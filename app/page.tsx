'use client'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { 
  Code2, 
  Database, 
  Globe, 
  Zap, 
  Package, 
  GitBranch,
  Cloud,
  Terminal,
  Boxes,
  Shield,
} from 'lucide-react'

// Dynamic import avoids Turbopack HMR module factory conflict with @xyflow/react
const ArchitectureDiagram = dynamic(
  () => import('@/components/architecture-diagram'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-sm text-muted-foreground animate-pulse">Loading architecture diagram...</div>
      </div>
    ),
  }
)

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Boxes className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold">SaaS Collective 3.0</h1>
              <Badge variant="secondary" className="text-[10px]">Multi-Language 2027 Full-Stack Monorepo</Badge>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Docs
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border bg-card/30 overflow-y-auto shrink-0">
          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-sm font-semibold mb-1">Architecture Overview</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Three-tier monorepo: deploy apps, write services in any language, swap providers freely between external, internal or hybrid.
              </p>
            </div>

            <Card className="p-3 space-y-2">
              <h3 className="font-semibold text-xs flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                /apps - Deployable
              </h3>
              <ul className="text-[11px] space-y-0.5 text-muted-foreground ml-5">
                <li>web/ - Next.js 16 (Vercel)</li>
                <li>api/ - FastAPI gateway (AWS)</li>
                <li className="italic text-muted-foreground/60">Only these get deployed</li>
              </ul>
            </Card>

            <Card className="p-3 space-y-2">
              <h3 className="font-semibold text-xs flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-orange-500" />
                /services - Multi-Language
              </h3>
              <ul className="text-[11px] space-y-0.5 text-muted-foreground ml-5">
                <li><span className="text-green-600">python/</span> - llm-service, mcp-service</li>
                <li><span className="text-yellow-600">nodejs/</span> - vector-db, realtime</li>
                <li><span className="text-orange-600">rust/</span> - compute (future)</li>
                <li className="italic text-muted-foreground/60">Each language isolated</li>
              </ul>
            </Card>

            <Card className="p-3 space-y-2">
              <h3 className="font-semibold text-xs flex items-center gap-2">
                <Cloud className="h-3.5 w-3.5 text-pink-500" />
                External Providers (3A)
              </h3>
              <ul className="text-[11px] space-y-0.5 text-muted-foreground ml-5">
                <li>openai/ anthropic/ pinecone/</li>
                <li>github/ slack/ stripe/</li>
                <li className="italic text-pink-500/60">Cloud - requires internet</li>
              </ul>
            </Card>

            <Card className="p-3 space-y-2 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
              <h3 className="font-semibold text-xs flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                Internal Providers (3B)
              </h3>
              <ul className="text-[11px] space-y-0.5 text-muted-foreground ml-5">
                <li>Ollama - local LLMs offline</li>
                <li>ChromaDB - local vectors</li>
                <li>LocalAI - self-hosted</li>
                <li className="italic text-emerald-600/80">Zero vendor lock-in</li>
              </ul>
            </Card>

            <Card className="p-3 space-y-2 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-xs flex items-center gap-2">
                <Boxes className="h-3.5 w-3.5 text-amber-600" />
                Hybrid / Client (3C)
              </h3>
              <ul className="text-[11px] space-y-0.5 text-muted-foreground ml-5">
                <li>Gov / B2B deployments</li>
                <li>Client-side DB on their infra</li>
                <li>Mix external + internal</li>
                <li className="italic text-amber-600/80">Deployment profile routes</li>
              </ul>
            </Card>

            <Card className="p-3 space-y-2">
              <h3 className="font-semibold text-xs flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-blue-500" />
                Cache Strategy
              </h3>
              <ul className="text-[11px] space-y-0.5 text-muted-foreground ml-5">
                <li>Next.js - use cache directive</li>
                <li>Redis - FastAPI LLM cache</li>
                <li className="italic text-muted-foreground/60">Simple, fast, KIS</li>
              </ul>
            </Card>

            <Card className="p-3 space-y-2">
              <h3 className="font-semibold text-xs flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-purple-500" />
                Database
              </h3>
              <ul className="text-[11px] space-y-0.5 text-muted-foreground ml-5">
                <li>PostgreSQL + pgvector</li>
                <li>FastAPI owns all queries</li>
                <li>Alembic migrations</li>
              </ul>
            </Card>

            <Card className="p-3 space-y-2">
              <h3 className="font-semibold text-xs flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-indigo-500" />
                /packages - Shared Code
              </h3>
              <ul className="text-[11px] space-y-0.5 text-muted-foreground ml-5">
                <li>TypeScript types</li>
                <li>Shared config</li>
                <li>Utilities</li>
              </ul>
            </Card>

            <Card className="p-3 space-y-2">
              <h3 className="font-semibold text-xs flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                Key Docs
              </h3>
              <ul className="text-[11px] space-y-0.5 text-muted-foreground ml-5">
                <li>START_HERE.md</li>
                <li>docs/ARCHITECTURE_DECISIONS.md</li>
                <li>docs/SOVEREIGN_ARCHITECTURE.md</li>
                <li>docs/ONBOARDING_CHECKLIST.md</li>
              </ul>
            </Card>
          </div>
        </aside>

        {/* React Flow Canvas */}
        <div className="flex-1 relative">
          <ArchitectureDiagram />
        </div>
      </div>
    </div>
  )
}
