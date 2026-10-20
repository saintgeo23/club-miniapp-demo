<script setup lang="ts">
import { computed, ref } from 'vue'
import { kind, requestPhone } from '../platform'
import { config } from '../config'

const emit = defineEmits<{ phone: [string] }>()
defineProps<{ error?: string }>()

const manual = ref(kind === 'web')
const digits = ref('')
const busy = ref(false)

const pretty = computed(() => {
  const d = digits.value
  let s = '+7'
  if (d.length) s += ' (' + d.slice(0, 3)
  if (d.length >= 3) s += ') ' + d.slice(3, 6)
  if (d.length >= 6) s += '-' + d.slice(6, 8)
  if (d.length >= 8) s += '-' + d.slice(8, 10)
  return s
})

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  digits.value = raw.replace(/^[78]/, '').slice(0, 10)
  ;(e.target as HTMLInputElement).value = pretty.value
}

async function viaMessenger() {
  busy.value = true
  const phone = await requestPhone()
  busy.value = false
  if (phone) emit('phone', phone)
  else manual.value = true
}
</script>

<template>
  <div class="login">
    <div class="logo">{{ config.brand[0] }}</div>
    <h1>{{ config.clubName }}</h1>
    <p class="muted">Бонусы, абонементы и записи в одном месте</p>

    <div class="card stack">
      <template v-if="!manual">
        <button class="btn" :disabled="busy" @click="viaMessenger">Войти по номеру телефона</button>
        <p class="muted small">Мессенджер передаст ваш номер, пароль не нужен</p>
      </template>
      <template v-else>
        <input
          class="phone"
          inputmode="tel"
          autocomplete="tel"
          placeholder="+7 (900) 000-00-00"
          :value="digits.length ? pretty : ''"
          @input="onInput"
        />
        <button class="btn" :disabled="digits.length !== 10" @click="emit('phone', '+7' + digits)">Войти</button>
        <p v-if="kind === 'web'" class="muted small">Демо-режим: подойдёт любой номер</p>
      </template>
      <p v-if="error" class="err small">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.login { padding-top: 12vh; text-align: center; }
.logo {
  width: 72px; height: 72px; margin: 0 auto 16px;
  border-radius: 22px; background: var(--accent); color: #fff;
  display: grid; place-items: center; font-size: 34px; font-weight: 700;
}
h1 { margin: 0 0 6px; font-size: 24px; }
.login > p { margin: 0 0 28px; }
.phone {
  width: 100%; padding: 14px 16px; font: inherit; font-size: 17px;
  border-radius: 14px; border: 1px solid var(--line); background: var(--bg); color: var(--text);
  outline: none; text-align: center; letter-spacing: 0.02em;
}
.phone:focus { border-color: var(--accent); }
.err { color: var(--danger); margin: 0; }
.card p { margin: 0; }
</style>
