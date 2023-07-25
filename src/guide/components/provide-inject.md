# Provide / Inject {#provide-inject}

> Tato stránka předpokládá, že už jste četli [Základy komponent](/guide/essentials/component-basics). Pokud jsou pro vás komponenty nové, přečtěte si je jako první.

## Drilling vlastností {#prop-drilling}

Pokud potřebujeme předat data z nadřazené komponenty podřazené komponentě, použijeme obvykle [vlastnosti (props)](/guide/components/props). Představte si však případ, kdy máme rozsáhlý strom komponent a hluboko vnořená komponenta potřebuje něco ze komponenty vzdáleného předka. Pokud bychom používali pouze vlastnosti, museli bychom předávat stejnou vlastnost napříč celým řetězcem rodičů:

![prop drilling diagram](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

Všimněte si, že ačkoli komponentu `<Footer>` tyto vlastnosti možná vůbec nezajímají, musí je deklarovat a předat dál, aby k nim komponenta `<DeepChild>` měla přístup. Pokud by existoval delší rodičovský řetězec, ovlivnilo by to po cestě ještě více komponent. Tomu se říká "props drilling" a rozhodně není zábavné se s tím potýkat.

Drilling vlastností můžeme řešit pomocí `provide` a `inject`. Komponenta rodiče může sloužit jako **poskytovatel závislostí (dependency provider)** pro všechny své potomky. Jakákoliv komponenta ve stromu potomků, bezohledu na hloubku jejího zanoření, může **implementovat (inject)** závislosti poskytované komponentami v rodčovském řetězci.

![Provide/inject scheme](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide {#provide}

<div class="composition-api">

Pro poskytnutí dat komponentám potomků použijte funkci [`provide()`](/api/composition-api-dependency-injection#provide) function:

```vue
<script setup>
import { provide } from 'vue'

provide(/* klíč */ 'message', /* hodnota */ 'Ahoj!')
</script>
```

Pokud nepoužíváte `<script setup>`, ujistetě se, že je `provide()` voláno synchronně uvnitř `setup()` funkce:

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* klíč */ 'message', /* hodnota */ 'Ahoj!')
  }
}
```

Funkce `provide()` přijímá dva parametry. První parametr se nazává **injection key**, což může být string nebo `Symbol`. Injection key je použit v komponentně potomka k vyhledání hodnoty, která má být implementována. Jedna komponenta může volat `provide()` vícekrát s různými injection keys pro poskytnutí různých hodnot.

Druhý parametr je poskytovaná hodnota. Hodnota může být jakéhokoliv typu vč. reaktivního stavu jako jsou refs:

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

Poskytnutí reaktivních hodnot umožňuje komponentám potomků, které poskytnutou hodnotu používají, navázat reaktivní spojení s komponentou zprostředkovatele.

</div>

<div class="options-api">

Pro poskytnutí dat komponentám potomků použijte sekci [`provide`](/api/options-composition#provide):

```js
export default {
  provide: {
    message: 'Ahoj!'
  }
}
```

Pro každou proměnnou objektu `provide`, je klíč použit v komponentě potomka k lokalizaci správné hodnoty pro inject, zatímco hodnota je to, co bude implementováno.

Pokud potřebujeme poskytovat stav konkrétní instance, například data deklarovaná pomocí `data()`, pak je třeba použít `provide` ve tvaru funkce:

```js{7-12}
export default {
  data() {
    return {
      message: 'Ahoj!'
    }
  },
  provide() {
    // použijeme syntaxi funkce, abychom mohli přistoupit k `this`
    return {
      message: this.message
    }
  }
}
```

Vemte ovšem na vědomí, že toto **nezajistí** reaktivitu implementace. Jak [udělat injection reaktivní](#working-with-reactivity) se budeme bavit později.

</div>

## Provide na úrovni aplikace {#app-level-provide}

Kromě poskytování dat v komponentě můžeme data poskytovat také na úrovni celé aplikace:

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* klíč */ 'message', /* hodnota */ 'Ahoj!')
```

Provide na úrovni aplikace je k dispozici všem komponentám vykresleným v aplikaci. To je obzvláště užitečné při psaní [pluginů](/guide/reusability/plugins), protože pluginy obvykle nejsou schopny poskytovat hodnoty pomocí komponent.

## Inject {#inject}

<div class="composition-api">

Pro implementaci dat poskytnutých komponentou předka použijte funkci [`inject()`](/api/composition-api-dependency-injection#inject) function:

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

Pokud je poskytovaná hodnota ref, bude jako ref implementována a **nebude** automaticky rozbalena. To umožňuje komponentě, která implementuje, zachovat reaktivitu spojení s komponentou, která data poskytuje.

[Kompletní provide/inject příklad vč. reaktivity](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

Opět, pokud nepoužíváte `<script setup>`, `inject()` lze volat pouze synchronně uvnitř `setup()`:

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

Pro implementaci dat poskytnutých komponentou předka použijte sekci [`inject`](/api/options-composition#inject):

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // implementovaná hodnota
  }
}
```

Implementace jsou vyhodnoceny **dříve** než vlastní stav komponenty, takže lze na implementované hodnoty přistupovat v sekci `data()`:

```js
export default {
  inject: ['message'],
  data() {
    return {
      // výchozí data založená na implementované hodnotě
      fullMessage: this.message
    }
  }
}
```

[Kompletní provide/inject příklad](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### Injection aliasing \* {#injection-aliasing}

Pokud je pro `inject` použita syntaxe pole, jsou implementované vlastnosti vystaveny na instanci komponenty pomocí stejného klíče. Ve výše uvedeném příkladu byla vlastnost poskytnuta pod klíčem `"message"` a implementováína jako `this.message`. Lokální klíč je stejný jako injection key.

Pokud chceme implementovat vlastnost pomocí jiného lokálního klíče, musíme pro volbu `inject` použít objektovou syntaxi:

```js
export default {
  inject: {
    /* lokální klíč */ localMessage: {
      from: /* injection key */ 'message'
    }
  }
}
```

V tomto případě nalezne komponenta vlastnost poskytovanou pod klíčem `"message"` a vystaví ji jako `this.localMessage`.

</div>

### Výchozí hodnoty pro injection {#injection-default-values}

Ve výchozím nastavení `inject` předpokládá, že implementovaná hodnota je někde v rodičovském řetězci poskytována. V případě, že klíč poskytnut není, zobrazí se runtime varování.

Pokud chceme, aby implementovaná vlastnost fungovala s volitelnými poskytovateli, musíme deklarovat výchozí hodnotu, podobně jako u vlastností:

<div class="composition-api">

```js
// pokud není poskytnuta žáná odpovídající "message"
// `value` bude "default value"
const value = inject('message', 'default value')
```

V některých případech může být nutné výchozí hodnotu vytvořit voláním funkce nebo instancí nové třídy. Abychom se vyhnuli zbytečným výpočtům nebo vedlejším efektům v případě, že volitelnou hodnotu nepoužijeme, můžeme pro vytvoření výchozí hodnoty použít tovární (factory) metodu:

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

The third parameter indicates the default value should be treated as a factory function.

</div>

<div class="options-api">

```js
export default {
  // pro deklaraci výchozích hodnot pro injection
  // je nutná objektová syntaxe
  inject: {
    message: {
      from: 'message', // pokud chceme použít stejný klíč, je toto nepovinné
      default: 'default value'
    },
    user: {
      // pro složitější hodnoty, které jsou drahé na tvorbu
      // nebo mají být unikátní pro každou instanci komponenty,
      // použijeme tovární metodu
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## Práce s reaktivitou {#working-with-reactivity}

<div class="composition-api">

Když používáme reaktivní provide/inject hodnoty, **je doporučeno provádět všechny změny reaktivního stavu uvnitř _provider_ komponenty, kdykoliv je to možné**. Tím je zajištěno, že jsou poskytnutý stav a jeho případné změny umístěny ve stejné komponentě, což usnadňuje budoucí údržbu.

V některých případech můžeme potřebovat aktualizovat data z komponenty, která poskytnutá data implementuje. V takových případech doporučujeme poskytovat funkci, která je za změny stavu zodpovědná:

```vue{7-9,13}
<!-- uvnitř komponenty, která poskytuje -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('Severní pól')

function updateLocation() {
  location.value = 'Jižní pól'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- uvnitř komponenty, která implementuje -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

Pokud se chcete ujistit, že data předaná skrz `provide` nemohou být změněna komponentou, která je implementuje, můžte poskytovanou hdonotu obalit pomocí [`readonly()`](/api/reactivity-core#readonly).

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

Aby byla injection reaktivně propojena se komponentou poskytovatele, musíme poskytovat computed proměnnou pomocí funkce [computed()](/api/reactivity-core#computed):

```js{10}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'Ahoj!'
    }
  },
  provide() {
    return {
      // explicitně poskytujeme computed proměnnou
      message: computed(() => this.message)
    }
  }
}
```

[Kompletní provide/inject příklad vč. reaktivity](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

Funkce `computed()` se typicky používá v komponentách psaných v Composition API, ale lze ji také použít pro doplnění některých případů užití v Options API. O jejím použití se můžete dočíst víc v průvodcích [Základy rektivity](/guide/essentials/reactivity-fundamentals) and [Computed proměnné](/guide/essentials/computed) s preferencí API nastavenou na Composition API.

:::warning Dočasně je potřeba nastavení
Výše uvedené použití vyžaduje nastavení `app.config.unwrapInjectedRef = true`, aby implementace automaticky rozbalovaly vypočtené ref. Ve Vue 3.3 se to stane výchozím chováním. Tento konfigurátor je zaveden dočasně, aby se zabránilo nefunkčnostem. Po vydání verze 3.3 již nebude vyžadován.
:::

</div>

## Práce s klíči typu Symbol {#working-with-symbol-keys}

Dosud jsme v příkladech používali injection kyes typu string. Pokud pracujete v rozsáhlé aplikaci s mnoha poskytovateli závislostí nebo vytváříte komponenty, které budou používat i další vývojáři, je nejlepší používat injection kyes typu Symbol, abyste se vyhnuli případným kolizím.

Je doporučeno exportovat použité symboly do vyhrazeného souboru:

```js
// keys.js
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// uvnitř komponenty, která poskytuje
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* poskytovaná data */
})
```

```js
// uvnitř komponenty, která implementuje
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

Viz také: [Typování Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// uvnitř komponenty, která poskytuje
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* poskytovaná data */
      }
    }
  }
}
```

```js
// uvnitř komponenty, která implementuje
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>
