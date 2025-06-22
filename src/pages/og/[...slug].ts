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
              },
              children: post.data.title,
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
              },
              children: post.data.description,
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