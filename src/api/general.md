# Globální API: Obecné {#global-api-general}

## version {#version}

Vystavuje aktuální verzi Vue.

- **Typ:** `string`

- **Příklad**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

Pomocná funkce pro čekání na příští aktualizaci DOM.

- **Typ**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Podrobnosti**

  Když ve Vue měníte reaktivní stav, výsledné aktualizace DOM se neprovádějí synchronně. Místo toho je Vue ukládá do fronty a aplikuje je až v „dalším tiknutí“ (next tick), aby se zajistilo, že každá komponenta se aktualizuje pouze jednou, bez ohledu na to, kolik změn stavu jste provedli.

  `nextTick()` můžete použít ihned po změně stavu, abyste počkali na dokončení aktualizace DOM. Můžete buď jako parametr předat callback, nebo počkat na vrácený Promise.

- **Příklad**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM ještě nebyl aktualizován
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM už je nyní aktualizován
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM ještě nebyl aktualizován
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM už nyní je aktualizován
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **Viz také:** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

Pomocná funkce pro podporu typů při definování Vue komponenty s odvozováním typů.

- **Typ**

  ```ts
  // syntaxe pomocí options
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // syntaxe pomocí funkce (3.3+)
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > Typ je pro lepší čitelnost zjednodušen.

- **Podrobnosti**

  První parametr očekává objekt s možnostmi (options) komponenty. Návratová hodnota bude stejný objekt s možnostmi, protože tato funkce se spouští pouze pro účely odvozování typů bez vedlejších efektů.

  Mějte však na paměti, že návratový typ je trochu specifický: bude to typ konstruktoru, jehož instanční typ je určen z odvozeného typu instance komponenty na základě options. To se používá pro odvozování typů, když je tento typ použit jako tag v TSX.

  Typ instance komponenty (ekvivalent typu `this` v jeho options) můžete získat z&nbsp;návratového typu `defineComponent()` takto:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### Syntaxe pomocí funkce <sup class="vt-badge" data-text="3.3+" /> {#function-signature}

  `defineComponent()` má také alternativní způsob zápisu, který je určen pro použití s&nbsp;Composition API a [funkce pro vykreslení & JSX](/guide/extras/render-function.html).

  Místo předávání objektu s možnostmi (options) se očekává funkce. Tato funkce funguje stejně jako funkce [`setup()`](/api/composition-api-setup.html#composition-api-setup) z Composition API: přijímá vlastnosti (props) a&nbsp;kontext pro setup. Návratová hodnota by měla být funkce pro vykreslení - podporovány jsou jak `h()`, tak JSX:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // zde použijte Composition API, stejně jako v <script setup>
      const count = ref(0)

      return () => {
        // funkce pro vykreslení nebo JSX
        return h('div', count.value)
      }
    },
    // extra možnosti, např. deklarace props a emits
    {
      props: {
        /* ... */
      }
    }
  )
  ```

Hlavní použití tohoto způsou zápisu je s TypeScriptem (zejména s TSX), protože podporuje generics:

```tsx
const Comp = defineComponent(
  <T extends string | number>(props: { msg: T; list: T[] }) => {
    // zde použijte Composition API, stejně jako v <script setup>
    const count = ref(0)

    return () => {
      // funkce pro vykreslení nebo JSX
      return <div>{count.value}</div>
    }
  },
  // ruční deklarace běhových vlastností je momentálně stále ještě potřebná
  {
    props: ['msg', 'list']
  }
)
```

V budoucnu plánujeme poskytnout Babel plugin, který runtime vlastnosti automaticky odvodí a&nbsp;implementuje (stejně jako u `defineProps` ve SFC), takže deklarace runtime vlastností budou moct být vynechány.

### Poznámka k webpack Treeshaking {#note-on-webpack-treeshaking}

Protože `defineComponent()` je volání funkce, může se zdát, že by mohla mít vedlejší efekty pro některé build nástroje, například webpack. To zabrání odstranění komponenty z výsledného balíčku, i když komponenta není nikdy použita.

Abychom nástroji webpack řekli, že toto volání funkce je pro odstranění nepoužitých částí kódu (treeshaking) bezpečné, můžete před voláním funkce přidat komentář `/*#__PURE__*/`:

```js
export default /*#__PURE__*/ defineComponent(/* ... */)
```

Toto není nutné, pokud používáte Vite, protože Rollup (základní produkční bundler používaný Vite) je dostatečně chytrý na to, aby určil, že `defineComponent()` je ve skutečnosti bez vedlejších efektů i bez potřeby ručních anotací.

- **Viz také:** [Průvodce - Používání Vue s TypeScriptem](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

Definuje asynchronní komponentu, která se načítá „lazy“ až při jejím vykreslení. Parametrem může být buď funkce pro načítání, nebo objekt s pokročilejší kontrolou chování načítání.

- **Typ**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

```ts
  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **Viz také:** [Průvodce - Asynchronní komponenty](/guide/components/async)

## defineCustomElement() {#definecustomelement}

Tato metoda přijímá stejný parametr jako [`defineComponent`](#definecomponent), ale místo toho vrací konstruktor nativního [custom elementu](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

- **Typ**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > Typ je pro lepší čitelnost zjednodušen.

- **Podrobnosti**

  Kromě běžných vlastnstí komponenty podporuje `defineCustomElement()` také speciální vlastností `styles`, která by měla být polem vložených CSS řetězců, které poskytují CSS, které by mělo být vloženo do stínového root elementu.

  Návratovou hodnotou je konstruktor custom elementu, který lze zaregistrovat pomocí [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Příklad**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* vlastnosti komponenty */
  })

  // Zaregistruje custom element.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Viz také:**

  - [Průvodce - Vytváření custom elementů s Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Také si všimněte, že `defineCustomElement()` vyžaduje [speciální konfiguraci](/guide/extras/web-components#sfc-as-custom-element), pokud se používá se Single-File komponentami (SFC).
