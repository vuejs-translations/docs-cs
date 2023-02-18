# Pravidla priority B: Silně doporučené {#priority-b-rules-strongly-recommended}

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

Možná vás napadlo vyřešit tento problém vnořením všech komponent vyhledávání do adresáře „search“ a všech komponent nastavení do adresáře „settings“. Tento přístup doporučujeme zvážit pouze ve skutečně velkých aplikacích (např. 100+ komponent), a to z těchto důvodů:

- Procházení vnořenými podadresáři obvykle zabere více času než procházení jediným adresářem `components`.
- Konflikty názvů (např. více komponent `ButtonDelete.vue`) ztěžují rychlou navigaci ke konkrétní komponentě v editoru kódu.
- Refaktorování bude obtížnější, protože funkce find-and-replace často nestačí k aktualizaci relativních odkazů na přesouvanou komponentu.
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

## Self-closing komponenty {#self-closing-components}

**Komponenty, kter nemají žádný obsah, by měly být zapsány jako nepárové (self-closing) v [Single-File komponentách (SFC)](/guide/scaling-up/sfc.html), string-šablonách, a [JSX](/guide/extras/render-function.html#jsx-tsx) - nikdy však v DOM-šablonách.**

Komponenty zapsané jako nepárový (self-closing) tag sdělují nejen, že nemají žádný obsah, ale ani **nemají** žádný obsah mít. Je to rozdíl mezi prázdnou stránkou v knize a stránkou označenou „Tato stránka byla záměrně ponechána prázdná“. Váš kód je také bez zbytečného uzavíracího tagu čistší.

HTML bohužel neumožňuje uživatelské nepárové (self-closing) elementy – pouze [oficiální „void“ elementy](https://www.w3.org/TR/html/syntax.html#void-elements). To je důvod, proč je tato strategie možná pouze tehdy, když se Vue kompilátor šablon může k šabloně  dostat před jejím vložením do DOM a poskytnout HTML vyhovující specifikaci.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<!-- Single-File komponenty (SFC), string-šablony a JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- DOM-šablony -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<!-- Single-File komponenty (SFC), string-šablony a JSX -->
<MyComponent/>
```

```vue-html
<!-- DOM-šablony -->
<my-component></my-component>
```

</div>

## Velká a malá písmena v názvech komponent v šablonách {#component-name-casing-in-templates}

**Ve většině projektů názvy komponent v [Single-File komponentách (SFC)](/guide/scaling-up/sfc.html) a string-šablonách měly být vždy PascalCase – ale v DOM-šablonách by názvy měly být kebab-case.**

PascalCase má oproti kebab-case několik výhod:

- Editory mohou v šablonách automaticky doplňovat názvy komponent, protože PascalCase se používá i v JavaScriptu.
- `<MyComponent>` je vizuálně odlišnější od jednoslovného HTML elementu než `<my-component>`, protože existují dva rozdílné znaky (dvě velká písmena), nikoli pouze jeden (pomlčka).
- Pokud ve svých šablonách použijete jakékoli custom prvky mimo Vue, jako je Web Component, PascalCase zajistí, že vaše Vue komponenty zůstanou zřetelně viditelné.

Bohužel kvůli necitlivosti HTML na malá a velká písmena musí DOM-šablony nadále používat kebab-case.

Také vezměte do úvahy, že pokud jste již do kebab-case investovali hodně úsilí, může být konzistence s HTML konvencemi a možnost používat velká a malá písmena stejně ve všech vašich projektech důležitější než výše uvedené výhody. V těchto případech je také přijatelné **používání kebab-case všude.**

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<!-- Single-File komponenty (SFC) a string-šablony -->
<mycomponent/>
```

```vue-html
<!-- Single-File komponenty (SFC) a string-šablony -->
<myComponent/>
```

```vue-html
<!-- DOM-šablony -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<!-- Single-File komponenty (SFC) a string-šablony -->
<MyComponent/>
```

```vue-html
<!-- DOM-šablony -->
<my-component></my-component>
```

NEBO

```vue-html
<!-- Všude -->
<my-component></my-component>
```

</div>

## Velká a malá písmena v názvech komponent v JS/JSX {#component-name-casing-in-js-jsx}

**Názvy komponent v JS/[JSX](/guide/extras/render-function.html#jsx-tsx) by měly být vždy PascalCase, přestože mohou být kebab-case uvnitř řetězců pro jednodušší aplikace, které používají pouze globální registraci komponent skrz `app.component`.**

::: details Podrobné vysvětlení
V JavaScriptu je PascalCase konvencí pro třídy a prototype konstruktory - v podstatě pro cokoli, co může mít odlišné instance. Vue komponenty mají také instance, takže dává smysl rovněž používat PascalCase. Další výhodou je, že používání PascalCase v rámci JSX (a šablon) umožňuje čtenářům kódu snadněji rozlišovat mezi komponentami a HTML elementy.

Nicméně pro aplikace, které používají **pouze** globální definice komponent přes `app.component`, doporučujeme místo toho kebab-case. Důvody jsou:

- Je vzácné, aby se v JavaScriptu někde odkazovalo na globální komponenty, takže dodržování konvence pro JavaScript nedává takový smysl.
- Tyto aplikace vždy obsahují mnoho DOM-šabon, kde [kebab-case **musí** být používán](#component-name-casing-in-templates).
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

## Celá slova jako názvy komponent {#full-word-component-names}

**Názvy komponent by měly upřednostňovat celá slova před zkratkami.**

Automatické doplňování textu v editorech činí náklady na psaní delších názvů velmi nízké, přičemž srozumitelnost, kterou poskytují, je neocenitelná. Zejména méně obvyklým zkratkám je třeba se vyhnout vždy.

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

## Velká a malá písmena v názvech vlastností (props) {#prop-name-casing}

**Názvy vlastností (props) by měly při deklaraci vždy používat camelCase. Při použití uvnitř DOM-šablon by vlastnosti měly být psány kebab-case. Šablony Single-File komponent (SFC) a [JSX](/guide/extras/render-function.html#jsx-tsx) mohou pro vlastnosti používat jak kebab-case, tak camelCase. Použití by mělo být konzistentní – pokud se rozhodnete použít rekvizity camelCased identifikátory, ujistěte se, že ve své aplikaci nepoužíváte i ty s kebab-case.**

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
// DOM-šablony
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
// pro SFC - ujistěte se, že je použití malých a velkých písmen konzistentní napříč projektem
// můžete použít kteroukoli konvenci, ale nedoporučujeme míchat oba dva různé styly
<WelcomeMessage greeting-text="hi"/>
// nebo
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// DOM-šablony
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## Elementy s více atributy {#multi-attribute-elements}

**Elementy s více atributy by měly měly být roztaženy na více řádků, s jedním atributem na řádek.**

V JavaScriptu je dělení objektů s více vlastnostmi na více řádků obecně považováno za dobrou praxi, protože je mnohem snáz čitelné. Naše šablony a [JSX](/guide/extras/render-function.html#jsx-tsx) si zaslouží stejnou úvahu.

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

## Jednoduché výrazy v šablonách {#simple-expressions-in-templates}

**Šablony komponent by měly obsahovat pouze jednoduché výrazy a složitější výrazy přepracované do computed proměnných nebo funkcí.**

Složité výrazy ve vašich šablonách je učiní méně deklarativní. Měli bychom se snažit popsat _co_ by se mělo objevit, nikoli _jak_ tuto hodnotu počítáme. Computed proměnné a funkce také umožňují opětovné použití kódu.

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
<!-- V šabloně -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// Složitý výraz byl přesunut do computed proměnné
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
// Složitý výraz byl přesunut do computed proměnné
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## Jednoduché computed proměnné {#simple-computed-properties}

**Složité computed proměnné by měly být rozděleny na co nejvíce jednodušších proměnných.**

::: details Podrobné vysvětlení
Jednodušší, dobře pojmenované computed proměnné jsou:

- **Jednodušší na testování**
  Když každá computed proměnná obsahuje pouze velmi jednoduchý výraz s velmi malým počtem závislostí, je mnohem jednodušší napsat testy potvrzující, že funguje správně.

- **Jednodušší pro čtení**

  Zjednodušení computed proměnných vás nutí přiřadit každé hodnotě popisný název, i když není znovu použita. To usnadňuje ostatním vývojářům (a vašemu budoucímu já) soustředit se na kód, který je zajímá, a zjistit, o co v něm jde.

- **Lépe se přizpůsobují změnovým požadavkům**

  Jakákoli hodnota, kterou lze pojmenovat, může být užitečná pro zobrazení. Můžeme se například rozhodnout zobrazit zprávu, která uživateli řekne, kolik peněz ušetřil. Můžeme se také rozhodnout vypočítat DPH, ale možná ji budeme chtít zobrazit samostatně, nikoli jako součást konečné ceny.

  Malé, cíleně vypočítané vlastnosti vytvářejí méně předpokladů o tom, jak budou informace použity, takže vyžadují méně refaktoringu, když se požadavky mění.
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

## Hodnoty atributů v úvozovkách {#quoted-attribute-values}

**Neprázdné hodnoty HTML atributů by měly být vždy v uvozovkách (jednoduchých nebo dvojitých, podle toho, co se nepoužívá v JS).**

Ačkoliv hodnoty atributů bez mezer nemusí mít v HTML uvozovky, tato praxe často vede k _vyhýbání se_ mezerám, takže hodnoty atributů jsou méně čitelné.

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

## Direktivní zkratky {#directive-shorthands}

**Direktivní zkratky (`:` pro `v-bind:`, `@` pro `v-on:` a `#` pro `v-slot`) by měly být použity buď všude nebo vůbec.**

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
