import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "6px",
        }}
      >
        {/* Scale of Justice */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          {/* Beam with two pans */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px" }}>
            {/* Left pan */}
            <div style={{ display: "flex", width: "7px", height: "4px", background: "#eab308", borderRadius: "0 0 2px 2px" }} />
            {/* Center column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", width: "14px", height: "2px", background: "#eab308" }} />
              <div style={{ display: "flex", width: "2px", height: "2px", background: "#eab308" }} />
            </div>
            {/* Right pan */}
            <div style={{ display: "flex", width: "7px", height: "4px", background: "#eab308", borderRadius: "0 0 2px 2px" }} />
          </div>
          {/* Post */}
          <div style={{ display: "flex", width: "2px", height: "9px", background: "#eab308" }} />
          {/* Base */}
          <div style={{ display: "flex", width: "14px", height: "2px", background: "#eab308", borderRadius: "1px" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
