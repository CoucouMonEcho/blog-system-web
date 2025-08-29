export function formatTimeAgo(dateInput?: string | number | Date) {
  if (!dateInput) return '未知时间'
  const date = new Date(dateInput)
  const diffMs = Date.now() - date.getTime()
  if (Number.isNaN(diffMs)) return '未知时间'
  const sec = Math.floor(diffMs / 1000)
  if (sec < 60) return `${sec} 秒前`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} 分钟前`
  const hour = Math.floor(min / 60)
  if (hour < 24) return `${hour} 小时前`
  const day = Math.floor(hour / 24)
  if (day < 30) return `${day} 天前`
  const month = Math.floor(day / 30)
  if (month < 12) return `${month} 个月前`
  const year = Math.floor(month / 12)
  return `${year} 年前`
}


