import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoItem
  },
  data() {
    return {
      groceryList: [
        { id: 0, text: 'Zelenina' },
        { id: 1, text: 'Sýr' },
        { id: 2, text: 'Cokoliv dalšího, co lidé jedí' }
      ]
    }
  }
}
