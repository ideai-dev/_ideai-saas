import { ArchNode } from './arch-node'
import { LabelNode } from './label-node'

/**
 * Pre-configured nodeTypes map for ReactFlow.
 *
 * Pass this directly to <ReactFlow nodeTypes={ideaiNodeTypes} />
 *
 * Types:
 *   'arch'      -> ArchNode (bidirectional handles)
 *   'labelOnly' -> LabelNode (no handles, annotation only)
 */
export const ideaiNodeTypes = {
  arch: ArchNode,
  labelOnly: LabelNode,
} as const
