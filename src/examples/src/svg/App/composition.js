import PolyGraph from './PolyGraph.vue'
import { ref, reactive } from 'vue'

export default {
  components: {
    PolyGraph
  },
  setup() {
    const newLabel = ref('')
    const stats = reactive([
      { label: 'A', hodnota: 100 },
      { label: 'B', hodnota: 100 },
      { label: 'C', hodnota: 100 },
      { label: 'D', hodnota: 100 },
      { label: 'E', hodnota: 100 },
      { label: 'F', hodnota: 100 }
    ])

    function add(e) {
      e.preventDefault()
      if (!newLabel.value) return
      stats.push({
        label: newLabel.value,
        hodnota: 100
      })
      newLabel.hodnota = ''
    }

    function remove(stat) {
      if (stats.length > 3) {
        stats.splice(stats.indexOf(stat), 1)
      } else {
        alert("Víc již nelze odstranit!")
      }
    }

    return {
      newLabel,
      stats,
      add,
      remove
    }
  }
}
