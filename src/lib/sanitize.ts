export function safeString(value: unknown): string | undefined {
  if (value == null) return undefined
  const t = typeof value
  if (t === 'string') return value as string
  if (t === 'number' || t === 'boolean') return String(value)
  if (t === 'object') {
    const obj = value as Record<string, unknown>
    if (Object.prototype.hasOwnProperty.call(obj, 'String')) {
      const valid = Object.prototype.hasOwnProperty.call(obj, 'Valid') ? Boolean((obj as any).Valid) : true
      if (!valid) return undefined
      const s = (obj as any).String
      return typeof s === 'string' ? s : s != null ? String(s) : undefined
    }
    if (Object.prototype.hasOwnProperty.call(obj, 'Time')) {
      // 处理可能的时间对象 { Time: string, Valid: boolean }
      const valid = Object.prototype.hasOwnProperty.call(obj, 'Valid') ? Boolean((obj as any).Valid) : true
      if (!valid) return undefined
      const s = (obj as any).Time
      return typeof s === 'string' ? s : s != null ? String(s) : undefined
    }
  }
  return undefined
}


