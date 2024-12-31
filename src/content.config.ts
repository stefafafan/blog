import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z
        .string()
        .max(
          60,
          'Title should be 60 characters or less for optimal Open Graph display.',
        ),
      description: z
        .string()
        .max(
          155,
          'Description should be 155 characters or less for optimal Open Graph display.',
        ),
      date: z.coerce.date(),
      image: image()
        .refine((img) => img.width === 1200 && img.height === 630, {
          message:
            'The image must be exactly 1200px × 630px for Open Graph requirements.',
        })
        .optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
    }),
})

export const collections = { posts }