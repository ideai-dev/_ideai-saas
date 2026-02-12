'use client'

import type { NodeProps } from '@xyflow/react'
import type { JSX } from 'react'

/**
 * LabelNode - Annotation-only node with NO handles.
 *
 * Use for tier labels, language runtime indicators, and any
 * decorative text that should not participate in edge connections.
 *
 * Usage:
 * ```ts
 * { id: 'label', type: 'labelOnly', data: { label: <div>My Label</div> }, draggable: false }
 * ```
 */
export function LabelNode({ data }: NodeProps) {
  return <div>{data.label as JSX.Element}</div>
}
