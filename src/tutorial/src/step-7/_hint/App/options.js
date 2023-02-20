// každý `todo` objekt dostane unikátní ID
let id = 0

export default {
  data() {
    return {
      newTodo: '',
      todos: [
        { id: id++, text: 'Naučit se HTML' },
        { id: id++, text: 'Naučit se JavaScript' },
        { id: id++, text: 'Naučit se Vue' }
      ]
    }
  },
  methods: {
    addTodo() {
      this.todos.push({ id: id++, text: this.newTodo })
      this.newTodo = ''
    },
    removeTodo(todo) {
      this.todos = this.todos.filter((t) => t !== todo)
    }
  }
}
