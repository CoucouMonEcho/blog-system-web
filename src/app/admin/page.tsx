"use client"

import { Typography, Space, Table, Card, Statistic, Row, Col } from 'antd'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDashboardOverview, getPvTimeseries, getErrorRate, getLatencyPercentile, getTopEndpoints, getActiveUsers, type TopEndpoint } from '@/services/stat.service'
import { MiniLine, MultiLine } from '@/components/admin/Charts'
import Filters from '@/components/admin/Filters'
import KpiCard from '@/components/admin/KpiCard'
import { computeRange, pickInterval, type RangeKey } from '@/lib/date-range'
import { qk } from '@/lib/query-keys'
import { 
  EyeOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  FolderOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'

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
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Typography.Title level={2} style={{ margin: 0, color: '#1e293b' }}>
              仪表盘概览
            </Typography.Title>
            <p className="text-slate-600 text-lg">实时监控站点运行状态与业务指标</p>
          </div>
          <Space size={8} wrap>
            <Filters 
              rangeKey={rangeKey} 
              onRangeChange={setRangeKey} 
              service={service} 
              onServiceChange={setService} 
            />
          </Space>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="text-center hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="今日 PV"
              value={overview?.pv_today || 0}
              prefix={<EyeOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="text-center hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="今日 UV"
              value={overview?.uv_today || 0}
              prefix={<UserOutlined className="text-green-500" />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="text-center hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="在线用户"
              value={overview?.online_users || 0}
              prefix={<UserOutlined className="text-purple-500" />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="text-center hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="文章总数"
              value={overview?.article_total || 0}
              prefix={<FileTextOutlined className="text-orange-500" />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="text-center hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="分类总数"
              value={overview?.category_total || 0}
              prefix={<FolderOutlined className="text-indigo-500" />}
              valueStyle={{ color: '#6366f1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card className="text-center hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="近1小时 5xx 错误"
              value={overview?.error_5xx_last_1h || 0}
              prefix={<ExclamationCircleOutlined className="text-red-500" />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
      </Row>

      {/* PV Trend Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <EyeOutlined className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">PV 趋势</h3>
              <p className="text-sm text-slate-500">{interval} 粒度</p>
            </div>
          </div>
        </div>
        {pvSeries ? (
          <MiniLine data={pvSeries} />
        ) : (
          <div className="text-center py-12 text-slate-500">
            <ClockCircleOutlined className="text-3xl mb-2" />
            <p>正在加载数据...</p>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExclamationCircleOutlined className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    错误率（{service || '所有服务'}）
                  </h3>
                  <p className="text-sm text-slate-500">{interval} 粒度</p>
                </div>
              </div>
            </div>
            {errorRate ? (
              <MiniLine data={errorRate} />
            ) : (
              <div className="text-center py-12 text-slate-500">
                <ClockCircleOutlined className="text-3xl mb-2" />
                <p>正在加载数据...</p>
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserOutlined className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">活跃用户</h3>
                  <p className="text-sm text-slate-500">{interval} 粒度</p>
                </div>
              </div>
            </div>
            {activeUsers ? (
              <MiniLine data={activeUsers} />
            ) : (
              <div className="text-center py-12 text-slate-500">
                <ClockCircleOutlined className="text-3xl mb-2" />
                <p>正在加载数据...</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Latency and Top Endpoints */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ClockCircleOutlined className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    延迟分位数（{service || '所有服务'}）
                  </h3>
                  <p className="text-sm text-slate-500">{interval} 粒度</p>
                </div>
              </div>
            </div>
            {latency ? (
              <>
                <MultiLine data={latency} />
                <div className="flex gap-4 mt-4 text-xs">
                  <span className="inline-flex items-center gap-2">
                    <div className="w-3 h-1 bg-green-500 rounded" />
                    P50
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <div className="w-3 h-1 bg-blue-500 rounded" />
                    P90
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <div className="w-3 h-1 bg-orange-500 rounded" />
                    P95
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <div className="w-3 h-1 bg-red-500 rounded" />
                    P99
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <ClockCircleOutlined className="text-3xl mb-2" />
                <p>正在加载数据...</p>
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileTextOutlined className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Top Endpoints（{service || '所有服务'}）
                  </h3>
                  <p className="text-sm text-slate-500">
                    {rangeKey === 'today' ? '今日' : rangeKey === '7d' ? '近7天' : '近30天'}
                  </p>
                </div>
              </div>
            </div>
            <Table
              size="small"
              rowKey={(r: TopEndpoint, i) => `${r.endpoint}-${i}`}
              dataSource={topEndpoints || []}
              columns={[
                { 
                  title: 'Endpoint', 
                  dataIndex: 'endpoint',
                  render: (text) => (
                    <span className="font-mono text-sm text-slate-700">{text}</span>
                  )
                },
                { 
                  title: 'Count', 
                  dataIndex: 'count', 
                  width: 100,
                  render: (value) => (
                    <span className="font-medium text-blue-600">{value}</span>
                  )
                }
              ]}
              pagination={false}
              className="custom-table"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}


