# @ideai/reactflow

Custom React Flow primitives for ideai SaaS architecture diagrams.

## What This Package Provides

| Export | Purpose |
|--------|---------|
| `ideaiNodeTypes` | Pre-configured nodeTypes map for `<ReactFlow>` |
| `ArchNode` | Node with both source + target handles (bidirectional) |
| `LabelNode` | Handle-free node for annotations and tier labels |
| `createEdgeStyle(tier)` | Consistent edge styling per architecture tier |
| `edgeColors` | Colour constants for all six edge tiers |
| `createNodeStyle(color)` | Theme-aware node style with coloured border |
| `themedNodeStyle` | Base node style using CSS custom properties |
| `mutedNodeStyle` | Dashed-border style for utility nodes |
| `transparentNodeStyle` | Invisible style for label-only nodes |
| `createMinimapColorFn(map)` | MiniMap `nodeColor` helper |
| `DiagramLegend` | Collapsible legend container |
| `LegendSection` | Legend section with title |
| `LegendNodeItem` | Legend row showing a node border sample |
| `LegendEdgeItem` | Legend row showing an edge line sample |

## Architecture Conventions

### Node Types

- **`arch`** - Any node that participates in data flow. Has handles top and bottom.
- **`labelOnly`** - Tier labels, language indicators, annotations. No handles.

### Edge Tiers

| Tier | Style | Colour | Meaning |
|------|-------|--------|---------|
| `primary` | Solid animated (3px) | Blue | Tier 1 data flow |
| `service` | Solid animated (2px) | Orange | Gateway to service routing |
| `external` | Dashed | Pink | External cloud API calls |
| `internal` | Dashed | Emerald | Sovereign / local provider calls |
| `hybrid` | Short-dash | Amber | Client / B2B / Gov hybrid calls |
| `shared` | Dotted | Muted | Shared package dependencies |

### Theme Awareness

All styles reference CSS custom properties (`--card`, `--border`, `--muted-foreground`).
When the active theme changes, every node and handle updates automatically.

## Usage

```tsx
import {
  ideaiNodeTypes,
  createEdgeStyle,
  createNodeStyle,
  createMinimapColorFn,
  DiagramLegend,
  LegendSection,
  LegendNodeItem,
  LegendEdgeItem,
} from '@ideai/reactflow'

const nodes = [
  {
    id: 'api',
    type: 'arch',
    data: { label: <div>My API</div> },
    position: { x: 100, y: 100 },
    style: createNodeStyle('rgb(34, 197, 94)', 3, 260),
  },
]

const edges = [
  { id: 'e1', source: 'frontend', target: 'api', ...createEdgeStyle('primary'), label: 'REST' },
  { id: 'e2', source: 'api', target: 'openai', ...createEdgeStyle('external'), label: 'Cloud' },
]

<ReactFlow nodes={nodes} edges={edges} nodeTypes={ideaiNodeTypes}>
  <MiniMap nodeColor={createMinimapColorFn({ api: 'green', frontend: 'blue' })} />
</ReactFlow>

<DiagramLegend title="Legend" version="v2027">
  <LegendSection title="Nodes">
    <LegendNodeItem borderStyle="3px solid blue" label="Deployable" />
  </LegendSection>
  <LegendSection title="Edges">
    <LegendEdgeItem color="blue" label="Primary flow" />
    <LegendEdgeItem color="pink" dashed label="External API" />
  </LegendSection>
</DiagramLegend>
```

## Peer Dependencies

- `@xyflow/react` >= 12.0.0
- `react` >= 19.0.0
