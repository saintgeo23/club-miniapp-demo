// Shape of POST /api/client/profile as we expect it from the brief. Adjust once real docs arrive.

export interface ClubLevel {
  name: string
  discount: number // percent
  threshold: number // total spent, rub
}

export interface Client {
  name: string
  phone: string
  totalSpent: number
  level: ClubLevel
  nextLevel: ClubLevel | null
  referral: { invited: number; bonusesEarned: number; link: string }
}

export interface BonusCard {
  id: string
  title: string
  balance: number
  expiresAt?: string
}

export interface Visit {
  id: string
  datetime: string // ISO
  category: string
  service: string
  branch: string
  master: string
  status: 'upcoming' | 'done' | 'cancelled'
  rating?: number
  branchReviewUrl?: string
}

export interface Subscription {
  id: string
  title: string
  price: number
  discountPrice: number
  paid: number
  frozen: boolean
  items: { name: string; total: number; left: number }[]
}

export interface Profile {
  client: Client
  cards: BonusCard[]
  visits: Visit[]
  subscriptions: Subscription[]
}

const API_URL = import.meta.env.VITE_API_URL as string | undefined

export async function fetchProfile(phone: string): Promise<Profile> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/api/client/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    if (!res.ok) throw new Error(res.status === 404 ? 'not_found' : 'server')
    return res.json()
  }
  const { mockProfile } = await import('./mock')
  await new Promise((r) => setTimeout(r, 600))
  return mockProfile(phone)
}

export async function rateVisit(visitId: string, rating: number): Promise<void> {
  if (API_URL) {
    await fetch(`${API_URL}/api/visit/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitId, rating }),
    })
    return
  }
  await new Promise((r) => setTimeout(r, 300))
}
