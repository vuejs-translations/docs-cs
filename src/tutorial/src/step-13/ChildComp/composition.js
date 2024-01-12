export default {
  emits: ['odpoved'],
  setup(props, { emit }) {
    emit('odpoved', 'Ahoj z potomka')
    return {}
  }
}
