"use client";

import { VideoTimestampButton } from "./video-timestamp-button";

interface Feature {
  id: string | number;
  feature: string;
  description: string;
  timestampStart: number | null;
  timestampEnd: number | null;
}

interface FeatureListProps {
  features: Feature[];
}

export function FeatureList({ features }: FeatureListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Key Features</h2>
      <div className="grid gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">{feature.feature}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
              {feature.timestampStart && feature.timestampEnd && (
                <p className="text-sm text-muted-foreground">
                  <VideoTimestampButton
                    start={feature.timestampStart}
                    end={feature.timestampEnd}
                  />
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
