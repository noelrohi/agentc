import { db } from "@/db";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Agent Directory";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const CDN_URL = "https://cdn.midday.ai";

export default async function Image({ params }: { params: { id: string } }) {
  const item = await db.query.items.findFirst({
    where: (table, { eq }) => eq(table.slug, params.id),
  });

  const geistMonoRegular = fetch(
    `${CDN_URL}/fonts/GeistMono/og/GeistMono-Regular.otf`,
  ).then((res) => res.arrayBuffer());

  const geistSansRegular = fetch(
    `${CDN_URL}/fonts/Geist/og/Geist-Regular.otf`,
  ).then((res) => res.arrayBuffer());

  if (!item) {
    throw new Error("Item not found");
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#111827",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: 60,
          fontFamily: "GeistMono, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "30%",
            height: "100%",
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)",
            borderLeft: "1px solid rgba(59, 130, 246, 0.3)",
            zIndex: 0,
          }}
        />

        {/* Subtle pattern */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(17, 24, 39, 0) 70%)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#60a5fa",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 4,
              }}
            >
              Agentic Directory
            </div>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 800,
                margin: 0,
                color: "#f9fafb",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {item.name}
            </h1>
            <p
              style={{
                fontSize: 28,
                margin: 0,
                color: "#d1d5db",
                maxWidth: 700,
                lineHeight: 1.4,
              }}
            >
              {item.description}
            </p>
          </div>
          {item.avatar ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                padding: 8,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              <img
                src={item.avatar}
                alt={item.name}
                width={140}
                height={140}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 64,
                color: "white",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              {item.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: "auto",
            zIndex: 1,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: 24,
            width: "100%",
          }}
        >
          <p
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "#d1d5db",
              margin: 0,
            }}
          >
            agentc.directory
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "GeistMono",
          data: await geistMonoRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "GeistSans",
          data: await geistSansRegular,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
