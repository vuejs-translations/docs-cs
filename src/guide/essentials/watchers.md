# Watchers {#watchers}

## Jednoduchý příklad {#basic-example}

Computed proměnné nám umožňují deklarativně vypočítat odvozené hodnoty. Existují však případy, kdy v reakci na změny stavu potřebujeme provést „vedlejší efekty“ – například změnu DOM nebo změnu jiné části stavu na základě výsledku asynchronní operace.

<div class="options-api">

S Options API můžeme použít [sekci `watch`](/api/options-state.html#watch) k vyvolání funkce kdykoliv se změní reaktivní hodnota:

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Questions usually contain a question mark. ;-)'
    }
  },
  watch: {
    // kdykoliv se změní `question`, spustí se tato funkce
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      }
    }
  }
}
```

```vue-html
<p>
  Ask a yes/no question:
  <input v-model="question" />
</p>
<p>{{ answer }}</p>
```

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcXVlc3Rpb246ICcnLFxuICAgICAgYW5zd2VyOiAnUXVlc3Rpb25zIHVzdWFsbHkgY29udGFpbiBhIHF1ZXN0aW9uIG1hcmsuIDstKSdcbiAgICB9XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgLy8gd2hlbmV2ZXIgcXVlc3Rpb24gY2hhbmdlcywgdGhpcyBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIHF1ZXN0aW9uKG5ld1F1ZXN0aW9uLCBvbGRRdWVzdGlvbikge1xuICAgICAgaWYgKG5ld1F1ZXN0aW9uLmluZGV4T2YoJz8nKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuZ2V0QW5zd2VyKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBhc3luYyBnZXRBbnN3ZXIoKSB7XG4gICAgICB0aGlzLmFuc3dlciA9ICdUaGlua2luZy4uLidcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgICB0aGlzLmFuc3dlciA9IChhd2FpdCByZXMuanNvbigpKS5hbnN3ZXJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuYW5zd2VyID0gJ0Vycm9yISBDb3VsZCBub3QgcmVhY2ggdGhlIEFQSS4gJyArIGVycm9yXG4gICAgICB9XG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

Konstrukce `watch` podporuje i cestu ke klíči vnořené proměnné pomocí tečkové notace:

```js
export default {
  watch: {
    // Pozn.: pouze jednoduché cesty. Výrazy zde podporovány nejsou.
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

S Composition API můžeme použít [funkci `watch`](/api/reactivity-core.html#watch) k vyvolání callback funkce kdykoliv se změní část reaktivního stavu:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// watch pracuje přímo nad ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnXG5cbmNvbnN0IHF1ZXN0aW9uID0gcmVmKCcnKVxuY29uc3QgYW5zd2VyID0gcmVmKCdRdWVzdGlvbnMgdXN1YWxseSBjb250YWluIGEgcXVlc3Rpb24gbWFyay4gOy0pJylcblxud2F0Y2gocXVlc3Rpb24sIGFzeW5jIChuZXdRdWVzdGlvbikgPT4ge1xuICBpZiAobmV3UXVlc3Rpb24uaW5kZXhPZignPycpID4gLTEpIHtcbiAgICBhbnN3ZXIudmFsdWUgPSAnVGhpbmtpbmcuLi4nXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgYW5zd2VyLnZhbHVlID0gKGF3YWl0IHJlcy5qc29uKCkpLmFuc3dlclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhbnN3ZXIudmFsdWUgPSAnRXJyb3IhIENvdWxkIG5vdCByZWFjaCB0aGUgQVBJLiAnICsgZXJyb3JcbiAgICB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

### Zdrojové typy pro Watch {#watch-source-types}

První parametr `watch` může být některý z různých typů reaktivních "zdrojů": může to být ref (vč. computed refs), reaktivní objekt, getter funkce nebo pole více různých zdrojů:

```js
const x = ref(0)
const y = ref(0)

// jednoduchý ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// pole více růzých zdrojů
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

Pamatujte, že nemůžete sledovat vlastnost reaktivního objektu tímto způsobem:

```js
const obj = reactive({ count: 0 })

// toto nebude fungovat, protože do watch() předáváme pouze number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

Místo toho použijte getter

```js
// místo toho použijte getter:
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

</div>

## Deep Watchers {#deep-watchers}

<div class="options-api">

`watch` je ve výchozím nastavení mělký (shallow): callback funkce je vyvolána pouze tehdy, když je nová hodnota přiřazena sledované vlastnosti – nespustí se při změnách vnořených vlastností. Pokud chcete, aby se callback funkce spustila i u všech vnořených změn, musíte použít tzv. deep watcher:

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // Pozn.: `newValue` zde při vnořených změnách bude rovna `oldValue`,
        // dokud nebude nahrazen samotný objekt
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

Když zavoláte `watch()` přímo na reaktivní objekt, implicitně vytvoří tzv. deep watcher - callback funkce bude vyvolána i při všech změnách vnořených vlastností:

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // bude spuštěno při změnách vnořených vlastností
  // Pozn.: `newValue` zde bude rovna `oldValue`
  // protože obě ukazují na ten samý objekt!
})

obj.count++
```

To by se mělo odlišovat getter funkcí, která vrací reaktivní objekt – v druhém případě se callback funkce spustí pouze v případě, že getter vrátí jiný objekt:

```js
watch(
  () => state.someObject,
  () => {
    // bude spuštěno pouze pokud je nahrazen state.someObject
  }
)
```

Můžete nicméně donutit i druhý případ, aby se z něj stal deep watcher, explicitním použitím nastavení `deep`:

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Pozn.: `newValue` zde bude rovna `oldValue`,
    // dokud nebude nahrazen state.someObject
  },
  { deep: true }
)
```

</div>

:::warning Používejte s rozvahou
Deep watcher vyžaduje procházení všech vnořených vlastností ve sledovaném objektu, což může být výpočetně náročné, pokud je použito na velkých datových strukturách. Používejte jej pouze v případě potřeby a dávejte pozor na důsledky pro výkon aplikace.
:::

## Eager Watchers {#eager-watchers}

`watch` je ve výchozím nastavení "lazy": callback funkce není spuštěna, dokud se sledovaný zdroj nezmění. V některých případech však můžeme chtít, aby byla stejná logika callback funkce spouštěna v "eager" módu - například můžeme chtít načíst některá počáteční data a poté načíst data znovu, kdykoli se změní relevantní stav.

<div class="options-api">

Můžeme vynutit okamžité provedení callback funkce tím, že watcher deklarujeme pomocí objektu s funkcí `handler` a s volbou `immediate: true`:

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // toto bude spuštěno ihned po vytvoření instance komponenty
      },
      // vynutí "eager" spuštění callback funkce
      immediate: true
    }
  }
  // ...
}
```

Úvodní spuštění handler funkce proběhne těsně před lifecycle hookem `created`. Vue již bude mít zpracovaný obsah sekcí `data`, `computed` a `methods`, takže tyto vlastnosti budou při tomto prvním volání dostupné.
  
</div>

<div class="composition-api">

Můžeme vynutit okamžité provedení callback funkce předáním parametru `immediate: true`:

```js
watch(source, (newValue, oldValue) => {
  // bude spuštěno okamžitě a poté kdykoliv se změní `source`
}, { immediate: true })
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

Pro watcher callback funkci je běžné, že používá přesně stejný reaktivní stav jako zdroj. Zvažte například následující kód, který používá watcher k načtení vzdáleného zdroje, kdykoli se změní ref `todoId`:

```js
const todoId = ref(1)
const data = ref(null)

watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })
```

Zejména si všimněte, jak watcher používá `todoId` dvakrát, jednou jako zdroj a pak znovu uvnitř callback funkce.

Toto je možné zjednodušit pomocí [`watchEffect()`](/api/reactivity-core.html#watcheffect). `watchEffect()` nám umožňuje automaticky sledovat reaktivní závislosti callback funkce. Výše uvedený watcher lze přepsat jako:

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```
Zde se callback funkce spustí okamžitě, není třeba zadávat `immediate: true`. Během svého vykonávání bude automaticky sledovat `todoId.value` jako závislost (podobně jako computed proměnné). Kdykoli se `todoId.value` změní, callback funkce se spustí znovu. S `watchEffect()` již nemusíme `todoId` předávat explicitně jako zdrojovou hodnotu.

Můžete se podívat na [tento příklad](/examples/#fetching-data) použití `watchEffect()` a reaktivního načítání dat v akci.

Pro příklady jako jsou tyto, pouze s jednou závislostí, je přínos `watchEffect()` relativně malý. Ale pro watchers, kteří mají závislostí více, odstraňuje použití `watchEffect()` břemeno nutnosti seznam závislostí ručně udržovat. Kromě toho, pokud potřebujete sledovat několik vlastností ve vnořené datové struktuře, `watchEffect()` může být efektivnější než deep watcher, protože bude sledovat pouze vlastnosti, které jsou použity v callback funkci, a nikoliv rekurzivně sledovat všechny, které v objektu existují.

:::tip
`watchEffect` sleduje závislosti pouze při svém **synchronním** spuštění. Při použití s asynchronní callback funkcí budou sledovány pouze vlastnosti, ke kterým se přistoupilo před prvním výskytem `await`.
:::

### `watch` vs. `watchEffect` {#watch-vs-watcheffect}

Jak `watch`, tak `watchEffect` nám umožňují reaktivně provádět operace s vedlejšími účinky na data. Jejich hlavním rozdílem je způsob, jakým sledují své reaktivní závislosti:

- `watch` sleduje pouze explicitně zadaný zdroj. Nebude sledovat nic, k čemu se přistupuje uvnitř callback funkce. Kromě toho se callback funkce spustí pouze tehdy, když se zdroj skutečně změnil. `watch` odděluje sledování závislostí od vedlejšího efektu, což nám dává přesnější kontrolu nad tím, kdy se má callback funkce spustit.

- `watchEffect` na druhou stranu kombinuje sledování závislostí a vedlejší efekt do jedné fáze. Automaticky sleduje každou reaktivní vlastnost, ke které přistupuje během svého synchronního vykonávání. Je to pohodlnější a obvykle to vede ke stručnějšímu kódu, ale jeho reaktivní závislosti jsou méně explicitní.

</div>

## Časování provedení callback funkce {#callback-flush-timing}

Když měníte reaktivní stav, může to vyvolat aktualizace Vue komponent a callback funkce u watcherů, které jste vytvořili.

Ve výchozím nastavení jsou uživatelsky vytvořené watcher callback funkce volány **před** aktualizacemi Vue komponent. To znamená, že pokud se pokusíte o přístup k DOM v rámci watcher callback funkce, DOM bude ve stavu před tím, než Vue aplikovalo jakékoliv změny.

Pokud chcete prostřednictvím watcher callback funkce získat přístup k DOM až **poté**, co jej Vue aktualizuje, musíte zadat volbu `flush: 'post'`:

<div class="options-api">

```js
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

Post-flush `watchEffect()` má také zjednodušující alias `watchPostEffect()`:

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* bude vykonáno až po Vue aktualizacích */
})
```

</div>

<div class="options-api">

## `this.$watch()` \* {#this-watch}

Je také možné bezpodmínečně vytvořit watcher imperativně pomocí [instanční metody `$watch()`](/api/component-instance.html#watch):

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

To je užitečné, když potřebujete watcher nastavit podmíněně, nebo sledovat jen něco v reakci na interakci uživatele. Umožňuje také watcher předčasně zastavit.

</div>

## Zastavení watchers {#stopping-a-watcher}

<div class="options-api">

Watchers deklarované pomocí volby `watch` nebo instanční metody `$watch()` jsou automaticky zastaveny, když je odpojena komponenta, do které patří, takže se ve většině případů nemusíte o jejich zastavení sami starat.

Pro vzácné případy, kdy potřebujete watcher zastavit předtím, než se komponenta odpojí, pro to API `$watch()` vrací funkci:

```js
const unwatch = this.$watch('foo', callback)

// ...když už není watcher potřeba:
unwatch()
```

</div>

<div class="composition-api">

Sledovače deklarované synchronně v rámci `setup()` nebo `<script setup>` jsou vázány na instanci komponenty, do které patří, a budou automaticky zastaveny, když je komponenta odpojena. Ve většině případů se nemusíte o jejich zastavení sami starat.

Klíčem je zde to, že watcher musí být vytvořen **synchronně**: pokud je watcher vytvořen v asynchronní callback funkci, nebude vázán na komponentu a musí být zastaven ručně, aby se zabránilo únikům paměti (memory leaks). Zde je příklad:

```vue
<script setup>
import { watchEffect } from 'vue'

// tento bude automaticky zastaven
watchEffect(() => {})

// ...tento nebude!
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```
¨
K ručnímu zastavení watcheru použijte vrácenou obslužnou funkci. Funguje to pro `watch` i `watchEffect`:

```js
const unwatch = watchEffect(() => {})

// ...později, když už není watcher potřeba
unwatch()
```

Mějte na paměti, že by mělo být jen velmi málo případů, kdy potřebujete vytvářet watcher asynchronně, a pokud je to možné, měla by se upřednostňovat synchronní tvorba. Pokud potřebujete počkat na některá asynchronní data, můžete místo toho logiku pro watch podmínit:

```js
// data, která budou načtena asynchronně
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // kód se vykoná až po načtení dat
  }
})
```

</div>
