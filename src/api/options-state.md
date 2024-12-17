# Options API: Stav {#options-state}

## data {#data}

Funkce, která vrací počáteční reaktivní stav pro instanci komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **Podrobnosti**

  Očekává se, že funkce vrátí prostý JavaScript objekt, který následně Vue učiní reaktivním. Po vytvoření instance je možné přistupovat k reaktivnímu datovému objektu přes `this.$data`. Instance komponenty také zajišťuje proxy přístup ke všem vlastnostem nalezeným v datovém objektu, takže `this.a` bude ekvivalentní `this.$data.a`.

  Všechny vlastnosti dat na nejvyšší úrovni musí být zahrnuty ve vráceném datovém objektu. Přidání nových vlastností do `this.$data` je možné, ale **není** doporučeno. Pokud požadovaná hodnota vlastnosti ještě není k dispozici, měla by být jako placeholder zahrnuta prázdná hodnota, jako je `undefined` nebo `null`, aby bylo zajištěno, že se Vue dozví, že vlastnost existuje.

  Vlastnosti, které začínají `_` nebo `$`, **nebudou** mít na instanci komponenty proxy přístup, protože by mohly být v konfliktu s Vue interními vlastnostmi a API metodami. Musíte k nim přistupovat přes `this.$data._vlastnost`.

  **Není** doporučeno vracet objekty se svým vlastním stavovým chováním, jako jsou objekty API prohlížeče a prototypové vlastnosti. Vrácený objekt by měl ideálně být prostý objekt, který pouze reprezentuje stav komponenty.

- **Příklad**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  Mějte na paměti, že pokud s možností `data` používáte arrow funkce, `this` nebude instancí komponenty, ale stále můžete přistupovat k instanci jako k prvnímu parametru funkce:

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **Viz také:** [Reaktivita podrobně](/guide/extras/reactivity-in-depth)

## props {#props}

Deklaruje vlastnosti (props) komponenty.

- **Typ**

```ts
interface ComponentOptions {
  props?: ArrayPropsOptions | ObjectPropsOptions
}

type ArrayPropsOptions = string[]

type ObjectPropsOptions = { [key: string]: Prop }

type Prop<T = any> = PropOptions<T> | PropType<T> | null

interface PropOptions<T> {
  type?: PropType<T>
  required?: boolean
  default?: T | ((rawProps: object) => T)
  validator?: (value: unknown, rawProps: object) => boolean
}

type PropType<T> = { new (): T } | { new (): T }[]
```

> Typy jsou pro lepší čitelnost zjednodušeny.

- **Podrobnosti**

  Ve Vue je třeba všechny vlastnosti komponenty explicitně deklarovat. Vlastnosti komponenty lze deklarovat ve dvou formách:

  - Jednoduchá forma pomocí pole řetězců
  - Plná forma pomocí objektu, kde je každý klíč název vlastnosti a hodnota typ vlastnosti (konstruktorová funkce) nebo pokročilé možnosti (options).

  S objektovou syntaxí může každá vlastnost dále definovat následující vlastnosti:

  - **`type`**: Může být jedním z následujících nativních konstruktorů: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Function`, `Symbol`, libovolná vlastní konstruktorová funkce nebo pole těchto typů. Ve vývojovém (dev) režimu Vue zkontroluje, zda hodnota vlastnosti odpovídá deklarovanému typu, a vyvolá varování, pokud tomu tak není. Pro více informací se podívejte na [Validaci vlastností](/guide/components/props#prop-validation).

    Také pamatujte, že vlastnost s typem `Boolean` ovlivňuje chování přetypování hodnoty jak ve vývojovém, tak ve produkčním režimu. Pro více informací se podívejte se na [Přetypování Boolean](/guide/components/props#boolean-casting).

  - **`default`**: Určuje výchozí hodnotu pro vlastnost, pokud není předána rodičem nebo má hodnotu `undefined`. Výchozí hodnoty objektů nebo polí musí být vráceny pomocí tovární funkce. Tovární funkce také dostává jako parametr objekt s&nbsp;původními vlastnostmi.

  - **`required`**: Určuje, zda je vlastnost povinná. Ve vývojovém prostředí bude vyvoláno varování v konzoli, pokud je tato hodnota pravdivá a vlastnost není předána.

  - **`validator`**: Vlastní validační funkce, která přijímá hodnotu vlastnosti jako jediný parametr. Ve vývojovém režimu bude vyvoláno varování v konzoli, pokud tato funkce vrátí hodnotu, která je nepravdivá (tj. validace selže).

- **Příklad**

  Jednoduchá deklarace:

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  Deklarace objektu s validacemi:

  ```js
  export default {
    props: {
      // kontrola typu
      height: Number,
      // kontrola typu a další validace
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **Viz také:**
  - [Průvodce – Vlastnosti (Props)](/guide/components/props)
  - [Průvodce – Typování vlastností komponenty](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

## computed {#computed}

Deklaruje computed proměnné, které mají být vystaveny na instanci komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **Detaily**

  Tato možnost přijímá objekt, kde klíč je název computed proměnné a hodnota je buď výpočetní getter nebo objekt s metodami `get` a `set` (pro zapisovatelné computed proměnné).

  Všechny gettery a settery mají kontext `this` automaticky vázaný na instanci komponenty.

  Pamatujte, že pokud použijete s computed proměnnou arrow funkci, `this` nebude odkazovat na instanci komponenty, ale stále můžete přistupovat k instanci jako prvnímu parametru funkce:

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **Příklad**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // pouze pro čtení
      aDouble() {
        return this.a * 2
      },
      // zapisovatelné
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2
    }
  }
  ```

- **Viz také:**
  - [Průvodce – Computed proměnné](/guide/essentials/computed)
  - [Průvodce – Typování computed proměnných](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

## methods {#methods}

Deklaruje metody, které budou začleněny do instance komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **Podrobnosti**

  Na deklarované metody lze z instance komponenty přímo přistupovat nebo je používat ve výrazech šablon. Všechny metody mají kontext `this` automaticky vázaný na instanci komponenty, i když jsou předávány.

  Při deklaraci metod se vyhněte používání arrow funkcí, protože nebudou mít přístup k&nbsp;instanci komponenty pomocí `this`.

- **Příklad**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **Viz také:** [Obsluha událostí](/guide/essentials/event-handling)

## watch {#watch}

Deklarujte callbacky pro sledování změn dat.

- **Typ**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // výchozí: false
    deep?: boolean // výchozí: false
    flush?: 'pre' | 'post' | 'sync' // výchozí: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > Typy jsou pro lepší čitelnost zjednodušeny.

- **Podrobnosti**

Možnost `watch` očekává objekt, kde klíče jsou vlastnosti reaktivní instance komponenty, které se mají sledovat (například vlastnosti deklarované pomocí `data` nebo `computed`) - a hodnoty jsou odpovídající callbacky. Callback obdrží novou a starou hodnotu sledovaného zdroje.

Kromě vlastnosti na kořenové úrovni může být klíč také jednoduchá tečkou oddělená cesta, například `a.b.c`. Všimněte si, že toto použití **nepodporuje** složité výrazy, podporovány jsou pouze tečkou oddělené cesty. Pokud potřebujete sledovat složité zdroje dat, použijte imperativní [`$watch()`](/api/component-instance#watch) API.

Hodnota může být také řetězec s názvem metody (deklarované pomocí `methods`) nebo objekt obsahující další možnosti (options). Při použití objektové syntaxe by měl být calback deklarován v poli `handler`. Další možnosti zahrnují:

- **`immediate`**: spustit callback při okamžitě vytvoření watcheru. Stará hodnota bude při prvním volání `undefined`.
- **`deep`**: vynutit hluboký (deep) průchod zdrojem, pokud je to objekt, aby se callback spustil při vnořených změnách. Viz [Deep Watchers](/guide/essentials/watchers#deep-watchers).
- **`flush`**: upravit časování vyvolání callbacku. Viz [Časování provedení callback funkce](/guide/essentials/watchers#callback-flush-timing) a [`watchEffect()`](/api/reactivity-core#watcheffect).
- **`onTrack / onTrigger`**: ladit závislosti watcheru. Viz [Ladění watcherů](/guide/extras/reactivity-in-depth#watcher-debugging).

Při deklarování callbacků pro sledování stavu se vyhněte používání arrow funkcí, protože nebudou mít přístup k instanci komponenty pomocí `this`.

- **Příklad**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // sledování vlastnosti nejvyšší úrovně
      a(val, oldVal) {
        console.log(`nová hodnota: ${val}, stará hodnota: ${oldVal}`)
      },
      // řetězcový název metody
      b: 'someMethod',
      // callback bude vyvolán pokaždé, když se změní libovolná 
      // sledovaná vlastnost objektu bez ohledu na její vnořenou hloubku
      c: {
        handler(val, oldVal) {
          console.log('c se změnilo')
        },
        deep: true
      },
      // sledování jedné vnořené vlastnosti:
      'c.d': function (val, oldVal) {
        // nějaká akce
      },
      // callback bude vyvolán okamžitě po zahájení pozorování
      e: {
        handler(val, oldVal) {
          console.log('e se změnilo')
        },
        immediate: true
      },
      // můžete předat pole callbacků, budou volány postupně
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('spuštěno handle2')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('spuštěno handle3')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b se změnilo')
      },
      handle1() {
        console.log('spuštěno handle1')
      }
    },
    created() {
      this.a = 3 // => nová hodnota: 3, stará hodnota: 1
    }
  }
  ```

- **Viz také:** [Watchers](/guide/essentials/watchers)

## emits {#emits}

Deklaruje vlastní události emitované komponentou.

- **Typ**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **Detaily**

  Emitované události mohou být deklarovány ve dvou formách:

  - Jednoduchá forma pomocí pole řetězců
  - Plná forma pomocí objektu, kde každý klíč je název události a hodnota je buď `null` nebo validační funkce.

  Validní funkce obdrží dodatečné parametry předané voláním `$emit` z komponenty. Například, pokud je zavoláno `this.$emit('foo', 1)`, odpovídající validační funkce pro `foo` obdrží parametr `1`. Validační funkce by měla vrátit boolean hodnotu, která indikuje, zda jsou parametry události platné.

  Všimněte si, že volba `emits` ovlivňuje, které event listenery jsou považovány za event listenery komponenty a nikoli událostí nativního DOMu. Listenery pro deklarované události budou odebrány z objektu `$attrs` komponenty, takže nebudou předávány do root elementu komponenty. Pro více informací se podívejte na [fallthrough atributy](/guide/components/attrs).

- **Příklad**

  Syntaxe pole řetězců:

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  Objektová syntaxe:

  ```js
  export default {
    emits: {
      // žádná validace
      click: null,

      // s validací
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Neplatný payload události submit!`)
          return false
        }
      }
    }
  }
  ```

- **Viz také:**
  - [Průvodce – Fallthrough atributy](/guide/components/attrs)
  - [Průvodce – Typování emitovaných událostí komponenty](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

## expose {#expose}

Deklaruje veřejné vlastnosti, ke kterým má komponenta rodiče přístu, když je instance přistoupena přes template refs.

- **Typ**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **Detaily**

  Ve výchozím nastavení komponenta vystavuje rodiči všechny své vlastnosti, když je přístup k němu získán pomocí `$parent`, `$root` nebo template refs. To může být nežádoucí, protože komponenta pravděpodobně obsahuje interní stav nebo metody, které by měly zůstat soukromé, aby se předešlo přílišnému provazování.

  Možnost `expose` očekává seznam názvů vlastností jako řetězců. Když je volba `expose` použita, budou na veřejné instanci komponenty vystaveny pouze explicitně uvedené vlastnosti.

  `expose` ovlivňuje pouze uživatelem definované vlastnosti, neodfiltruje vestavěné vlastnosti instance komponenty.

- **Příklad**

  ```js
  export default {
    // na veřejné instanci bude dostupná pouze `publicMethod`
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```
