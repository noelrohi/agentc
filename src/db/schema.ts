import { relations, sql } from "drizzle-orm";
import { sqliteTable } from "drizzle-orm/sqlite-core";

export const items = sqliteTable(
  "items",
  (t) => ({
    id: t.integer().primaryKey(),
    name: t.text().notNull(),
    slug: t.text().notNull(),
    description: t.text().notNull(),
    category: t.text().notNull(),
    avatar: t.text(),
    href: t.text().notNull(),
    tags: t.text("tags", { mode: "json" }).$type<string[]>().default([]),
    type: t
      .text({ enum: ["agent", "tool"] })
      .notNull()
      .default("tool"),
    createdAt: t.integer().default(sql`CURRENT_TIMESTAMP`),
    demoVideo: t.text(),
    isNew: t.integer({ mode: "boolean" }).default(false),
    keybenefits: t
      .text("keybenefits", { mode: "json" })
      .$type<string[]>()
      .default([]),
    whoIsItFor: t
      .text("whoIsItFor", { mode: "json" })
      .$type<string[]>()
      .default([]),
    pricingModel: t
      .text({ enum: ["free", "paid", "freemium"] })
      .default("freemium")
      .notNull(),
    updatedAt: t.integer().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  }),
  () => [],
);

export const features = sqliteTable(
  "features",
  (t) => ({
    id: t.integer().primaryKey(),
    feature: t.text().notNull(),
    description: t.text().notNull(),
    timestampStart: t.integer(),
    timestampEnd: t.integer(),
    itemId: t
      .integer()
      .references(() => items.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: t.integer().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: t.integer().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  }),
  () => [],
);

export const itemRelations = relations(items, ({ many }) => ({
  features: many(features),
}));

export const featureRelations = relations(features, ({ one }) => ({
  item: one(items, {
    fields: [features.itemId],
    references: [items.id],
  }),
}));

export type Item = typeof items.$inferSelect;

export interface ItemWithFeatures extends Item {
  features: (typeof features.$inferSelect)[];
}
