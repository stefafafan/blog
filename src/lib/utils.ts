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

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, '')
  const japaneseOnly = textOnly.replace(/[^ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー。]*/g, '')
  const readingTimeMinutes = (japaneseOnly.length / 500).toFixed()
  return `読了目安時間: ${readingTimeMinutes} 分 (約 ${japaneseOnly.length} 字)`
}
