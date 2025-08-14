export const qk = {
  overview: () => ['dashboard-overview'] as const,
  pv: (from: string, to: string, interval: string) => ['pv-timeseries', from, to, interval] as const,
  errorRate: (from: string, to: string, service?: string) => ['error-rate', from, to, service || 'all'] as const,
  latency: (from: string, to: string, service?: string) => ['latency-percentile', from, to, service || 'all'] as const,
  topEndpoints: (from: string, to: string, service?: string) => ['top-endpoints', from, to, service || 'all'] as const,
  activeUsers: (from: string, to: string) => ['active-users', from, to] as const
}


