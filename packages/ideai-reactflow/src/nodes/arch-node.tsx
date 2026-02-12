'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { JSX } from 'react'

/**
 * ArchNode - Primary architecture node with bidirectional handles.
 *
 * Renders data.label as JSX content with a target handle on top
 * and a source handle on bottom. Handle styling uses theme tokens
 * so they adapt to light/dark and custom themes.
 *
 * Usage:
 * ```ts
 * { id: 'my-node', type: 'arch', data: { label: <MyLabel /> }, position: { x: 0, y: 0 } }
 * ```
 */
export function ArchNode({ data }: NodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: 8,
          height: 8,
          background: 'hsl(var(--muted-foreground))',
          border: '2px solid hsl(var(--card))',
        }}
      />
      <div>{data.label as JSX.Element}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: 8,
          height: 8,
          background: 'hsl(var(--muted-foreground))',
          border: '2px solid hsl(var(--card))',
        }}
      />
    </>
  )
}
