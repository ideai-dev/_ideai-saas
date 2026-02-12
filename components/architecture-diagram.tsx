'use client'

import { useCallback } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Connection,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Import from @ideai/reactflow package
import {
  ideaiNodeTypes,
  createEdgeStyle,
  createNodeStyle,
  createMinimapColorFn,
  mutedNodeStyle,
  transparentNodeStyle,
  DiagramLegend,
  LegendSection,
  LegendNodeItem,
  LegendEdgeItem,
  edgeColors,
} from '@/packages/ideai-reactflow/src'

import {
  Code2,
  Database,
  Globe,
  Zap,
  Package,
  Cloud,
  Terminal,
  Boxes,
  Shield,
} from 'lucide-react'

// ──────────────────────────────────────────────
// NODES
// ──────────────────────────────────────────────
const initialNodes = [
  // Tier Labels
  {
    id: 'tier1-label',
    type: 'labelOnly',
    data: {
      label: (
        <div className="px-4 py-2 bg-blue-500/10 border-l-4 border-blue-500 rounded-r">
          <div className="font-bold text-sm text-blue-600 dark:text-blue-400">TIER 1: Deployables</div>
          <div className="text-[10px] text-muted-foreground">Production apps (Vercel, AWS)</div>
        </div>
      ),
    },
    position: { x: 10, y: 50 },
    draggable: false,
    selectable: false,
    style: { ...transparentNodeStyle, width: 200 },
  },
  {
    id: 'tier2-label',
    type: 'labelOnly',
    data: {
      label: (
        <div className="px-4 py-2 bg-orange-500/10 border-l-4 border-orange-500 rounded-r">
          <div className="font-bold text-sm text-orange-600 dark:text-orange-400">TIER 2: Services</div>
          <div className="text-[10px] text-muted-foreground">Multi-language business logic</div>
        </div>
      ),
    },
    position: { x: 10, y: 330 },
    draggable: false,
    selectable: false,
    style: { ...transparentNodeStyle, width: 200 },
  },
  {
    id: 'tier3-label',
    type: 'labelOnly',
    data: {
      label: (
        <div className="px-4 py-2 bg-pink-500/10 border-l-4 border-pink-500 rounded-r">
          <div className="font-bold text-sm text-pink-600 dark:text-pink-400">TIER 3: Providers</div>
          <div className="text-[10px] text-muted-foreground">External, Internal & Hybrid</div>
        </div>
      ),
    },
    position: { x: 10, y: 620 },
    draggable: false,
    selectable: false,
    style: { ...transparentNodeStyle, width: 200 },
  },

  // ── TIER 1: Deployable Applications ──
  {
    id: 'frontend',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <Globe className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <div className="font-bold text-sm">Next.js 16 Frontend</div>
            <div className="text-xs text-muted-foreground">{'apps/web - RSC + use cache'}</div>
          </div>
        </div>
      ),
    },
    position: { x: 350, y: 50 },
    style: createNodeStyle('rgb(59, 130, 246)', 3, 260),
  },
  {
    id: 'gateway',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <Code2 className="h-5 w-5 text-green-500 shrink-0" />
          <div>
            <div className="font-bold text-sm">FastAPI Gateway</div>
            <div className="text-xs text-muted-foreground">{'apps/api - Python 3.12 - AWS'}</div>
          </div>
        </div>
      ),
    },
    position: { x: 350, y: 190 },
    style: createNodeStyle('rgb(34, 197, 94)', 3, 260),
  },

  // Cache nodes
  {
    id: 'cache-next',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-3 py-1.5">
          <Zap className="h-4 w-4 text-blue-400 shrink-0" />
          <div className="text-xs font-medium">Next.js Cache</div>
        </div>
      ),
    },
    position: { x: 660, y: 55 },
    style: { ...mutedNodeStyle, width: 135 },
  },
  {
    id: 'cache-redis',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-3 py-1.5">
          <Zap className="h-4 w-4 text-red-500 shrink-0" />
          <div className="text-xs font-medium">Redis Cache</div>
        </div>
      ),
    },
    position: { x: 660, y: 195 },
    style: { ...mutedNodeStyle, width: 135 },
  },

  // ── TIER 2: Multi-Language Services ──
  {
    id: 'llm-service',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <Zap className="h-5 w-5 text-orange-500 shrink-0" />
          <div>
            <div className="font-bold text-sm">LLM Service</div>
            <div className="text-xs text-muted-foreground">{'services/python/ - LLM routing'}</div>
          </div>
        </div>
      ),
    },
    position: { x: 50, y: 370 },
    style: createNodeStyle('rgb(249, 115, 22)'),
  },
  {
    id: 'mcp-service',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <Terminal className="h-5 w-5 text-yellow-500 shrink-0" />
          <div>
            <div className="font-bold text-sm">MCP Service</div>
            <div className="text-xs text-muted-foreground">{'services/python/ - MCP tools'}</div>
          </div>
        </div>
      ),
    },
    position: { x: 305, y: 370 },
    style: createNodeStyle('rgb(234, 179, 8)'),
  },
  {
    id: 'vector-service',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <Database className="h-5 w-5 text-cyan-500 shrink-0" />
          <div>
            <div className="font-bold text-sm">Vector Service</div>
            <div className="text-xs text-muted-foreground">{'services/nodejs/ - embeddings'}</div>
          </div>
        </div>
      ),
    },
    position: { x: 560, y: 370 },
    style: createNodeStyle('rgb(6, 182, 212)'),
  },

  // Language Runtime Indicators
  {
    id: 'lang-python',
    type: 'labelOnly',
    data: { label: <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 px-1">Python 3.12</div> },
    position: { x: 55, y: 435 },
    draggable: false,
    selectable: false,
    style: { ...transparentNodeStyle, width: 75 },
  },
  {
    id: 'lang-node',
    type: 'labelOnly',
    data: { label: <div className="text-[10px] font-semibold text-yellow-600 dark:text-yellow-400 px-1">Node.js 20</div> },
    position: { x: 565, y: 435 },
    draggable: false,
    selectable: false,
    style: { ...transparentNodeStyle, width: 75 },
  },
  {
    id: 'lang-rust',
    type: 'labelOnly',
    data: { label: <div className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 px-1">Rust (future)</div> },
    position: { x: 310, y: 435 },
    draggable: false,
    selectable: false,
    style: { ...transparentNodeStyle, width: 75 },
  },

  // Database
  {
    id: 'postgres',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <Database className="h-5 w-5 text-purple-500 shrink-0" />
          <div>
            <div className="font-bold text-sm">PostgreSQL</div>
            <div className="text-xs text-muted-foreground">{'FastAPI owned - pgvector'}</div>
          </div>
        </div>
      ),
    },
    position: { x: 305, y: 520 },
    style: createNodeStyle('rgb(168, 85, 247)'),
  },

  // ── TIER 3A: External Providers ──
  {
    id: 'external-providers',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <Cloud className="h-5 w-5 text-pink-500 shrink-0" />
          <div>
            <div className="font-bold text-sm">External Providers</div>
            <div className="text-xs text-muted-foreground">{'OpenAI - Anthropic - Pinecone'}</div>
          </div>
        </div>
      ),
    },
    position: { x: 50, y: 660 },
    style: createNodeStyle('rgb(236, 72, 153)', 2, 220),
  },

  // ── TIER 3B: Internal Providers (Sovereign) ──
  {
    id: 'internal-providers',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <Shield className="h-5 w-5 text-emerald-500 shrink-0" />
          <div>
            <div className="font-bold text-sm">Internal Providers</div>
            <div className="text-xs text-muted-foreground">{'Ollama - ChromaDB - LocalAI'}</div>
          </div>
        </div>
      ),
    },
    position: { x: 295, y: 660 },
    style: createNodeStyle('rgb(16, 185, 129)', 2, 220),
  },

  // ── TIER 3C: Hybrid / Client-Side Providers ──
  {
    id: 'hybrid-providers',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <Boxes className="h-5 w-5 text-amber-500 shrink-0" />
          <div>
            <div className="font-bold text-sm">Hybrid / Client</div>
            <div className="text-xs text-muted-foreground">{'Gov - B2B - Client-side DB'}</div>
          </div>
        </div>
      ),
    },
    position: { x: 540, y: 660 },
    style: createNodeStyle('rgb(217, 119, 6)', 2, 220),
  },

  // Shared packages
  {
    id: 'packages',
    type: 'arch',
    data: {
      label: (
        <div className="flex items-center gap-2 px-3 py-1.5">
          <Package className="h-4 w-4 text-indigo-500 shrink-0" />
          <div className="text-xs font-medium">Shared Packages</div>
        </div>
      ),
    },
    position: { x: 660, y: 380 },
    style: { ...mutedNodeStyle, width: 135 },
  },
]

// ──────────────────────────────────────────────
// EDGES  (using @ideai/reactflow factories)
// ──────────────────────────────────────────────
const initialEdges = [
  // Tier 1: Frontend <-> Gateway
  { id: 'e-fe-gw', source: 'frontend', target: 'gateway', ...createEdgeStyle('primary'), label: 'API Calls' },
  // Cache
  { id: 'e-fe-cache', source: 'frontend', target: 'cache-next', ...createEdgeStyle('shared'), label: 'use cache' },
  { id: 'e-gw-cache', source: 'gateway', target: 'cache-redis', label: 'LLM cache', style: { stroke: 'rgb(239, 68, 68)', strokeDasharray: '5,5' } },
  // Tier 2: Gateway -> Services
  { id: 'e-gw-llm', source: 'gateway', target: 'llm-service', ...createEdgeStyle('service'), label: 'Route LLMs' },
  { id: 'e-gw-mcp', source: 'gateway', target: 'mcp-service', animated: true, label: 'MCP Tools', style: { stroke: 'rgb(234, 179, 8)', strokeWidth: 2 } },
  { id: 'e-gw-vec', source: 'gateway', target: 'vector-service', animated: true, label: 'Vector Ops', style: { stroke: 'rgb(6, 182, 212)', strokeWidth: 2 } },
  // Gateway -> Database
  { id: 'e-gw-db', source: 'gateway', target: 'postgres', label: 'SQL + pgvector', style: { stroke: 'rgb(168, 85, 247)', strokeWidth: 2 } },
  // Tier 3A: Services -> External
  { id: 'e-llm-ext', source: 'llm-service', target: 'external-providers', ...createEdgeStyle('external'), label: 'Cloud APIs' },
  { id: 'e-vec-ext', source: 'vector-service', target: 'external-providers', ...createEdgeStyle('external'), label: 'Pinecone' },
  // Tier 3B: Services -> Internal
  { id: 'e-llm-int', source: 'llm-service', target: 'internal-providers', ...createEdgeStyle('internal'), label: 'Ollama/Local' },
  { id: 'e-mcp-int', source: 'mcp-service', target: 'internal-providers', ...createEdgeStyle('internal'), label: 'Local Tools' },
  { id: 'e-vec-int', source: 'vector-service', target: 'internal-providers', ...createEdgeStyle('internal'), label: 'ChromaDB' },
  // Tier 3C: Services -> Hybrid
  { id: 'e-llm-hyb', source: 'llm-service', target: 'hybrid-providers', ...createEdgeStyle('hybrid'), label: 'Client LLMs' },
  { id: 'e-vec-hyb', source: 'vector-service', target: 'hybrid-providers', ...createEdgeStyle('hybrid'), label: 'Client DB' },
  // Hybrid connects to both External and Internal
  { id: 'e-hyb-ext', source: 'hybrid-providers', target: 'external-providers', style: { stroke: edgeColors.hybrid, strokeDasharray: '2,4', strokeWidth: 1 } },
  { id: 'e-hyb-int', source: 'hybrid-providers', target: 'internal-providers', style: { stroke: edgeColors.hybrid, strokeDasharray: '2,4', strokeWidth: 1 } },
  // Shared Packages
  { id: 'e-pkg-fe', source: 'packages', target: 'frontend', ...createEdgeStyle('shared') },
  { id: 'e-pkg-gw', source: 'packages', target: 'gateway', ...createEdgeStyle('shared') },
  { id: 'e-pkg-vec', source: 'packages', target: 'vector-service', ...createEdgeStyle('shared') },
]

// ──────────────────────────────────────────────
// MINIMAP COLOURS
// ──────────────────────────────────────────────
const minimapColorFn = createMinimapColorFn({
  frontend: 'rgb(59, 130, 246)',
  gateway: 'rgb(34, 197, 94)',
  'llm-service': 'rgb(249, 115, 22)',
  'mcp-service': 'rgb(234, 179, 8)',
  'vector-service': 'rgb(6, 182, 212)',
  postgres: 'rgb(168, 85, 247)',
  'external-providers': 'rgb(236, 72, 153)',
  'internal-providers': 'rgb(16, 185, 129)',
  'hybrid-providers': 'rgb(217, 119, 6)',
  'cache-next': 'rgb(147, 197, 253)',
  'cache-redis': 'rgb(239, 68, 68)',
  packages: 'rgb(99, 102, 241)',
})

// ──────────────────────────────────────────────
// MAIN DIAGRAM COMPONENT
// ──────────────────────────────────────────────
export default function ArchitectureDiagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  return (
    <div className="relative w-full h-full">
      <DiagramLegend title="Architecture Legend" version="v2027">
        <LegendSection title="Nodes">
          <LegendNodeItem borderStyle="3px solid rgb(59, 130, 246)" label="Deployable (Tier 1)" />
          <LegendNodeItem borderStyle="2px solid rgb(249, 115, 22)" label="Your Service (Tier 2)" />
          <LegendNodeItem borderStyle="2px solid rgb(236, 72, 153)" label="External Provider (3A)" />
          <LegendNodeItem borderStyle="2px solid rgb(16, 185, 129)" label="Internal / Sovereign (3B)" />
          <LegendNodeItem borderStyle="2px solid rgb(217, 119, 6)" label="Hybrid / Client (3C)" />
          <LegendNodeItem borderStyle="1px dashed hsl(var(--border))" label="Cache & Utility" />
        </LegendSection>
        <LegendSection title="Connections">
          <LegendEdgeItem color={edgeColors.primary} thickness={3} label="Primary data flow" />
          <LegendEdgeItem color={edgeColors.service} thickness={2} label="Service routing" />
          <LegendEdgeItem color={edgeColors.external} dashed label="External API call" />
          <LegendEdgeItem color={edgeColors.internal} dashed label="Local / offline call" />
          <LegendEdgeItem color={edgeColors.hybrid} dashed label="Hybrid / client call" />
          <LegendEdgeItem color="hsl(var(--muted-foreground))" dashed thickness={1} label="Shared dependency" />
        </LegendSection>
        <LegendSection title="Languages">
          <div className="flex gap-3">
            <span className="text-[11px] text-green-600 dark:text-green-400 font-medium">Python 3.12</span>
            <span className="text-[11px] text-yellow-600 dark:text-yellow-400 font-medium">Node.js 20</span>
            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">Rust (future)</span>
          </div>
        </LegendSection>
        <div className="pt-2 border-t border-border">
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Hybrid / Client Model</h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Client environments (Gov, B2B) run their own internal providers AND connect to external cloud providers.
            Client-side DBs stay on their infrastructure. Services route transparently via deployment profiles.
          </p>
        </div>
      </DiagramLegend>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={ideaiNodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap
          nodeColor={minimapColorFn}
          className="bg-card border border-border rounded-lg"
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </div>
  )
}
