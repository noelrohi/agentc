import { db } from "@/db";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Agent Directory";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const FONT_URL = "https://cdn.midday.ai";

export default async function Image({ params }: { params: { id: string } }) {
  const item = await db.query.items.findFirst({
    where: (table, { eq }) => eq(table.slug, params.id),
  });

  if (!item) {
    throw new Error("Item not found");
  }

  try {
    const [geistMonoRegular, geistSansRegular] = await Promise.all([
      fetch(`${FONT_URL}/fonts/GeistMono/og/GeistMono-Regular.otf`)
        .then((res) => res.arrayBuffer())
        .catch(() => null),
      fetch(`${FONT_URL}/fonts/Geist/og/Geist-Regular.otf`)
        .then((res) => res.arrayBuffer())
        .catch(() => null),
    ]);

    const fonts = [];
    if (geistMonoRegular) {
      fonts.push({
        name: "GeistMono",
        data: geistMonoRegular,
        weight: 400 as const,
        style: "normal" as const,
      });
    }

    if (geistSansRegular) {
      fonts.push({
        name: "GeistSans",
        data: geistSansRegular,
        weight: 400 as const,
        style: "normal" as const,
      });
    }

    return new ImageResponse(
      (
        <div
          style={{
            background: "#0f172a",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: 60,
            fontFamily:
              fonts.length > 0 ? "GeistSans, sans-serif" : "sans-serif",
          }}
        >
          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              width: "100%",
              height: "100%",
            }}
          >
            {/* Header */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#38bdf8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily:
                  fonts.length > 0 ? "GeistMono, monospace" : "monospace",
              }}
            >
              AGENTIC DIRECTORY
            </div>

            {/* Main Content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <h1
                style={{
                  fontSize: 76,
                  fontWeight: 800,
                  margin: 0,
                  color: "#f8fafc",
                  lineHeight: 1.2,
                }}
              >
                {item.name}
              </h1>
              <p
                style={{
                  fontSize: 28,
                  margin: 0,
                  color: "#94a3b8",
                  maxWidth: 700,
                  lineHeight: 1.5,
                }}
              >
                {item.description}
              </p>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
                borderTop: "1px solid #1e293b",
                paddingTop: 24,
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#64748b",
                  margin: 0,
                }}
              >
                agentc.directory
              </p>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fonts.length > 0 ? fonts : undefined,
      },
    );
  } catch (error: unknown) {
    console.error(error);
    // Simple fallback image
    return new ImageResponse(
      (
        <div
          style={{
            background: "#0f172a",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: 60,
            fontFamily: "sans-serif",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#38bdf8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              AGENTIC DIRECTORY
            </div>
            <h1
              style={{
                fontSize: 76,
                fontWeight: 800,
                color: "#f8fafc",
                margin: 0,
              }}
            >
              {item.name}
            </h1>
            <p
              style={{
                fontSize: 28,
                color: "#94a3b8",
                margin: 0,
                maxWidth: 700,
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </p>
          </div>
        </div>
      ),
      {
        ...size,
      },
    );
  }
}
