<script setup lang="ts">
import type { Visit } from '../api'
import { when } from '../format'

defineProps<{ items: Visit[] }>()
</script>

<template>
  <div v-if="items.length" class="stack">
    <div v-for="v in items" :key="v.id" class="card booking">
      <div class="date">{{ when(v.datetime) }}</div>
      <div class="svc">{{ v.service }} <span class="chip">{{ v.category }}</span></div>
      <div class="muted small">{{ v.branch }} · {{ v.master }}</div>
    </div>
  </div>
  <div v-else class="card muted">Активных записей нет</div>
</template>

<style scoped>
.booking { border-left: 4px solid var(--accent); }
.date { font-weight: 700; font-size: 16px; }
.svc { margin: 6px 0 4px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
</style>
