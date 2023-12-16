import TreeItem from './TreeItem.vue'

const treeData = {
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
}

export default {
  components: {
    TreeItem
  },
  data() {
    return {
      treeData
    }
  }
}
