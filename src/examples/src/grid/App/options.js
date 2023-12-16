import DemoGrid from './Grid.vue'

export default {
  components: {
    DemoGrid
  },
  data: () => ({
    searchQuery: '',
    gridColumns: ['jméno', 'síla'],
    gridData: [
      { jméno: 'Chuck Norris', síla: Infinity },
      { jméno: 'Bruce Lee', síla: 9000 },
      { jméno: 'Jackie Chan', síla: 7000 },
      { jméno: 'Jet Li', síla: 8000 }
    ]
  })
}
