import { ImageResponse } from "next/og";

// Route segment config
export const alt = "Papinwit Lertwassana — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#0B0D10",
        color: "#E7E9EE",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#2DD4BF",
          fontSize: 30,
          letterSpacing: 2,
          marginBottom: 32,
        }}
      >
        &gt; papinwit
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 78,
          fontWeight: 700,
          letterSpacing: -2,
          lineHeight: 1.05,
          marginBottom: 20,
        }}
      >
        Papinwit Lertwassana
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "#868D99",
          marginBottom: 44,
        }}
      >
        Full-Stack Developer · Bangkok, Thailand
      </div>

      <div
        style={{
          width: 56,
          height: 4,
          backgroundColor: "#2DD4BF",
          marginBottom: 24,
        }}
      />

      <div style={{ display: "flex", fontSize: 32, color: "#E7E9EE" }}>
        From MPLS backbones to Next.js frontends.
      </div>
    </div>,
    { ...size },
  );
}
