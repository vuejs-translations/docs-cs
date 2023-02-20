import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const childMsg = ref('Zatím nic nepředáno')

    return {
      childMsg
    }
  }
}
