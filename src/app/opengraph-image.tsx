import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#070b12",
          color: "#e8eef7",
          padding: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            border: "1px solid #1c2a3d",
            borderRadius: "18px",
            overflow: "hidden",
            background: "#05080f",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "56px",
              padding: "0 28px",
              borderBottom: "1px solid #1c2a3d",
              color: "#8496ad",
              fontSize: "22px",
            }}
          >
            gabriel@portfolio: ~
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "48px 40px",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", color: "#6ea8ff", fontSize: "26px" }}>
              gabriel@portfolio:~$ whoami
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "68px",
                letterSpacing: "-1.5px",
                marginTop: "12px",
              }}
            >
              {site.name}
            </div>
            <div style={{ display: "flex", fontSize: "32px", color: "#b4c2d4" }}>
              {site.role}
            </div>
            <div style={{ display: "flex", fontSize: "26px", color: "#9ec4ff", marginTop: "18px" }}>
              React · TypeScript · Java · C#
            </div>
            <div style={{ display: "flex", fontSize: "22px", color: "#8496ad" }}>
              Mendoza, Argentina
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
