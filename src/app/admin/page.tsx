"use client"

import { Typography, Space, Table } from 'antd'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDashboardOverview, getPvTimeseries, getErrorRate, getLatencyPercentile, getTopEndpoints, getActiveUsers, type TopEndpoint } from '@/services/stat.service'
import { MiniLine, MultiLine } from '@/components/admin/Charts'
import Filters from '@/components/admin/Filters'
import KpiCard from '@/components/admin/KpiCard'
import { computeRange, pickInterval, type RangeKey } from '@/lib/date-range'
import { qk } from '@/lib/query-keys'

export default function AdminDashboardPage() {
  const [rangeKey, setRangeKey] = useState<RangeKey>('today')
  const [service, setService] = useState<string>('')

  const { from, to } = computeRange(rangeKey)
  const interval = pickInterval(rangeKey)

  const { data: overview } = useQuery({
    queryKey: qk.overview(),
    queryFn: () => getDashboardOverview()
  })

  const { data: pvSeries } = useQuery({
    queryKey: qk.pv(from, to, interval),
    queryFn: () => getPvTimeseries({ from, to, interval })
  })

  const { data: errorRate } = useQuery({
    queryKey: qk.errorRate(from, to, service || undefined),
    queryFn: () => getErrorRate({ from, to, service: service || undefined })
  })

  const { data: latency } = useQuery({
    queryKey: qk.latency(from, to, service || undefined),
    queryFn: () => getLatencyPercentile({ from, to, service: service || undefined })
  })

  const { data: topEndpoints } = useQuery({
    queryKey: qk.topEndpoints(from, to, service || undefined),
    queryFn: () => getTopEndpoints({ from, to, service: service || undefined })
  })

  const { data: activeUsers } = useQuery({
    queryKey: qk.activeUsers(from, to),
    queryFn: () => getActiveUsers({ from, to })
  })

  return (
    <section className="space-y-4">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>仪表盘</Typography.Title>
            <p className="muted">站点运行态与业务指标概览。</p>
          </div>
          <Space size={8} wrap>
            <Filters rangeKey={rangeKey} onRangeChange={setRangeKey} service={service} onServiceChange={setService} />
          </Space>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="今日 PV" value={overview?.pv_today} />
        <KpiCard title="今日 UV" value={overview?.uv_today} />
        <KpiCard title="在线用户" value={overview?.online_users} />
        <KpiCard title="文章总数" value={overview?.article_total} />
        <KpiCard title="分类总数" value={overview?.category_total} />
        <KpiCard title="近1小时 5xx 错误" value={overview?.error_5xx_last_1h} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">PV 趋势</div>
          <div className="text-xs muted">{interval} 粒度</div>
        </div>
        {pvSeries ? <MiniLine data={pvSeries} /> : <div className="muted text-sm">加载中...</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">错误率（{service || '所有服务'}）</div>
            <div className="text-xs muted">{interval} 粒度</div>
          </div>
          {errorRate ? <MiniLine data={errorRate} /> : <div className="muted text-sm">加载中...</div>}
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">活跃用户</div>
            <div className="text-xs muted">{interval} 粒度</div>
          </div>
          {activeUsers ? <MiniLine data={activeUsers} /> : <div className="muted text-sm">加载中...</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">延迟分位数（{service || '所有服务'}）</div>
            <div className="text-xs muted">{interval} 粒度</div>
          </div>
          {latency ? (
            <>
              <MultiLine data={latency} />
              <div className="flex gap-3 mt-2 text-xs">
                <span className="inline-flex items-center gap-1"><i style={{ width: 10, height: 2, background: '#10b981', display: 'inline-block' }} />P50</span>
                <span className="inline-flex items-center gap-1"><i style={{ width: 10, height: 2, background: '#3b82f6', display: 'inline-block' }} />P90</span>
                <span className="inline-flex items-center gap-1"><i style={{ width: 10, height: 2, background: '#f59e0b', display: 'inline-block' }} />P95</span>
                <span className="inline-flex items-center gap-1"><i style={{ width: 10, height: 2, background: '#ef4444', display: 'inline-block' }} />P99</span>
              </div>
            </>
          ) : (
            <div className="muted text-sm">加载中...</div>
          )}
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Top Endpoints（{service || '所有服务'}）</div>
            <div className="text-xs muted">{rangeKey === 'today' ? '今日' : rangeKey === '7d' ? '近7天' : '近30天'}</div>
          </div>
          <Table
            size="small"
            rowKey={(r: TopEndpoint, i) => `${r.endpoint}-${i}`}
            dataSource={topEndpoints || []}
            columns={[
              { title: 'Endpoint', dataIndex: 'endpoint' },
              { title: 'Count', dataIndex: 'count', width: 100 }
            ]}
            pagination={false}
          />
        </div>
      </div>
    </section>
  )
}


