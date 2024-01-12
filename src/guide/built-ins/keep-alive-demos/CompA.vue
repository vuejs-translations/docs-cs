<script setup>
import { ref } from 'vue'
const pocet = ref(0)
</script>

<template>
  <p>Aktuální komponenta: A</p>
  <span style="margin-right: 20px">Počet: {{ pocet }}</span>
  <button @click="pocet++">+</button>
</template>
