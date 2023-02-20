# Watchers {#watchers}

Někdy můžeme potřebovat reaktivně provést operaci s „vedlejším efektem“ – například zalogování čísla do konzole, když se změní. Můžeme toho dosáhnout pomocí watchers:

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // ano, console.log() je vedlejší efekt
  console.log(`nový počet: ${newCount}`)
})
```

`watch()` může přímo sledovat ref a callback funkce se spustí vždy, když se změní hodnota `count`. `watch()` může sledovat i jiné typy datových zdrojů – další podrobnosti jsou uvedeny v <a target="_blank" href="/guide/essentials/watchers.html">Průvodce – Watchers</a>.

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // ano, console.log() je vedlejší efekt
      console.log(`nový počet: ${newCount}`)
    }
  }
}
```

Zde používáme sekci `watch` ke sledování změn vlastnosti `count`. Když se `count` změní, je volánja callback funkce a jako parametr obdrží novou hodnotu. Další podrobnosti jsou uvedeny v <a target="_blank" href="/guide/essentials/watchers.html">Průvodce – Watchers</a>.

</div>

Praktičtější ukázkou než logování do konzole bude načítání nových dat při změně ID. Kód, který máme k dispozici, načítá po připojení (mount) komponenty data úkolů z falešného API. K dispozici je také tlačítko, které zvyšuje ID úkolu, který by měl být načten. Zkuste implementovat watcher, který po kliknutí na tlačítko načte nový úkol.
