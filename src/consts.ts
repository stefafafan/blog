export type Site = {
  TITLE: string
  DESCRIPTION: string
  NUM_POSTS_ON_HOMEPAGE: number
  POSTS_PER_PAGE: number
  SITEURL: string
}

export type Link = {
  href: string
  label: string
}

export const SITE: Site = {
  TITLE: 'stefafafanのテックブログ2',
  DESCRIPTION:
    'すてにゃん (stefafafan) によるテックブログです。',
  NUM_POSTS_ON_HOMEPAGE: 5,
  POSTS_PER_PAGE: 5,
  SITEURL: 'https://stenyan.dev',
}

export const NAV_LINKS: Link[] = [
  { href: '/blog', label: 'blog' },
  { href: '/about', label: 'about' },
  { href: '/tags', label: 'tags' },
]

export const SOCIAL_LINKS: Link[] = [
  { href: 'https://github.com/stefafafan', label: 'GitHub' },
  { href: 'https://x.com/stefafafan', label: 'Twitter' },
  { href: '/rss.xml', label: 'RSS' },
]
