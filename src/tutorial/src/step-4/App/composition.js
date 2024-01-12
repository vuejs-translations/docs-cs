import { ref } from 'vue'

export default {
  setup() {
    const pocet = ref(0)

    return {
      pocet
    }
  }
}
