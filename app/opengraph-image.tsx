import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0B1220 0%, #152B6B 45%, #3A5BFF 100%)",
          color: "white",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 0.6,
            }}
          >
            P
          </div>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: -0.4 }}>Postifly</div>
        </div>

        <div style={{ marginTop: 28, fontSize: 56, fontWeight: 800, lineHeight: 1.05 }}>
          Parcel delivery & tracking
        </div>
        <div style={{ marginTop: 14, fontSize: 28, opacity: 0.92, lineHeight: 1.25 }}>
          Forwarding, declaration, and real‑time tracking in one platform.
        </div>

        <div style={{ marginTop: "auto", display: "flex", gap: 10, opacity: 0.9, fontSize: 18 }}>
          <span>postifly.ge</span>
          <span>•</span>
          <span>Shipping to Georgia</span>
        </div>
      </div>
    ),
    size
  );
}

