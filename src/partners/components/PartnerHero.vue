<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <PageHero>
    <template #title>{{ title || 'Partneři Vue' }}</template>
    <template #lead>
      <p>
        Partneři Vue jsou Vue-týmem podporované subjekty, které nabízí prvotřídní
        konzultační a vývojářské služby pro Vue. Pokud vaše společnost 
        stojí o to být jako partner zahrnuta, prosím 
        <a class="link" href="https://airtable.com/shrCQhat57SApJI2l" target="_blank">ohlaste svůj zájem zde</a>.
      </p>
    </template>
  </PageHero>
</template>
