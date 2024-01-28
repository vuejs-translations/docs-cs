# Watchers {#watchers}

## Jednoduchý příklad {#basic-example}

Computed proměnné nám umožňují deklarativně vypočítat odvozené hodnoty. Existují však případy, kdy v reakci na změny stavu potřebujeme provést „vedlejší efekty“ &#8209;&nbsp;například změnu DOM nebo změnu jiné části stavu na základě výsledku asynchronní operace.

<div class="options-api">

S Options API můžeme použít [možnost `watch`](/api/options-state#watch) k vyvolání funkce kdykoli se změní reaktivní hodnota:

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Otázky obvykle obsahují otazník. ;-)',
      loading: false
    }
  },
  watch: {
    // kdykoli se změní `question`, spustí se tato funkce
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.loading = true
      this.answer = 'Přemýšlím...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Chyba! Nelze volat API. ' + error
      } finally {
        this.loading = false
      }
    }
  }
}
```

```vue-html
<p>
  Zeptejte se na otázku s odpovědí ano/ne:
  <input v-model="question" :disabled="loading" />
</p>
<p>{{ answer }}</p>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9VE1v2zAM/SucLnaw1D70lqUbsiKH7rB1W4++aDYdq5ElTx9xgiD/fbT8lXZFAQO2+Mgn8pH0mW2aJjl4ZCu2trkRjfucKTw22jgosOReOjhnCqDgjseL/hvAoPNGjSeAvx6tE1qtIIqWo5Er26Ih088BteCt51KeINfKcaGAT5FQc7NP4NPNYiaQmhdC7VZQcmlxMF+61yUcWu7yajVmkabQVqjwgGZmzSuudmiX4CphofQqD+ZWSAnGqz5y9I4VtmOuS9CyGA9T3QCihGu3RKhc+gJtHH2JFld+EG5Mdug2QYZ4MSKhgBd11OgqXdipEm5PKoer0Jk2kA66wB044/EF1GtOSPRUCbUnryRJosnFnK4zpC5YR7205M9bLhyUSIrGUeVcY1dpekKrdNK6MuWNiKYKXt8V98FElDxbknGxGLCpZMi7VkGMxmjzv0pz1tvO4QPcay8LULoj5RToKoTN40MCEXyEQDJTl0KFmXpNOqsUxudN+TNFzzqdJp8ODutGcod0Alg34QWwsXsaVtIjVXqe9h5bC9V4B4ebWhco7zI24hmDVSEs/yOxIPOQEFnTnjzt2emS83nYFrhcevM6nRJhS+Ys9aoUu6Av7WqoNWO5rhsh0fxownplbBqhjJEmuv0WbN2UDNtDMRXm+zfsz/bY2TL2SH1Ec8CMTZjjhqaxh7e/v+ORvieQqvaSvN8Bf6HV0veSdG5fvSoo7Su/kO1D3f13SKInuz06VHYsahzzfl0yRj+s+3dKn9O9TW7HPrPLP624lFU=)

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

S Composition API můžeme použít [funkci `watch`](/api/reactivity-core#watch) k vyvolání callback funkce kdykoli se změní část reaktivního stavu:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Otázky obvykle obsahují otazník. ;-)')
const loading = ref(false)

// watch pracuje přímo nad ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Přemýšlím...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Chyba! Nelze volat API. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Zeptejte se na otázku s odpovědí ano/ne:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9U8Fy0zAQ/ZVFF9tDah96C2mZ0umhHKBAj7oIe52oUSQjyXEyGf87KytyoDC9JPa+p+e3b1cndtd15b5HtmQrV1vZeXDo++6Wa7nrjPVwAovtAgbh6w2M0Fqzg4xOZFxzXRvtPPzq0XlpNNwEbp5lRUKEdgPaVP925jnoXS+UOgKxvJAaxEVjJ+y2hA9XxUVFGdFIvT7LtEI5JIzrqjrbGozdOmikxdqTKqmIQOV6gvOkvQDhjrqGXOOQvCzAqCa9FHBzCyeuAWT7F6uUulZ9gy7PPmZFETmQjJV7oXoke972GJHY+Axkzxupt4FalhRcYHh7TDIQcqA+LTriikFIDy0G59nG+84tq+qITpty8G0lOhmSiedefSaPZ0mnfHFG50VRRkbkj1BPceVorbFzF/+6fQj4O7g3vWpAm6Ao6JzfINw9PZaQwXuYNJJuK/U0z1nxdTLT0M7s8Ec/I3WxquLS0brRi8ddp4RHegNYhR0M/Du3pXFSAJU285osI7aSuus97K92pkF1w1nCOYNlI534qbCh8tkOVasoXkV1+sjplLZ0HGN5Vc1G2IJ5R8Np5XpKlK7J1CJntdl1UqH92k0bzdkyNc8ZRWGGz1MtbMQi1esN1tv/1F/cIdQ4e6LJod0jZzPmhV2jj/DDjy94oOcZpK57Rew3wO/ojOpjJIH2qdcN2f6DN7l9nC47RfTsHg4etUtNpZUeJz5ndPPv32j9Yve6vE6DZuNvu1R2Tg==)

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

Výsledek `watch` je ve výchozím nastavení mělký (shallow): callback funkce je vyvolána pouze tehdy, když je nová hodnota přiřazena sledované vlastnosti – nespustí se při změnách vnořených vlastností. Pokud chcete, aby se callback funkce spustila i u všech vnořených změn, musíte použít tzv. deep watcher:

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

Když zavoláte `watch()` přímo na reaktivní objekt, implicitně vytvoří tzv. deep watcher &#8209;&nbsp;callback funkce bude vyvolána i při všech změnách vnořených vlastností:

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

Výsledek `watch` je ve výchozím nastavení „lazy“: callback funkce není spuštěna, dokud se sledovaný zdroj nezmění. V některých případech však můžeme chtít, aby byla stejná logika callback funkce spouštěna v „eager“ módu - například můžeme chtít načíst některá počáteční data a poté načíst data znovu, kdykoli se změní relevantní stav.

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

Úvodní spuštění handler funkce proběhne těsně před lifecycle hookem `created`. Vue již bude mít zpracovaný obsah možností `data`, `computed` a `methods`, takže jejich výsledky budou při tomto prvním volání dostupné.
  
</div>

<div class="composition-api">

Můžeme vynutit okamžité provedení callback funkce předáním parametru `immediate: true`:

```js
watch(
  source, 
  (newValue, oldValue) => {
    // bude spuštěno okamžitě a poté kdykoli se změní `source`
  }, 
  { immediate: true }
)
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

Pro watcher callback funkci je běžné, že používá přesně stejný reaktivní stav jako zdroj. Zvažte například následující kód, který používá watcher k načtení vzdáleného zdroje, kdykoli se změní ref `todoId`:

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

Zejména si všimněte, jak watcher používá `todoId` dvakrát, jednou jako zdroj a pak znovu uvnitř callback funkce.

Toto je možné zjednodušit pomocí [`watchEffect()`](/api/reactivity-core#watcheffect). `watchEffect()` nám umožňuje automaticky sledovat reaktivní závislosti callback funkce. Výše uvedený watcher lze přepsat jako:

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```
Zde se callback funkce spustí okamžitě, není třeba zadávat `immediate: true`. Během svého vykonávání bude automaticky sledovat `todoId.value` jako závislost (podobně jako computed proměnné). Kdykoli se `todoId.value` změní, callback funkce se spustí znovu. S `watchEffect()` již nemusíme `todoId` předávat explicitně jako zdrojovou hodnotu.

Můžete se podívat na [tento příklad](/examples/#fetching-data) použití `watchEffect()` a reaktivního načítání dat v&nbsp;akci.

Pro příklady jako jsou tyto, pouze s jednou závislostí, je přínos `watchEffect()` relativně malý. Ale pro watchers, kteří mají závislostí více, odstraňuje použití `watchEffect()` břemeno nutnosti seznam závislostí ručně udržovat. Kromě toho, pokud potřebujete sledovat několik vlastností ve vnořené datové struktuře, `watchEffect()` může být efektivnější než deep watcher, protože bude sledovat pouze vlastnosti, které jsou použity v callback funkci, a nikoli rekurzivně sledovat všechny, které v objektu existují.

:::tip
`watchEffect` sleduje závislosti pouze při svém **synchronním** spuštění. Při použití s&nbsp;asynchronní callback funkcí budou sledovány pouze vlastnosti, ke kterým se přistoupilo před prvním výskytem `await`.
:::

### `watch` vs. `watchEffect` {#watch-vs-watcheffect}

Jak `watch`, tak `watchEffect` nám umožňují reaktivně provádět operace s vedlejšími účinky na data. Jejich hlavním rozdílem je způsob, jakým sledují své reaktivní závislosti:

- `watch` sleduje pouze explicitně zadaný zdroj. Nebude sledovat nic, k čemu se přistupuje uvnitř callback funkce. Kromě toho se callback funkce spustí pouze tehdy, když se zdroj skutečně změnil. `watch` odděluje sledování závislostí od vedlejšího efektu, což nám dává přesnější kontrolu nad tím, kdy se má callback funkce spustit.

- `watchEffect` na druhou stranu kombinuje sledování závislostí a vedlejší efekt do jedné fáze. Automaticky sleduje každou reaktivní vlastnost, ke které přistupuje během svého synchronního vykonávání. Je to pohodlnější a obvykle to vede ke stručnějšímu kódu, ale jeho reaktivní závislosti jsou méně explicitní.

</div>

## Časování provedení callback funkce {#callback-flush-timing}

Když měníte reaktivní stav, může to vyvolat aktualizace Vue komponent a callback funkce u watcherů, které jste vytvořili.

Stejně jako v případě aktualizací komponent, jsou uživatelsky vytvořené watcher callback funkce organizovány do dávek, aby se předešlo duplicitním spuštěním. Například nejspíš nechceme, aby se watcher spustil tisíckrát, když synchronně přidáme tisíc prvků do sledovaného pole.

Ve výchozím nastavení jsou watcher callback funkce volány **po** aktualizacích komponenty rodiče (pokud nějaké jsou) a **před** DOM aktualizacemi komponenty, které watcher patří. To znamená, že pokud se pokusíte přistoupit k DOM této komponenty uvnitř watcher callback funkce, její DOM bude v pre-update stavu.

### Post Watchers {#post-watchers}

Pokud chcete prostřednictvím watcher callback funkce získat přístup k DOM až **poté**, co jej Vue aktualizuje, musíte zadat volbu `flush: 'post'`:

<div class="options-api">

```js{6}
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

```js{2,6}
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

### Sync Watchers {#sync-watchers}

Je také možné vytvořit watcher, který bude spuštěn synchronně před provedením jakýchkoli Vue aktualizací.

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'sync'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'sync'
})

watchEffect(callback, {
  flush: 'sync'
})
```

Synchronní `watchEffect()` má také zjednodušující alias `watchSyncEffect()`:

```js
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  /* bude vykonáno synchronně při reaktivní změně dat */
})
```

</div>

:::warning Používejte s rozvahou
Synchronní watchery nejsou organizovány do dávek a spouští se pokaždé, když je zjištěna reaktivní změna. Není problém je používat pro jednoduché boolean hodnoty, ale vyhněte se jejich použití na datových zdrojích, které mohou být synchronně  měněny mnohokrát, například na polích.
:::

<div class="options-api">

## `this.$watch()` \* {#this-watch}

Je také možné bezpodmínečně vytvořit watcher imperativně pomocí [instanční metody `$watch()`](/api/component-instance#watch):

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

To je užitečné, když potřebujete watcher nastavit podmíněně, nebo sledovat jen něco v&nbsp;reakci na interakci uživatele. Umožňuje také watcher předčasně zastavit.

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
