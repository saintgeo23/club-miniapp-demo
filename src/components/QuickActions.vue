<script setup lang="ts">
import { config } from '../config'
import { haptic, openExternal, openManagerChat } from '../platform'

const emit = defineEmits<{ toast: [string] }>()

async function chat(text: string) {
  haptic()
  const r = await openManagerChat(config.manager, text)
  if (r === 'copied') emit('toast', 'Текст сообщения скопирован, вставьте его в чат с менеджером')
}
function online() {
  haptic()
  openExternal(config.onlineBookingUrl)
}
</script>

<template>
  <div class="grid">
    <button class="act" @click="chat(config.texts.bookProcedure)">
      <span class="ico">✦</span>Записаться на процедуру
    </button>
    <button class="act" @click="online"><span class="ico">◷</span>Онлайн-запись</button>
    <button class="act wide" @click="chat(config.texts.contactCare)">
      <span class="ico">♡</span>Связаться с отделом заботы
    </button>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.act {
  appearance: none; border: 0; font: inherit; color: var(--text); cursor: pointer;
  background: var(--surface); border-radius: var(--radius); box-shadow: var(--shadow);
  padding: 14px; text-align: left; font-weight: 600; font-size: 14px; line-height: 1.25;
  display: flex; flex-direction: column; gap: 10px; transition: transform 0.08s;
}
.act:active { transform: scale(0.97); }
.wide { grid-column: span 2; flex-direction: row; align-items: center; }
.ico {
  width: 32px; height: 32px; border-radius: 10px; flex: none;
  display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); font-size: 16px;
}
</style>
