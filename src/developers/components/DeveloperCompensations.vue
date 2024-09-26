<script setup lang="ts">
import { DeveloperCompensations } from './type'

defineProps<{
  compensations?: DeveloperCompensations
  showDetails?: boolean
  title?: string
}>()
</script>

<template>
  <div>
    <h4 v-if="title">{{ title }}</h4>
    <div>
      <div v-if="compensations" class="developer-compensations__list">
        <div v-for="(compensation, key) in compensations" :key="`compensation-${key}`">
          {{ compensation }}
        </div>
      </div>
      <div v-if="showDetails" class="developer-compensations__details">
        <p>Žádné další poplatky.</p>
        <p>Měsíční zkušební doba, poté měsíční výpovědní lhůta.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.developer-compensations__list {
  display: flex;
  flex-direction: column;
}

.developer-compensations__details {
  margin-top: 32px;
}
</style>
