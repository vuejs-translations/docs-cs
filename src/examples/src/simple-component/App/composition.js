import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoItem
  },
  setup() {
    const groceryList = ref([
      { id: 0, text: 'Zelenina' },
      { id: 1, text: 'Sýr' },
      { id: 2, text: 'Cokoliv dalšího, co lidé jedí' }
    ])

    return {
      groceryList
    }
  }
}
