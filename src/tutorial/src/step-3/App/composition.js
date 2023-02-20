import { ref } from 'vue'

export default {
  setup() {
    const h1Class = ref('title')

    return {
      h1Class
    }
  }
}
