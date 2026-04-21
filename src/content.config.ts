import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const dateFieldSchema = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return val;
}, z.string());

const dateTimeFieldSchema = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  return val;
}, z.string());

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: dateFieldSchema,
    updatedAt: dateTimeFieldSchema.optional(),
    description: z.string(),
    type: z.enum(["journal", "analysis", "portfolio", "infra", "meta"]),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    coverPhoto: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? undefined : val,
      z.string().optional(),
    ),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
