import PolyGraph from './PolyGraph.vue'

export default {
  components: {
    PolyGraph
  },
  data: () => ({
    newLabel: '',
    stats: [
      { label: 'A', hodnota: 100 },
      { label: 'B', hodnota: 100 },
      { label: 'C', hodnota: 100 },
      { label: 'D', hodnota: 100 },
      { label: 'E', hodnota: 100 },
      { label: 'F', hodnota: 100 }
    ]
  }),
  methods: {
    add(e) {
      e.preventDefault()
      if (!this.newLabel) return
      this.stats.push({
        label: this.newLabel,
        hodnota: 100
      })
      this.newLabel = ''
    },
    remove(stat) {
      if (this.stats.length > 3) {
        this.stats.splice(this.stats.indexOf(stat), 1)
      } else {
        alert("Víc již nelze odstranit!")
      }
    }
  }
}
