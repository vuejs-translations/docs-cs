import DemoGrid from './Grid.vue'
import { ref } from 'vue'

export default {
  components: {
    DemoGrid
  },
  setup() {
    const searchQuery = ref('')
    const gridColumns = ['jméno', 'síla']
    const gridData = [
      { jméno: 'Chuck Norris', síla: Infinity },
      { jméno: 'Bruce Lee', síla: 9000 },
      { jméno: 'Jackie Chan', síla: 7000 },
      { jméno: 'Jet Li', síla: 8000 }
    ]

    return {
      searchQuery,
      gridColumns,
      gridData
    }
  }
}
