"use client"

import { useMemo } from 'react'
import type { TimeseriesPoint, LatencyPercentilePoint } from '@/services/stat.service'

export function MiniLine({ data, color = '#3b82f6', width = 160, height = 40 }: { data: TimeseriesPoint[]; color?: string; width?: number; height?: number }) {
  const points = useMemo(() => {
    if (!data || data.length === 0) return ''
    const values = data.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const xStep = width / Math.max(1, data.length - 1)
    const scaleY = (v: number) => {
      if (max === min) return height / 2
      return height - ((v - min) / (max - min)) * height
    }
    return data.map((d, i) => `${i * xStep},${scaleY(d.value)}`).join(' ')
  }, [data, width, height])

  return (
    <svg width="100%" height={height + 2} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  )
}

export function MultiLine({ data, width = 240, height = 60 }: { data: LatencyPercentilePoint[]; width?: number; height?: number }) {
  const seriesKeys = ['p50', 'p90', 'p95', 'p99'] as const
  const colors: Record<(typeof seriesKeys)[number], string> = {
    p50: '#10b981',
    p90: '#3b82f6',
    p95: '#f59e0b',
    p99: '#ef4444'
  }
  const paths = useMemo(() => {
    if (!data || data.length === 0) return {}
    const xStep = width / Math.max(1, data.length - 1)
    const values = data.flatMap((d) => [d.p50, d.p90, d.p95, d.p99].filter((v): v is number => typeof v === 'number'))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const scaleY = (v: number) => {
      if (!isFinite(min) || !isFinite(max) || min === max) return height / 2
      return height - ((v - min) / (max - min)) * height
    }
    const out: Record<string, string> = {}
    for (const k of seriesKeys) {
      const pts = data
        .map((d, i) => (typeof d[k] === 'number' ? `${i * xStep},${scaleY(d[k] as number)}` : null))
        .filter(Boolean)
        .join(' ')
      out[k] = pts
    }
    return out
  }, [data, width, height]) as Record<string, string>

  return (
    <svg width="100%" height={height + 4} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {(['p50', 'p90', 'p95', 'p99'] as const).map((k) => (
        <polyline key={k} fill="none" stroke={colors[k]} strokeWidth="2" points={paths?.[k] || ''} />
      ))}
    </svg>
  )
}


