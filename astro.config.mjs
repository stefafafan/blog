import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { transformerCopyButton } from '@rehype-pretty/transformers'
import {
  transformerMetaHighlight,
  transformerNotationDiff,
} from '@shikijs/transformers'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import rehypeExternalLinks from 'rehype-external-links'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'
import remarkToc from 'remark-toc'
import remarkEmbedder from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'
import Cache from '@remark-embedder/cache'
import sectionize from '@hbsnow/rehype-sectionize'

import icon from 'astro-icon'

const hatenaBlogOwnedDomains = ['blog.stenyan.jp']

const hatenaBlogTransformer = {
  name: 'hatenablog',
  shouldTransform(url) {
    const { host } = new URL(url)

    const isHatenablogDomain =
      host.endsWith('hatenablog.com') ||
      host.endsWith('hatenablog.jp') ||
      host.endsWith('hateblo.jp') ||
      host.endsWith('hatenadiary.com') ||
      host.endsWith('hatenadiary.jp')
    const isSpecificOwnedDomain = hatenaBlogOwnedDomains.some(
      (domain) => host === domain,
    )

    return isHatenablogDomain || isSpecificOwnedDomain
  },

  async getHTML(url) {
    const oembedUrl = `https://hatenablog.com/oembed?url=${encodeURIComponent(url)}`
    const oembedRes = await fetch(oembedUrl)
    if (!oembedRes.ok) return null

    const oembedJson = await oembedRes.json()
    if (!oembedJson.html) return null

    return oembedJson.html
  },
}

const cache = new Cache.default()

// https://astro.build/config
export default defineConfig({
  site: 'https://stenyan.dev',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    react(),
    icon(),
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow', 'noreferrer', 'noopener'],
        },
      ],
      rehypeHeadingIds,
      rehypeKatex,
      sectionize,
      [
        rehypePrettyCode,
        {
          theme: {
            light: 'material-theme-lighter',
            dark: 'material-theme-darker',
          },
          transformers: [
            transformerNotationDiff(),
            transformerMetaHighlight(),
            transformerCopyButton({
              visibility: 'hover',
              feedbackDuration: 1000,
            }),
          ],
        },
      ],
    ],
    remarkPlugins: [
      remarkToc,
      remarkMath,
      remarkEmoji,
      // Using workaround as mentioned here: https://github.com/shikijs/twoslash/issues/147
      [
        remarkEmbedder.default,
        {
          cache,
          transformers: [oembedTransformer.default, hatenaBlogTransformer],
        },
      ],
    ],
  },
  server: {
    port: 1234,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  trailingSlash: 'never',
})
