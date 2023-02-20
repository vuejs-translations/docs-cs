import { ref } from 'vue'

export default {
  setup() {
    // každý `todo` objekt dostane unikátní ID
    let id = 0

    const newTodo = ref('')
    const todos = ref([
      { id: id++, text: 'Naučit se HTML' },
      { id: id++, text: 'Naučit se JavaScript' },
      { id: id++, text: 'Naučit se Vue' }
    ])

    function addTodo() {
      // ...
      newTodo.value = ''
    }

    function removeTodo(todo) {
      // ...
    }

    return {
      newTodo,
      todos,
      addTodo,
      removeTodo
    }
  }
}
