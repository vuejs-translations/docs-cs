# Composition API: Dependency injection {#composition-api-dependency-injection}

## provide() {#provide}

Poskytuje hodnotu, která může být implementována komponentami potomka.

- **Typ**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Podrobnosti**

  `provide()` přijímá dva parametry: klíč (injection key), kterým může být řetězec nebo symbol, a hodnotu, která má být implementována.

  Při použití TypeScriptu může být klíč symbolem přetypovaným jako `InjectionKey` - typem poskytovaným Vue, který rozšiřuje `Symbol` a který lze použít k synchronizaci typu hodnoty mezi `provide()` a `inject()`.

  Podobně jako u API pro registraci lifecycle hooks musí být `provide()` voláno synchronně během `setup()` fáze komponenty.

- **Příklad**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // poskytnutí statické hodnoty
  provide('path', '/project/')

  // poskytnutí reaktivní hodnoty
  const count = ref(0)
  provide('count', count)

  // poskytnutí s klíčem typu Symbol
  provide(countSymbol, count)
  </script>
  ```

- **Viz také**:
  - [Průvodce - Provide / Inject](/guide/components/provide-inject)
  - [Průvodce - Typování provide / inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

Implementuje hodnotu poskytnutou komponentou předka nebo aplikací (pomocí `app.provide()`).

- **Typ**

  ```ts
  // bez výchozí hodnoty
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // s výchozí hodnotou
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // s tovární funkcí
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Podrobnosti**

  První parametr je klíč pro implementaci (injection key). Vue se bude procházet hierarchií rodičovských komponent, aby našlo poskytovanou hodnotu s&nbsp;odpovídajícím klíčem. Pokud více komponent v hierarchii poskytuje stejný klíč, ten z&nbsp;nejbližší komponenty „překryje“ ty výše v řetězci. Pokud nebyla nalezena žádná hodnota s odpovídajícím klíčem, `inject()` vrátí `undefined`, pokud není poskytnuta výchozí hodnota.

  Druhý parametr je volitelný a jde o výchozí hodnotou, která se použije, pokud nebyla nalezena žádná odpovídající poskytnutá hodnota.

  Druhý parametr může být také tovární funkce, která vrací hodnoty, které jsou nákladné na vytvoření. V tomto případě musí být jako třetí parametr předáno `true` pro indikaci, že by měla být funkce použita jako tovární metoda místo samotné hodnoty.

  Podobně jako u API pro registraci lifecycle hooks, musí být `inject()` voláno synchronně během `setup()` fáze komponenty.

  Při použití TypeScriptu může být klíč typu `InjectionKey` - typu poskytovaného Vue, který rozšiřuje `Symbol` a který lze použít k synchronizaci typu hodnoty mezi `provide()` a `inject()`.

- **Příklad**

  Za předpokladu, že rodičovská komponenta poskytuje hodnoty, jak je ukázáno v&nbsp;předchozím příkladu `provide()`:

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // implementace statické hodnoty bez výchozí hodnoty
  const path = inject('path')

  // implementace reaktivní hodnoty
  const count = inject('count')

  // implementace s použitím klíče typu Symbol
  const count2 = inject(countSymbol)

  // implementace s výchozí hodnotou
  const bar = inject('path', '/default-path')

  // implementace s výchozí hodnotou ve formě funkce
  const fn = inject('function', () => {})

  // implementace s výchozí hodnotou ve formě tovární funkce
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```

- **Viz také**:
  - [Průvodce - Provide / Inject](/guide/components/provide-inject)
  - [Průvodce - Typování provide / inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />


## hasInjectionContext() {#has-injection-context}

- Podporováno až od verze 3.3+

Vrací true, pokud může být funkce [inject()](#inject) použita, aniž by vyvolala varování, že je volána na špatném místě (např. mimo `setup()`). Tato metoda je navržena pro použití v&nbsp;knihovnách, které chtějí používat `inject()` interně bez výpisu varování pro koncové uživatele.

- **Typ**

  ```ts
  function hasInjectionContext(): boolean
  ```
