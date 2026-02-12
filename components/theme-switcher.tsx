'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Palette, Check } from 'lucide-react'

const themes = [
  { name: 'Default', value: 'light', description: 'Clean and minimal' },
  { name: 'Dark', value: 'dark', description: 'Easy on the eyes' },
  { name: 'Zinc', value: 'zinc', description: 'Neutral and professional' },
  { name: 'Slate', value: 'slate', description: 'Cool and modern' },
  { name: 'Stone', value: 'stone', description: 'Warm and natural' },
  { name: 'Gray', value: 'gray', description: 'Classic and balanced' },
  { name: 'Neutral', value: 'neutral', description: 'Timeless design' },
  { name: 'Rose', value: 'rose', description: 'Warm and inviting' },
  { name: 'Orange', value: 'orange', description: 'Bold and energetic' },
  { name: 'Green', value: 'green', description: 'Fresh and natural' },
  { name: 'Blue', value: 'blue', description: 'Professional and trustworthy' },
  { name: 'Yellow', value: 'yellow', description: 'Bright and cheerful' },
  { name: 'Violet', value: 'violet', description: 'Creative and modern' },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Palette className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{themeOption.name}</span>
              <span className="text-xs text-muted-foreground">
                {themeOption.description}
              </span>
            </div>
            {theme === themeOption.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
