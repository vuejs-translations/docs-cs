# Aplikační API {#application-api}

## createApp() {#createapp}

Vytvoří instanci aplikace.

- **Typ**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **Podrobnosti**

  První argument je root komponenta. Druhý volitelný argument jsou vlastnosti, které se mají root komponentě předat.

- **Příklad**

  Inline root komponenta:

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* vlastnosti root komponenty */
  })
  ```

  Importovaná root komponenta:

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **Viz také:** [Průvodce - Vytvoření Vue aplikace](/guide/essentials/application)

## createSSRApp() {#createssrapp}

Vytvoří instanci aplikace v režimu [SSR hydratace](/guide/scaling-up/ssr#client-hydration). Použití je zcela totožné jako u `createApp()`.

## app.mount() {#app-mount}

Připojí (mount) instanci aplikace do mateřského elementu.

- **Typ**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **Podrobnosti**

  Argumentem může být buď skutečný DOM element nebo CSS selektor (bude použit první vyhovující element). Vrací instanci root komponenty.

  Pokud má komponenta definovanou šablonu nebo vykreslovací funkci, nahradí všechny existující DOM elementy uvnitř kontejneru. Jinak, pokud je k dispozici runtime kompilátor, bude jako šablona použito `innerHTML` kontejneru.

  V režimu SSR hydratace, provede hydrataci existujících DOM elementů uvnitř kontejneru. Pokud existují [neshody](/guide/scaling-up/ssr#hydration-mismatch), existující DOM elementy budou změněny tak, aby odpovídaly očekávanému výstupu.

  Pro každou instanci aplikace lze `mount()` zavolat pouze jednou.

- **Příklad**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  Lze také připojit ke konkrétnímu DOM elementu:

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount() {#app-unmount}

Odstraní (unmount) připojenou instanci aplikace a spustí 'unmount' lifecycle hooky pro všechny komponenty v aplikačním stromu komponent.

- **Typ**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.component() {#app-component}

Registruje globální komponentu, pokud je zadán jak název, tak definice komponenty, nebo vrátí již registrovanou komponentu, pokud je zadán pouze název.

- **Typ**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **Příklad**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // zaregistrovat objekt vlastností
  app.component('my-component', {
    /* ... */
  })

  // získat již registrovanou komponentu
  const MyComponent = app.component('my-component')
  ```

- **Viz také** [Registrace komponent](/guide/components/registration)

## app.directive() {#app-directive}

Registruje globální vlastní direktivu, pokud je zadán jak název, tak definice direktivy, nebo získá již registrovanou direktivu, pokud je zadán pouze název.

- **Typ**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **Příklad**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // zaregistrovat direktivu (objektová notace)
  app.directive('my-directive', {
    /* vlastní hooks direktivy */
  })

  // zaregistrovat direktivu (zkrácená funkční notace)
  app.directive('my-directive', () => {
    /* ... */
  })

  // získat již registrovanou direktivu
  const myDirective = app.directive('my-directive')
  ```

- **Viz také** [Vlastní direktivy](/guide/reusability/custom-directives)

## app.use() {#app-use}

Nainstaluje [plugin](/guide/reusability/plugins).

- **Typ**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **Detaily**

Očekává plugin jako první argument a volitelně vlastnosti pluginu jako druhý argument.

Plugin může být buď objekt s metodou `install()`, nebo pouze funkce, která bude použita jako metoda `install()`. Vlastnosti (druhý argument `app.use()`) budou do metody `install()` předány.

Když je na stejný plugin voláno `app.use()` vícekrát, plugin bude nainstalován pouze jednou.

- **Příklad**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **Viz také** [Pluginy](/guide/reusability/plugins)

## app.mixin() {#app-mixin}

Použije globální mixin (omezený na aplikaci). Globální mixin aplikuje své obsažené vlastnosti na každou instanci komponenty v aplikaci.

:::warning Nedoporučeno
Mixin jsou ve Vue 3 podporovány hlavně z důvodu zpětné kompatibility kvůli jejich rozsáhlému používání v knihovnách ekosystému. Používání mixinů, zejména globálních, byste se měli ve vlastním kódu aplikace vyhnout.

Pro opakované použití logiky je lepší použít [Composables](/guide/reusability/composables).
:::

- **Typ**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.provide() {#app-provide}

Poskytne hodnotu, která může být vložena (injected) do všech komponent potomků v rámci aplikace.

- **Typ**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **Podrobnosti**

  Očekává 'injection key' jako první a poskytnutou hodnotu jako druhý argument. Vrací instanci aplikace jako takovou.

- **Příklad**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'hello')
  ```

  Uvnitř komponenty v aplikaci:

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'hello'
    }
  }
  ```

</div>
<div class="options-api">

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // 'ahoj'
  }
}
```

</div>

- **See also:**
  - [Provide / Inject](/guide/components/provide-inject)
  - [Provide na úprvni aplikace](/guide/components/provide-inject#app-level-provide)
  - [app.runWithContext()](#app-runwithcontext)

## app.runWithContext()<sup class="vt-badge" data-text="3.3+" /> {#app-runwithcontext}

Spustí callback s aktuální aplikací jako kontextem (injection context).

- **Typ**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **Podrobnosti**

  Očekává callback funkci a okamžitě ji spustí. Během synchronního volání callbacku mohou volání `inject()` vyhledávat hodnoty poskytované v rámci aktuální aplikace, i když momentálně neexistuje žádná aktivní instance komponenty. Návratová hodnota callback funkce bude také vrácena.

- **Příklad**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## app.version {#app-version}

Poskytuje verzi Vue, se kterou byla aplikace vytvořena. To se hodí uvnitř [pluginů](/guide/reusability/plugins), kde můžete potřebovat podmíněnou logiku založenou na různých verzích Vue.

- **Typ**

  ```ts
  interface App {
    version: string
  }
  ```

- **Příklad**

  Kontrola verze uvnitř pluginu:

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('Tento plugin vyžaduje Vue 3')
      }
    }
  }
  ```

- **Viz také:** [Globální API - version](/api/general#version)

## app.config {#app-config}

Každá instance aplikace vystavuje objekt `config`, který obsahuje konfigurační nastavení dané aplikace. Před nasazením vaší aplikace můžete upravit její vlastnosti (dokumentováno níže).

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

Přiřadí globální handler pro nezachycené chyby propagované z aplikace.

- **Typ**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` je informace o Vue chybě,
      // např. ve kterém lifecycle hooku chyba vznikla
      info: string
    ) => void
  }
  ```

- **Podrobnosti**

  Error handler přijímá tři argumenty: objekt chyby, instanci komponenty, která chybu vyvolala, a informační string, který specifikuje typ zdroje chyby.

  Může zachytit chyby z následujících zdrojů:

  - Vykreselení komponenty
  - Event handlery
  - Metody životního cyklu
  - Funkce `setup()`
  - Watchery
  - Vlastní direktivy
  - Transition metody

  :::tip
  V produkčním prostředí bude třetí parametr (`info`) zkrácený kód místo kompletního řetězce s informací. Na mapování kódů na texty se můžete podívat do [Reference chybových kódů v produkci](/error-reference/#runtime-errors).
  :::

- **Příklad**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // zpracování chyby, např. nahlášení službě
  }
  ```

## app.config.warnHandler {#app-config-warnhandler}

Přiřadí vlastní handler pro Vue runtime varování.

- **Typ**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **Podrobnosti**

  Warning handler přijímá jako první argument zprávu varování, jako druhý argument instanci zdrojové komponenty a jako třetí argument trace string.

  Může být použit k odfiltrování konkrétních varování pro snížení množství výpisů do konzole. Všechna Vue varování by měla být řešena během vývoje, takže se použití doporučuje pouze během ladění se zaměřením na jedno konkrétní varování po skončení debuggingu metodu opět odstranit.

  :::tip
  Varování fungují pouze během vývoje, takže tato konfigurace je v produkčním režimu ignorována.
  :::

- **Příklad**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` je trasování hierarchie komponent
  }
  ```

## app.config.performance {#app-config-performance}

Nastavte tuto vlastnost na `true`, abyste povolili sledování výkonu inicializace, kompilace, vykreslování a běhových úprav komponent v panelu výkon/časová osa (performance/timeine) nástroje pro vývojáře (devtools) v prohlížeči. Funguje pouze v režimu vývoje a v prohlížečích, které podporují rozhraní [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

- **Typ:** `boolean`

- **Viz také:** [Průvodce - Výkon](/guide/best-practices/performance)

## app.config.compilerOptions {#app-config-compileroptions}

Runtime konfigurace vlastností překladače. Hodnoty nastavené v tomto objektu budou předány překladači šablon v prohlížeči a ovlivní každou komponentu v konfigurované aplikaci. Poznámka: Tyto možnosti lze také přepsat pro každou komponentu pomocí [volby `compilerOptions`](/api/options-rendering#compileroptions).

::: warning Důležité
Tato možnost konfigurace je možná pouze při použití plného buildu (tj. samostatného `vue.js`, který může v prohlížeči kompilovat šablony). Pokud používáte runtime-only build + build setup, vlastnosti překladače musí být předány do `@vue/compiler-dom` pomocí konfigurace build nástroje.

- Pro `vue-loader`: [předejte pomocí volby `compilerOptions`](https://vue-loader.vuejs.org/options.html#compileroptions). Viz také [jak jej nakonfigurovat v `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- Pro `vite`: [předejte pomocí nastavení `@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
  ::: 

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

Definuje ověřovací metodu pro rozpoznání custom nativních prvků.

- **Typ:** `(tag: string) => boolean`

- **Podrobnosti**

  Metoda by měla vrátit `true`, pokud má být nějaký tag považován za nativní element. Odpovídající tag bude Vue vykreslovat nativně, místo aby se pokoušelo jej zpracovat jako Vue komponentu.

  Nativní HTML a SVG tagy není třeba v této funkci řešit - Vue parser je rozpozná automaticky.

- **Příklad**

  ```js
  // pokládá všechny tagy, které začínají 'ion-', za custom nativní elementy
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **Viz také:** [Vue a Web Components](/guide/extras/web-components)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

Upravuje chování manipulace s mezerami (whitespace) v šablonách.

- **Typ:** `'condense' | 'preserve'`

- **Výchozí hodnota:** `'condense'`

- **Podrobnosti**

  Vue odstraňuje / zhušťuje bílé znaky v šablonách, aby byl vytvořený zkompilovaný výstup efektivnější. Výchozí strategie je "condense" s následujícím chováním:

  1. Počáteční / koncové mezery uvnitř prvku jsou zhuštěny do jedné mezery.
  2. Mezery mezi prvky, které obsahují nové řádky, jsou odstraněny.
  3. Po sobě jdoucí mezery ve textových elementech jsou zhuštěny do jedné mezery.

  Nastavení této možnosti na `'preserve'` zakáže (2) a (3).

- **Příklad**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

Upravuje oddělovače používané pro textovou interpolaci ve šabloně.

- **Typ:** `[string, string]`

- **Výchozí hodnota:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Podrobnosti**

  Toto se typicky používá pro předcházení konfliktům se serverovými frameworky, které také používají "mustache" syntaxi.

- **Příklad**

  ```js
  // Oddělovače změněny na ES6 styl šablon 
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

Upravuje zpracování HTML komentářů ve šablonách.

- **Typ:** `boolean`

- **Výchozí hodnota:** `false`

- **Podrobnosti**

  Ve výchozím nastavení Vue v produkčním prostředí komentáře odstraňuje. Nastavení této možnosti na `true` donutí Vue komentáře zachovávat i pro produkci. Během vývoje jsou komentáře zachovány vždy. Tato možnost se obvykle používá, když je Vue používáno s jinými knihovnami, které na HTML komentáře spoléhají.

- **Příklad**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

Objekt, který může být použit k registraci globálních vlastností, ke kterým lze přistupovat z jakéhokoli instance komponenty v rámci aplikace.

- **Typ**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **Podrobnosti**

  Toto je náhrada za `Vue.prototype` z Vue 2, který již není ve Vue 3 přítomen. Stejně jako cokoliv globálního, by měly být používány střídmě a s rozmyslem.

  Pokud dojde ke konfliktu názvů globální vlastnosti s vlastností komponenty, vlastnost uvnitř komponenty bude mít vyšší prioritu.

- **Použití**

  ```js
  app.config.globalProperties.msg = 'ahoj'
  ```

Umožňí použití `msg` uvnitř kterékoliv šablony a také na `this` libovolné instance komoonenty:

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'ahoj'
    }
  }
  ```

- **Viz také:** [Průvodce - Rozšiřování globálních vlastností](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

Objekt pro definici strategií pro slučování custom vlastností komponenty.

- **Typ**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **Podrobnosti**

  Některé pluginy / knihovny přidávají podporu pro custom vlastnosti komponent (implementací globálních mixinů (mixins)). Tyto vlastnosti mohou vyžadovat speciální logiku pro slučování, když je třeba "sloučit" vlastnost z více zdrojů (např. mixinů nebo dědičnosti komponenty).

  Funkce pro strategii slučování může být pro custom vlastnost zaregistrována jejím přiřazením na objekt `app.config.optionMergeStrategies` s použitím názvu vlastnosti jako klíče.

  Funkce přijímá hodnotu této vlastnosti definovanou na instancích komponenty rodiče a potomka jako první a druhý parametr.

- **Příklad**

  ```js
  const app = createApp({
    // vlastnost z aplikace (self)
    msg: 'Vue',
    // vlastnost z mixinu
    mixins: [
      {
        msg: 'Ahoj '
      }
    ],
    mounted() {
      // sloučené volby vystavené na this.$options
      console.log(this.$options.msg)
    }
  })

  // definování strategie pro sloučení `msg`
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // vypíše 'Ahoj Vue'
  ```

- **Viz také:** [Instance komponenty - `$options`](/api/component-instance#options)
