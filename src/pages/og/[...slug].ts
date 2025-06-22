import { getCollection, getEntry } from 'astro:content'
import { ImageResponse } from '@vercel/og'
import type { APIRoute } from 'astro'

export async function getStaticPaths() {
  const posts = await getCollection('posts')
  return posts.map((post) => ({
    params: { slug: post.id },
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

  // Add line breaks to title and description for better display
  const formattedTitle = addLineBreaks(post.data.title, 30)
  const formattedDescription = addLineBreaks(post.data.description, 60)

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#18181b',
          backgroundImage: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
          padding: 60,
          gap: 20,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: 44,
                fontWeight: 700,
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.3,
                fontFamily: 'system-ui, sans-serif',
                maxWidth: 1080,
                whiteSpace: 'pre-line',
              },
              children: formattedTitle,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: 20,
                fontWeight: 400,
                color: '#d4d4d8',
                textAlign: 'center',
                lineHeight: 1.5,
                fontFamily: 'system-ui, sans-serif',
                marginTop: 20,
                maxWidth: 1080,
                whiteSpace: 'pre-line',
              },
              children: formattedDescription,
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
