/**
 * @ideai/reactflow - Theme-Aware Helpers
 *
 * Utilities for building theme-responsive React Flow diagrams.
 * All colours reference CSS custom properties so they update
 * when the active theme changes (light, dark, zinc, rose, etc).
 */

/** Default node style that respects the active theme */
export const themedNodeStyle = {
  background: 'hsl(var(--card))',
  borderRadius: '12px',
  padding: '0',
} as const

/** Transparent style for label-only / annotation nodes */
export const transparentNodeStyle = {
  background: 'transparent',
  border: 'none',
} as const

/** Muted style for utility nodes (caches, shared packages) */
export const mutedNodeStyle = {
  background: 'hsl(var(--muted))',
  border: '1px dashed hsl(var(--border))',
  borderRadius: '8px',
  padding: '0',
} as const

/**
 * Create a themed node style with a coloured border.
 *
 * @param color  - CSS colour string for the border (e.g. 'rgb(59, 130, 246)')
 * @param width  - Border width in px (default 2)
 * @param nodeWidth - CSS width (default 230)
 */
export function createNodeStyle(color: string, width = 2, nodeWidth = 230) {
  return {
    ...themedNodeStyle,
    border: `${width}px solid ${color}`,
    width: nodeWidth,
  } as const
}

/**
 * Colour map for MiniMap node colouring.
 * Pass to <MiniMap nodeColor={(node) => minimapColors[node.id] ?? 'transparent'} />
 */
export function createMinimapColorFn(colorMap: Record<string, string>) {
  return (node: { id: string }) => colorMap[node.id] ?? 'transparent'
}
