# Event listenery {#event-listeners}

S využitím direktivy `v-on` můžeme naslouchat DOM událostem (events):

```vue-html
<button v-on:click="increment">{{ pocet }}</button>
```

Kvůli častému použití má `v-on` svou zkrácenou syntaxi:

```vue-html
<button @click="increment">{{ pocet }}</button>
```

<div class="options-api">

V tomto případě `increment` odkazuje na funkci deklarovanou pomocí sekce `methods`:

<div class="sfc">

```js{7-12}
export default {
  data() {
    return {
      pocet: 0
    }
  },
  methods: {
    increment() {
      // aktualizovat stav komponenty
      this.pocet++
    }
  }
}
```

</div>
<div class="html">

```js{7-12}
createApp({
  data() {
    return {
      pocet: 0
    }
  },
  methods: {
    increment() {
      // aktualizovat stav komponenty
      this.pocet++
    }
  }
})
```

</div>

Uvnitř metody můžeme přistupovat k instanci komponenty pomocí `this`. Instance komponenty vystavuje datové proměnné deklarované v sekci `data`. Změnou těchto proměnných můžeme aktualizovat stav komponenty.

</div>

<div class="composition-api">

<div class="sfc">

V tomto případě `increment` odkazuje na funkci definovanou v rámci `<script setup>`:

```vue{6-9}
<script setup>
import { ref } from 'vue'

const pocet = ref(0)

function increment() {
  // aktualizovat stav komponenty
  pocet.value++
}
</script>
```

</div>

<div class="html">

V tomto případě `increment` odkazuje na funkci v objektu vráceném ze `setup()`:

```js{$}
setup() {
  const pocet = ref(0)

  function increment(e) {
    // aktualizovat stav komponenty
    pocet.value++
  }

  return {
    pocet,
    increment
  }
}
```

</div>

Uvnitř funkce můžeme aktualizovat stav komponenty pomocí změn příslušných refs.

</div>

Event handlery mohou také používat inline výrazy a mohou zjednodušit běžné úkoly pomocí modifikátorů. Tyto detaily pokrývá <a target="_blank" href="/guide/essentials/event-handling.html">Průvodce obsluhou událostí</a>.

Teď zkuste <span class="options-api">metodu</span><span class="composition-api">funkci</span> `increment` sami implementovat a provést binding na tlačítko s využítím `v-on`.
