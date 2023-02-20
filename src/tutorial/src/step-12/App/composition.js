import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const pozdrav = ref('Ahoj od rodiče')

    return {
      pozdrav
    }
  }
}
