<script setup lang="ts">
import type { BonusCard } from '../api'
import { date } from '../format'

defineProps<{ cards: BonusCard[] }>()
const n = new Intl.NumberFormat('ru-RU')
</script>

<template>
  <div class="row">
    <div v-for="c in cards" :key="c.id" class="card bonus">
      <div class="muted small">{{ c.title }}</div>
      <div class="sum">{{ n.format(c.balance) }}</div>
      <div class="muted small" v-if="c.expiresAt">до {{ date(c.expiresAt) }}</div>
      <div class="muted small" v-else>бонусов</div>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  margin: 0 -16px;
  padding: 2px 16px 8px;
  scrollbar-width: none;
}
.row::-webkit-scrollbar { display: none; }
.bonus { flex: 0 0 42%; min-width: 150px; scroll-snap-align: start; }
.sum { font-size: 24px; font-weight: 700; margin: 6px 0 2px; }
</style>
