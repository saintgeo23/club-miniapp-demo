<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import type { Profile, Visit } from './api'
import { fetchProfile } from './api'
import { kind, platformLabel } from './platform'
import PhoneLogin from './components/PhoneLogin.vue'
import ClubStatus from './components/ClubStatus.vue'
import BonusCards from './components/BonusCards.vue'
import QuickActions from './components/QuickActions.vue'
import Bookings from './components/Bookings.vue'
import Subscriptions from './components/Subscriptions.vue'
import Visits from './components/Visits.vue'
import RateSheet from './components/RateSheet.vue'
import Referral from './components/Referral.vue'

const PHONE_KEY = 'club.phone'

const profile = shallowRef<Profile | null>(null)
const loading = ref(false)
const error = ref('')
const rating = ref<Visit | null>(null)
const toastText = ref('')
let toastTimer = 0

const upcoming = computed(() =>
  (profile.value?.visits ?? [])
    .filter((v) => v.status === 'upcoming')
    .sort((a, b) => a.datetime.localeCompare(b.datetime)),
)
const history = computed(() =>
  (profile.value?.visits ?? [])
    .filter((v) => v.status !== 'upcoming')
    .sort((a, b) => b.datetime.localeCompare(a.datetime)),
)

function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

async function login(phone: string) {
  loading.value = true
  error.value = ''
  try {
    profile.value = await fetchProfile(phone)
    storage()?.setItem(PHONE_KEY, phone)
  } catch (e) {
    error.value =
      (e as Error).message === 'not_found'
        ? 'Не нашли клиента с этим номером. Проверьте номер или запишитесь на первый визит.'
        : 'Не удалось загрузить данные. Попробуйте ещё раз.'
  } finally {
    loading.value = false
  }
}

function logout() {
  storage()?.removeItem(PHONE_KEY)
  profile.value = null
}

function toast(text: string) {
  toastText.value = text
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastText.value = ''), 2800)
}

function onRated(value: number) {
  const v = rating.value
  if (!v || !profile.value) return
  // Replace the visit so the history row shows stars without refetching.
  profile.value = {
    ...profile.value,
    visits: profile.value.visits.map((x) => (x.id === v.id ? { ...x, rating: value } : x)),
  }
}

onMounted(() => {
  const saved = storage()?.getItem(PHONE_KEY)
  if (saved) login(saved)
})
</script>

<template>
  <div class="top-scrim" />
  <div v-if="loading" class="stack">
    <div class="skeleton" style="height: 190px" />
    <div class="skeleton" style="height: 100px" />
    <div class="skeleton" style="height: 120px" />
  </div>

  <PhoneLogin v-else-if="!profile" :error="error" @phone="login" />

  <main v-else>
    <ClubStatus :client="profile.client" />

    <h2>Бонусные карты</h2>
    <BonusCards :cards="profile.cards" />

    <h2>Запись и связь</h2>
    <QuickActions @toast="toast" />

    <h2>Активные записи</h2>
    <Bookings :items="upcoming" />

    <template v-if="profile.subscriptions.length">
      <h2>Абонементы</h2>
      <Subscriptions :items="profile.subscriptions" />
    </template>

    <h2>Последние визиты</h2>
    <Visits :items="history" @rate="rating = $event" />

    <h2>Приведи подругу</h2>
    <Referral :referral="profile.client.referral" @toast="toast" />

    <footer class="muted small">
      {{ platformLabel[kind] }} ·
      <a href="#" @click.prevent="logout">Выйти</a>
    </footer>
  </main>

  <RateSheet v-if="rating" :visit="rating" @close="rating = null" @rated="onRated" />

  <Transition name="fade">
    <div v-if="toastText" class="toast">{{ toastText }}</div>
  </Transition>
</template>

<style scoped>
footer { text-align: center; margin-top: 32px; }
footer a { color: inherit; }
</style>
