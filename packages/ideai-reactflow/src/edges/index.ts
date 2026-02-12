/**
 * @ideai/reactflow - Edge Style Factories
 *
 * Consistent edge styles across all ideai architecture diagrams.
 * Each factory returns a partial Edge style object.
 *
 * SOLID  = Primary data flow (animated)
 * DASHED = External / cross-boundary calls
 * DOTTED = Shared dependency / utility links
 */

export type EdgeTier = 'primary' | 'service' | 'external' | 'internal' | 'hybrid' | 'shared'

/** Color palette for edge tiers - matches ideai architecture conventions */
export const edgeColors = {
  primary:  'rgb(59, 130, 246)',   // Blue - Tier 1 data flow
  service:  'rgb(249, 115, 22)',   // Orange - service routing
  external: 'rgb(236, 72, 153)',   // Pink - external provider calls
  internal: 'rgb(16, 185, 129)',   // Emerald - sovereign / local calls
  hybrid:   'rgb(217, 119, 6)',    // Amber - hybrid / client calls
  shared:   'hsl(var(--muted-foreground))', // Theme muted - shared deps
} as const

/**
 * Create an edge style for a given tier.
 *
 * @example
 * ```ts
 * { id: 'e-1', source: 'a', target: 'b', ...createEdgeStyle('primary') }
 * ```
 */
export function createEdgeStyle(tier: EdgeTier) {
  switch (tier) {
    case 'primary':
      return { animated: true, style: { stroke: edgeColors.primary, strokeWidth: 3 } }
    case 'service':
      return { animated: true, style: { stroke: edgeColors.service, strokeWidth: 2 } }
    case 'external':
      return { style: { stroke: edgeColors.external, strokeDasharray: '5,5' } }
    case 'internal':
      return { style: { stroke: edgeColors.internal, strokeDasharray: '5,5' } }
    case 'hybrid':
      return { style: { stroke: edgeColors.hybrid, strokeDasharray: '3,3' } }
    case 'shared':
      return { style: { stroke: edgeColors.shared, strokeDasharray: '2,2' } }
  }
}
