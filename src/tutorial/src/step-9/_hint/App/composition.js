import { ref, onMounted } from 'vue'

export default {
  setup() {
    const p = ref(null)

    onMounted(() => {
      p.value.textContent = 'připojeno!'
    })

    return {
      p
    }
  }
}
