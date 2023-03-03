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

[Kompletní provide/inject příklad vč. reaktivity](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgcHJvdmlkZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBDaGlsZCBmcm9tICcuL0NoaWxkLnZ1ZSdcblxuLy8gYnkgcHJvdmlkaW5nIGEgcmVmLCB0aGUgR3JhbmRDaGlsZFxuLy8gY2FuIHJlYWN0IHRvIGNoYW5nZXMgaGFwcGVuaW5nIGhlcmUuXG5jb25zdCBtZXNzYWdlID0gcmVmKCdoZWxsbycpXG5wcm92aWRlKCdtZXNzYWdlJywgbWVzc2FnZSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxpbnB1dCB2LW1vZGVsPVwibWVzc2FnZVwiPlxuICA8Q2hpbGQgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkNoaWxkLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgR3JhbmRDaGlsZCBmcm9tICcuL0dyYW5kQ2hpbGQudnVlJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPEdyYW5kQ2hpbGQgLz5cbjwvdGVtcGxhdGU+IiwiR3JhbmRDaGlsZC52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgaW5qZWN0IH0gZnJvbSAndnVlJ1xuXG5jb25zdCBtZXNzYWdlID0gaW5qZWN0KCdtZXNzYWdlJylcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwPlxuICAgIE1lc3NhZ2UgdG8gZ3JhbmQgY2hpbGQ6IHt7IG1lc3NhZ2UgfX1cbiAgPC9wPlxuPC90ZW1wbGF0ZT4ifQ==)

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

[Kompletní provide/inject příklad](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDaGlsZCBmcm9tICcuL0NoaWxkLnZ1ZSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7IENoaWxkIH0sXG4gIHByb3ZpZGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6ICdoZWxsbydcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxDaGlsZCAvPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQ2hpbGQudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBHcmFuZENoaWxkIGZyb20gJy4vR3JhbmRDaGlsZC52dWUnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIEdyYW5kQ2hpbGRcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPEdyYW5kQ2hpbGQgLz5cbjwvdGVtcGxhdGU+IiwiR3JhbmRDaGlsZC52dWUiOiI8c2NyaXB0PlxuZXhwb3J0IGRlZmF1bHQge1xuICBpbmplY3Q6IFsnbWVzc2FnZSddXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBNZXNzYWdlIHRvIGdyYW5kIGNoaWxkOiB7eyBtZXNzYWdlIH19XG4gIDwvcD5cbjwvdGVtcGxhdGU+In0=)

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
const value = inject('key', () => new ExpensiveClass())
```

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

[Kompletní provide/inject příklad vč. reaktivity](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDaGlsZCBmcm9tICcuL0NoaWxkLnZ1ZSdcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQ2hpbGQgfSxcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogJ2hlbGxvJ1xuICAgIH1cbiAgfSxcbiAgcHJvdmlkZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogY29tcHV0ZWQoKCkgPT4gdGhpcy5tZXNzYWdlKVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGlucHV0IHYtbW9kZWw9XCJtZXNzYWdlXCI+XG4gIDxDaGlsZCAvPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQ2hpbGQudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBHcmFuZENoaWxkIGZyb20gJy4vR3JhbmRDaGlsZC52dWUnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIEdyYW5kQ2hpbGRcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPEdyYW5kQ2hpbGQgLz5cbjwvdGVtcGxhdGU+IiwiR3JhbmRDaGlsZC52dWUiOiI8c2NyaXB0PlxuZXhwb3J0IGRlZmF1bHQge1xuICBpbmplY3Q6IFsnbWVzc2FnZSddXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBNZXNzYWdlIHRvIGdyYW5kIGNoaWxkOiB7eyBtZXNzYWdlIH19XG4gIDwvcD5cbjwvdGVtcGxhdGU+In0=)

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
