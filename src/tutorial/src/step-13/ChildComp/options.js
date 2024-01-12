export default {
  emits: ['odpoved'],
  created() {
    this.$emit('odpoved', 'Ahoj z potomka')
  }
}
