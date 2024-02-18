---
outline: deep
---

# Základy reaktivity {#reactivity-fundamentals}

:::tip API preference
Tato stránka a mnoho dalších kapitol dále v průvodci obsahuje různý obsah pro Options API a Composition API. Vaše aktuální preference je <span class="options-api">Options API</span><span class="composition-api">Composition API</span>. Mezi API styly můžete přepínat pomocí přepínače "API preference" vlevo nahoře.
:::

<div class="options-api">

## Deklarace reaktivního stavu \* {#declaring-reactive-state}


S Options API používáme k deklaraci reaktivního stavu komponenty vlastnost `data`. Hodnota vlastnosti by měla být funkce, která vrací objekt. Vue zavolá funkci při vytváření nové instance komponenty a zabalí vrácený objekt do svého systému reaktivity. Jakékoli vlastnosti nejvyšší úrovně tohoto objektu jsou proxy na instanci komponenty (`this` ve funkcích a lifecycle hooks):

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

[Vyzkoušejte si to](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

Tyto vlastnosti instance jsou přidány pouze při prvním vytvoření instance, takže musíte zajistit, aby byly všechny přítomny v objektu vráceném funkcí `data`. V případě potřeby použijte hodnotu `null`, `undefined` nebo jinou zástupnou hodnotu pro vlastnosti, u&nbsp;nichž požadovaná hodnota ještě není k dispozici.

Je možné přidat novou vlastnost přímo do `this`, aniž byste ji zahrnuli do `data`. Vlastnosti přidané tímto způsobem však nebudou moci vyvolat reaktivní aktualizace.

Vue používá předponu `$`, když vystavuje své vlastní vestavěné API prostřednictvím instance komponenty. Také si vyhrazuje předponu `_` pro interní vlastnosti. U vlastností nejvyšší úrovně v `data` byste se měli vyhnout používání názvů, které začínají jedním z&nbsp;těchto znaků.

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

## Deklarace reaktivního stavu \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

V rámci Composition API je doporučený způsob deklarace reaktivního stavu použitím funkce [`ref()`](/api/reactivity-core#ref):

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` přijímá vstupní parametr a vrací jej obalený uvnitř ref objektu s vlastností `.value`:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> Viz také:  [Typování `ref()`](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

Chcete-li použít reaktivní stav v šabloně komponenty, deklarujte a vraťte jej z funkce `setup()` v komponentě:

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` je speciální hook určený pro Composition API.
  setup() {
    const count = ref(0)

    // zpřístupnit stav pro šablonu komponenty
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

Všimněte si, že jsme **nepotřebovali** přidat `.value` při použití ref v šabloně. Pro větší pohodlí jsou refs v šabloně automaticky rozbaleny (unwrapped) - s několika [omezeními](#caveat-when-unwrapping-in-templates).

Můžete také měnit ref přímo v event handlerech:

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

Pro komplexnější logiku můžeme deklarovat funkce, které mění refs ve stejném scope, a&nbsp;vystavit je jako metody napříč stavem:

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // v JavaScriptu je .value nutné
      count.value++
    }

    // nezapomeňte funkce vystavit
    return {
      count,
      increment
    }
  }
}
```

Vystavené funkce se obvykle používají jako event listenery:

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

Zde je funkční ukázka na [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo), bez použití build nástrojů.

### `<script setup>` \*\* {#script-setup}

Ruční vystavování stavu a funkcí pomocí `setup()` může být zbytečně složité. Naštěstí je to nutné pouze tehdy, když nepoužíváte build fázi. Při použití [Single-File komponent (SFC)](/guide/scaling-up/sfc) můžeme použití výrazně zjednodušit pomocí `<script setup>`:

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

Importy nejvyšší úrovně a proměnné deklarované v `<script setup>` jsou v šabloně stejné komponenty použitelné automaticky. Přemýšlejte o šablonách jako o JavaScript funkcích deklarovaných ve stejném scope - přirozeně mají přístup ke všemu, co je kolem ní deklarováno.

:::tip 
Ve zbytku průvodce budeme pro příklady kódu Composition API primárně používat syntaxi SFC + `<script setup>`, protože to je pro Vue vývojáře nejběžnější použití.

Pokud SFC nepoužívate, pořád lze Composition API použít společně s možností [`setup()`](/api/composition-api-setup).
:::

### Proč používat refs? \*\* {#why-refs}

Možná se ptáte, proč potřebujeme refs s `.value` místo obyčejných proměnných. Abychom to vysvětlili, musíme stručně vysvětlit, jak funguje systém reaktivity Vue.

Když použijete ref v šabloně a později změníte jeho hodnotu, Vue automaticky zjistí změnu a aktualizuje DOM. To je možné díky systému reaktivity založenému na sledování závislostí. Když je komponenta poprvé vykreslena, Vue **sleduje** každý ref, který byl během vykreslování použit. Později, když je ref měněn, **spustí** překreslení komponent, které ho sledují.

V běžném JavaScriptu není způsob, jak detekovat čtení nebo změnu obyčejných proměnných. Nicméně, můžeme zachytit operace get a set vlastností objektu pomocí getter a setter metod.

Vlastnost `.value` dává Vue možnost detekovat, kdy byl ref čten nebo měněn. Interně Vue provádí sledování ve svém getteru a spouští překreslování ve svém setteru. Konceptuálně si můžete představit ref jako objekt, který vypadá takto:

```js
// pseudokód, ne skutečná implementace
const mujRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(novaHodnota) {
    this._value = novaHodnota
    trigger()
  }
}
```

Další hezkou vlastností refs je, že je na rozdíl od obyčejných proměnných můžete předávat do funkcí a stále mít přístup k nejnovější hodnotě a reaktivnímu spojení. To je zvláště užitečné při refaktorování složité logiky do znovupoužitelného kódu.

Reaktivní systém je podrobněji diskutován v sekci [Reaktivita podrobně](/guide/extras/reactivity-in-depth).
</div>

<div class="options-api">

## Deklarace funkcí \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Lekce o Vue.js funkcí zdarma"/>

Pro přidání funkcí do instance komponenty používáme vlastnost `methods`. Měl by to být objekt obsahující zamýšlené funkce:

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
    // funkce mohou být být volány v lifecycle hooks nebo v jiných funkcích
    this.increment()
  }
}
```

Vue pro `methods` automaticky provede binding hodnoty `this` tak, aby vždy odkazovala na instanci komponenty. To zajišťuje, že funkce zachová správnou hodnotu `this`, pokud je použita jako event listener nebo callback. Při definování `methods` byste se měli vyvarovat použití arrow funkcí, protože to zabraňuje Vue správně provést binding hodnoty `this`:

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

[Vyzkoušejte si to](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

Ve výše uvedeném příkladu je zavolána funkce `increment` ve chvíli, kdy je stisknuto tlačítko `<button>`.

</div>

### Vnořená reaktivita {#deep-reactivity}

<div class="options-api">

Ve Vue ve výchozím nastavení je stav hluboce reaktivní (deep reactivity). To znamená, že můžete očekávat detekci změn, i když změníte vnořené objekty nebo pole:

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

Refs mohou obsahovat hodnotu jakéhokoli typu, včetně hlubok vnořených objektů, polí a vestavěných JavaScipt datových struktur jako je `Map`.

Ref svou hodnotu udělá hluboce reaktivní (deep reactivity). To znamená, že můžete očekávat detekci změn, i když změníte vnořené objekty nebo pole:

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // bude fungovat podle očekávání
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

Jiné než primitivní hodnoty jsou převedeny na reaktivní proxy přes [`reactive()`](#reactive), o čemž mluvíme níže.

Je také možné potlačit hlubokou reaktivitu pomocí [mělkých (shallow) refs](/api/reactivity-advanced#shallowref). U mělké reaktivity je reaktivně sledován pouze přístup na `.value`. Shallow refs mohou být použity pro optimalizaci výkonu díky potlačení náhladů na sledování velkých objektů nebo v případech, kdy je vnitřní stav pravován externí knihovnou.

Další informace:

- [Snížení reaktivního zatížení pro velké neměnné struktury](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [Integrace s externími systémy pro správu stavu](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### Časování aktualizace DOM {#dom-update-timing}

Když měníte reaktivní stav, DOM se automaticky aktualizuje. Je však třeba poznamenat, že aktualizace DOM se neprovádí synchronně. Místo toho je Vue ukládá do fronty a&nbsp;aplikuje je až v „dalším tiknutí“ (next tick), aby se zajistilo, že každá komponenta se aktualizuje pouze jednou, bez ohledu na to, kolik změn stavu jste provedli.

Abyste po změně stavu počkali na dokončení aktualizace DOM, můžete použít globální API [nextTick()](/api/general#nexttick):

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // teď už je DOM aktualizován
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    async increment() {
      this.count++
      await nextTick()
      // teď už je DOM aktualizován
    }
  }
}
```

</div>

<div class="composition-api">

## `reactive()` \*\* {#reactive}

Existuje další způsob deklarace reaktivního stavu pomocí API `reactive()`. Na rozdíl od ref, který obaluje vnitřní hodnotu do speciálního objektu, `reactive()` činí objekt sám o&nbsp;sobě reaktivním:

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> Viz také: [Typování `reactive()`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

Použití v šabloně:

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

Reaktivní objekty jsou [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) a chovají se jako normální objekty. Rozdíl spočívá v tom, že Vue je schopno zachytit čtení a změnu všech vlastností reaktivního objektu pro sledování a spouštění systému reaktivity.

`reactive()` konvertuje objekt hluboce: vnořené objekty jsou při přístupu k nim také obaleny pomocí `reactive()`. Interně je také voláno při použití `ref()` s objektem jako hodnotou ref. Podobně jako u „mělkých“ refs existuje také API [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) pro potlačení hluboké reaktivity.

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

### Limity `reactive()` \*\* {#limitations-of-reactive}

API funkce `reactive()` má dvě omezení:

1. Funguje pouze pro objektové typy (objekty, pole a [typy kolekcí](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections), jako jsou `Map` a&nbsp;`Set`). Nemůže obsahovat [primitivní datové typy](https://developer.mozilla.org/en-US/docs/Glossary/Primitive), jako je `string`, `number` nebo `boolean`.

2. Vzhledem k tomu, že sledování reaktivity ve Vue funguje přes přístup k vlastnostem, musíme vždy zachovat stejný odkaz (reference) na reaktivní objekt. To znamená, že nemůžeme reaktivní objekt snadno „nahradit“, protože spojení reaktivity (reactivity connection) s prvním odkazem je ztraceno:

   ```js
   let state = reactive({ count: 0 })

   // výše uvedená reference ({ count: 0 }) už není sledována (spojení reaktivity je ztraceno!)
   state = reactive({ count: 1 })
   ```

3. **Není destructure-friendly:** když destrukturujeme vlastnosti reaktivního objektu do lokálních proměnných nebo když tuto vlastnost předáme jako parametr funkci, ztratíme spojení reaktivity:

   ```js
   const state = reactive({ count: 0 })

   // count je při destrukturování odpojena od state.count
   let { count } = state
   // neovlivní původní stav
   count++

   // funkce obdrží pouze prosté číslo
   // a nebude moci sledovat změny state.count
   // pro zachování reaktivity musíme předat celá objekt
   callSomeFunction(state.count)
   ```

Kvůli těmto omezením doporučujeme jako primární API pro deklaraci reaktivního stavu používat `ref()`.

## Bližší informace o rozbalování refs \*\* {#additional-ref-unwrapping-details}

### Jako vlastnost reaktivního objektu \*\* {#ref-unwrapping-as-reactive-object-property}

Ref je automaticky rozbalen, když je přistoupen nebo měněn jako vlastnost reaktivního objektu. Jinými slovy, chová se jako normální vlastnost:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Pokud je ke vlastnosti propojené s existující instancí ref přiřazena nová, nahradí původní instanci:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// původní instance ref je nyní od state.count odpojena
console.log(count.value) // 1
```

K rozbalení ref dochází pouze při vnoření do hluboce reaktivního objektu. Neplatí to, když se k němu přistupuje jako k vlastnosti [mělkého reaktivního objektu](/api/reactivity-advanced#shallowreactive).

### Omezení při rozbalování refs v polích a kolekcích \*\* {#caveat-in-arrays-and-collections}

Na rozdíl od reaktivních objektů nedochází k žádnému rozbalení, když se k ref přistupuje jako k prvku reaktivního pole nebo nativního typu kolekce, jako je `Map`:

```js
const books = reactive([ref('Vue 3 Guide')])
// zde je třeba .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// zde je třeba .value
console.log(map.get('count').value)
```

### Omezení při rozbalování refs v šablonách \*\* {#caveat-when-unwrapping-in-templates}

Rozbalování ref v šablonách platí pouze v případě, kdy je ref vlastností na nejvyšší úrovni v kontextu vykreslování šablony.

V následujícím příkladu jsou `count` a `object` vlastnostmi na nejvyšší úrovni, ale `object.id` není:

```js
const count = ref(0)
const object = { id: ref(1) }
```

Proto tento výraz funguje správně:

```vue-html
{{ count + 1 }}
```

...zatímco tento výraz **NE**:

```vue-html
{{ object.id + 1 }}
```

Výsledkem bude `[object Object]1`, protože `object.id` není při vyhodnocování výrazu rozbaleno a zůstává ref objektem. Pro opravu tohoto problému můžeme `id` destrukturovat do vlastnosti na nejvyšší úrovni:

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

Nyní bude výsledek vykreslen jako `2`.

Další věc, na kterou je třeba si dát pozor, je, že ref se rozbalí, pokud je konečnou vyhodnocenou hodnotou textové interpolace (tj. tag <code v-pre>{{ }}</code>), takže následující kód vykreslí `1`:

```vue-html
{{ object.id }}
```

Tato vymoženost textové interpolace pro větší pohodlí při psaní je ekvivalentní s&nbsp;<code v-pre>{{ object.id.value }}</code>.

</div>

<div class="options-api">

### Stateful funkce \* {#stateful-methods}

V některých případech možná budeme potřebovat vytvořit funkci komponenty dynamicky, například vytvořit „debounced“ event handler:

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // debouncing s pomocí knihovny Lodash
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
    // je vhodné časovač zrušit,
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
