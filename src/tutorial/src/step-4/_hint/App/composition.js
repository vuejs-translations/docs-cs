import { ref } from 'vue'

export default {
  setup() {
    const pocet = ref(0)

    function increment() {
      pocet.value++
    }

    return {
      pocet,
      increment
    }
  }
}
