/**
 * @ideai/reactflow - Custom Node Types
 *
 * ArchNode:   Standard node with BOTH source (bottom) and target (top) handles.
 *             Use for any node that participates in data flow.
 *
 * LabelNode:  No handles. Use for tier labels, annotations, language indicators.
 *
 * All nodes render `data.label` as JSX content and are fully theme-aware
 * through CSS custom properties (hsl(var(--card)), etc).
 */
export { ArchNode } from './arch-node'
export { LabelNode } from './label-node'
export { ideaiNodeTypes } from './node-types'
