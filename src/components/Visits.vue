<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Visit } from '../api'
import { when } from '../format'

const PAGE = 5
const props = defineProps<{ items: Visit[] }>()
const emit = defineEmits<{ rate: [Visit] }>()

const shown = ref(PAGE)
const visible = computed(() => props.items.slice(0, shown.value))
</script>

<template>
  <div class="card list">
    <div v-for="v in visible" :key="v.id" class="row">
      <div class="info">
        <div class="svc">{{ v.service }}</div>
        <div class="muted small">{{ when(v.datetime) }} · {{ v.master }}</div>
      </div>
      <span v-if="v.status === 'cancelled'" class="muted small">Отменён</span>
      <span v-else-if="v.rating" class="stars small" :aria-label="`Оценка ${v.rating}`">
        {{ '★'.repeat(v.rating) }}<span class="off">{{ '★'.repeat(5 - v.rating) }}</span>
      </span>
      <button v-else class="rate" @click="emit('rate', v)">Оценить</button>
    </div>
  </div>
  <button v-if="shown < items.length" class="btn ghost more" @click="shown += PAGE">
    Показать ещё
  </button>
</template>

<style scoped>
.list { padding: 4px 16px; }
.row { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
.row + .row { border-top: 1px solid var(--line); }
.info { flex: 1; min-width: 0; }
.svc { font-weight: 600; }
.stars { color: var(--accent); letter-spacing: 1px; white-space: nowrap; }
.off { opacity: 0.25; }
.rate {
  appearance: none; border: 0; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
  padding: 7px 12px; border-radius: 10px; background: var(--accent); color: #fff;
}
.more { margin-top: 10px; }
</style>
