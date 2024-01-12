export default {
  data() {
    return {
      message: 'Ahoj, Vue!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('')
    },
    notify() {
      alert('bylo zabráněno navigaci')
    }
  }
}
