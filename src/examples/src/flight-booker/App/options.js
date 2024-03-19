function stringToDate(str) {
  const [y, m, d] = str.split('-')
  return new Date(+y, m - 1, +d)
}

function dateToString(date) {
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate())
  )
}

function pad(n, s = String(n)) {
  return s.length < 2 ? `0${s}` : s
}

export default {
  data() {
    return {
      flightType: 'one-way flight',
      departureDate: dateToString(new Date()),
      returnDate: dateToString(new Date())
    }
  },
  computed: {
    isReturn() {
      return this.flightType === 'return flight'
    },
    canBook() {
      return (
        !this.isReturn ||
        stringToDate(this.returnDate) > stringToDate(this.departureDate)
      )
    }
  },
  methods: {
    book() {
      alert(
        this.isReturn
          ? `Rezervovali jste si zpáteční letenku s odletem ${this.departureDate} a návratem ${this.returnDate}.`
          : `Rezervovali jste si jednosměrnou letenku s odletem ${this.departureDate}.`
      )
    }
  }
}
