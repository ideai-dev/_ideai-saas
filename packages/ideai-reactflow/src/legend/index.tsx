'use client'

import { useState, type ReactNode } from 'react'

/**
 * @ideai/reactflow - Collapsible Legend
 *
 * A headless collapsible legend for React Flow diagrams.
 * You provide the content sections; it handles open/close state.
 *
 * @example
 * ```tsx
 * <DiagramLegend title="Legend" version="v2027">
 *   <LegendSection title="Nodes">
 *     <LegendItem border="3px solid blue" label="Deployable" />
 *   </LegendSection>
 * </DiagramLegend>
 * ```
 */

// ── LegendItem ──
export interface LegendNodeItemProps {
  borderStyle: string
  label: string
}

export function LegendNodeItem({ borderStyle, label }: LegendNodeItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-4 w-6 rounded shrink-0"
        style={{ border: borderStyle, background: 'hsl(var(--card))' }}
      />
      <span className="text-[11px]">{label}</span>
    </div>
  )
}

// ── LegendEdgeItem ──
export interface LegendEdgeItemProps {
  color: string
  dashed?: boolean
  thickness?: number
  label: string
}

export function LegendEdgeItem({ color, dashed = false, thickness = 2, label }: LegendEdgeItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 shrink-0"
        style={{
          borderTop: `${thickness}px ${dashed ? 'dashed' : 'solid'} ${color}`,
        }}
      />
      <span className="text-[11px]">{label}</span>
    </div>
  )
}

// ── LegendSection ──
export function LegendSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
        {title}
      </h4>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

// ── DiagramLegend (container) ──
export interface DiagramLegendProps {
  title?: string
  version?: string
  children: ReactNode
  defaultOpen?: boolean
}

export function DiagramLegend({
  title = 'Architecture Legend',
  version,
  children,
  defaultOpen = false,
}: DiagramLegendProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="absolute bottom-20 left-4 z-10 bg-card/95 backdrop-blur-sm shadow-lg rounded-lg border border-border overflow-hidden"
      style={{ width: open ? 300 : 'auto' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold w-full hover:bg-muted/50 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        {title}
        {version && (
          <span className="text-[9px] ml-auto border border-border rounded px-1.5 py-0.5 text-muted-foreground">
            {version}
          </span>
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  )
}
