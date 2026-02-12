import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '2027 Full-Stack Monorepo | Next.js + FastAPI + Node.js',
  description: 'Best-in-class Turborepo monorepo with Next.js 16, FastAPI, Node.js microservices, and AWS integration. Built for 2027.',
  keywords: ['monorepo', 'turborepo', 'nextjs', 'fastapi', 'nodejs', 'typescript', 'python', 'aws'],
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          themes={['light', 'dark', 'zinc', 'slate', 'stone', 'gray', 'neutral', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet']}
          enableSystem={false}
          storageKey="monorepo-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
