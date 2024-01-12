import { computed } from 'vue'
import { valueToPoint } from './util.js'

export default {
  props: {
    stat: Object,
    index: Number,
    total: Number
  },
  setup(props) {
    const point = computed(() =>
      valueToPoint(+props.stat.hodnota + 10, props.index, props.total)
    )

    return {
      point
    }
  }
}
