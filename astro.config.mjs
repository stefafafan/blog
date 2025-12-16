import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import sectionize from '@hbsnow/rehype-sectionize'

import { transformerCopyButton } from '@rehype-pretty/transformers'
import Cache from '@remark-embedder/cache'
import remarkEmbedder from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'
import {
  transformerMetaHighlight,
  transformerNotationDiff,
} from '@shikijs/transformers'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'
import remarkHeadingPrefix from './src/lib/remark-heading-prefix'

const hatenaBlogOwnedDomains = [
  'blog.stenyan.jp',
  'blog.smartbank.co.jp',
  'blog.shibayu36.org',
]

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
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), mdx(), react(), icon()],
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
            transformerNotationDiff({
              matchAlgorithm: 'v3',
            }),
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
      remarkMath,
      remarkEmoji,
      remarkHeadingPrefix,
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
