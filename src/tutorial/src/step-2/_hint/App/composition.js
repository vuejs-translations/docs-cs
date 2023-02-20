import { reactive, ref } from 'vue'

export default {
  setup() {
    const counter = reactive({ pocet: 0 })
    const message = ref('Ahoj, Vue!')

    return {
      counter,
      message
    }
  }
}
