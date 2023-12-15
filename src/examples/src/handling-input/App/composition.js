import { ref } from 'vue'

export default {
  setup() {
    const message = ref('Ahoj, Vue!')

    function reverseMessage() {
      // pro přístup/změnu k hodnotě uvnitř `ref` se použije
      // jeho vlastnost `.value`
      message.value = message.value.split('').reverse().join('')
    }

    function notify() {
      alert('bylo zabráněno navigaci')
    }

    return {
      message,
      reverseMessage,
      notify
    }
  }
}
