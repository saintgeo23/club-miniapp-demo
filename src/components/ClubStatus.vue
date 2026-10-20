<script setup lang="ts">
import { computed } from 'vue'
import type { Client } from '../api'
import { money, phone } from '../format'

const props = defineProps<{ client: Client }>()

const progress = computed(() => {
  const { level, nextLevel, totalSpent } = props.client
  if (!nextLevel) return 100
  return Math.min(100, ((totalSpent - level.threshold) / (nextLevel.threshold - level.threshold)) * 100)
})
const left = computed(() => (props.client.nextLevel ? props.client.nextLevel.threshold - props.client.totalSpent : 0))
</script>

<template>
  <div class="status">
    <div class="top">
      <div>
        <div class="hello">Здравствуйте, {{ client.name }}</div>
        <div class="phone">{{ phone(client.phone) }}</div>
      </div>
      <div class="discount">
        <b>−{{ client.level.discount }}%</b>
        <span>скидка</span>
      </div>
    </div>
    <div class="level">{{ client.level.name }}</div>
    <div class="bar"><i :style="{ width: progress + '%' }" /></div>
    <div class="hint" v-if="client.nextLevel">
      До {{ client.nextLevel.name }} (−{{ client.nextLevel.discount }}%) осталось {{ money(left) }}
    </div>
    <div class="hint" v-else>Максимальный уровень клуба</div>
  </div>
</template>

<style scoped>
.status {
  border-radius: 22px;
  padding: 20px;
  color: #fff;
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(255, 255, 255, 0.22), transparent 55%),
    linear-gradient(135deg, #c9a273, #8c6a43);
  box-shadow: 0 10px 30px rgba(140, 106, 67, 0.3);
}
.top { display: flex; justify-content: space-between; align-items: flex-start; }
.hello { font-size: 17px; font-weight: 600; }
.phone { opacity: 0.8; font-size: 13px; margin-top: 2px; }
.discount { text-align: right; line-height: 1.1; }
.discount b { display: block; font-size: 22px; }
.discount span { font-size: 12px; opacity: 0.8; }
.level { font-size: 30px; font-weight: 700; letter-spacing: 0.02em; margin: 22px 0 10px; }
.bar { background: rgba(255, 255, 255, 0.25); }
.bar > :deep(i), .bar > i { background: #fff; }
.hint { font-size: 13px; opacity: 0.9; margin-top: 8px; }
</style>
