<script setup lang="ts">
import type { Subscription } from '../api'
import { money } from '../format'

defineProps<{ items: Subscription[] }>()
</script>

<template>
  <div class="stack">
    <div v-for="s in items" :key="s.id" class="card" :class="{ frozen: s.frozen }">
      <div class="head">
        <b>{{ s.title }}</b>
        <span v-if="s.frozen" class="chip cold">❄ Заморожен</span>
      </div>
      <div class="price">
        <span class="now">{{ money(s.discountPrice) }}</span>
        <s class="muted" v-if="s.discountPrice < s.price">{{ money(s.price) }}</s>
      </div>

      <div class="pay small">
        <span>Оплачено {{ money(s.paid) }}</span>
        <span v-if="s.discountPrice > s.paid" class="due">К оплате {{ money(s.discountPrice - s.paid) }}</span>
        <span v-else class="muted">Оплачен полностью</span>
      </div>
      <div class="bar"><i :style="{ width: (s.paid / s.discountPrice) * 100 + '%' }" /></div>

      <div class="items">
        <div v-for="it in s.items" :key="it.name" class="item small">
          <span>{{ it.name }}</span>
          <span><b>{{ it.left }}</b> <span class="muted">из {{ it.total }}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.price { margin: 6px 0 12px; display: flex; gap: 8px; align-items: baseline; }
.now { font-size: 20px; font-weight: 700; }
.pay { display: flex; justify-content: space-between; margin-bottom: 6px; }
.due { color: var(--danger); font-weight: 600; }
.items { margin-top: 14px; border-top: 1px solid var(--line); padding-top: 8px; }
.item { display: flex; justify-content: space-between; padding: 4px 0; }
.frozen { opacity: 0.75; }
</style>
