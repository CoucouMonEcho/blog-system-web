"use client"

type KpiCardProps = {
  title: string
  value: number | string | undefined | null
}

export default function KpiCard({ title, value }: KpiCardProps) {
  return (
    <div className="card">
      <div className="text-sm muted">{title}</div>
      <div className="text-2xl font-semibold">{value ?? '-'}</div>
    </div>
  )
}


