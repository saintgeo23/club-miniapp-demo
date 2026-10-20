<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { Visit } from '../api'
import { rateVisit } from '../api'
import { when } from '../format'
import { haptic, openExternal, setBackButton } from '../platform'

const props = defineProps<{ visit: Visit }>()
const emit = defineEmits<{ close: []; rated: [number] }>()

const stars = ref(0)
const done = ref(false)
const busy = ref(false)

const releaseBack = setBackButton(() => emit('close'))
onBeforeUnmount(releaseBack)

async function submit() {
  busy.value = true
  await rateVisit(props.visit.id, stars.value)
  busy.value = false
  haptic('success')
  done.value = true
  emit('rated', stars.value)
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="sheet">
      <div class="grip" />
      <template v-if="!done">
        <h3>Как прошёл визит?</h3>
        <p class="muted small">{{ visit.service }} · {{ visit.master }}<br />{{ when(visit.datetime) }}</p>
        <div class="pick">
          <button
            v-for="i in 5"
            :key="i"
            :class="{ on: i <= stars }"
            :aria-label="`${i} из 5`"
            @click="stars = i; haptic()"
          >★</button>
        </div>
        <button class="btn" :disabled="!stars || busy" @click="submit">Отправить</button>
      </template>
      <template v-else-if="stars === 5 && visit.branchReviewUrl">
        <h3>Спасибо!</h3>
        <p class="muted">Нам будет очень приятно, если вы поделитесь впечатлением на картах. Это займёт минуту.</p>
        <button class="btn" @click="openExternal(visit.branchReviewUrl!)">Оставить отзыв</button>
        <button class="btn ghost later" @click="emit('close')">Позже</button>
      </template>
      <template v-else>
        <h3>Спасибо за оценку!</h3>
        <p class="muted">Мы передали её администратору филиала и обязательно разберёмся.</p>
        <button class="btn ghost" @click="emit('close')">Закрыть</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; z-index: 40;
  background: rgba(0, 0, 0, 0.4);
  display: flex; align-items: flex-end; justify-content: center;
  animation: fadein 0.2s;
}
.sheet {
  width: 100%; max-width: 520px;
  background: var(--surface); color: var(--text);
  border-radius: 24px 24px 0 0;
  padding: 10px 20px calc(24px + env(safe-area-inset-bottom));
  text-align: center;
  animation: up 0.25s ease-out;
}
.grip { width: 40px; height: 4px; border-radius: 2px; background: var(--line); margin: 0 auto 16px; }
h3 { margin: 0 0 6px; font-size: 20px; }
p { margin: 0 0 18px; }
.pick { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; }
.pick button {
  appearance: none; border: 0; background: none; cursor: pointer;
  font-size: 40px; line-height: 1; color: var(--line); transition: transform 0.1s, color 0.1s;
}
.pick button.on { color: var(--accent); transform: scale(1.08); }
.later { margin-top: 8px; }
@keyframes up { from { transform: translateY(100%); } }
@keyframes fadein { from { opacity: 0; } }
</style>
