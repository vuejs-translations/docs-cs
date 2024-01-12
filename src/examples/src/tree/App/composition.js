import { ref } from 'vue'
import TreeItem from './TreeItem.vue'

export default {
  components: {
    TreeItem
  },
  setup() {
    const treeData = ref({
      name: 'Můj strom',
      children: [
        { name: 'ahoj' },
        { name: 'něco' },
        {
          name: 'podadresář',
          children: [
            {
              name: 'podadresář',
              children: [{ name: 'ahoj' }, { name: 'něco' }]
            },
            { name: 'ahoj' },
            { name: 'něco' },
            {
              name: 'podadresář',
              children: [{ name: 'ahoj' }, { name: 'něco' }]
            }
          ]
        }
      ]
    })

    return {
      treeData
    }
  }
}
