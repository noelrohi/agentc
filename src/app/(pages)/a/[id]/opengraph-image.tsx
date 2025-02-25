import { db } from "@/db";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Agent Directory";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const item = await db.query.items.findFirst({
    where: (table, { eq }) => eq(table.slug, params.id),
  });

  if (!item) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 600,
          }}
        >
          Not Found
        </div>
      ),
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h1
              style={{
                fontSize: 64,
                fontWeight: 700,
                margin: 0,
              }}
            >
              {item.name}
            </h1>
            <p
              style={{
                fontSize: 32,
                margin: 0,
                color: "#666",
                maxWidth: 800,
              }}
            >
              {item.description}
            </p>
          </div>
          {item.avatar && (
            <img
              src={item.avatar}
              alt={item.name}
              width={120}
              height={120}
              style={{
                borderRadius: "50%",
              }}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: "auto",
          }}
        >
          <p
            style={{
              fontSize: 24,
              color: "#666",
              margin: 0,
            }}
          >
            agents.noelrohi.com
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
