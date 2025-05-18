import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import * as React from 'react'

export function ModeToggle() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const initialIsDark = document.documentElement.classList.contains('dark')
    setIsDark(initialIsDark)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  React.useEffect(() => {
    document.documentElement.classList.add('disable-transitions')
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark')

    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('opacity')

    requestAnimationFrame(() => {
      document.documentElement.classList.remove('disable-transitions')
    })
  }, [isDark])

  return (
    <Button
      variant="outline"
      size="icon"
      className="group"
      title="Toggle theme"
      onClick={toggleTheme}
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
