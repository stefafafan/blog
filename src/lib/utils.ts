import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

const htmlTagRegex = /<[^>]+>/g
const japaneseCharRegex = /[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー。]/g

export function readingTime(html: string) {
  const textOnly = html.replace(htmlTagRegex, '')
  const japaneseMatches = textOnly.match(japaneseCharRegex)
  const japaneseLength = japaneseMatches ? japaneseMatches.length : 0
  const readingTimeMinutes = Math.max(1, Math.round(japaneseLength / 500))
  return `読了目安時間: ${readingTimeMinutes} 分 (約 ${japaneseLength} 字)`
}
