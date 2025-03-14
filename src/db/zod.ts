import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { features, items } from "./schema";

export const insertItemSchema = createInsertSchema(items, {
  tags: z.array(z.string()).nullish(),
})
  .extend({
    keybenefits: z.array(z.string()),
    whoIsItFor: z.array(z.string()),
    features: z.array(
      createInsertSchema(features).omit({
        itemId: true,
        id: true,
        createdAt: true,
        updatedAt: true,
      }),
    ),
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });
