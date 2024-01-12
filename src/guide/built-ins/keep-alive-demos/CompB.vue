<script setup>
import { ref } from 'vue'
const msg = ref('')
</script>

<template>
  <p>Aktuální komponenta: B</p>
  <span style="margin-right: 20px">Zpráva: {{ msg }}</span>
  <input v-model="msg">
</template>
