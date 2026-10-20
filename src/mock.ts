import type { ClubLevel, Profile, Visit } from './api'

export const LEVELS: ClubLevel[] = [
  { name: 'Base', discount: 3, threshold: 0 },
  { name: 'Silver', discount: 5, threshold: 30_000 },
  { name: 'Gold', discount: 10, threshold: 80_000 },
  { name: 'Platinum', discount: 15, threshold: 150_000 },
]

const BRANCHES = ['Лоск на Тверской', 'Лоск в Сити', 'Лоск на Соколе']
const MASTERS = ['Анна Петрова', 'Мария Ким', 'Ольга Смирнова', 'Дарья Лебедева']
const SERVICES: [string, string][] = [
  ['Косметология', 'Чистка лица'],
  ['Косметология', 'Пилинг'],
  ['Массаж', 'Массаж спины'],
  ['Ногтевой сервис', 'Маникюр с покрытием'],
  ['Волосы', 'Стрижка и укладка'],
]

function day(offset: number, hour: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(hour, offset % 2 ? 30 : 0, 0, 0)
  return d.toISOString()
}

export function mockProfile(phone: string): Profile {
  const totalSpent = 96_400
  const levelIdx = LEVELS.findLastIndex((l) => totalSpent >= l.threshold)

  const past: Visit[] = Array.from({ length: 17 }, (_, i) => {
    const [category, service] = SERVICES[i % SERVICES.length]
    const branch = BRANCHES[i % BRANCHES.length]
    return {
      id: `v${i}`,
      datetime: day(-4 - i * 6, 11 + (i % 7)),
      category,
      service,
      branch,
      master: MASTERS[i % MASTERS.length],
      status: i === 5 ? 'cancelled' : 'done',
      rating: i > 1 && i !== 5 ? 4 + (i % 2) : undefined,
      branchReviewUrl: 'https://yandex.ru/maps/',
    }
  })

  return {
    client: {
      name: 'Екатерина',
      phone,
      totalSpent,
      level: LEVELS[levelIdx],
      nextLevel: LEVELS[levelIdx + 1] ?? null,
      referral: { invited: 4, bonusesEarned: 2_000, link: 'https://t.me/losk_club_bot?start=ref_a7k2' },
    },
    cards: [
      { id: 'c1', title: 'Бонусный счёт', balance: 3_250 },
      { id: 'c2', title: 'Подарок на день рождения', balance: 1_500, expiresAt: day(21, 0) },
      { id: 'c3', title: 'Депозит', balance: 10_000 },
    ],
    visits: [
      {
        id: 'u1', datetime: day(2, 14), category: 'Косметология', service: 'Чистка лица',
        branch: BRANCHES[0], master: MASTERS[0], status: 'upcoming',
      },
      {
        id: 'u2', datetime: day(9, 18), category: 'Массаж', service: 'Массаж спины',
        branch: BRANCHES[1], master: MASTERS[2], status: 'upcoming',
      },
      ...past,
    ],
    subscriptions: [
      {
        id: 's1', title: 'Массаж · 10 сеансов', price: 45_000, discountPrice: 38_000, paid: 38_000, frozen: false,
        items: [{ name: 'Массаж спины', total: 10, left: 6 }],
      },
      {
        id: 's2', title: 'Сияние кожи', price: 32_000, discountPrice: 27_200, paid: 15_000, frozen: true,
        items: [
          { name: 'Чистка лица', total: 3, left: 2 },
          { name: 'Пилинг', total: 3, left: 3 },
        ],
      },
    ],
  }
}
