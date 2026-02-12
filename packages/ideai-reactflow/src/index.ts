/**
 * @ideai/reactflow
 *
 * Custom React Flow primitives for ideai SaaS architecture diagrams.
 *
 * This package provides:
 *   - Custom node types (ArchNode, LabelNode) with proper handle management
 *   - Edge style factories for consistent tier-based colouring
 *   - Theme-aware node styles that respond to CSS custom properties
 *   - Collapsible legend components for diagram annotation
 *   - MiniMap colour helpers
 *
 * All components are theme-aware and work with any CSS custom property
 * based theme system (shadcn/ui, Tailwind, custom).
 *
 * @example
 * ```tsx
 * import { ideaiNodeTypes, createEdgeStyle, createNodeStyle } from '@ideai/reactflow'
 *
 * <ReactFlow
 *   nodes={myNodes}
 *   edges={myEdges}
 *   nodeTypes={ideaiNodeTypes}
 * />
 * ```
 */

// Nodes
export { ArchNode, LabelNode, ideaiNodeTypes } from './nodes'

// Edges
export { createEdgeStyle, edgeColors, type EdgeTier } from './edges'

// Theme
export {
  themedNodeStyle,
  transparentNodeStyle,
  mutedNodeStyle,
  createNodeStyle,
  createMinimapColorFn,
} from './theme'

// Legend
export {
  DiagramLegend,
  LegendSection,
  LegendNodeItem,
  LegendEdgeItem,
  type DiagramLegendProps,
  type LegendNodeItemProps,
  type LegendEdgeItemProps,
} from './legend'
