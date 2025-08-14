"use client"

import { Segmented, Input } from 'antd'
import type { RangeKey } from '@/lib/date-range'

type FiltersProps = {
  rangeKey: RangeKey
  onRangeChange: (val: RangeKey) => void
  service: string
  onServiceChange: (val: string) => void
}

export default function Filters({ rangeKey, onRangeChange, service, onServiceChange }: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <Segmented
        value={rangeKey}
        onChange={(val) => onRangeChange(val as RangeKey)}
        options={[
          { label: '今日', value: 'today' },
          { label: '近7天', value: '7d' },
          { label: '近30天', value: '30d' }
        ]}
      />
      <Input
        placeholder="服务名（可选，如 gateway、content）"
        value={service}
        onChange={(e) => onServiceChange(e.target.value)}
        allowClear
        style={{ width: 260 }}
      />
    </div>
  )
}


