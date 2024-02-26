# Options API: Lifecycle hooks {#options-lifecycle}

:::info Viz také
Pro sdílené použití Lifecycle hooks se podívejte na [Průvodce - Lifecycle hooks](/guide/essentials/lifecycle)
:::

## beforeCreate {#beforecreate}

Voláno při inicializaci instance.

- **Typ**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **Podrobnosti**

  Voláno okamžitě po inicializaci instance a po vyřešení (resolve) vlastností (props).
  
  Až po této metodě proběhne definice reaktivních proměnných pro vlastnosti a nastavení prvků stavu jako jsou `data()` nebo `computed`.

  Pamatujte, že `setup()` hook z Composition API je volán před jakýmkoli hookem Options API, včetně `beforeCreate()`.

## created {#created}

Voláno poté, co instance dokončila zpracování všech možností (options) souvisejících se stavem.

- **Typ**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **Podrobnosti**

  Když je volán tento hook, bylo nastaveno následující: reaktivní data, computed proměnné, funkce a watchery. Fáze připojování (mount) však ještě nezačala a vlastnost `$el` ještě nebude k dispozici.

## beforeMount {#beforemount}

Voláno těsně před připojením (mount) komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **Podrobnosti**

  Když je tento hook volán, komponenta dokončila nastavení svého reaktivního stavu, ale ještě nebyly vytvořeny žádné DOM elementy. Je připravena poprvé provést svůj DOM vykreslovací efekt.

  **Tento hook není volán během vykreslování na serveru (SSR).**

## mounted {#mounted}

Voláno poté, co byla komponenta připojena.

- **Typ**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **Podrobnosti**

  Komponenta je považována za připojenou poté, co:

  - Byly připojeny všechny její synchronní komponenty potomků (neplatí pro asynchronní komponenty nebo komponenty uvnitř `<Suspense>` hierarchie).

  - Byl vytvořen její vlastní DOM a vložen do rodičovského kontejneru. Všimněte si, že to zaručuje, že DOM komponenty je v dokumentu pouze tehdy, pokud je v dokumentu také root kontejner aplikace.

Tento hook se typicky používá pro provádění vedlejších efektů, které potřebují přístup k vykreslenému DOM komponenty, nebo pro omezení kódu souvisejícího s DOM na klientovi v [aplikaci vykreslené na serveru](/guide/scaling-up/ssr).

**Tento hook není volán během vykreslování na serveru (SSR).**

## beforeUpdate {#beforeupdate}

Voláno před tím, než se komponenta chystá aktualizovat svůj DOM strom kvůli změně reaktivního stavu.

- **Typ**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **Detaily**

  Tento hook lze použít k přístupu ke stavu DOM předtím, než ho Vue aktualizuje. V tomto hooku je také bezpečné upravovat stav komponenty.

  **Tento hook není volán během vykreslování na serveru (SSR).**

## updated {#updated}

Voláno poté, co komponenta aktualizovala svůj DOM strom kvůli změně reaktivního stavu.

- **Typ**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **Detaily**

  Hook `updated` nadřazené komponenty se volá až po `updated` komponent potomků.

  Tento hook se volá po každé aktualizaci DOM komponenty, která může být způsobena různými změnami stavu, protože z důvodu optimalizace výkonu může být více změn stavu seskupeno do jednoho vykreslovací cyklu. Pokud potřebujete přistupovat k aktualizovanému DOM po konkrétní změně stavu, použijte místo toho [nextTick()](/api/general#nexttick).

  **Tento hook není volán během vykreslování na serveru (SSR).**

  :::warning
  V hooku `updated` neměňte stav komponenty - to pravděpodobně povede k nekonečné smyčce aktualizací!
  :::

## beforeUnmount {#beforeunmount}

Voláno před odstraněním instance komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **Detaily**

  Když je tento hook volán, instance komponenty je stále plně funkční.

  **Tento hook není volán během vykreslování na serveru (SSR).**

## unmounted {#unmounted}

Voláno poté, co byla komponenta odstraněna.

- **Typ**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **Podrobnosti**

  Komponenta je považována za odstraněnou poté, co:

  - Byly odstraněny všechny její podřízené komponenty.

  - Byly zastaveny všechny asociované reaktivní efekty (efekt vykreslování a computed proměnné / watchery vytvořené během `setup()`) 

  Použijte tento hook k ručnímu čištění vytvořených vedlejších efektů, jako jsou časovače, DOM event listenery nebo serverová připojení.

  **Tento hook není volán během vykreslování na serveru (SSR).**

## errorCaptured {#errorcaptured}

Voláno, když byla zachycena chyba propagující se z komponenty potomka.

- **Typ**

  ```ts
  interface ComponentOptions {
    errorCaptured?(
      this: ComponentPublicInstance,
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ): boolean | void
  }
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
  V produkčním prostředí bude třetí parametr (`info`) zkrácený kód místo kompletního řetězce s informací. Na mapování kódů na texty se můžete podívat do [Reference chybových kódů v produkci](/error-reference/#runtime-errors).
  :::

  Pro zobrazení stavu chyby uživateli můžete upravit stav komponenty v `errorCaptured()`. Je však důležité, aby stav chyby nevykresloval původní obsah, který způsobil chybu; jinak bude komponenta vržena do nekonečné smyčky vykreslování.

  Hook může vrátit `false`, aby zastavil další propagaci chyby. Podrobnosti o propagaci chyb naleznete níže.

  **Pravidla propagace chyb**

  - Ve výchozím nastavení jsou všechny chyby stále odesílány až na úroveň aplikace do [`app.config.errorHandler`](/api/application#app-config-errorhandler), pokud je definován, aby mohly být tyto chyby stále hlášeny do analytické služby na jednom místě.

  - Pokud existuje více `errorCaptured` hooks v hierarchii dědičnosti komponenty nebo hierarchii rodičů, všechny budou volány se stejnou chybou, v pořadí odspodu nahoru. To je podobné mechanismu probublávání nativních DOM událostí.

  - Pokud `errorCaptured` hook sám vyvolá chybu, tato chyba a původní zachycená chyba jsou odeslány do `app.config.errorHandler`.

  - Hook `errorCaptured` může vrátit `false`, aby zabránil propagaci chyby dále. To v podstatě znamená "tato chyba byla zpracována a měla by být ignorována." Pro tuto chybu to zabrání volání dalších `errorCaptured` hooks nebo `app.config.errorHandler`.

## renderTracked <sup class="vt-badge dev-only" /> {#rendertracked}

Voláno, když je reaktivní závislost sledována vykreslovacím efektem komponenty.

**Tento hook se volá pouze v režimu vývoje (dev) a není volán během vykreslování na serveru (SSR).**

- **Typ**

  ```ts
  interface ComponentOptions {
    renderTracked?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Viz také:** [Reaktivita podrobně](/guide/extras/reactivity-in-depth)

## renderTriggered <sup class="vt-badge dev-only" /> {#rendertriggered}

Voláno, když reaktivní závislost vyvolá nové spuštění vykreslovacího efektu komponenty.

**Tento hook se volá pouze v režimu vývoje (dev) a není volán během vykreslování na serveru (SSR).**

- **Typ**

  ```ts
  interface ComponentOptions {
    renderTriggered?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

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

## activated {#activated}

Voláno poté, co je instance komponenty vložena do DOM coby součást stromu uloženého pomocí [`<KeepAlive>`](/api/built-in-components#keepalive).

**Tento hook není volán během vykreslování na serveru (SSR).**

- **Typ**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **Viz také:** [Průvodce - Životní cyklus cached instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## deactivated {#deactivated}

Voláno poté, co je instance komponenty odebrána z DOM coby součást stromu uloženého pomocí [`<KeepAlive>`](/api/built-in-components#keepalive).

**Tento hook není volán během vykreslování na serveru (SSR).**

- **Typ**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **Viz také:** [Průvodce - Životní cyklus cached instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## serverPrefetch <sup class="vt-badge" data-text="Pouze SSR" /> {#serverprefetch}

Asynchronní funkce, která se vyhodnotí před vykreslením instance komponenty na serveru.

- **Typ**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **Podrobnosti**

  Pokud callback vrátí Promise, server počká, dokud se Promise nevyřeší, než vykreslí komponentu.

  Tento hook se volá pouze během vykreslování na serveru (SSR) a může být použit pro načítání dat pouze na serveru.

- **Příklad**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // komponenta je vykreslena jako součást výcozího požadavku
      // data se načítají na serveru, protože to je rychlejší než na klientovi
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // pokud jsou při připojení data null, znamená to, že komponenta
        // je dynamicky vykreslena na klientovi
        // proto načíst data na klientovi
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **Viz také:** [Server-Side Rendering](/guide/scaling-up/ssr)
