# Composition API: Lifecycle hooks {#composition-api-lifecycle-hooks}

:::info Poznámka k použití
Všechny API funkce uvedené na této stránce musí být volány synchronně během `setup()` fáze komponenty. Pro více informací se podívejte na [Průvodce - Lifecycle Hooks](/guide/essentials/lifecycle).
:::

## onMounted() {#onmounted}

Registruje callback, který se volá po připojení komponenty.

- **Typ**

  ```ts
  function onMounted(callback: () => void): void
  ```

- **Detaily**

  Komponenta je považována za připojenou poté, co:

  - Byly připojeny všechny její synchronní komponenty potomků (neplatí pro asynchronní komponenty nebo komponenty uvnitř `<Suspense>` hierarchie).

  - Byl vytvořen její vlastní DOM a vložen do rodičovského kontejneru. Všimněte si, že to zaručuje, že DOM komponenty je v dokumentu pouze tehdy, pokud je v dokumentu také root kontejner aplikace.

  Tento hook se typicky používá pro provádění vedlejších efektů, které potřebují přístup k vykreslenému DOM komponenty, nebo pro omezení kódu souvisejícího s DOM na klientovi v [aplikaci vykreslené na serveru](/guide/scaling-up/ssr).

  **Tento hook není volán během vykreslování na serveru (SSR).**

- **Příklad**

  Přístup k elementu pomocí template ref:

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## onUpdated() {#onupdated}

Registruje callback, který se volá poté, co komponenta aktualizuje svůj DOM v důsledku změny reaktivního stavu.

- **Typ**

  ```ts
  function onUpdated(callback: () => void): void
  ```

- **Detaily**

  Hook `updated` nadřazené komponenty se volá až po `updated` komponent potomků.

  Tento hook se volá po každé aktualizaci DOM komponenty, která může být způsobena různými změnami stavu, protože z důvodu optimalizace výkonu může být více změn stavu seskupeno do jednoho vykreslovací cyklu. Pokud potřebujete přistupovat k aktualizovanému DOM po konkrétní změně stavu, použijte místo toho [nextTick()](/api/general#nexttick).

**Tento hook není volán během vykreslování na serveru (SSR).**

:::warning
 V hooku `updated` neměňte stav komponenty - to pravděpodobně povede k nekonečné smyčce aktualizací!
:::

- **Příklad**

  Přístup k aktualizovanému DOM:

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // textový obsah by měl být stejný jako aktuální `count.value`
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## onUnmounted() {#onunmounted}

Registruje callback, který se zavolá po odstranění komponenty.

- **Typ**

  ```ts
  function onUnmounted(callback: () => void): void
  ```

- **Detaily**

  Komponenta je považována za odstraněnou poté, co:

  - Byly odstraněny všechny její podřízené komponenty.

  - Byly zastaveny všechny asociované reaktivní efekty (efekt vykreslování a computed proměnné / watchery vytvořené během `setup()`) 

  Použijte tento hook k ručnímu čištění vytvořených vedlejších efektů, jako jsou časovače, DOM event listenery nebo serverová připojení.

  **Tento hook není volán během vykreslování na serveru (SSR).**

- **Příklad**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## onBeforeMount() {#onbeforemount}

Registruje callback, který se zavolá před tím, než se má komponenta připojit.

- **Typ**

  ```ts
  function onBeforeMount(callback: () => void): void
  ```

- **Detaily**

  Když je tento hook zavolán, komponenta dokončila nastavení svého reaktivního stavu, ale ještě nebyly vytvořeny žádné DOM elementy. Je připravena poprvé vykonat svůj efekt pro vykreslování DOM.

  **Tento hook není volán během vykreslování na serveru (SSR).**

## onBeforeUpdate() {#onbeforeupdate}

Registruje callback, který se zavolá před tím, než se komponenta chystá aktualizovat svůj DOM kvůli změně reaktivního stavu.

- **Typ**

  ```ts
  function onBeforeUpdate(callback: () => void): void
  ```

- **Podrobnosti**

  Tento hook lze použít k přístupu ke stavu DOM před aktualizací DOM Vue. Je také bezpečné upravovat stav komponenty uvnitř tohoto hooku.

  **Tento hook není volán během vykreslování na serveru (SSR).**

## onBeforeUnmount() {#onbeforeunmount}

Registruje hook, který se má volat před odstraněním instance komponenty.

- **Typ**

  ```ts
  function onBeforeUnmount(callback: () => void): void
  ```

- **Podrobnosti**

  Když je tento hook zavolán, instance komponenty je stále plně funkční.

  **Tento hook není volán během vykreslování na serveru (SSR).**

## onErrorCaptured() {#onerrorcaptured}

Registruje callback, který se má volat, když je zachycena chyba propagující se z komponenty potomka.

- **Typ**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **Podrobnosti**

  Chyby lze zachytit z následujících zdrojů:

  - Vykreslování komponenty
  - Obsluha událostí
  - Lifecycle hooks
  - Funkce `setup()`
  - Watchery
  - Custom directive hooks
  - Transition hooks

  Hook dostává tři argumenty: chybu, instanci komponenty, která chybu vyvolala, a řetězec s informací, která specifikuje typ zdroje chyby.

  :::tip
  V produkčním prostředí bude třetí parametr (`info`) zkrácený kód místo kompletního řetězce s informací. Na mapování kódů na texty se můžete podívat do [Reference pro produkční chybové kódy](/error-reference/#runtime-errors).
  :::

  Pro zobrazení stavu chyby uživateli můžete upravit stav komponenty v `errorCaptured()`. Je však důležité, aby stav chyby nevykresloval původní obsah, který způsobil chybu; jinak bude komponenta vržena do nekonečné smyčky vykreslování.

  Hook může vrátit `false`, aby zastavil další propagaci chyby. Podrobnosti o propagaci chyb naleznete níže.

  **Pravidla propagace chyb**

  - Ve výchozím nastavení jsou všechny chyby stále odesílány až na úroveň aplikace do [`app.config.errorHandler`](/api/application#app-config-errorhandler), pokud je definován, aby mohly být tyto chyby stále hlášeny do analytické služby na jednom místě.

  - Pokud existuje více `errorCaptured` hooks v hierarchii dědičnosti komponenty nebo hierarchii rodičů, všechny budou volány se stejnou chybou, v pořadí odspodu nahoru. To je podobné mechanismu probublávání nativních DOM událostí.

  - Pokud `errorCaptured` hook sám vyvolá chybu, tato chyba a původní zachycená chyba jsou odeslány do `app.config.errorHandler`.

  - Hook `errorCaptured` může vrátit `false`, aby zabránil propagaci chyby dále. To v podstatě znamená "tato chyba byla zpracována a měla by být ignorována." Pro tuto chybu to zabrání volání dalších `errorCaptured` hooks nebo `app.config.errorHandler`.

## onRenderTracked() <sup class="vt-badge dev-only" /> {#onrendertracked}

Registruje debug hook, který je zavolán, když byla reaktivní závislost sledována vykreslovacím efektem komponenty.

**Tento hook se volá pouze v režimu vývoje (dev) a není volán během vykreslování na serveru (SSR).**

- **Typ**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Viz také:** [Reaktivita podrobně](/guide/extras/reactivity-in-depth)

## onRenderTriggered() <sup class="vt-badge dev-only" /> {#onrendertriggered}

Registruje debug hook, který se volá, když reaktivní závislost vyvolá nové spuštění vykreslovacího efektu komponenty.

**Tento hook se volá pouze v režimu vývoje (dev) a není volán během vykreslování na serveru (SSR).**

- **Typ**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **Viz také:** [Reaktivita podrobně](/guide/extras/reactivity-in-depth)

## onActivated() {#onactivated}

Registruje callback, který se zavolá poté, co je instance komponenty vložena do DOM coby součást stromu uloženého pomocí [`<KeepAlive>`](/api/built-in-components#keepalive).

**Tento hook není volán během vykreslování na serveru (SSR).**

- **Typ**

  ```ts
  function onActivated(callback: () => void): void
  ```

- **Viz také:** [Průvodce - Životní cyklus cached instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onDeactivated() {#ondeactivated}

Registruje callback, který se zavolá poté, co je instance komponenty odebrána z DOM coby součást stromu uloženého pomocí [`<KeepAlive>`](/api/built-in-components#keepalive).

**Tento hook není volán během vykreslování na serveru (SSR).**

- **Typ**

  ```ts
  function onDeactivated(callback: () => void): void
  ```

- **Viz také:** [Průvodce - Životní cyklus cached instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onServerPrefetch() <sup class="vt-badge" data-text="Pouze SSR" /> {#onserverprefetch}

Registruje asynchronní funkci, která se vyhodnotí před vykreslením instance komponenty na serveru.

- **Typ**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **Detaily**

  Pokud callback vrátí Promise, server počká, dokud se Promise nevyřeší, než vykreslí komponentu.

  Tento hook se volá pouze během vykreslování na serveru (SSR) a může být použit pro načítání dat pouze na serveru.

- **Příklad**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // komponenta je vykreslena jako součást výcozího požadavku
    // data se načítají na serveru, protože to je rychlejší než na klientovi
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // pokud jsou při připojení data null, znamená to, že komponenta
      // je dynamicky vykreslena na klientovi
      // proto načíst data na klientovi
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **See also:** [Server-Side Rendering](/guide/scaling-up/ssr)
