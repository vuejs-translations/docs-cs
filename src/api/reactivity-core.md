# Reactivity API: Core {#reactivity-api-core}

:::info Viz také
Pro lepší porozumění Reactivity API je doporučeno přečíst následující kapitoly v průvodci:

- [Základy reaktivity](/guide/essentials/reactivity-fundamentals) (s preferencí API nastavenou na Composition API)
- [Reaktivita podrobně](/guide/extras/reactivity-in-depth)
:::


## ref() {#ref}

Přijímá vnitřní hodnotu a vrací reaktivní a měnitelný objekt ref s jedinou vlastností `.value`, která odkazuje na vnitřní hodnotu.

- **Typ**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **Podrobnosti**

  Objekt ref je měnitelný - tj. můžete do `.value` přiřadit nové hodnoty. Je také reaktivní – tj. všechny operace čtení `.value` jsou sledovány a operace zápisu spustí příslušné efekty.

  Pokud je jako hodnota ref přiřazen objekt, objekt je hluboce (deep) reaktivní pomocí [reactive()](#reactive). To také znamená, že pokud objekt obsahuje vnořené ref, budou hluboce rozbaleny.

  Pokud se potřebujete výchozímu „deep“ chování vyhnout, použijte místo toho [`shallowRef()`](./reactivity-advanced#shallowref).

- **Příklad**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **Viz také**
  - [Průvodce – Základy reaktivity – `ref()`](/guide/essentials/reactivity-fundamentals#ref)
  - [Průvodce – Typování `ref()`](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />


## computed() {#computed}

Přijímá [getter funkci](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) a vrací reaktivní objekt [ref](#ref) pouze pro čtení s vnitřní hodnotu vrácenou z getteru. Může také přijmout objekt s funkcemi `get` a `set` pro vytvoření zapisovatelného objektu ref.

- **Typ**

  ```ts
  // pouze pro čtení
  function computed<T>(
    getter: (oldValue: T | undefined) => T,
    // viz odkaz "Ladění computed proměnných" níže
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // zapisovatelný
  function computed<T>(
    options: {
      get: (oldValue: T | undefined) => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **Příklad**

  Vytvoření computed ref určeného pouze pro čtení:

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // chyba
  ```

  Vytvoření zapisovatelného computed ref:

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  Ladění:

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Viz také:**
  - [Průvodce – Computed proměnné](/guide/essentials/computed)
  - [Průvodce – Ladění computed proměnných](/guide/extras/reactivity-in-depth#computed-debugging)
  - [Průvodce – Typování `computed()`](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />
  - [Průvodce – Výkon – Stabilita computed proměnných](/guide/best-practices/performance#computed-stability)

## reactive() {#reactive}

Vrátí reaktivní proxy objektu.

- **Typ**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **Detaily**

  Reaktivní konverze je hluboká (deep): ovlivňuje všechny vnořené vlastnosti. Reaktivní objekt také hluboce rozbaluje jakékoli vlastnosti, které jsou [refs](#ref), a zároveň udržuje reaktivitu.

  Je třeba také poznamenat, že rozbalování refs není prováděno, když je ref přistupován jako prvek reaktivního pole nebo nativního typu kolekce, jako je `Map`.

  Pokud se potřebujete výchozímu „deep“ chování vyhnout a udržovat reaktivitu pouze na nejvyšší úrovni objektu, použijte místo toho [shallowReactive()](./reactivity-advanced#shallowreactive).

  Vrácený objekt a jeho vnořené objekty jsou obaleny [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) a **nejsou** rovny původním objektům. Doporučuje se pracovat výhradně s reaktivní proxy a nespoléhat se na původní objekt.

- **Příklad**

  Vytvoření reaktivního objektu:

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  Rozbalení ref (unwrapping):

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ref bude rozbalen
  console.log(obj.count === count.value) // true

  // aktualizuje `obj.count`
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // také aktualizuje `count` ref
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

  Všimněte si, že refs **nejsou** rozbaleny při přístupu jako prvek pole nebo kolekce:

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // zde je potřeba .value
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // zde je potřeba .value
  console.log(map.get('count').value)
  ```

  Při přiřazení [ref](#ref) do `reactive` vlastnosti bude tento ref také automaticky rozbalen:

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **Viz také:**
  - [Průvodce – Základy reaktivity](/guide/essentials/reactivity-fundamentals)
  - [Průvodce – Typování `reactive()`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

Přijímá objekt (reaktivní nebo obyčejný) nebo [ref](#ref) a vrací readonly proxy k původnímu objektu.

- **Typ**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **Detaily**

  Readonly proxy je hluboká (deep): jakýkoli přístup k vnořené vlastnosti bude také readonly. Má také stejné chování rozbalování ref jako `reactive()`, s tím rozdílem, že&nbsp;rozbalené hodnoty budou také readonly.

  Pokud se potřebujete výchozímu „deep“ chování vyhnout, použijte místo toho [shallowReadonly()](./reactivity-advanced#shallowreadonly).

- **Příklad**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // funguje pro sledování reaktivity
    console.log(copy.count)
  })

  // změna originálu spustí watchery sledující kopii
  original.count++
  ```

```js
  // změna kopie selže a vyvolá varování
  copy.count++ // varování!
  ```

## watchEffect() {#watcheffect}

Okamžitě spustí funkci a sleduje její závislosti. Funkci v případě změny závislostí spustí znovu.

- **Typ**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): WatchHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // výchozí: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  interface WatchHandle {
    (): void // stejné jako `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Detaily**

  První parametr je funkce, která se má spustit. Tato funkce dostává funkci, kterou lze použít k registraci funkce pro clean-up. Úklidová funkce bude zavolána před dalším spuštěním efektu a může být použita k vyčištění neplatných vedlejších efektů, například čekajícího asynchronního požadavku (viz příklad níže).

  Druhý parametr je nepovinný objekt možností (options), který lze použít k nastavení časování spouštění efektu nebo k ladění závislostí efektu.

  Výchozí chování je spouštět watchery před vykreslením komponenty. Nastavením `flush: 'post'` se watcher odloží až po vykreslení komponenty. Více informací naleznete v [Časování provedení callback funkce](/guide/essentials/watchers#callback-flush-timing). Výjimečně může být nutné spustit watcher okamžitě při změně reaktivní závislosti, například pro zneplatnění mezipaměti (cache). Toho lze dosáhnout pomocí `flush: 'sync'`. Toto nastavení by však mělo být používáno opatrně, protože může vést k problémům s výkonem a konzistencí dat, pokud se současně aktualizuje více vlastností.

  Návratovou hodnotou je ovládací (handle) funkce, kterou lze zavolat k zastavení opětovného spuštění efektu.

- **Příklad**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> zobrazí 0

  count.value++
  // -> zobrazí 1
  ```

  Zastavení sledování:

  ```js
  const stop = watchEffect(() => {})

  // když již není sledování potřeba:
  stop()
  ```

  Pozastavení / obnovení watcheru: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watchEffect(() => {})

  // dočasné pozastavení watcheru
  pause()

  // později znovu spustit
  resume()

  // zastavit
  stop()
  ```

  Čištění vedlejších efektů:

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` bude zavolán, pokud se změní `id`,
    // takže předchozí nevyřízený požadavek bude zrušen
    // pokud ještě nebyl dokončen
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Čištění vedlejších efektů ve Vue 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watchEffect(async () => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` bude zavolán, pokud se změní `id`,
    // takže předchozí nevyřízený požadavek bude zrušen
    // pokud ještě nebyl dokončen
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

  Možnosti:

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Viz také**:
  - [Průvodce – Watchers](/guide/essentials/watchers#watcheffect)
  - [Průvodce – Ladění watcherů](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

Alias pro [`watchEffect()`](#watcheffect) s volbou `flush: 'post'`.

## watchSyncEffect() {#watchsynceffect}

Alias pro [`watchEffect()`](#watcheffect) s volbou `flush: 'sync'`.

## watch() {#watch}

Sleduje jeden nebo více reaktivních datových zdrojů a vyvolá callback, když se zdroje změní.

- **Typ**

  ```ts
  // sledování jednoho zdroje
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): WatchHandle

  // sledování více zdrojů
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): WatchHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | (T extends object ? T : never) // reaktivní objekt

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // výchozí: false
    deep?: boolean | number // výchozí: false
    flush?: 'pre' | 'post' | 'sync' // výchozí: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    once?: boolean // default: false (3.4+)
  }

  interface WatchHandle {
    (): void // stejné jako `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

> Typy jsou pro lepší čitelnost zjednodušeny.

- **Podrobnosti**

  `watch()` je ve výchozím nastavením „lazy“ - tj. callback je volán pouze tehdy, když sledovaný zdroj změní.

  Prvním parametr je **zdroj** watcheru. Zdroj může být jedním z následujících:

  - Getter funkce, která vrací hodnotu
  - Ref
  - Reaktivní objekt
  - ...nebo pole výše uvedených.

  Druhým parametrem je callback, který bude volán při změně zdroje. Callback funkce přijímá tři parametry: novou hodnotu, starou hodnotu a funkci pro cleanup. Callback pro čištění bude volán před dalším spuštěním efektu a může být použit k čištění neplatných vedlejších efektů, např. čekajícího asynchronního požadavku.

  Při sledování více zdrojů přijímá callback dvě pole obsahující nové / staré hodnoty odpovídající zdrojovému poli.

  Třetím volitelným parametrem je objekt možností (options), který podporuje následující volby:

  - **`immediate`**: spustit callback okamžitě při vytvoření watcheru. Stará hodnota bude při prvním volání `undefined`.
  - **`deep`**: vynutit hluboké procházení zdroje, pokud je objektem, takže callback se spustí i při změnách hluboko uvnitř objektu. Od verze 3.5+ je možné zadat také číslo indikující maximální hloubku prohledávání. Viz [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: upravit časování vyvolání callbacku. Viz [Časování provedení callback funkce](/guide/essentials/watchers#callback-flush-timing) a [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: ladit závislosti watcheru. Viz [Ladění watcherů](/guide/extras/reactivity-in-depth#watcher-debugging).
  - **`once`**: (3.4+) spustit callback pouze jednou. Watcher se po dokončení prvního běhu callback funkce automaticky zastaví.

  V porovnání s [`watchEffect()`](#watcheffect) nám `watch()` umožňuje:

  - Provést „lazy“ vedlejší efekt;
  - Být konkrétnější v tom, jaký stav by měl watcher znovu spustit;
  - Přistupovat jak k předchozí, tak k aktuální hodnotě sledovaného stavu.

- **Příklad**

  Sledování getteru:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  Sledování ref:

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  Při sledování více zdrojů přijímá callback pole obsahující nové / staré hodnoty odpovídající zdrojovému poli:

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  Při použití getter zdroje se watcher spustí pouze tehdy, pokud se změní návratová hodnota getteru. Pokud chcete, aby se callback spustil i při změnách hluboko uvnitř objektu, musíte explicitně nastavit watcher do deep režimu pomocí `{ deep: true }`. V&nbsp;hlubokém režimu budou nová a stará hodnota stejný objekt, pokud byl callback spuštěn změnou uvnitř objektu a nikoli změnou hodnoty getteru:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  Při přímém sledování reaktivního objektu je watcher automaticky v deep režimu:

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* spustí se při změně stavu uvnitř objektu */
  })
  ```

  `watch()` sdílí stejné časování provedení callback funkce a možnosti ladění jako [`watchEffect()`](#watcheffect):

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  Zastavení watcheru:

  ```js
  const stop = watch(source, callback)

  // když už watcher není potřeba:
  stop()
  ```

  Pozastavení / obnovení watcheru: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watch(() => {})

  // dočasné pozastavení watcheru
  pause()

  // později znovu spustit
  resume()

  // zastavit
  stop()
  ```

  Čištění vedlejších efektů:

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` bude zavolán, pokud se změní `id`,
    // takže předchozí nevyřízený požadavek bude zrušen
    // pokud ještě nebyl dokončen
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Čištění vedlejších efektů ve Vue 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watch(id, async (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

- **Viz také**:

  - [Průvodce – Watchers](/guide/essentials/watchers)
  - [Průvodce – Ladění watcherů](/guide/extras/reactivity-in-depth#watcher-debugging)

## onWatcherCleanup() <sup class="vt-badge" data-text="3.5+" /> {#onwatchercleanup}

Zaregistruje čistící funkci, která se vykoná, když je aktuální watcher znovu spuštěn. Může být volána pouze při synchronním spuštění `watchEffect` efektu nebo callbacku `watch` funkce (např. ji nelze volat po `await` výrazu uvnitř asynchronní funkce).

- **Typ**

  ```ts
  function onWatcherCleanup(
    cleanupFn: () => void,
    failSilently?: boolean
  ): void
  ```

- **Příklad**

  ```ts
  import { watch, onWatcherCleanup } from 'vue'

  watch(id, (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` se zavolá, když se změní `id`,
    // a zruší předchozí request, pokud ještě nebyl dokončen
    onWatcherCleanup(cancel)
  })
  ```