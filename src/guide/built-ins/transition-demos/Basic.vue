<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<template>
  <div class="demo">
    <button @click="show = !show">Změnit zobrazení (fade)</button>
    <Transition name="fade">
      <p style="margin-top: 20px" v-if="show">Ahoj</p>
    </Transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
