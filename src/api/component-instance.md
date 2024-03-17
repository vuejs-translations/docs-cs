# Instance komponenty {#component-instance}

:::info Poznámka
Tato stránka dokumentuje vestavěné vlastnosti a metody, které jsou přístupné na veřejné instanci komponenty, tj. `this`.

Všechny vlastnosti uvedené na této stránce jsou pouze pro čtení (kromě vnořených vlastností v `$data`).
:::

## $data {#data}

Objekt vrácený ze sekce [`data`](./options-state#data), který komponenta činí reaktivní. Instance komponenty zajišťuje proxy přístup k vlastnostem na svém objektu data.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

Objekt představující aktuální, vyřešené vlastnosti (props) komponenty.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Podrobnosti**

  Budou zahrnuty pouze vlastnosti deklarované pomocí sekce [`props`](./options-state#props). Instance komponenty zajišťuje proxy přístup k vlastnostem na svém objektu props.

## $el {#el}

Root DOM element, který instance komponenty spravuje.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $el: Node | undefined
  }
  ```

- **Podrobnosti**

  `$el` bude `undefined` až do doby, než je komponenta [připojena (mounted)](./options-lifecycle#mounted).

  - Pro komponenty s jedním root elementem bude `$el` odkazovat na tento element.
  - Pro komponenty s textovým rootem bude `$el` odkazovat na textový element.
  - Pro komponenty s více root elementy bude `$el` představovat zástupný DOM element, který Vue používá k udržování pozice komponenty v DOM (textový element nebo komentářový element v režimu SSR hydratace).

  :::tip
  Pro konzistenci se pro přímý přístup k elementům doporučuje používat [template refs](/guide/essentials/template-refs) místo spoléhání na `$el`.
  :::

## $options {#options}

Vyřešené možnosti (options) komponenty použité pro vytvoření aktuální instance komponenty.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Podrobnosti**

  Objekt `$options` poskytuje vyřešené možnosti pro aktuální komponentu a je výsledkem sloučení těchto možných zdrojů:

  - Globální mixins
  - Základ `extends` komponenty
  - Mixins komponenty

  Obvykle se používá k podpoře custom options komponent:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **Viz také:** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

Instance rodičovské komponenty, pokud ji aktuální instance má. Pro root instanci bude hodnota `null`.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

Instance root komponenty aktuálního stromu komponent. Pokud aktuální instance nemá rodiče, bude v této hodnota odkazovat na sebe sama.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

Objekt představující [sloty (slots)](/guide/components/slots), které předala komponenta rodiče.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Podrobnosti**

  Obvykle se používá při ručním vytváření [funkcí pro vykreslení](/guide/extras/render-function), ale může se také použít k detekci přítomnosti slotu.

  Každý slot je vystaven na `this.$slots` jako funkce, která vrací pole VNodes pod klíčem odpovídajícím názvu slotu. Výchozí slot je přístupný jako `this.$slots.default`.

  Pokud je to [scoped slot](/guide/components/slots#scoped-slots), jsou parametry předané do slotových funkcí dostupné jako slot props.

- **Viz také:** [Funkce pro vykreslení - Vykreslení slotů](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

Objekt DOM elementů a instancí komponent, registrovaných pomocí [template refs](/guide/essentials/template-refs).

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **Viz také:**

  - [Template refs](/guide/essentials/template-refs)
  - [Vestavěné speciální atributy - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

Objekt obsahující atributy komponentu, které se předávají dále (fallthrough atributy).

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Podrobnosti**

  [Fallthrough atributy](/guide/components/attrs) jsou atributy a event handlery předávané rodičovskou komponentou, které nejsou v potomkovi deklarovány jako vlastnosti (props) nebo emitované události (emits).

  Ve výchozím nastavení se všechny atributy v `$attrs` automaticky zdědí na root elementu komponenty, pokud je root element pouze jeden. Toto chování je vypnuto, pokud má komponenta více root elementů, a může být explicitně zakázáno pomocí volby [`inheritAttrs`](./options-misc#inheritattrs).

- **Viz také:**

  - [Fallthrough atributy](/guide/components/attrs)

## $watch() {#watch}

Imperativní API pro vytváření watcherů.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // výchozí: false
    deep?: boolean // výchozí: false
    flush?: 'pre' | 'post' | 'sync' // výchozí: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Podrobnosti**

  Prvním parametrem je zdroj watcheru. Může to být název vlastnosti komponenty jako řetězec, jednoduchý řetězec oddělený tečkami nebo getter funkce.

  Druhým parametrem je callback funkce. Callback dostává novou a starou hodnotu sledovaného zdroje.

  - **`immediate`**: spustit callback při okamžitě vytvoření watcheru. Stará hodnota bude při prvním volání `undefined`.
  - **`deep`**: vynutit hluboký průchod zdrojem, pokud je to objekt, aby se callback spustil při vnořených změnách. Viz [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: upravit časování vyvolání callbacku. Viz [Časování provedení callback funkce](/guide/essentials/watchers#callback-flush-timing) a [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: ladit závislosti watcheru. Viz [Debugging watcherů](/guide/extras/reactivity-in-depth#watcher-debugging).

- **Příklad**

  Sledování názvu vlastnosti:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Sledování cesty oddělené tečkami:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Použití getteru pro složitější výrazy:

  ```js
  this.$watch(
    // pokaždé, když výraz `this.a + this.b` vrátí
    // jiný výsledek, bude zavolán handler.
    // Je to jako bychom sledovali computed proměnnou
    // bez definování ji samotné.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Zastavení watcheru:

  ```js
  const unwatch = this.$watch('a', cb)

  // později...
  unwatch()
  ```

- **Viz také:**
  - [Options - `watch`](/api/options-state#watch)
  - [Průvodce - Watchers](/guide/essentials/watchers)

## $emit() {#emit}

Spustí vlastní událost na aktuální instanci. Jakékoli další parametry budou předány do callbacku listeneru.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **Příklad**

  ```js
  export default {
    created() {
      // pouze událost
      this.$emit('foo')
      // s dalšími parametry
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **Viz také:**

  - [Události komponent](/guide/components/events)
  - [Options - `emits`](./options-state#emits)

## $forceUpdate() {#forceupdate}

Vynutí překreslení instance komponenty.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Podrobnosti**

  Mělo by být potřeba jen zřídka, díky plně automatickému reaktivnímu systému Vue. Jediné případy, kdy byste to mohli potřebovat, jsou ty, kdy jste explicitně vytvořili ne-reaktivní stav komponenty pomocí pokročilých funkcí Reactivity API.

## $nextTick() {#nexttick}

Verze metody [`nextTick()`](./general#nexttick) vázaná na instanci.

- **Typ**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **Podrobnosti**

  Jediný rozdíl oproti globální verzi `nextTick()` je, že callback předaný `this.$nextTick()` bude mít svůj kontext `this` vázaný na aktuální instanci komponenty.

- **Viz také:** [`nextTick()`](./general#nexttick)
