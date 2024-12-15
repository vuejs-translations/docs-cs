# Computed proměnné {#computed-property}

Pokračujme v práci nad seznamem úkolů z posledního kroku. Zde jsme již ke každému úkolu přidali funkci přepínání. Toho dosáhnete přidáním vlastnosti `done` ke každému objektu úkolu a provedením bindingu na checkbox pomocí `v-model`:

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

Dalším vylepšením, které můžeme přidat, je schopnost skrýt již dokončené úkoly. Již máme tlačítko, které přepíná stav `hideCompleted`. Jak ale na základě tohoto stavu vykreslíme různé položky seznamu?

<div class="options-api">

Představujeme <a target="_blank" href="/guide/essentials/computed.html">computed proměnné</a>. Vlastnost, která je reaktivně vypočítána z jiných vlastností, můžeme deklarovat v rámci sekce `computed`:

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // vrací filtrovaný seznamu `todos`
      // v závislosti na `this.hideCompleted`
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // vrací filtrovaný seznamu `todos` 
      // v závislosti na `this.hideCompleted`
    }
  }
})
```

</div>

</div>
<div class="composition-api">

Představujeme <a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>. Můžeme vytvořit „computed ref“, který počítá svou `.value` dynamicky na základě jiných reaktivních zdrojů dat:

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // vrací filtrovaný seznamu `todos` v závislosti na
  // `todos.value` & `hideCompleted.value`
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // vrací filtrovaný seznamu `todos` v závislosti na
      // `todos.value` & `hideCompleted.value`
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

Computed proměnná sleduje další reaktivní stavy použité při jejím výpočtu jako své závislosti. Výsledek uloží do mezipaměti (cache) a&nbsp;automaticky jej aktualizuje, když se jeho závislosti změní.

Nyní zkuste přidat computed proměnnou `filteredTodos` a doplnit její&nbsp;výpočetní logiku! Pokud je implementována správně, při zapnutém skrývání dokončených položek by mělo zaškrtnutí úkolu okamžitě příslušný úkol skrýt.
