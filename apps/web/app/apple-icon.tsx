import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080c14",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          {/* Scale of Justice — large version */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            {/* Beam */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
              {/* Left pan */}
              <div style={{ display: "flex", width: "38px", height: "20px", background: "#eab308", borderRadius: "0 0 8px 8px" }} />
              {/* Center pivot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", width: "70px", height: "6px", background: "#eab308" }} />
                <div style={{ display: "flex", width: "8px", height: "8px", background: "#eab308" }} />
              </div>
              {/* Right pan */}
              <div style={{ display: "flex", width: "38px", height: "20px", background: "#eab308", borderRadius: "0 0 8px 8px" }} />
            </div>
            {/* Post */}
            <div style={{ display: "flex", width: "8px", height: "48px", background: "#eab308" }} />
            {/* Base */}
            <div style={{ display: "flex", width: "70px", height: "8px", background: "#eab308", borderRadius: "4px" }} />
          </div>
          {/* Brand name */}
          <div style={{
            display: "flex",
            color: "#eab308",
            fontSize: "20px",
            fontWeight: 900,
            letterSpacing: "0.18em",
            fontFamily: "sans-serif",
            marginTop: "6px",
          }}>
            CIVICLEDGER
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
