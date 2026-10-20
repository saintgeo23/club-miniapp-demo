// One adapter over Telegram WebApp and MAX WebApp, with a plain-browser fallback for the demo.

export type PlatformKind = 'telegram' | 'max' | 'web'

interface TgWebApp {
  initData: string
  ready(): void
  expand(): void
  colorScheme: 'light' | 'dark'
  platform: string
  isVersionAtLeast(version: string): boolean
  requestFullscreen(): void
  disableVerticalSwipes(): void
  requestContact(cb?: (ok: boolean, res?: { responseUnsafe?: { contact?: { phone_number?: string } } }) => void): void
  openTelegramLink(url: string): void
  openLink(url: string): void
  HapticFeedback?: { impactOccurred(style: string): void; notificationOccurred(type: string): void }
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void }
}

interface MaxWebApp {
  initData: string
  ready?(): void
  requestContact(): Promise<{ phone: string; authDate: string; hash: string }>
  openLink(url: string): void
  openMaxLink(url: string): void
  HapticFeedback?: { impactOccurred(style: string): void; notificationOccurred(type: string): void }
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void }
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp }
    WebApp?: MaxWebApp
  }
}

const tg = window.Telegram?.WebApp
const max = window.WebApp

// Both SDK scripts define their globals everywhere; only initData tells us where we actually run.
export const kind: PlatformKind = tg?.initData ? 'telegram' : max?.initData ? 'max' : 'web'

export const platformLabel: Record<PlatformKind, string> = {
  telegram: 'Telegram',
  max: 'MAX',
  web: 'Браузер (демо)',
}

export function init(): void {
  if (kind === 'telegram') {
    tg!.ready()
    tg!.expand()
    document.documentElement.dataset.theme = tg!.colorScheme
    // Scrolling up must not collapse the app.
    if (tg!.isVersionAtLeast('7.7')) tg!.disableVerticalSwipes()
    // Fullscreen only on phones: on desktop it blows the window up to the whole monitor.
    if (tg!.isVersionAtLeast('8.0') && ['ios', 'android'].includes(tg!.platform)) tg!.requestFullscreen()
  } else if (kind === 'max') {
    max!.ready?.()
  }
}

/** Asks the messenger for the user's phone. Returns null in the browser: the UI shows a phone input instead. */
export async function requestPhone(): Promise<string | null> {
  if (kind === 'telegram') {
    return new Promise((resolve) => {
      tg!.requestContact((ok, res) => resolve(ok ? res?.responseUnsafe?.contact?.phone_number ?? null : null))
    })
  }
  if (kind === 'max') {
    try {
      return (await max!.requestContact()).phone
    } catch {
      return null
    }
  }
  return null
}

export interface ManagerLinks {
  telegram: string // username without @
  max: string // full https://max.ru/... link
}

/** Opens a chat with the manager. Telegram supports prefilled text; MAX and web get it copied to clipboard. */
export async function openManagerChat(links: ManagerLinks, text: string): Promise<'opened' | 'copied'> {
  if (kind === 'telegram') {
    tg!.openTelegramLink(`https://t.me/${links.telegram}?text=${encodeURIComponent(text)}`)
    return 'opened'
  }
  await navigator.clipboard?.writeText(text).catch(() => undefined)
  if (kind === 'max') max!.openMaxLink(links.max)
  return 'copied'
}

/** Native "send to a chat" picker in Telegram. Elsewhere returns false and the caller falls back. */
export function shareToChat(url: string, text: string): boolean {
  if (kind !== 'telegram') return false
  tg!.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`)
  return true
}

export function openExternal(url: string): void {
  if (kind === 'telegram') tg!.openLink(url)
  else if (kind === 'max') max!.openLink(url)
  else window.open(url, '_blank', 'noopener')
}

export function haptic(type: 'light' | 'success' = 'light'): void {
  const h = kind === 'telegram' ? tg!.HapticFeedback : kind === 'max' ? max!.HapticFeedback : undefined
  if (!h) return
  if (type === 'success') h.notificationOccurred('success')
  else h.impactOccurred('light')
}

export function setBackButton(cb: (() => void) | null): () => void {
  const bb = kind === 'telegram' ? tg!.BackButton : kind === 'max' ? max!.BackButton : undefined
  if (!bb) return () => undefined
  if (!cb) {
    bb.hide()
    return () => undefined
  }
  bb.onClick(cb)
  bb.show()
  return () => {
    bb.offClick(cb)
    bb.hide()
  }
}
