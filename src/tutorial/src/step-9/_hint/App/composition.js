import { ref, onMounted } from 'vue'

export default {
  setup() {
    const pElementRef = ref(null)

    onMounted(() => {
      pElementRef.value.textContent = 'připojeno!'
    })

    return {
      pElementRef
    }
  }
}
