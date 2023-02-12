---
outline: deep
---

# Základy reaktivity {#reactivity-fundamentals}

:::tip API preference

Tato stránka a mnoho dalších kapitol dále v průvodci obsahuje různý obsah pro Options API a Composition API. Vaše aktuální preference je <span class="options-api">Options API</span><span class="composition-api">Composition API</span>. Mezi API styly můžete přepínat pomocí přepínače "API preference" vlevo nahoře.
:::

## Deklarace reaktivního stavu {#declaring-reactive-state}

<div class="options-api">

S Options API používáme k deklaraci reaktivního stavu komponenty vlastnost `data`. Hodnota vlastnosti by měla být funkce, která vrací objekt. Vue zavolá funkci při vytváření nové instance komponenty a zabalí vrácený objekt do svého systému reaktivity. Jakékoli vlastnosti nejvyšší úrovně tohoto objektu jsou proxy na instanci komponenty (`this` v metodách a lifecycle hooks):

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` je lifecycle hook, který bude popsán později
  mounted() {
    // `this` odkazuje na instanci komponenty
    console.log(this.count) // => 1

    // data lze rovněž měnit
    this.count = 2
  }
}
```

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDFcbiAgICB9XG4gIH0sXG5cbiAgLy8gYG1vdW50ZWRgIGlzIGEgbGlmZWN5Y2xlIGhvb2sgd2hpY2ggd2Ugd2lsbCBleHBsYWluIGxhdGVyXG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gYHRoaXNgIHJlZmVycyB0byB0aGUgY29tcG9uZW50IGluc3RhbmNlLlxuICAgIGNvbnNvbGUubG9nKHRoaXMuY291bnQpIC8vID0+IDFcblxuICAgIC8vIGRhdGEgY2FuIGJlIG11dGF0ZWQgYXMgd2VsbFxuICAgIHRoaXMuY291bnQgPSAyXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIENvdW50IGlzOiB7eyBjb3VudCB9fVxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

Tyto vlastnosti instance jsou přidány pouze při prvním vytvoření instance, takže musíte zajistit, aby byly všechny přítomny v objektu vráceném funkcí `data`. V případě potřeby použijte hodnotu `null`, `undefined` nebo jinou zástupnou hodnotu pro vlastnosti, u nichž požadovaná hodnota ještě není k dispozici.

Je možné přidat novou vlastnost přímo do `this`, aniž byste ji zahrnuli do `data`. Vlastnosti přidané tímto způsobem však nebudou moci vyvolat reaktivní aktualizace.

Vue používá předponu `$`, když vystavuje své vlastní vestavěné API prostřednictvím instance komponenty. Také si vyhrazuje předponu `_` pro interní vlastnosti. U vlastností nejvyšší úrovně v `data` byste se měli vyhnout používání názvů, které začínají jedním z těchto znaků.

### Reaktivní proxy vs. originál \* {#reactive-proxy-vs-original}

Ve Vue 3 jsou data reaktivní s využitím [JavaScript proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Uživatelé zvyklí na Vue 2 by si měli dát pozor na následující speciální případ:

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

Když přistupujete k `this.someObject` po přiřazení hodnoty, tato hodnota je reaktivní proxy původního `newObject`. **Na rozdíl od Vue 2 je původní `newObject` ponechán nedotčený a nebude reaktivní: ujistěte se, že vždy přistupujete k reaktivnímu stavu jako vlastnosti objektu `this`.**

</div>

<div class="composition-api">

Můžeme vytvořit reaktivní objekt nebo pole pomocí funkce [`reactive()`](/api/reactivity-core.html#reactive):

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

Reaktivní objekty jsou [JavaScript proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) a chovají se jako normální objekty. Rozdíl je v tom, že Vue je schopno sledovat přístup k vlastnostem a změnám reaktivního objektu. Pokud jste zvědaví na podrobnosti, jak systém Vue reaktivity funguje vysvětlíme v kapitole [Reaktivita podrobně](/guide/extras/reactivity-in-depth.html) – ale doporučujeme si ji přečíst až po dokončení hlavního průvodce.

Viz také: [Typování `reactive()`](/guide/typescript/composition-api.html#typing-reactive) <sup class="vt-badge ts" />

Chcete-li použít reaktivní stav v šabloně komponenty, deklarujte a vraťte jej z funkce `setup()` v komponentě:

```js{5,9-11}
import { reactive } from 'vue'

export default {
  // `setup` je speciální hook určený pro Composition API.
  setup() {
    const state = reactive({ count: 0 })

    // zpřístupnit stav pro šablonu komponenty
    return {
      state
    }
  }
}
```

```vue-html
<div>{{ state.count }}</div>
```

Podobně můžeme deklarovat funkce, které mění reaktivní stav ve stejném scope, a zpřístupnit je jako metody spolu se stavem:

```js{7-9,14}
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // nezapomeňte zpřístupnit i funkce
    return {
      state,
      increment
    }
  }
}
```

Vystavené metody se obvykle používají jako event listenery:

```vue-html
<button @click="increment">
  {{ state.count }}
</button>
```

### `<script setup>` \*\* {#script-setup}

Ruční vystavování stavu a metod pomocí `setup()` může být zbytečně složité. Naštěstí je to nutné pouze tehdy, když nepoužíváte build fázi. Při použití Single-File komponent (SFC) můžeme použití výrazně zjednodušit pomocí `<script setup>`:

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBzdGF0ZSA9IHJlYWN0aXZlKHsgY291bnQ6IDAgfSlcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBzdGF0ZS5jb3VudCsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPlxuICAgIHt7IHN0YXRlLmNvdW50IH19XG4gIDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

Importy nejvyšší úrovně a proměnné deklarované v `<script setup>` jsou v šabloně stejné komponenty použitelné automaticky.

> Ve zbytku průvodce budeme pro příklady kódu Composition API primárně používat syntaxi SFC + `<script setup>`, protože to je pro Vue vývojáře nejběžnější použití.

</div>

<div class="options-api">

## Deklarace metod \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Lekce o Vue.js metodách zdarma"/>

Pro přidání metod do instance komponenty používáme vlastnost `methods`. Měl by to být objekt obsahující zamýšlené metody:

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // metody mohou být být volány v lifecycle hooks nebo v jiných metodách
    this.increment()
  }
}
```

Vue pro `methods` automaticky provede binding hodnoty `this` tak, aby vždy odkazovala na instanci komponenty. To zajišťuje, že metoda zachová správnou hodnotu `this`, pokud je použita jako event listener nebo callback. Při definování `methods` byste se měli vyvarovat použití arrow funkcí, protože to zabraňuje Vue správně provést binding hodnoty `this`:

```js
export default {
  methods: {
    increment: () => {
      // ŠPATNĚ: `this` zde není přístupné!
    }
  }
}
```

Stejně jako všechny ostatní vlastnosti instance komponenty jsou `methods` přístupné ze šablony komponenty. Uvnitř šablony se nejčastěji používají jako event listenery:

```vue-html
<button @click="increment">{{ count }}</button>
```

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDBcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBpbmNyZW1lbnQoKSB7XG4gICAgICB0aGlzLmNvdW50KytcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5pbmNyZW1lbnQoKVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

Ve výše uvedeném příkladu je zavolána metoda `increment` ve chvíli, kdy je stisknuto tlačítko `<button>`.

</div>

### Časování aktualizací DOM {#dom-update-timing}

Když změníte reaktivní stav, DOM se automaticky aktualizuje. Je však třeba upozornit, že aktualizace DOM nejsou aplikovány synchronně. Místo toho je Vue ukládá do vyrovnávací paměti až do „příštího běhu“ (tick) aktualizačního cyklu, aby bylo zajištěno, že se každá komponenta aktualizuje pouze jednou bez ohledu na to, kolik změn stavu jste provedli.

Chcete-li vyčkat na dokončení aktualizace DOM po změně stavu, můžete použít globální API [nextTick()](/api/general.html#nexttick):

<div class="composition-api">

```js
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // přístup k aktualizovanému DOM
  })
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    increment() {
      this.count++
      nextTick(() => {
        // přístup k aktualizovanému DOM
      })
    }
  }
}
```

</div>

### Vnořená reaktivita {#deep-reactivity}

Ve Vue ve výchozím nastavení je stav hluboce reaktivní. To znamená, že můžete očekávat, že změny budou detekovány, i když změníte vnořené objekty nebo pole:

<div class="options-api">

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // bude fungovat podle očekávání
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

```js
import { reactive } from 'vue'

const obj = reactive({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // bude fungovat podle očekávání
  obj.nested.count++
  obj.arr.push('baz')
}
```

</div>

Je také možné explicitně vytvořit tzv. [shallow reaktivní objekty](/api/reactivity-advanced.html#shallowreactive), kde je reaktivita sledována pouze na kořenové úrovni, ale takové jsou obvykle potřeba pouze v pokročilejších případech užití.

<div class="composition-api">

### Reaktivní proxy vs. originál \*\* {#reactive-proxy-vs-original-1}

Je důležité si uvědomit, že hodnota vrácená z `reactive()` je [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) originálního objektu, který se nerovná původnímu objektu:

```js
const raw = {}
const proxy = reactive(raw)

// proxy se NEROVNÁ původnímu objektu.
console.log(proxy === raw) // false
```

Pouze proxy je reaktivní - změny původního objektu aktualizace nevyvolají. Proto je nejlepší praxí při práci se systémem reaktivity ve Vue **používat výhradně proxy verze vašeho stavu**.

Aby byl zajištěn konzistentní přístup k proxy, volání `reactive()` na stejném objektu vždy vrací stejné proxy a volání `reactive()` na existující proxy také vrátí to samé proxy:

```js
// volání reactive() na stejném objektu vrací stejné proxy
console.log(reactive(raw) === proxy) // true

// volání reactive() na proxy vrací sebe sama
console.log(reactive(proxy) === proxy) // true
```

Toto pravidlo platí i pro vnořené objekty. Kvůli vnořené reaktivitě jsou objekty vnořené uvnitř reaktivního objektu také proxy:

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Limity `reactive()` API \*\* {#limitations-of-reactive}

API metoda `reactive()` má dvě omezení:

1. Funguje pouze pro objektové typy (objekty, pole a [typy kolekcí](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections), jako jsou `Map` a ` Set`). Nemůže obsahovat [primitivní datové typy](https://developer.mozilla.org/en-US/docs/Glossary/Primitive), jako je `string`, `number` nebo `boolean`.

2. Vzhledem k tomu, že sledování reaktivity ve Vue funguje přes přístup k vlastnostem, musíme vždy zachovat stejný odkaz (reference) na reaktivní objekt. To znamená, že nemůžeme reaktivní objekt snadno "nahradit", protože spojení reaktivity (reactivity connection) s prvním odkazem je ztraceno:

   ```js
   let state = reactive({ count: 0 })

   // výše uvedená reference ({ count: 0 }) už není sledována (spojení reaktivity je ztraceno!)
   state = reactive({ count: 1 })
   ```

   To také znamená, že když přiřazujeme nebo dekonstruujme (destructure) vlastnost reaktivního objektu do lokálních proměnných nebo když tuto vlastnost předáme jako parametr funkci, ztratíme spojení reaktivity:

   ```js
   const state = reactive({ count: 0 })

   // n je lokální proměnná, která je odpojena
   // od state.count.
   let n = state.count
   // neovlivní původní stav
   n++

   // count je také odpojena od state.count.
   let { count } = state
   // neovlivní původní stav
   count++

   // funkce obdrží pouze prosté číslo
   // a nebude moci sledovat změny state.count
   callSomeFunction(state.count)
   ```

## Reaktivní proměnné s `ref()` \*\* {#reactive-variables-with-ref}

Pro řešení omezení `reactive()` poskytuje Vue také funkci [`ref()`](/api/reactivity-core.html#ref), která nám umožňuje vytvářet reaktivní **"refs"**, které mohou obsahovat hodnotu jakéhokoliv typu:

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` přijímá jeden parametr a vrací ho obalený v ref objektu s vlastností `.value`:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

Viz také: [Typování Refs](/guide/typescript/composition-api.html#typing-ref) <sup class="vt-badge ts" />

Stejně jako vlastnosti na reaktivním objektu je vlastnost `.value` ref objektu také reaktivní. Navíc pokud obsahuje objektové typy, ref objekt automaticky převede svou `.value` pomocí `reactive()`.

Instance ref obsahující jako hodnotu objekt ho může celý reaktivně nahradit:

```js
const objectRef = ref({ count: 0 })

// zůstává reaktivní
objectRef.value = { count: 1 }
```

Instance ref mohou být také předávány do funkcí nebo dekonstruovány z prostých (plain) objektů bez ztráty reaktivity:

```js
const obj = {
  foo: ref(1),
  bar: ref(2)
}

// funkce přijímá ref
// k přístupu k hodnotě potřebuje .value,
// ale zachovává spojení reaktivity
callSomeFunction(obj.foo)

// zůstává reaktivní
const { foo, bar } = obj
```

Jinými slovy, `ref()` nám umožňuje vytvořit "odkaz" na jakoukoli hodnotu a předávat ji dál bez ztráty reaktivity. Tato schopnost je poměrně důležitá a se často používá při extrahování logiky do [Composable funkcí](/guide/reusability/composables.html).

### Rozbalování ref v šablonách \*\* {#ref-unwrapping-in-templates}

Když se přistupuje k instancím ref deklarovaným jako vlastnosti nejvyšší úrovně v šabloně, jsou automaticky „rozbaleny“ (unwrapped), takže není třeba používat `.value`. Zde je předchozí příklad počítadla s použitím `ref()`:

```vue{13}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- není třeba vlastnost .value -->
  </button>
</template>
```

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnQgPSByZWYoMClcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBjb3VudC52YWx1ZSsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

Zapamatujte si, že rozbalení se použije pouze v případě, že je instance ref vlastnost nejvyšší úrovně v kontextu vykreslování šablony. Například `object` je vlastnost nejvyšší úrovně, ale `object.foo` nikoli.

Tedy pro následující objekt:

```js
const object = { foo: ref(1) }
```

**NEBUDE** následující kód fungovat podle očekávání:

```vue-html
{{ object.foo + 1 }}
```

Vykreslený výsledek bude `[object Object]1`, protože `object.foo` je vnořený ref objekt. Můžeme to napravit tak, že z `foo` uděláme vlastnost nejvyšší úrovně:

```js
const { foo } = object
```

```vue-html
{{ foo + 1 }}
```

Nyní bude vykrelseným výsledkem `2`.

Jedna věc, kterou je třeba poznamenat, je, že ref bude rozbalen také v případě, že se jedná o finálně vyhodnocenou hodnotu textové interpolace (např. tag <code v-pre>{{ }}</code>), takže následující kód vykreslí `1`:

```vue-html
{{ object.foo }}
```

Toto je pouze užitečná vlastnost funkce textové interpolace a je ekvivalentní zápisu <code v-pre>{{ object.foo.value }}</code>.

### Rozbalování ref v reaktivních objektech \*\* {#ref-unwrapping-in-reactive-objects}

Když je k instanci 'ref' přistupováno nebo je měněno jako vlastnost reaktivního objektu, je také automaticky rozbaleno, takže se chová jako normální vlastnost:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Pokud je ke vlastnosti propojené s existující ref instancí přiřazena nová, nahradí starou instanci:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// původní instance ref je nyní od state.count odpojena
console.log(count.value) // 1
```

K rozbalení ref dochází pouze při vnoření do hluboce reaktivního objektu. Neplatí to, když se k němu přistupuje jako k vlastnosti [shallow reaktivního objektu](/api/reactivity-advanced.html#shallowreactive).

### Rozbalování ref v polích a kolekcích {#ref-unwrapping-in-arrays-and-collections}

Na rozdíl od reaktivních objektů nedochází k žádnému rozbalení, když se k ref přistupuje jako k prvku reaktivního pole nebo nativního typu kolekce, jako je `Map`:

```js
const books = reactive([ref('Vue 3 Guide')])
// zde je třeba .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// zde je třeba .value
console.log(map.get('count').value)
```

</div>

<div class="options-api">

### Stateful metody \* {#stateful-methods}

V některých případech možná budeme potřebovat vytvořit funkci metody dynamicky, například vytvořit "debounced" event handler:

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // Debouncing s pomocí knihovny Lodash
    click: debounce(function () {
      // ... reakce na kliknutí ...
    }, 500)
  }
}
```

Tento přístup je však problematický u komponent, které jsou znovupoužívány, protože funkce s debounced je **stateful**: udržuje si určitý vnitřní stav pro uplynulý čas. Pokud více instancí komponenty sdílí stejnou debounced funkci, budou se navzájem vyrušovat.

Abychom zachovali debounced funkci v každé instanci komponenty nezávislou na ostatních, můžeme vytvořit debounced verzi uvnitř lifecycle hooku `created`:

```js
export default {
  created() {
    // každá instance bude mít vlastní kopii debounced handleru
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // je vhodné časovač zrušit
    // když je komponenta odstraněna
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... reakce na kliknutí ...
    }
  }
}
```

</div>

<div class="composition-api">

## Reactivity Transform <sup class="vt-badge experimeental" /> \*\* {#reactivity-transform}

Nutnost používat spolu s refs `.value` je nedostatek způsobený jazykovými omezeními JavaScriptu. Nicméně díky transformacím v době kompilace můžeme zlepšit ergonomii automatickým připojením `.value` na vhodná místa. Vue poskytuje transformaci v době kompilace, která nám umožňuje napsat dřívější příklad "počítadla" takto:

```vue
<script setup>
let count = $ref(0)

function increment() {
  // není třeba .value
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

Další informace o [Reactivity Transform](/guide/extras/reactivity-transform.html) najdete v příslušné sekci. Upozorňujeme, že je v současné době stále experimentální a před dokončením se může změnit.

</div>
