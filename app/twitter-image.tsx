import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
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
        <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -0.5 }}>Postifly</div>
        <div style={{ marginTop: 18, fontSize: 54, fontWeight: 800, lineHeight: 1.06 }}>
          Track your parcel
        </div>
        <div style={{ marginTop: 12, fontSize: 26, opacity: 0.92 }}>
          Delivery, declaration, and tracking for Georgia.
        </div>
        <div style={{ marginTop: "auto", fontSize: 18, opacity: 0.9 }}>postifly.ge</div>
      </div>
    ),
    size
  );
}

