const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
const dateTime = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
const dateOnly = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export const money = (n: number) => rub.format(n)
export function when(iso: string): string {
  const s = `${weekday.format(new Date(iso))}, ${dateTime.format(new Date(iso))}`
  return s[0].toUpperCase() + s.slice(1)
}

export function phone(raw: string): string {
  const d = raw.replace(/\D/g, '').replace(/^[78]/, '')
  if (d.length !== 10) return raw
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`
}
export const date = (iso: string) => dateOnly.format(new Date(iso))

export function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few
  return many
}
