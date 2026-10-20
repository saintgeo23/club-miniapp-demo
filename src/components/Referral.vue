<script setup lang="ts">
import type { Client } from '../api'
import { config } from '../config'
import { plural } from '../format'

const props = defineProps<{ referral: Client['referral'] }>()
const emit = defineEmits<{ toast: [string] }>()
const n = new Intl.NumberFormat('ru-RU')

async function share() {
  const text = `${config.texts.referral}\n${props.referral.link}`
  if (navigator.share) {
    await navigator.share({ text }).catch(() => undefined)
    return
  }
  await navigator.clipboard?.writeText(props.referral.link).catch(() => undefined)
  emit('toast', 'Ссылка скопирована')
}
</script>

<template>
  <div class="card">
    <p class="txt">{{ config.texts.referral }}</p>
    <div class="nums">
      <div>
        <b>{{ referral.invited }}</b>
        <span class="muted small">{{ plural(referral.invited, 'подруга', 'подруги', 'подруг') }} пришли</span>
      </div>
      <div>
        <b>{{ n.format(referral.bonusesEarned) }}</b>
        <span class="muted small">бонусов получено</span>
      </div>
    </div>
    <button class="btn" @click="share">Пригласить</button>
  </div>
</template>

<style scoped>
.txt { margin: 0 0 14px; }
.nums { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.nums > div { background: var(--accent-soft); border-radius: 14px; padding: 12px; }
.nums b { display: block; font-size: 22px; color: var(--accent); }
</style>
