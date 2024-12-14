# Computed proměnné {#computed-properties}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/computed-properties-in-vue-3" title="Lekce o Vue.js computed proměnných zdarma"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api" title="Lekce o Vue.js computed proměnných zdarma"/>
</div>

## Jednoduchý příklad {#basic-example}

Výrazy přímo v šabloně jsou velmi pohodlné, ale jsou určeny pouze pro jednoduché operace. Příliš mnoho logiky vložené do vašich šablon může způsobit, že budou přeplácané a obtížně udržovatelné. Například, pokud máme objekt s vnořeným polem:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'Jan Novák',
        books: [
          'Vue 2 - Pokročilý průvodce',
          'Vue 3 - Základní průvodce',
          'Vue 4 - Tajemství'
        ]
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const author = reactive({
  name: 'Jan Novák',
  books: [
    'Vue 2 - Pokročilý průvodce',
    'Vue 3 - Základní průvodce',
    'Vue 4 - Tajemství'
  ]
})
```

</div>

A chceme zobrazovat různé texty v závislosti na tom, zda `author` napsal nebo nenapsal nějaké knihy:

```vue-html
<p>Již publikoval knihu:</p>
<span>{{ author.books.length > 0 ? 'Ano' : 'Ne' }}</span>
```

V tuto chvíli začíná být šablona trochu nepřehledná. Musíme se na ni chvíli dívat, než si uvědomíme, že provádí výpočet v závislosti na `author.books`. Ještě důležitější je, že se asi nechceme opakovat, pokud tento výpočet potřebujeme zahrnout do šablony vícekrát.

Proto se pro komplexní logiku, která zahrnuje reaktivní data, doporučuje použít **computed proměnnou**. Zde je stejný příklad po úpravě:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'Jan Novák',
        books: [
          'Vue 2 - Pokročilý průvodce',
          'Vue 3 - Základní průvodce',
          'Vue 4 - Tajemství'
        ]
      }
    }
  },
  computed: {
    // getter computed proměnné
    publishedBooksMessage() {
      // `this` odkazuje na instanci komponenty
      return this.author.books.length > 0 ? 'Ano' : 'Ne'
    }
  }
}
```

```vue-html
<p>Již publikoval knihu:</p>
<span>{{ publishedBooksMessage }}</span>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

Deklarovali jsme computed proměnnou `publishedBooksMessage`.

Zkuste změnit hodnotu pole `books` v návratové hodnotě možnosti `data` a uvidíte, jak se `publishedBooksMessage` odpovídajícím způsobem změní.

Binding computed proměnných v šablonách můžete provést stejně jako u&nbsp;normálních proměnných. Vue si uvědomuje, že `this.publishedBooksMessage` závisí na hodnotě `this.author.books`, takže když se `this.author.books` změní, aktualizuje všude všechny reference na `this.publishedBooksMessage`.

Viz také: [Typování computed proměnných](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'Jan Novák',
  books: [
    'Vue 2 - Pokročilý průvodce',
    'Vue 3 - Základní průvodce',
    'Vue 4 - Tajemství'
  ]
})

// computed ref objekt
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Ano' : 'Ne'
})
</script>

<template>
  <p>Již publikoval knihu:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1kE9Lw0AQxb/KI5dtoTainkoaaREUoZ5EEONhm0ybYLO77J9CCfnuzta0vdjbzr6Zeb95XbIwZroPlMySzJW2MR6OfDB5oZrWaOvRwZIsfbOnCUrdmuCpQo+N1S0ET4pCFarUynnI4GttMT9PjLpCAUq2NIN41bXCkyYxiZ9rrX/cDF/xDYiPQLjDDRbVXqqSHZ5DUw2tg3zP8lK6pvxHe2DtvSasDs6TPTAT8F2ofhzh0hTygm5pc+I1Yb1rXE3VMsKsyDm5JcY/9Y5GY8xzHI+wnIpVw4nTI/10R2rra+S4xSPEJzkBvvNNs310ztK/RDlLLjy1Zic9cQVkJn+R7gIwxJGlMXiWnZEq77orhH3Pq2NH9DjvTfpfSBSbmA==)

Zde jsme deklarovali computed proměnnou `publishedBooksMessage`. Funkce `computed()` očekává, že jí bude předána [getter funkce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description), a vrácená hodnota je **computed ref**. Podobně jako u&nbsp;normálních refs můžete k vypočítanému výsledku přistupovat přes výraz `publishedBooksMessage.value`. Computed refs jsou v šablonách také automaticky rozbaleny, takže na ně můžete ve výrazech v šablonách odkazovat bez `.value`.

Computed proměnná automaticky sleduje své reaktivní závislosti. Vue si uvědomuje, že `publishedBooksMessage` závisí na `author.books`, takže když se `author.books` změní, aktualizuje všude všechny reference na `publishedBooksMessage`.

Viz také: [Typování computed proměnných](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

</div>

## Computed caching vs. funkce {#computed-caching-vs-methods}

Možná jste si všimli, že stejného výsledku můžeme dosáhnout zavoláním funkce ve výrazu šablony:

```vue-html
<p>{{ calculateBooksMessage() }}</p>
```

<div class="options-api">

```js
// v komponentě
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Ano' : 'Ne'
  }
}
```

</div>

<div class="composition-api">

```js
// v komponentě
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Ano' : 'Ne'
}
```

</div>

Místo computed proměnné můžeme stejnou logiku definovat jako funkci. Pro konečný výsledek jsou oba přístupy skutečně naprosto stejné. Rozdíl je však v tom, že **computed proměnné se na základě jejich reaktivních závislostí ukládají do mezipaměti**. Computed proměnná se přehodnotí pouze tehdy, když se změní některé její reaktivní závislosti. To znamená, že pokud se `author.books` nezmění, vícenásobný přístup k hodnotě `publishedBooksMessage` okamžitě vrátí dříve vypočítaný výsledek, aniž by bylo nutné znovu spouštět getter funkci.

To také znamená, že následující computed proměnná se neaktualizuje nikdy, protože `Date.now()` není reaktivní závislost:

<div class="options-api">

```js
computed: {
  now() {
    return Date.now()
  }
}
```

</div>

<div class="composition-api">

```js
const now = computed(() => Date.now())
```

</div>

Ve srovnání s tím vyvolání funkce ji spustí **vždy**, jakmile dojde k opětovnému vykreslení.

Proč caching potřebujeme? Představte si, že máme složitě získávanou proměnnou `list`, která vyžaduje procházení obrovského pole a spoustu výpočtů. Pak můžeme mít další computed proměnné, které na `list` závisí. Bez ukládání do mezipaměti bychom spouštěli getter pro `list` mnohem častěji, než je nutné! V případech, kdy caching nechcete, použijte místo toho volání funkce.

## Computed proměnná, kterou lze měnit {#writable-computed}

Computed proměnné jsou ve výchozím nastavení pouze pro čtení. Pokud se pokusíte přiřadit do computed proměnné novou hodnotu, dostanete runtime warning. V těch vzácných případech, kdy „zapisovatelnou“ computed proměnnou potřebujete, ji můžete vytvořit tak, aby poskytovala getter i setter:

<div class="options-api">

```js
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName: {
      // getter
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set(newValue) {
        // poznámka: zde používáme "destructuring assignment" syntaxi
        [this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

Když teď zadáte `this.fullName = 'Jan Novák'`, zavolá se setter a `this.firstName` a&nbsp;`this.lastName` budou odpovídajícím způsobem aktualizovány.

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // poznámka: zde používáme "destructuring assignment" syntaxi
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

Když teď zadáte `this.fullName = 'Jan Novák'`, zavolá se setter a `this.firstName` a&nbsp;`this.lastName` budou odpovídajícím způsobem aktualizovány.

</div>

## Získání předchozí hodnoty {#previous}

- Podporováno až od verze 3.4+

V případě, že to potřebujete, můžete získat předchozí hodnotu computed proměnné v&nbsp;podobě prvního parametru getter funkce:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    // Tato computed proměnná vrátí hodnotu `count`, pokud je menší nebo rovno 3.
    // Když je `count` >=4, bude vrácena poslední hodnota splňující podmínku.
    alwaysSmall(previous) {
      if (this.count <= 3) {
        return this.count
      }
      return previous
    }
  }
}
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
const count = ref(2)
// Tato computed proměnná vrátí hodnotu `count`, pokud je menší nebo rovno 3.
// Když je `count` >=4, bude vrácena poslední hodnota splňující podmínku.
const alwaysSmall = computed((previous) => {
  if (count.value <= 3) {
    return count.value
  }
  return previous
})
</script>
```
</div>

Pokud používáte zapisovatelnou computed proměnnou:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    alwaysSmall: {
      get(previous) {
        if (this.count <= 3) {
          return this.count
        }
        return previous
      },
      set(newValue) {
        this.count = newValue * 2
      }
    }
  }
}
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
const count = ref(2)
const alwaysSmall = computed({
  get(previous) {
    if (count.value <= 3) {
      return count.value
    }
    return previous
  },
  set(newValue) {
    count.value = newValue * 2
  }
})
</script>
```

</div>

## Osvědčené postupy {#best-practices}

### Getter funkce by neměly mít vedlejší účinky {#getters-should-be-side-effect-free}

Je důležité si zapamatovat, že getter funkce pro computed proměnné by měly provádět pouze čisté výpočty a neměly by mít vedlejší účinky. Například **uvnitř computed getter funkce neměňte jiný stav, nevytvářejte asynchronní volání, ani neměňte DOM**! Představte si computed proměnnou jako deklarativní popis, jak odvodit hodnotu na základě jiných hodnot – její jedinou odpovědností by měl být výpočet a návrat této hodnoty. Později v příručce probereme, jak můžeme vedlejší účinky v reakci na změny stavu provádět pomocí [watchers](./watchers).

### Vyhněte se změnám vypočítané hodnoty {#avoid-mutating-computed-value}

Vrácená hodnota computed proměnné je odvozený stav. Berte to jako dočasný otisk (snapshot) – pokaždé, když se změní stav zdroje, vytvoří se nový snímek. Měnit obraz nedává smysl, takže vypočítaná návratová hodnota by měla být obsluhována jako _read-only_ a nikdy by neměla být měněna – místo toho aktualizujte stav zdroje, na kterém závisí, což vyvolá nový výpočet.
