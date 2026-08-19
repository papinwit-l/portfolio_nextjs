"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------
   Tunables
   ------------------------------------------------------------------ */
const NODE_COUNT = 70;
const CONNECT_FACTOR = 0.16; // node-to-node link distance (fraction of min viewport dim)
const CURSOR_FACTOR = 0.22; // how far the cursor reaches to wire up nodes
const INFLUENCE_FACTOR = 0.26; // node brightening radius around the cursor
const MAX_SEGMENTS = 1400; // upper bound on ambient links (buffer preallocated)

/* ------------------------------------------------------------------
   Accent, synced to the active theme via [data-theme] on <html>.
   ------------------------------------------------------------------ */
function readAccent(): string {
  if (typeof window === "undefined") return "#2DD4BF";
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim();
  return v || "#2DD4BF";
}

function useAccent(): string {
  const [accent, setAccent] = useState(readAccent);
  useEffect(() => {
    const update = () => setAccent(readAccent());
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  return accent;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------
   The network. Buffers are mutated in place each frame; React only owns
   the initial arrays.
   ------------------------------------------------------------------ */
function Network({ accent, reduced }: { accent: string; reduced: boolean }) {
  const { viewport, gl } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const cursorRef = useRef<THREE.LineSegments>(null);

  // Pointer state (normalized -1..1) + whether it's active and on-canvas.
  const pointer = useRef({ x: 0, y: 0 });
  const interactiveRef = useRef(false);
  const onScreenRef = useRef(false);
  const [, setInteractive] = useState(false);

  const seeded = useRef(false);

  const { positions, velocities, colors } = useMemo(
    () => ({
      positions: new Float32Array(NODE_COUNT * 3),
      velocities: new Float32Array(NODE_COUNT * 3),
      colors: new Float32Array(NODE_COUNT * 3),
    }),
    [],
  );

  // Ambient node-to-node links.
  const linePositions = useMemo(
    () => new Float32Array(MAX_SEGMENTS * 2 * 3),
    [],
  );

  // Cursor-to-node links (at most one per node) with their own colors.
  const cursorPositions = useMemo(
    () => new Float32Array(NODE_COUNT * 2 * 3),
    [],
  );
  const cursorColors = useMemo(() => new Float32Array(NODE_COUNT * 2 * 3), []);

  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);

  // Detect + track a real mouse/pen; ignore touch. Window-level so the
  // overlays above the canvas can't swallow it.
  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!interactiveRef.current) {
        interactiveRef.current = true;
        setInteractive(true);
      }
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.current.x = nx;
      pointer.current.y = ny;
      // Only "reach" when the cursor is actually over the hero canvas.
      onScreenRef.current =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame(() => {
    const pts = pointsRef.current;
    const lns = linesRef.current;
    const cur = cursorRef.current;
    if (!pts || !lns || !cur) return;

    const w = viewport.width;
    const h = viewport.height;
    if (w === 0 || h === 0) return;

    const halfW = w / 2;
    const halfH = h / 2;
    const minDim = Math.min(w, h);

    if (!seeded.current) {
      for (let i = 0; i < NODE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * w;
        positions[i * 3 + 1] = (Math.random() - 0.5) * h;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        velocities[i * 3] = (Math.random() - 0.5) * 0.06;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      }
      seeded.current = true;
    }

    // 1) Drift (skipped under reduced-motion).
    if (!reduced) {
      for (let i = 0; i < NODE_COUNT; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        if (positions[i * 3] < -halfW || positions[i * 3] > halfW)
          velocities[i * 3] *= -1;
        if (positions[i * 3 + 1] < -halfH || positions[i * 3 + 1] > halfH)
          velocities[i * 3 + 1] *= -1;
      }
    }

    const active = interactiveRef.current && onScreenRef.current;
    const px = pointer.current.x * halfW;
    const py = pointer.current.y * halfH;

    // 2) Node brightness — a gentle lift near the cursor.
    if (active) {
      const influence = minDim * INFLUENCE_FACTOR;
      const inf2 = influence * influence;
      for (let i = 0; i < NODE_COUNT; i++) {
        const dx = positions[i * 3] - px;
        const dy = positions[i * 3 + 1] - py;
        const d2 = dx * dx + dy * dy;
        const t = d2 < inf2 ? 1 - d2 / inf2 : 0;
        const k = 0.5 + 0.5 * t;
        colors[i * 3] = accentColor.r * k;
        colors[i * 3 + 1] = accentColor.g * k;
        colors[i * 3 + 2] = accentColor.b * k;
      }
    } else {
      const k = 0.72;
      for (let i = 0; i < NODE_COUNT; i++) {
        colors[i * 3] = accentColor.r * k;
        colors[i * 3 + 1] = accentColor.g * k;
        colors[i * 3 + 2] = accentColor.b * k;
      }
    }

    // 3) Ambient node-to-node links.
    const connect = minDim * CONNECT_FACTOR;
    const cd2 = connect * connect;
    let seg = 0;
    for (let i = 0; i < NODE_COUNT && seg < MAX_SEGMENTS; i++) {
      for (let j = i + 1; j < NODE_COUNT && seg < MAX_SEGMENTS; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < cd2) {
          const o = seg * 6;
          linePositions[o] = positions[i * 3];
          linePositions[o + 1] = positions[i * 3 + 1];
          linePositions[o + 2] = positions[i * 3 + 2];
          linePositions[o + 3] = positions[j * 3];
          linePositions[o + 4] = positions[j * 3 + 1];
          linePositions[o + 5] = positions[j * 3 + 2];
          seg++;
        }
      }
    }

    // 4) Cursor-to-node links — the network reaching for the pointer.
    //    Brighter the closer a node is; faded via per-vertex color.
    let cseg = 0;
    if (active) {
      const reach = minDim * CURSOR_FACTOR;
      const reach2 = reach * reach;
      for (let i = 0; i < NODE_COUNT; i++) {
        const dx = positions[i * 3] - px;
        const dy = positions[i * 3 + 1] - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < reach2) {
          const prox = 1 - Math.sqrt(d2) / reach; // 0 at edge, 1 at cursor
          const o = cseg * 6;
          // node endpoint
          cursorPositions[o] = positions[i * 3];
          cursorPositions[o + 1] = positions[i * 3 + 1];
          cursorPositions[o + 2] = positions[i * 3 + 2];
          // cursor endpoint
          cursorPositions[o + 3] = px;
          cursorPositions[o + 4] = py;
          cursorPositions[o + 5] = 0;
          const nodeK = 0.1 + 0.5 * prox; // dimmer at the node
          const cursorK = 0.4 + 0.6 * prox; // brightest at the cursor
          cursorColors[o] = accentColor.r * nodeK;
          cursorColors[o + 1] = accentColor.g * nodeK;
          cursorColors[o + 2] = accentColor.b * nodeK;
          cursorColors[o + 3] = accentColor.r * cursorK;
          cursorColors[o + 4] = accentColor.g * cursorK;
          cursorColors[o + 5] = accentColor.b * cursorK;
          cseg++;
        }
      }
    }

    // 5) Upload + draw ranges.
    pts.geometry.attributes.position.needsUpdate = true;
    pts.geometry.attributes.color.needsUpdate = true;

    lns.geometry.attributes.position.needsUpdate = true;
    lns.geometry.setDrawRange(0, seg * 2);
    (lns.material as THREE.LineBasicMaterial).color.copy(accentColor);

    cur.geometry.attributes.position.needsUpdate = true;
    cur.geometry.attributes.color.needsUpdate = true;
    cur.geometry.setDrawRange(0, cseg * 2);
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          size={2.2}
          sizeAttenuation={false}
          depthWrite={false}
          toneMapped={false}
        />
      </points>

      {/* Ambient node-to-node links */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          transparent
          opacity={0.2}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {/* Cursor-to-node links — brighter, per-vertex faded */}
      <lineSegments ref={cursorRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[cursorPositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[cursorColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </>
  );
}

export default function NetworkField() {
  const accent = useAccent();
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 75 }}
      frameloop="always"
      style={{ width: "100%", height: "100%" }}
    >
      <Network accent={accent} reduced={reduced} />
    </Canvas>
  );
}
