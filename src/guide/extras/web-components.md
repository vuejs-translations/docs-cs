# Vue a Web Components {#vue-and-web-components}

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) je obecný termín pro sadu nativních webových API, které umožňují vývojářům vytvářet vlastní znovupoužitelné custom elementy.

Považujeme Vue a Web Components především za doplňkové technologie. Vue má vynikající podporu jak pro konzumaci, tak pro vytváření custom elementů. Bez ohledu na to, zda integrujete vlastní prvky do existující Vue aplikace, nebo používáte Vue k&nbsp;jejich vytváření a distribuci, jste ve správné společnosti.

## Použití custom elementů ve Vue {#using-custom-elements-in-vue}

Vue [dosahuje v testech Custom Elements Everywhere perfektního skóre 100 %](https://custom-elements-everywhere.com/libraries/vue/results/results.html). Konzumace custom elementů uvnitř Vue aplikace funguje v podstatě stejně jako používání nativních HTML elementů s několika záležitostmi, na které je třeba pamatovat:

### Přeskočení řešení komponent {#skipping-component-resolution}

Ve výchozím nastavení se Vue pokusí vyřešit neregistrovaný HTML tag jako registrovanou Vue komponentu, než se vrátí k vykreslení custom elementu. To způsobí, že Vue během vývoje vyvolá varování „failed to resolve component“. Abychom Vue řekli, že určité tagy by měly být považovány za custom elementy a přeskočit řešení komponent, můžeme specifikovat volbu [`compilerOptions.isCustomElement`](/api/application#app-config-compileroptions).

Pokud používáte Vue s nastavením pro build fázi, volba by měla být předána pomocí konfigurace buildu, protože se jedná o volbu kompilace.

#### Příklad konfigurace v prohlížeči {#example-in-browser-config}

```js
// Funguje pouze při použití kompilace v prohlížeči.
// Pokud používáte build nástroje, podívejte se na příklady konfigurace níže.
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Příklad konfigurace Vite {#example-vite-config}

```js [vite.config.js]
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // považovat všechny tagy s pomlčkou za custom elementy
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Příklad konfigurace Vue CLI {#example-vue-cli-config}

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // považovat jakýkoli tag, který začíná na ion- jako custom element
          isCustomElement: (tag) => tag.startsWith('ion-')
        }
      }))
  }
}
```

### Předávání vlastností DOM {#passing-dom-properties}

Protože atributy DOM mohou být pouze řetězce, musíme složitá data custom elementů předávat jako vlastnosti DOM. Při nastavování vlastností (props) na custom elementu Vue 3 automaticky kontroluje přítomnost vlastnosti DOM pomocí operátoru `in` a&nbsp;upřednostňuje nastavení hodnoty jako vlastnosti DOM, pokud je klíč přítomen. To znamená, že ve většině případů se o to nemusíte starat, pokud custom element dodržuje [doporučené postupy](https://web.dev/custom-elements-best-practices/).

Nicméně mohou existovat vzácné případy, kdy musí být data předána jako vlastnost DOM, ale custom element nedefinuje/neodráží vlastnost správně (což způsobuje selhání kontroly `in`). V tomto případě můžete vynutit vazbu `v-bind` jako vlastnost DOM pomocí modifikátoru `.prop`:

```vue-html
<my-element :user.prop="{ jmeno: 'jack' }"></my-element>

<!-- zkrácený ekvivalent -->
<my-element .user="{ jmeno: 'jack' }"></my-element>
```

## Vytváření custom elementů s Vue {#building-custom-elements-with-vue}

Hlavní výhodou custom elementů je, že je lze použít s libovolným frameworkem nebo dokonce bez frameworku. To je ideální pro distribuci komponent, kde konečný uživatel nemusí používat stejný frontendový stack nebo když chcete oddělit koncovou aplikaci od implementačních detailů použitých komponent.

### defineCustomElement {#definecustomelement}

Vue podporuje vytváření custom elementů pomocí přesně stejných API pro Vue komponenty pomocí metody [`defineCustomElement`](/api/custom-elements#definecustomelement). Metoda přijímá stejný parametr jako [`defineComponent`](/api/general#definecomponent), ale místo komponenty vrací konstruktor custom elementu, který rozšiřuje `HTMLElement`:

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // standardní možnosti (options) Vue komponenty
  props: {},
  emits: {},
  template: `...`,

  // pouze pro defineCustomElement: CSS, které bude vloženo do shadow root
  styles: [`/* vložené CSS */`]
})

// Zaregistrovat custom element.
// Po registraci budou všechny tagy `<my-vue-element>`
// na stránce aktualizovány.
customElements.define('my-vue-element', MyVueElement)

// Můžete také programově vytvořit instanci elementu:
// (lze provést pouze po registraci)
document.body.appendChild(
  new MyVueElement({
    // počáteční vlastnosti (volitelné)
  })
)
```

#### Životní cyklus {#lifecycle}

- Custom element Vue vytvoří interní instanci Vue komponenty uvnitř svého shadow root, když je poprvé zavolána jeho metoda [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks).

- Když je na elementu zavolána metoda `disconnectedCallback`, Vue v příštím mikro-cyklu (microtask tick) zkontroluje, zda je element z dokumentu odpojen.

  - Pokud je element stále v dokumentu, jedná se o přesun a instance komponenty bude zachována;

  - Pokud je element z dokumentu odpojen, jedná se o odstranění a instance komponenty bude odpojena (unmounted).

#### Vlastnosti (props) {#props}

- Všechny vlastnosti deklarované pomocí sekce `props` budou na custom elementu definovány jako vlastnosti (properties). Vue automaticky zajišťuje reflexi mezi atributy/vlastnostmi tam, kde to má smysl.

  - Atributy jsou vždy reflektovány na odpovídající vlastnosti.

  - Vlastnosti s primitivními hodnotami (`string`, `boolean` nebo `number`) jsou reflektovány jako atributy.

- Vue také automaticky přetypovává vlastnosti deklarované s typy `Boolean` nebo `Number` na požadovaný typ, když jsou nastaveny jako atributy (které jsou vždy řetězce). Například, při deklaraci následujících vlastností:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

A při použití custom elementu:

```vue-html
<my-element selected index="1"></my-element>
```

Uvnitř komponenty bude `selected` přetypováno na `true` (boolean) and `index` na `1` (number).

#### Události (events) {#events}

Události emitované pomocí `this.$emit` nebo `setup emit` jsou odesílány jako nativní [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) na custom elementu. Další parametry události (payload) budou vystaveny jako pole na objektu CustomEvent ve vlastnosti `detail`.

#### Sloty (slots) {#slots}

Uvnitř komponenty lze sloty vykreslovat pomocí elementu `<slot/>` jako obvykle. Ovšem při konzumaci výsledného elementu je přijímána pouze [syntaxi nativních slotů](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- [Scoped sloty](/guide/components/slots#scoped-slots) nejsou podporovány.

- Při předávání pojmenovaných slotů použijte atribut `slot` místo direktivy `v-slot`:

  ```vue-html
  <my-element>
    <div slot="pojmenovany">ahoj</div>
  </my-element>
  ```

#### Provide / Inject {#provide-inject}

[Provide / Inject API](/guide/components/provide-inject#provide-inject) a jeho [ekvivalent v Composition API](/api/composition-api-dependency-injection#provide) fungují i mezi Vue-definovanými custom elementy. Nicméně, mějte na paměti, že to funguje **pouze mezi custom elementy**. tj. Vue-definovaný custom element nebude schopen vložit vlastnosti poskytované Vue komponentou, která není custom element.

#### Globální konfigurace <sup class="vt-badge" data-text="3.5+" /> {#app-level-config}

Pomocí volby `configureApp` můžete pro Vue custom element nastavit instanci aplikace:

```js
defineCustomElement(MyComponent, {
  configureApp(app) {
    app.config.errorHandler = (err) => {
      /* ... */
    }
  }
})
```

### SFC jako custom element {#sfc-as-custom-element}

Metoda `defineCustomElement` funguje i s Vue Single-File komponentami (SFC). Nicméně, s výchozím nastavením nástrojů bude `<style>` uvnitř SFC během produkčního buildu stále extrahován a sloučen do jednoho CSS souboru. Při použití SFC jako custom elementu je často žádoucí vložit `<style>` tagy do shadow root custom elementu.

Oficiální nástroje pro SFC podporují import SFC v „režimu custom elementu“ (vyžaduje `@vitejs/plugin-vue@^1.4.0` nebo `vue-loader@^16.5.0`). SFC načtený v režimu custom elementu vkládá své `<style>` tagy jako CSS řetězce a vystavuje je pod možností `styles` komponenty. To bude zachyceno `defineCustomElement` a vloženo do shadow root elementu při vytváření instance.

Pro aktivaci tohoto režimu jednoduše ukončete název souboru komponenty příponou `.ce.vue`:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* vložené CSS */"]

// převést na konstruktor custom elementu
const ExampleElement = defineCustomElement(Example)

// zaregistrovat
customElements.define('my-example', ExampleElement)
```

Pokud chcete upravit, které soubory mají být v režimu custom elementu importovány (například, pokud chcete zacházet se _všemi_ SFC jako s custom elementy), můžete předat volbu `customElement` příslušným build pluginům:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Tipy pro knihovnu custom elementů Vue {#tips-for-a-vue-custom-elements-library}

Při vytváření custom elementů s Vue jsou elementy závislé na běhovém prostředí Vue. Základní velikost je přibližně **16 kB** v závislosti na tom, kolik funkcí se používá. To znamená, že pokud dodáváte pouze jeden custom element, není ideální používat Vue – měli byste použít čistý JavaScript, [petite-vue](https://github.com/vuejs/petite-vue) nebo frameworky specializující se na malou runtime velikost. Základní velikost je více než ospravedlnitelná, pokud dodáváte kolekci custom elementů s komplexní logikou, protože Vue umožní napsat každou komponentu s&nbsp;mnohem menším množstvím kódu. Čím více elementů dodáváte společně, tím lepší je to kompromis.

Pokud budou custom elementy použity v aplikaci, která Vue také používá, můžete se rozhodnout vyčlenit Vue z vytvořeného balíčku, aby elementy používaly stejnou kopii Vue z hostitelské aplikace.

Je doporučeno exportovat jednotlivé konstruktory elementů, abyste uživatelům poskytli flexibilitu importovat je na vyžádání a registrovat je s požadovanými názvy tagů. Můžete také exportovat pohodlnou funkci pro automatickou registraci všech elementů. Zde je příklad vstupního bodu Vue knihovny custom elementů:

```js
// elements.js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// exportovat jednotlivé elementy
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

Konzument může elementy použít ve Vue souboru:
```vue
<script setup>
import { register } from 'path/to/elements.js'
register()
</script>
<template>
  <my-foo ... >
    <my-bar ... ></my-bar>
  </my-foo>
</template>
```

Nebo v jakémkoliv jiném frameworku, například s využitím JSX a custom názvy:
```jsx
import { MyFoo, MyBar } from 'path/to/elements.js'
customElements.define('some-foo', MyFoo)
customElements.define('some-bar', MyBar)
export function MyComponent() {
  return <>
    <some-foo ... >
      <some-bar ... ></some-bar>
    </some-foo>
  </>
}
```

### Na Vue založené Web Components a TypeScript {#web-components-and-typescript}

Pokud píšete šablony Vue SFC komponent, můžete chtít [ověřovat typy](/guide/scaling-up/tooling.html#typescript) použitých Vue komponent, včetně těch, které jsou definovány jako custom elementy.

Custom elementy jsou registrovány globálně pomocí nativních API, takže ve výchozím nastavení nemají při použití ve Vue šablonách odvozování typů. Abyste poskytli podporu typů pro Vue komponenty registrované jako custom elementy, můžeme zaregistrovat globální typy komponent pomocí rozhraní [`GlobalComponents`](https://github.com/vuejs/language-tools/wiki/Global-Component-Types) ve Vue šablonách a/nebo v&nbsp;[JSX](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements):

```typescript
import { defineCustomElement } from 'vue'

// import Vue komponenty
import SomeComponent from './src/components/SomeComponent.ce.vue'

// transformovat Vue komponentu na třídu Custom Element
export const SomeElement = defineCustomElement(SomeComponent)

// nezapomeňte registrovat třídu elementu v browseru 
customElements.define('some-element', SomeElement)

// přidat nový typ elementu do Vue GlobalComponents
declare module 'vue' {
  interface GlobalComponents {
    // ujistěte se, že předáváte Vue typ komponenty
    // (SomeComponent a nikoliv SomeElement)
    // custom elementy vyžadují v názvu pomlčku (hyphen),
    // použijte tedy jejich kebab-cased název
    'some-element': typeof SomeComponent
  }
}
```

## Web Components a TypeScript {#non-vue-web-components-and-typescript}

Toto je doporučený postup, jak umožnit kontrolu typů v SFC šablonách pro Custom elementy, které nejsou vytvořeny pomocí Vue.

:::tip Info
Jde o obecně platný způsob, jak to udělat, ale detaily se mohou se trochu lišit v závislosti na frameworku použitém pro vytvoření custom elementu.
:::

Předpokládejme, že máme definován custom element s nějakými JS atributy a událostmi, který je distribuován v knihovně nazvané `some-lib`:

```ts
// soubor: some-lib/src/SomeElement.ts

// definice třídy s typovanými JS atributy
export class SomeElement extends HTMLElement {
  foo: number = 123
  bar: string = 'blah'

  lorem: boolean = false

  // tato metoda nemá být vystavena do typů pro šablonu
  someMethod() {
    /* ... */
  }

  // ... implementační detaily vynecháváme ...
  // ... předpokládejme, že element vyvolává událost jménem "apple-fell"...
}

customElements.define('some-element', SomeElement)

// Toto je seznam vlastností SomeElement, které budou vybrány pro typovou
// kontrolu v šablonách frameworku (např. Vue SFC šablony). Jakékoliv jiné
// vlastnosti nebudou vystaveny.
export type SomeElementAttributes = 'foo' | 'bar'

// Definice typů událostí, které SomeEvent vyvolává.
export type SomeElementEvents = {
  'apple-fell': AppleFellEvent
}

export class AppleFellEvent extends Event {
  /* ... implementační detaily vynecháváme ... */
}
```
Implementační detaily byly vynechány, ale důležité je, že máme dva druhy definic typů - pro vlastnosti (props) a pro události (emits).

Vytvořme pomocnou funkci pro snadnou registraci definic typů custom elementů ve Vue:

```ts
// soubor: some-lib/src/DefineCustomElement.ts

// Tuto pomocnou funkci můžeme znovupoužít pro každý prvek,
// který potřebujeme definovat.
type DefineCustomElement<
  ElementType extends HTMLElement,
  Events extends EventMap = {},
  SelectedAttributes extends keyof ElementType = keyof ElementType
> = new () => ElementType & {
  // Použijte $props pro definici vlastností (props) vystavených pro kontrolu 
  // typů v šabloně. Vue specificky čte jejich definice z typu `$props`. 
  // Pamatujte, že kombinujeme props elementu s globálními HTML atrbuty 
  // a speciálními vlastnostmi Vue.
  /** @deprecated Nepoužívejte $props na Custom Element ref, 
   *  toto je určeno pouze pro template prop typy */
  $props: HTMLAttributes &
    Partial<Pick<ElementType, SelectedAttributes>> &
    PublicProps

  // Použijte $emit pro definici typů událostí. Vue specificky čte jejich 
  // definice z typu `$emit`. Pamatujte, že `$emit` očekává určitý formát, 
  // který mapujeme na `Events`.
  /** @deprecated Nepoužívejte $emit na Custom Element ref, 
   *  toto je určeno pouze pro template prop typy */
  $emit: VueEmit<Events>
}

type EventMap = {
  [event: string]: Event
}

// Zde se mapuje EventMap na formát, který očekává Vue typ pro $emit.
type VueEmit<T extends EventMap> = EmitFn<{
  [K in keyof T]: (event: T[K]) => void
}>
```

:::tip Info
Označili jsme `$props` a `$emit` jako deprecated, abychom při získání `ref` na custom element nebyli v pokušení tyto vlastnosti použít. Slouží totiž pouze k ověřování typů u&nbsp;custom elementů. Ve skutečnosti na instancích těchto elementů neexistují.
:::

Prostřednictvím pomocné funkce nyní můžeme vybrat JavaScriptové vlastnosti,
které mají být vystaveny pro typovou kontrolu ve Vue šablonách:

```ts
// soubor: some-lib/src/SomeElement.vue.ts

import {
  SomeElement,
  SomeElementAttributes,
  SomeElementEvents
} from './SomeElement.js'
import type { Component } from 'vue'
import type { DefineCustomElement } from './DefineCustomElement'

// Přidat nový typ element k Vue typu GlobalComponents.
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElement,
      SomeElementAttributes,
      SomeElementEvents
    >
  }
}
```

Řekněme, že `some-lib` vytváří své zdrojové TypeScript soubory do adresáře `dist/` folder. Uživatel `some-lib` poté může importovat `SomeElement` a použít jej ve Vue SFC komponentě takto:

```vue
<script setup lang="ts">
// toto vytvoří a registruje element v prohlížeči
import 'some-lib/dist/SomeElement.js'

// Uživatel TypeScriptu a Vue může dodatečně importovat definici typů
// specifickou pro Vue (uživatelé jiných frameworků mohou importovat
// jiné definice specifické pro jiné frameworky).
import type {} from 'some-lib/dist/SomeElement.vue.js'

import { useTemplateRef, onMounted } from 'vue'

const el = useTemplateRef('el')

onMounted(() => {
  console.log(
    el.value!.foo,
    el.value!.bar,
    el.value!.lorem,
    el.value!.someMethod()
  )

  // Nepoužívejte tyto vlastnosti, které jsou `undefined`
  // (IDE je rovnou zobrazí přeškrtnuté)
  el.$props
  el.$emit
})
</script>

<template>
  <!-- Nyní můžeme použít element s typovou kontrolou: -->
  <some-element
    ref="el"
    :foo="456"
    :blah="'hello'"
    @apple-fell="
      (event) => {
        // Typ proměnné `event` je zde odvozen na `AppleFellEvent`
      }
    "
  ></some-element>
</template>
```

Pokud element typové definice nemá, mohou být typy vlastností a událostí definovány více ručním způsobem:

```vue
<script setup lang="ts">
// řekněme, že `some-lib` je čistý JavaScript bez typových definic
// a TypeScript nemůže typy sám odvodit:
import { SomeElement } from 'some-lib'

// Použijeme stejnou pomocnou funkci pro typy jako předtím.
import { DefineCustomElement } from './DefineCustomElement'

type SomeElementProps = { foo?: number; bar?: string }
type SomeElementEvents = { 'apple-fell': AppleFellEvent }
interface AppleFellEvent extends Event {
  /* ... */
}

// Přidat nový typ elementu do Vue typu GlobalComponents.
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElementProps,
      SomeElementEvents
    >
  }
}

// ... stejně jako předtím použijte referenci na element ...
</script>

<template>
  <!-- ... stejně jako předtím použijte element v šabloně ... -->
</template>
```

Autoři custom elementů by neměli typové definice specifické pro jednotlivé frameworky automaticky exportovat v rámci svých knihoven. Například by je neměli zahrnovat do souboru `index.ts`, odkud se exportuje i zbytek knihovny. Jinak mohou uživatelé narazit na nečekané chyby při rozšiřování modulů. Uživatelé by si sami měli importovat definiční soubor typů specifický pro framework, který potřebují.

## Web Components vs. Vue komponenty {#web-components-vs-vue-components}

Někteří vývojáři věří, že by se měli vyhnout proprietárním komponentám v rámci frameworku a že pouze používání custom elementů zajišťuje „budoucnostní odolnost“ aplikace. Zde se pokusíme vysvětlit, proč si myslíme, že to je příliš zjednodušený pohled na problém.

Skutečně existuje určitá míra překryvu funkcí mezi custom elementy a Vue komponentami: obojí nám umožňuje definovat znovupoužitelné komponenty s&nbsp;předáváním dat, emitováním událostí a správou životního cyklu. Nicméně, API custom elementů je relativně nízkoúrovňové a základní. Pro vytvoření skutečné aplikace potřebujeme několik dalších schopností, které platforma nepokrývá:

- Deklarativní a efektivní systém šablonování;

- Reaktivní systém správy stavu, který usnadňuje extrakci a znovupoužití logiky mezi komponentami;

- Výkonný způsob vykreslování komponent na serveru a hydratace na klientovi (SSR), což je důležité pro SEO a [metriky Web Vitals, jako je LCP](https://web.dev/vitals/). SSR nativních custom elementů obvykle zahrnuje simulaci DOM v Node.js a následné serializování modifikovaného DOM, zatímco Vue SSR kompiluje do složených řetězců, kdykoli je to možné, což je mnohem efektivnější.

Model Vue komponent je navržen s ohledem na tyto potřeby jako koherentní systém.

S týmem kompetentních SW inženýrů byste pravděpodobně mohli postavit ekvivalent na základě nativních custom elementů - to ale také znamená, že přebíráte dlouhodobou údržbu interního frameworku a ztrácíte výhody ekosystému a komunity vyzrálého frameworku, jako je Vue.

Existují také frameworky postavené na základě custom elementů jako základu jejich modelu komponent, ale všechny nevyhnutelně musí představit svá vlastní řešení pro výše uvedené problémy. Používání těchto frameworků znamená přijetí jejich technických rozhodnutí o tom, jak tyto problémy řešit. Což, navzdory tomu, co se může tvrdit, automaticky nechrání před potenciálními budoucími změnami.

Existují také oblasti, kde vnímáme custom elementy jako omezující:

- Předčasné (eager) vyhodnocení slotů brání kompozici komponent. Vue [scoped sloty](/guide/components/slots#scoped-slots) jsou mocný mechanismus pro kompozici komponent, který nemůže být podporován custom elementy kvůli eager povaze nativních slotů. Předčasné vyhodnocení slotů také znamená, že komponenta příjemce nemůže ovládat, kdy nebo zda vykreslit část obsahu slotu.

- V současné době je nutné vložit CSS do JavaScriptu, aby bylo možné dodávat custom elementy s ohraničeným shadow DOM a implementovat je do shadow rootů za běhu. To také vede k duplikovaným stylům v markupu v případě SSR scénářů. V této oblasti se pracuje na [platformních funkcích](https://github.com/whatwg/html/pull/4898/), ale zatím nejsou všeobecně podporovány a stále existují obavy ohledně výkonu v produkčním prostředí / SSR. Mezitím Vue SFC poskytuje [mechanismy pro ohraničení CSS](/api/sfc-css-features), které umožňují extrahování stylů do běžných CSS souborů.

Vue vždy bude držet krok s nejnovějšími standardy na webové platformě a rádi využijeme to, co platforma poskytuje, pokud to usnadní naši práci. Nicméně, naším cílem je poskytovat řešení, která fungují dobře a fungují dnes. To znamená, že musíme nové funkce platformy začlenit s kritickým přístupem – a to zahrnuje vyplňování mezer, kde standardy stále selhávají.
