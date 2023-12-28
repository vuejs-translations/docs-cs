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

> Viz také:  [Typování Refs](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

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

Notice that we did **not** need to append `.value` when using the ref in the template. For convenience, refs are automatically unwrapped when used inside templates (with a few [caveats](#caveat-when-unwrapping-in-templates)).

You can also mutate a ref directly in event handlers:

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

For more complex logic, we can declare functions that mutate refs in the same scope and expose them as methods alongside the state:

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // .value is needed in JavaScript
      count.value++
    }

    // nezapomeňte zpřístupnit i funkce
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

Here's the example live on [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo), without using any build tools.

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

> Ve zbytku průvodce budeme pro příklady kódu Composition API primárně používat syntaxi SFC + `<script setup>`, protože to je pro Vue vývojáře nejběžnější použití.

If you are not using SFC, you can still use Composition API with the [`setup()`](/api/composition-api-setup) option.
:::

### Why Refs? \*\* {#why-refs}

You might be wondering why we need refs with the `.value` instead of plain variables. To explain that, we will need to briefly discuss how Vue's reactivity system works.

When you use a ref in a template, and change the ref's value later, Vue automatically detects the change and updates the DOM accordingly. This is made possible with a dependency-tracking based reactivity system. When a component is rendered for the first time, Vue **tracks** every ref that was used during the render. Later on, when a ref is mutated, it will **trigger** a re-render for components that are tracking it.

In standard JavaScript, there is no way to detect the access or mutation of plain variables. However, we can intercept the get and set operations of an object's properties using getter and setter methods.

The `.value` property gives Vue the opportunity to detect when a ref has been accessed or mutated. Under the hood, Vue performs the tracking in its getter, and performs triggering in its setter. Conceptually, you can think of a ref as an object that looks like this:

```js
// pseudo code, not actual implementation
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

Another nice trait of refs is that unlike plain variables, you can pass refs into functions while retaining access to the latest value and the reactivity connection. This is particularly useful when refactoring complex logic into reusable code.

The reactivity system is discussed in more details in the [Reactivity in Depth](/guide/extras/reactivity-in-depth) section.
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

Ve Vue ve výchozím nastavení je stav hluboce reaktivní. To znamená, že můžete očekávat, že změny budou detekovány, i když změníte vnořené objekty nebo pole:

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

Refs can hold any value type, including deeply nested objects, arrays, or JavaScript built-in data structures like `Map`.

A ref will make its value deeply reactive. This means you can expect changes to be detected even when you mutate nested objects or arrays:

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

Non-primitive values are turned into reactive proxies via [`reactive()`](#reactive), which is discussed below.

It is also possible to opt-out of deep reactivity with [shallow refs](/api/reactivity-advanced#shallowref). For shallow refs, only `.value` access is tracked for reactivity. Shallow refs can be used for optimizing performance by avoiding the observation cost of large objects, or in cases where the inner state is managed by an external library.

Further reading:

- [Snížení reaktivního zatížení pro velké neměnné struktury](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [Integrace s externími systémy pro správu stavu](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### DOM Update Timing {#dom-update-timing}

When you mutate reactive state, the DOM is updated automatically. However, it should be noted that the DOM updates are not applied synchronously. Instead, Vue buffers them until the "next tick" in the update cycle to ensure that each component updates only once no matter how many state changes you have made.

To wait for the DOM update to complete after a state change, you can use the [nextTick()](/api/general#nexttick) global API:

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // Now the DOM is updated
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
      // Now the DOM is updated
    }
  }
}
```

</div>

<div class="composition-api">

## `reactive()` \*\* {#reactive}

There is another way to declare reactive state, with the `reactive()` API. Unlike a ref which wraps the inner value in a special object, `reactive()` makes an object itself reactive:

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> See also: [Typing Reactive](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

Usage in template:

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

Reactive objects are [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and behave just like normal objects. The difference is that Vue is able to intercept the access and mutation of all properties of a reactive object for reactivity tracking and triggering.

`reactive()` converts the object deeply: nested objects are also wrapped with `reactive()` when accessed. It is also called by `ref()` internally when the ref value is an object. Similar to shallow refs, there is also the [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) API for opting-out of deep reactivity.

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

API funkce `reactive()` má dvě omezení:

1. Funguje pouze pro objektové typy (objekty, pole a [typy kolekcí](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections), jako jsou `Map` a ` Set`). Nemůže obsahovat [primitivní datové typy](https://developer.mozilla.org/en-US/docs/Glossary/Primitive), jako je `string`, `number` nebo `boolean`.

2. Vzhledem k tomu, že sledování reaktivity ve Vue funguje přes přístup k vlastnostem, musíme vždy zachovat stejný odkaz (reference) na reaktivní objekt. To znamená, že nemůžeme reaktivní objekt snadno "nahradit", protože spojení reaktivity (reactivity connection) s prvním odkazem je ztraceno:

   ```js
   let state = reactive({ count: 0 })

   // výše uvedená reference ({ count: 0 }) už není sledována (spojení reaktivity je ztraceno!)
   state = reactive({ count: 1 })
   ```

3. **Není destructure-friendly:** ldyž dekonstruujme (destructure) vlastnosti reaktivního objektu do lokálních proměnných nebo když tuto vlastnost předáme jako parametr funkci, ztratíme spojení reaktivity:

   ```js
   const state = reactive({ count: 0 })

   // count je při dekonstrukci odpojena od state.count
   let { count } = state
   // neovlivní původní stav
   count++

   // funkce obdrží pouze prosté číslo
   // a nebude moci sledovat změny state.count
   // pro zachování reaktivity musíme předat celá objekt
   callSomeFunction(state.count)
   ```

Kvůli těmto omezením doporučujeme používat `ref()` jako primární API pro deklaraci reaktivního stavu.

## Reaktivní proměnné s `ref()` \*\* {#reactive-variables-with-ref}

Pro řešení omezení `reactive()` poskytuje Vue také funkci [`ref()`](/api/reactivity-core#ref), která nám umožňuje vytvářet reaktivní **"refs"**, které mohou obsahovat hodnotu jakéhokoliv typu:

### As Reactive Object Property \*\* {#ref-unwrapping-as-reactive-object-property}

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

Viz také: [Typování Refs](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

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

Jinými slovy, `ref()` nám umožňuje vytvořit "odkaz" na jakoukoli hodnotu a předávat ji dál bez ztráty reaktivity. Tato schopnost je poměrně důležitá a se často používá při extrahování logiky do [Composable funkcí](/guide/reusability/composables).

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

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNclSnuP2dgwQqiZhDhxE3L3Riwu//DmvazeIQxHIvVUejfRBoGdJIUZ2brgo0CGSCsUWKN30FS0QUY2nncB4xMLTCfRPrrzviY2Yj2DZRPJEUvbQUaGix2OZUvU98gFWY9XsbbqEHJhW4TqAtCfJFItL7NZ851Q3TpUc87/cCl6vMD6pMfboMoPvd1Nzg==)

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
A ref is automatically unwrapped when accessed or mutated as a property of a reactive object. In other words, it behaves like a normal property :

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

K rozbalení ref dochází pouze při vnoření do hluboce reaktivního objektu. Neplatí to, když se k němu přistupuje jako k vlastnosti [shallow reaktivního objektu](/api/reactivity-advanced#shallowreactive).

### Rozbalování ref v polích a kolekcích {#ref-unwrapping-in-arrays-and-collections}

Na rozdíl od reaktivních objektů nedochází k žádnému rozbalení, když se k ref přistupuje jako k prvku reaktivního pole nebo nativního typu kolekce, jako je `Map`:
### Caveat in Arrays and Collections \*\* {#caveat-in-arrays-and-collections}

Unlike reactive objects, there is **no** unwrapping performed when the ref is accessed as an element of a reactive array or a native collection type like `Map`:

```js
const books = reactive([ref('Vue 3 Guide')])
// zde je třeba .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// zde je třeba .value
console.log(map.get('count').value)
```

### Caveat when Unwrapping in Templates \*\* {#caveat-when-unwrapping-in-templates}

Ref unwrapping in templates only applies if the ref is a top-level property in the template render context.

In the example below, `count` and `object` are top-level properties, but `object.id` is not:

```js
const count = ref(0)
const object = { id: ref(1) }
```

Therefore, this expression works as expected:

```vue-html
{{ count + 1 }}
```

...while this one does **NOT**:

```vue-html
{{ object.id + 1 }}
```

The rendered result will be `[object Object]1` because `object.id` is not unwrapped when evaluating the expression and remains a ref object. To fix this, we can destructure `id` into a top-level property:

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

Now the render result will be `2`.

Another thing to note is that a ref does get unwrapped if it is the final evaluated value of a text interpolation (i.e. a <code v-pre>{{ }}</code> tag), so the following will render `1`:

```vue-html
{{ object.id }}
```

This is just a convenience feature of text interpolation and is equivalent to <code v-pre>{{ object.id.value }}</code>.

</div>

<div class="options-api">

### Stateful funkce \* {#stateful-methods}

V některých případech možná budeme potřebovat vytvořit funkci komponenty dynamicky, například vytvořit "debounced" event handler:

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
