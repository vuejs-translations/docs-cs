<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<template>
  <div class="demo">
    <button @click="show = !show" style="margin-bottom: 20px">Změnit zobrazení</button>
    <Transition duration="550" name="nested">
      <div v-if="show" class="transition-demo-outer">
        <div class="transition-demo-inner">Ahoj</div>
      </div>
    </Transition>
  </div>
</template>

<style>
.transition-demo-outer,
.transition-demo-inner {
  background: #eee;
  padding: 30px;
  min-height: 100px;
}

.transition-demo-inner {
  background: #ccc;
  color: rgb(33, 53, 71);
}

.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}
/* zdržet odchod elementu rodiče */
.nested-leave-active {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

/* můžeme také aplikovat tranzici na vnořené elementy pomocí vnořených selektorů */ 
.nested-enter-active .transition-demo-inner,
.nested-leave-active .transition-demo-inner {
  transition: all 0.3s ease-in-out;
}
/* zdržet vstup vnořeného elementu */
.nested-enter-active .transition-demo-inner {
  transition-delay: 0.25s;
}

.nested-enter-from .transition-demo-inner,
.nested-leave-to .transition-demo-inner {
  transform: translateX(30px);
  /*
  	Workaround pro chybu v Chrome 96 při zpracování vnořených přechodů průhlednosti.
    Není potřeba v jiných prohlížečích nebo v Chrome 99+, kde byla chyba opravena.
  */
  opacity: 0.001;
}
</style>
