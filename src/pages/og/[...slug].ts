import { getCollection, getEntry } from 'astro:content'
import { ImageResponse } from '@vercel/og'
import type { APIRoute } from 'astro'

export async function getStaticPaths() {
  const posts = await getCollection('posts')
  return posts.map((post) => ({
    params: { slug: `${post.id}.png` },
    props: { post },
  }))
}

// Function to add natural line breaks for long text
function addLineBreaks(text: string, maxLength: number = 25): string {
  if (text.length <= maxLength) return text

  // First, identify hashtags and treat them as single units
  const parts: string[] = []

  // Match hashtags (# followed by non-whitespace characters)
  const hashtagRegex = /#\S+/g
  let lastIndex = 0
  let match

  while ((match = hashtagRegex.exec(text)) !== null) {
    // Add text before hashtag
    if (match.index > lastIndex) {
      parts.push(...text.slice(lastIndex, match.index).split(/(\s+|[、。！？])/g).filter(Boolean))
    }
    // Add hashtag as a single unit
    parts.push(match[0])
    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(...text.slice(lastIndex).split(/(\s+|[、。！？])/g).filter(Boolean))
  }

  // Now build lines with proper length constraints
  const lines: string[] = []
  let currentLine = ''

  for (const part of parts) {
    const testLine = currentLine ? currentLine + part : part

    if (testLine.length <= maxLength) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine.trim())
        currentLine = part
      } else {
        // Part is too long, force break (but not for hashtags)
        if (part.startsWith('#')) {
          lines.push(part)
          currentLine = ''
        } else {
          lines.push(part)
          currentLine = ''
        }
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim())
  }

  return lines.join('\n')
}

export const GET: APIRoute = async ({ props, params }) => {
  // In development mode, props might be undefined, so we fetch the post directly
  let post = props ? (props as { post: any }).post : null

  if (!post && params?.slug) {
    // Remove .png extension if present for development mode
    let slug = params.slug as string
    if (slug.endsWith('.png')) {
      slug = slug.slice(0, -4)
    }
    post = await getEntry('posts', slug)
  }

  if (!post) {
    return new Response('Post not found', { status: 404 })
  }

  // Add line breaks to title for better display
  const formattedTitle = addLineBreaks(post.data.title, 30)

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#fefffe',
          backgroundImage: 'linear-gradient(135deg, #fefffe 0%, #f9fdfb 100%)',
          padding: 60,
          border: '6px solid #9ca3af',
          borderRadius: 24,
        },
        children: [
          // Main post title (left-aligned)
          {
            type: 'div',
            props: {
              style: {
                fontSize: 64,
                fontWeight: 700,
                color: '#111827',
                textAlign: 'left',
                lineHeight: 1.2,
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                maxWidth: 1080,
                whiteSpace: 'pre-line',
                flex: 1,
                display: 'flex',
                alignItems: 'flex-start',
                paddingTop: 80,
              },
              children: formattedTitle,
            },
          },
          // Bottom section with tags and blog title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                alignItems: 'flex-start',
                marginTop: -60,
              },
              children: [
                // Tags
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 12,
                    },
                    children: post.data.tags && post.data.tags.length > 0 ? post.data.tags.map((tag: string) => ({
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 22,
                          fontWeight: 500,
                          color: '#16a34a',
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          border: '2px solid #16a34a',
                          borderRadius: 8,
                          padding: '10px 18px',
                        },
                        children: `#${tag}`,
                      },
                    })) : [],
                  },
                },
                // Blog title
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 30,
                      fontWeight: 600,
                      color: '#16a34a',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      textDecoration: 'underline',
                      textDecorationThickness: '1px',
                      textUnderlineOffset: '2px',
                    },
                    children: 'stenyan[.]dev',
                  },
                },
              ],
            },
          },
        ],
      },
    } as any,
    {
      width: 1200,
      height: 630,
    }
  )
}
