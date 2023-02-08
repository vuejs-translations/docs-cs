# Pravidla priority B: Silně doporučeno {#priority-b-rules-strongly-recommended}

Tato pravidla byla zavedena pro zlepšení čitelnosti a/nebo komfortu pro vývojáře na většině projektů. Pokud je porušíte, váš kód bude stále fungovat, ale porušení by měla být vzácná a dobře odůvodněná.

## Soubory komponent {#component-files}

**Kdykoli je k dispozici build systém pro poskládání souborů, každá komponenta by měla být ve svém vlastním souboru.**

To vám pomůže rychleji najít komponentu, když ji potřebujete upravit nebo zkontrolovat, jak ji používat.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## Velká a malá písmena v názvech Single-file komponent (SFC) {#single-file-component-filename-casing}

**Názvy souborů [Single-File komponent (SFC)](/guide/scaling-up/sfc.html) by měly být buďto vždy PascalCase nebo vždy kebab-case.**

PascalCase funguje nejlépe s automatickým dokončováním v editorech kódu, protože je konzistentní s tím, jak odkazujeme na komponenty v JS(X) a v šablonách, kdykoli je to možné. Názvy s mixem malých a velkých písmen však mohou někdy způsobit problémy v case-insensitive souborových systémech, a proto je kebab-case také dokonale přijatelný.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## Názvy základních komponent {#base-component-names}

**Základní komponenty (alias prezentační (presentational), hloupé (dumb) nebo čisté (pure) komponenty), ve kterých platí pravidla stylování a konvence typické pro aplikaci, by měly vždy začít se speciální předponou, například `Base`, `App`, or `V`.**

::: details Podrobné vysvětlení
Tyto komponenty pokládají základy pro konzistentní stylování a chování ve vaší aplikaci. Mohou obsahovat **pouze**:

- HTML elementy,
- jiné základní komponenty
- UI komponenty třetích stran.

Ale **nikdy** neobsahují globální stav (např. state z [Pinia](https://pinia.vuejs.org/) store).

Jejich názvy často obsahují název prvku, který obalují (např. `BaseButton`, `BaseTable`), ledaže neexistuje žádný prvek pro jejich konkrétní účel (např. `BaseIcon`). Pokud vytváříte podobné komponenty pro specifičtější kontext, tyto komponenty je téměř vždy použijí (např. `BaseButton` může být použita v `ButtonSubmit`).

Některé výhody této konvence:

- Když jsou v editoru uspořádány abecedně, základní součásti vaší aplikace jsou uvedeny společně, což usnadňuje jejich identifikaci.

- Vzhledem k tomu, že názvy komponent by měly být vždy víceslovné, tato konvence vám brání volit libovolnou předponu pro jednoduché obaly komponent (např. `MyButton`, `VueButton`).

- Vzhledem k tomu, že se tyto komponenty používají často, možná budete chtít, aby byly globální, místo abyste je všude importovali. Předpona to v kombinaci s Webpackem umožňuje:

  ```js
  const requireComponent = require.context(
    './src',
    true,
    /Base[A-Z]\w+\.(vue|js)$/
  )
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig =
      baseComponentConfig.default || baseComponentConfig
    const baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
    app.component(baseComponentName, baseComponentConfig)
  })
  ```

  :::

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## Jména komponent s jedinou instancí {#single-instance-component-names}

**Komponenty, které by vždy měly mít pouze jednu aktivní instanci, by měly začínat na `The`, aby bylo označeno, že může být pouze jedna.**

To neznamená, že komponenta je použita pouze na jedné stránce, ale bude použita pouze jednou _na stránku_. Tyto komponenty nikdy nepřijímají žádné vlastnosti (props), protože jsou specifické pro vaši aplikaci, nikoli jejich kontext ve vaší aplikaci. Pokud zjistíte, že je potřeba přidat vlastnosti, je to dobrá známka toho, že se ve skutečnosti jedná o opakovaně použitelnou komponentu, která se _prozatím_ používá pouze jednou na stránku.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```
components/
|- Heading.vue
|- MySidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```

</div>

## Těsně provázané názvy komponent {#tightly-coupled-component-names}

**Komponenty potomků, ktero jsou těsně provázané s jejich rodičovskou komponentou, by měly obsahovat název nadřazené komponenty jako předponu.**

Pokud má komponenta smysl pouze v kontextu jedné nadřazené komponenty, měl by být tento vztah zřejmý z jejího názvu. Vzhledem k tomu, že editory obvykle řadí soubory abecedně, toto také drží související soubory vedle sebe.

::: details Podrobné vysvětlení
Možná budete v pokušení řešit tento problém vnořením podřízených komponent do adresářů pojmenovaných po jejich rodiči. Například:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

or:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

To se nedoporučuje, protože to má za následek:

- Mnoho souborů s podobnými názvy, což ztěžuje rychlé přepínání souborů v editorech kódu.
- Mnoho vnořených podadresářů, což prodlužuje čas potřebný k procházení komponent v postranním panelu editoru.
  :::

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## Pořadí slov v názvech komponent {#order-of-words-in-component-names}

**Názvy komponent by měly začínat (většinou) nejobecnějšími slovy a končit popisnými modifikujícími výrazy.**

::: details Podrobné vysvětlení
Možná se ptáte:

> ""Proč bychom nutili názvy komponent používat méně přirozený jazyk?"

V přirozené angličtině se přídavná jména a další deskriptory obvykle objevují před podstatnými jmény, zatímco výjimky vyžadují spojovací slova. Například:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

Pokud chcete, určitě můžete tato spojovací slova zahrnout do názvů komponent, ale pořadí je stále důležité.

:::warning Čeština
Výše uvedený text platí spíše pro anglický jazyk. V češtině sice také říkáme _Káva s mlékem_, ale vystačíme si s _Polévka dne_ a _Návštěvník muzea_ i bez spojovacích slov.
:::

Také si uvědomte, že **co je považováno za "nejvyšší level" bude platit v kontextu vaší aplikace**. Představte si například aplikaci s vyhledávacím formulářem. Může obsahovat komponenty jako jsou tato:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Jak jste si mohli všimnout, je docela obtížné zjistit, které komponenty jsou specifické pro vyhledávání. Nyní přejmenujme komponenty podle pravidla:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Protože editory obvykle organizují soubory abecedně, všechny důležité vztahy mezi komponentami jsou nyní zřejmé na první pohled.

Možná budete chtít vyřešit tento problém jinak, vnořit všechny komponenty vyhledávání do adresáře „search“ a poté všechny komponenty nastavení do adresáře „settings“. Tento přístup doporučujeme zvážit pouze ve velmi velkých aplikacích (např. 100+ komponent), a to z těchto důvodů:

- Procházení vnořenými podadresáři obvykle zabere více času než procházení jediným adresářem `components`.
- Konflikty názvů (např. více komponent `ButtonDelete.vue`) ztěžují rychlou navigaci ke konkrétní komponentě v editoru kódu.
- Refaktorování se stává obtížnějším, protože funkce find-and-replace často nestačí k aktualizaci relativních odkazů na přesouvanou komponentu.
  :::

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## Self-closing components {#self-closing-components}

**Components with no content should be self-closing in [Single-File Components](/guide/scaling-up/sfc.html), string templates, and [JSX](/guide/extras/render-function.html#jsx-tsx) - but never in DOM templates.**

Components that self-close communicate that they not only have no content, but are **meant** to have no content. It's the difference between a blank page in a book and one labeled "This page intentionally left blank." Your code is also cleaner without the unnecessary closing tag.

Unfortunately, HTML doesn't allow custom elements to be self-closing - only [official "void" elements](https://www.w3.org/TR/html/syntax.html#void-elements). That's why the strategy is only possible when Vue's template compiler can reach the template before the DOM, then serve the DOM spec-compliant HTML.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<!-- In Single-File Components, string templates, and JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- In DOM templates -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<!-- In Single-File Components, string templates, and JSX -->
<MyComponent/>
```

```vue-html
<!-- In DOM templates -->
<my-component></my-component>
```

</div>

## Component name casing in templates {#component-name-casing-in-templates}

**In most projects, component names should always be PascalCase in [Single-File Components](/guide/scaling-up/sfc.html) and string templates - but kebab-case in DOM templates.**

PascalCase has a few advantages over kebab-case:

- Editors can autocomplete component names in templates, because PascalCase is also used in JavaScript.
- `<MyComponent>` is more visually distinct from a single-word HTML element than `<my-component>`, because there are two character differences (the two capitals), rather than just one (a hyphen).
- If you use any non-Vue custom elements in your templates, such as a web component, PascalCase ensures that your Vue components remain distinctly visible.

Unfortunately, due to HTML's case insensitivity, DOM templates must still use kebab-case.

Also note that if you've already invested heavily in kebab-case, consistency with HTML conventions and being able to use the same casing across all your projects may be more important than the advantages listed above. In those cases, **using kebab-case everywhere is also acceptable.**

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<!-- In Single-File Components and string templates -->
<mycomponent/>
```

```vue-html
<!-- In Single-File Components and string templates -->
<myComponent/>
```

```vue-html
<!-- In DOM templates -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<!-- In Single-File Components and string templates -->
<MyComponent/>
```

```vue-html
<!-- In DOM templates -->
<my-component></my-component>
```

OR

```vue-html
<!-- Everywhere -->
<my-component></my-component>
```

</div>

## Component name casing in JS/JSX {#component-name-casing-in-js-jsx}

**Component names in JS/[JSX](/guide/extras/render-function.html#jsx-tsx) should always be PascalCase, though they may be kebab-case inside strings for simpler applications that only use global component registration through `app.component`.**

::: details Podrobné vysvětlení
In JavaScript, PascalCase is the convention for classes and prototype constructors - essentially, anything that can have distinct instances. Vue components also have instances, so it makes sense to also use PascalCase. As an added benefit, using PascalCase within JSX (and templates) allows readers of the code to more easily distinguish between components and HTML elements.

However, for applications that use **only** global component definitions via `app.component`, we recommend kebab-case instead. The reasons are:

- It's rare that global components are ever referenced in JavaScript, so following a convention for JavaScript makes less sense.
- These applications always include many in-DOM templates, where [kebab-case **must** be used](#component-name-casing-in-templates).
  :::

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## Full-word component names {#full-word-component-names}

**Component names should prefer full words over abbreviations.**

The autocompletion in editors make the cost of writing longer names very low, while the clarity they provide is invaluable. Uncommon abbreviations, in particular, should always be avoided.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## Prop name casing {#prop-name-casing}

**Prop names should always use camelCase during declaration. When used inside in-DOM templates, props should be kebab-cased. Single-File Components templates and [JSX](/guide/extras/render-function.html#jsx-tsx) can use either kebab-case or camelCase props. Casing should be consistent - if you choose to use camelCased props, make sure you don't use kebab-cased ones in your application**

<div class="style-example style-example-bad">
<h3>Špatně</h3>

<div class="options-api">

```js
props: {
  'greeting-text': String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  'greeting-text': String
})
```

</div>

```vue-html
// for in-DOM templates
<welcome-message greetingText="hi"></welcome-message>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

<div class="options-api">

```js
props: {
  greetingText: String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  greetingText: String
})
```

</div>

```vue-html
// for SFC - please make sure your casing is consistent throughout the project
// you can use either convention but we don't recommend mixing two different casing styles
<WelcomeMessage greeting-text="hi"/>
// or
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// for in-DOM templates
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## Multi-attribute elements {#multi-attribute-elements}

**Elements with multiple attributes should span multiple lines, with one attribute per line.**

In JavaScript, splitting objects with multiple properties over multiple lines is widely considered a good convention, because it's much easier to read. Our templates and [JSX](/guide/extras/render-function.html#jsx-tsx) deserve the same consideration.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## Simple expressions in templates {#simple-expressions-in-templates}

**Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.**

Complex expressions in your templates make them less declarative. We should strive to describe _what_ should appear, not _how_ we're computing that value. Computed properties and methods also allow the code to be reused.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<!-- In a template -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// The complex expression has been moved to a computed property
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

<div class="composition-api">

```js
// The complex expression has been moved to a computed property
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## Simple computed properties {#simple-computed-properties}

**Complex computed properties should be split into as many simpler properties as possible.**

::: details Podrobné vysvětlení
Simpler, well-named computed properties are:

- **Easier to test**

  When each computed property contains only a very simple expression, with very few dependencies, it's much easier to write tests confirming that it works correctly.

- **Easier to read**

  Simplifying computed properties forces you to give each value a descriptive name, even if it's not reused. This makes it much easier for other developers (and future you) to focus in on the code they care about and figure out what's going on.

- **More adaptable to changing requirements**

  Any value that can be named might be useful to the view. For example, we might decide to display a message telling the user how much money they saved. We might also decide to calculate sales tax, but perhaps display it separately, rather than as part of the final price.

  Small, focused computed properties make fewer assumptions about how information will be used, so require less refactoring as requirements change.
  :::

<div class="style-example style-example-bad">
<h3>Špatně</h3>

<div class="options-api">

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="composition-api">

```js
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - basePrice * (discountPercent.value || 0)
})
```

</div>

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

<div class="options-api">

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

<div class="composition-api">

```js
const basePrice = computed(
  () => manufactureCost.value / (1 - profitMargin.value)
)

const discount = computed(
  () => basePrice.value * (discountPercent.value || 0)
)

const finalPrice = computed(() => basePrice.value - discount.value)
```

</div>

</div>

## Quoted attribute values {#quoted-attribute-values}

**Non-empty HTML attribute values should always be inside quotes (single or double, whichever is not used in JS).**

While attribute values without any spaces are not required to have quotes in HTML, this practice often leads to _avoiding_ spaces, making attribute values less readable.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## Directive shorthands {#directive-shorthands}

**Directive shorthands (`:` for `v-bind:`, `@` for `v-on:` and `#` for `v-slot`) should be used always or never.**

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template v-slot:footer>
  <p>Here's some contact info</p>
</template>
```

```vue-html
<template #header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>
