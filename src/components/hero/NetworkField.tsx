"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------
   Tunables
   ------------------------------------------------------------------ */
const NODE_COUNT = 70;
const CONNECT_FACTOR = 0.16; // link distance as a fraction of the smaller viewport dim
const INFLUENCE_FACTOR = 0.22; // pointer "brighten" radius, same units
const MAX_SEGMENTS = 1400; // upper bound on drawn links (buffer is preallocated)

/* ------------------------------------------------------------------
   Read the current accent straight from the CSS variable, and keep it
   in sync when the theme switches. The swatch flips [data-theme] on
   <html>, so a MutationObserver on that attribute is all we need —
   no per-frame getComputedStyle (which would force reflow).
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
   The network itself. Positions/velocities/colors live in Float32Arrays
   that we mutate in place every frame — React never re-renders for the
   animation, it only owns the initial buffers.
   ------------------------------------------------------------------ */
function Network({ accent, reduced }: { accent: string; reduced: boolean }) {
  const { viewport, pointer, invalidate } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Initial node buffers — built once. z is a small spread for subtle depth.
  const { positions, velocities, colors } = useMemo(() => {
    const w = viewport.width;
    const h = viewport.height;
    const positions = new Float32Array(NODE_COUNT * 3);
    const velocities = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * w;
      positions[i * 3 + 1] = (Math.random() - 0.5) * h;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      velocities[i * 3] = (Math.random() - 0.5) * 0.06;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
    }
    return { positions, velocities, colors };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preallocated line buffer (two endpoints × xyz per segment).
  const linePositions = useMemo(
    () => new Float32Array(MAX_SEGMENTS * 2 * 3),
    [],
  );

  // Accent as a THREE.Color; recomputed only when the theme changes.
  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);

  // In reduced-motion (frameloop="demand"), nudge a single re-render so the
  // static field repaints in the new accent after a theme switch.
  useEffect(() => {
    invalidate();
  }, [accent, invalidate]);

  useFrame(() => {
    const pts = pointsRef.current;
    const lns = linesRef.current;
    if (!pts || !lns) return;

    const halfW = viewport.width / 2;
    const halfH = viewport.height / 2;
    const minDim = Math.min(viewport.width, viewport.height);

    // Pointer in world units (pointer is normalized -1..1, y-up).
    const px = pointer.x * halfW;
    const py = pointer.y * halfH;

    // 1) Drift + bounce off the viewport edges.
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

    // 2) Per-node brightness: full accent near the pointer, dim far away.
    const influence = minDim * INFLUENCE_FACTOR;
    const inf2 = influence * influence;
    for (let i = 0; i < NODE_COUNT; i++) {
      const dx = positions[i * 3] - px;
      const dy = positions[i * 3 + 1] - py;
      const d2 = dx * dx + dy * dy;
      const t = d2 < inf2 ? 1 - d2 / inf2 : 0;
      const intensity = 0.45 + 0.55 * t;
      colors[i * 3] = accentColor.r * intensity;
      colors[i * 3 + 1] = accentColor.g * intensity;
      colors[i * 3 + 2] = accentColor.b * intensity;
    }

    // 3) Rebuild links between nearby nodes (O(n²), fine at this count).
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

    // 4) Flag the GPU buffers dirty and set how much of the line buffer to draw.
    pts.geometry.attributes.position.needsUpdate = true;
    pts.geometry.attributes.color.needsUpdate = true;
    lns.geometry.attributes.position.needsUpdate = true;
    lns.geometry.setDrawRange(0, seg * 2);

    // Keep the line color following the theme.
    (lns.material as THREE.LineBasicMaterial).color.copy(accentColor);
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
    </>
  );
}

/* ------------------------------------------------------------------
   Canvas wrapper. Transparent (alpha) so the page background shows
   through and the field inherits whatever theme is active.
   ------------------------------------------------------------------ */
export default function NetworkField() {
  const accent = useAccent();
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 75 }}
      frameloop={reduced ? "demand" : "always"}
      style={{ width: "100%", height: "100%" }}
    >
      <Network accent={accent} reduced={reduced} />
    </Canvas>
  );
}
