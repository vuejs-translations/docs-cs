# Syntaxeš šablon {#template-syntax}

Vue používá pro šablony (template) syntaxi založenou na HTML. Ta vám umožňuje deklarativně propojit vykreslený DOM s daty instance komponenty v pozadí. Všechny Vue šablony jsou syntakticky platný HTML kód, který může být analyzován prohlížeči a HTML parsery odpovídajícími specifikaci.

Vue interně kompiluje šablony do vysoce optimalizovaného JavaScript kódu. V kombinaci se systémem reaktivity dokáže Vue inteligentně zjistit minimální počet komponent k opětovnému vykreslení a použít minimální množství DOM manipulací ve chvíli, kdy se změní stav aplikace.

Pokud jste obeznámeni s koncepty Virtual DOM a dáváte přednost hrubé síle JavaScriptu, můžete také místo šablon [přímo psát funkce pro vykreslování](/guide/extras/render-function) s volitelnou podporou JSX. Pamatujte ale, že nemohou využít stejnou úroveň optimalizací v době kompilace jako šablony.

## Interpolace textu {#text-interpolation}

Nejzákladnější formou datové vazby je textová interpolace pomocí "Mustache" syntaxe (dvojité složené závorky):

```vue-html
<span>Zpráva: {{ msg }}</span>
```
Značka pro "Mustache" bude nahrazena hodnotou `msg` z [odpovídající instance komponenty](/guide/essentials/reactivity-fundamentals#declaring-reactive-state). Bude také aktualizována při každé změně hodnoty `msg` proměnné.

## HTML kód {#raw-html}

"Mustache" syntaxe interpretuje data jako prostý text, nikoli HTML. K vykreslení stylovaného HTML budete muset použít direktivu [`v-html`](/api/built-in-directives#v-html):

```vue-html
<p>S použitím textové interpolace: {{ rawHtml }}</p>
<p>S použitím direktivy v-html: <span v-html="rawHtml"></span></p>
```

<script setup>
  const rawHtml = '<span style="color: red">Červený text</span>'
</script>

<div class="demo">
  <p>S použitím textové interpolace: {{ rawHtml }}</p>
  <p>S použitím direktivy v-html: <span v-html="rawHtml"></span></p>
</div>

Zde se setkáváme s něčím novým. Atribut `v-html`, který vidíte, se nazývá **direktiva**. Direktivy mají předponu `v-`, která označuje, že se jedná o speciální atributy poskytované Vue. Jak jste možná uhodli, aplikují na vykreslený DOM speciální reaktivní chování. Zde v podstatě říkáme „udržuj vnitřní HTML tohoto elementu aktuální pomocí proměnné `rawHtml` z aktuální aktivní instance.“

Obsah tagu `span` bude nahrazen hodnotou proměnné `rawHtml`, interpretovanou jako prosté HTML – data-binding je ignorován. Dejte pozor, že nemůžete použít `v-html` ke skládání částí šablony, protože Vue není šablonovací engine založený na řetězcích. Místo toho jsou jako základní jednotka pro znovupoužití a skládání UI preferovány komponenty.

:::warning Bezpečnostní varování
Dynamické vykreslování libovolného HTML kódu na vaší webové stránce může být velmi nebezpečné, protože může snadno vést k [XSS zranitelnostem](https://en.wikipedia.org/wiki/Cross-site_scripting). `v-html` používejte pouze u důvěryhodného obsahu a **nikdy** pro obsah zadaný uživateli.
:::

## Binding atributů {#attribute-bindings}

"Mustache" syntaxi nelze použít uvnitř HTML atributů. Místo toho, použijte [direktivu `v-bind`](/api/built-in-directives#v-bind):

```vue-html
<div v-bind:id="dynamicId"></div>
```

Direktiva `v-bind` říká Vue, aby ponechalo atribut `id` daného elementu synchronizovaný s proměnnou komponenty `dynamicId`. Pokud je propojená hodnota `null` nebo `undefined`, bude atribut z vykresleného elementu odstraněn.

### Zkrácený zápis {#shorthand}

Protože se `v-bind` používá velmi často, je pro něj definována speciální zkrácená syntaxe:

```vue-html
<div :id="dynamicId"></div>
```

Atributy začínající na `:` mohou vypadat trochu jinak než normální HTML, ale ve skutečnosti je to platný znak pro názvy atributů a všechny prohlížeče podporované Vue jej umí správně analyzovat. Navíc se v konečně vykresleném HTML kódu nezobrazují. Syntaxe zkratky je volitelná, ale pravděpodobně ji oceníte, až se o jejím použití později dozvíte víc.

> Ve zbytku průvodce budeme v příkladech kódu používat zkrácenou syntaxi, protože je to pro Vue vývojáře nejběžnější použití.

### Boolean atributy {#boolean-attributes}

[Boolean atributy](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes) jsou atributy, jejichž přítomnost v elementu indikuje hodnoty ano / ne. Jedním z nejčastěji používaných boolean atributů je například [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled).

`v-bind` v tomto případě funguje trochu jinak:

```vue-html
<button :disabled="isButtonDisabled">Button</button>
```

Atribut `disabled` bude ve výsledku zahrnut, pokud má `isButtonDisabled` [pravdivou (truthy) hodnotu](https://developer.mozilla.org/en-US/docs/Glossary/Truthy). Přítomen bude i tehdy, pokud bude hodnota prázdný string, aby se zachovala konzistence s `<button disabled="">`. Pro ostatní [nepravdivé (falsy) hodnoty](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) bude atribut vynechán.

### Dynamický binding více atributů {#dynamically-binding-multiple-attributes}

Pokud máte JavaScript objekt reprezentující více atributů, který vypadá nějak takto:

<div class="composition-api">

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```

</div>

Můžete provést binding na element pomocí `v-bind` bez atributu:

```vue-html
<div v-bind="objectOfAttrs"></div>
```

## Použití JavaScriptových výrazů {#using-javascript-expressions}

Zatím jsme se v našich šablonách vázali pouze jednoduše na hodnoty proměnných. Vue ovšem uvnitř všech datových vazeb podporuje plnou škálu JavaScriptových výrazů (expressions):

```vue-html
{{ number + 1 }}

{{ ok ? 'ANO' : 'NE' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

Tyto výrazy budou vyhodnoceny jako JavaScript s použitím datového scope aktuální instance komponenty.

V Vue šablonách lze JavaScriptové výrazy použít na následujících místech:

- Uvnitř textových interpolací ("Mustache" syntaxe)
- V hodnotě atributu kterékoliv Vue direktivy (speciální atributy začínající na `v-`)

### Pouze výrazy {#expressions-only}

Každý binding může obsahovat pouze **jeden jediný výraz**. Výraz je část kódu, kterou lze vyhodnotit na hodnotu. Jednoduchá kontrola je, zda ji lze použít po `return`.

Kvůli tomu **NEBUDE** fungovat následující:

```vue-html
<!-- toto je konstatování (statement), nikoliv výraz (expression): -->
{{ var a = 1 }}

<!-- nebude fungovat ani řízení kódu (flow control), použijte ternární operátory -->
{{ if (ok) { return message } }}
```

### Volání funkcí {#calling-functions}

Uvnitř binding výrazu je možné volat funkci vystavenou v komponentě:

```vue-html
<time :title="toTitleDate(date)" :datetime="date">
  {{ formatDate(date) }}
</time>
```

:::tip
Funkce volané uvnitř binding výrazů budou volány při každé aktualizaci komponenty, takže by **neměly mít** žádné vedlejší účinky, jako je změna dat nebo spouštění asynchronních operací.
:::

### Omezení globální přístup {#restricted-globals-access}

Výrazy v šablonách jsou sandboxovány a mají přístup pouze k [omezenému seznamu globálních objektů](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3). Seznam vystavuje běžně používané vestavěné globální objekty, jako jsou `Math` a `Date`.

Globální objekty, které nejsou explicitně uvedeny v seznamu, například vlastnosti připojené uživatelem k instanci `window`, nebudou ve výrazech šablony přístupné. Můžete však explicitně definovat další globální objekty pro všechny Vue výrazy jejich přidáním do [`app.config.globalProperties`](/api/application#app-config-globalproperties).

## Direktivy {#directives}

Direktivy jsou speciální atributy s předponou `v-`. Vue poskytuje řadu [vestavěných direktiv](/api/built-in-directives), včetně `v-html` a `v-bind`, které jsme již představili výše.

Jako hodnoty direktivních atributů jsou očekávány samostatné JavaScriptové výrazy (s výjimkou výrazů `v-for`, `v-on` a `v-slot`, které budou popsány v příslušných částech později). Úkolem direktivy je reaktivně aplikovat aktualizace na DOM, když se změní hodnota jejího výrazu. Jako příklad si vezměme [`v-if`](/api/built-in-directives#v-if):

```vue-html
<p v-if="seen">Teď mě vidíte</p>
```

Zde direktiva `v-if` odstraní nebo přidá element `<p>` na základě pravdivosti hodnoty proměnné `seen`.

### Parametry {#arguments}

Některé direktivy mohou přijímat "parametr", označený dvojtečkou za názvem direktivy. Například direktiva `v-bind` se používá k reaktivní aktualizaci HTML atributu:

```vue-html
<a v-bind:href="url"> ... </a>

<!-- zkrácený zápis -->
<a :href="url"> ... </a>
```

Zde je parametrem `href`, což říká direktivě `v-bind`, aby provedla binding atributu `href` v elementu s hodnotou výrazu `url`. Ve zkráceném zápisu je cokoliv před parametrem (např. `v-bind:`) sbaleno do jediného znaku `:`.

Jiný příklad je direktiva `v-on`, která naslouchá DOM událostem (events):

```vue-html
<a v-on:click="akcePoKliknuti"> ... </a>

<!-- shorthand -->
<a @click="akcePoKliknuti"> ... </a>
```

Zde je parametrem událost (event), jíž se naslouchá: `click`. `v-on` má rovněž odpovídající zkrácený zápis, a sice znak `@`. O obsluze událostí (event handling) budeme později hovořit podrobněji.

### Dynamické parametry {#dynamic-arguments}

Pro parametr direktivy je možné použít i JavaScript výraz tak, že jej zabalíte do hranatých závorek:

```vue-html
<!--
Vemte na vědomí, že zde pro hodnoty výrazu platí určitá omezení,
jež jsou vysvětlena v oddílech "Omezení hodnot dynamických parametrů" a "Omezení syntaxe dynamických parametrů" níže.
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- zkrácený zápis -->
<a :[attributeName]="url"> ... </a>
```

Hodnota `attributeName` bude dynamicky vyhodnocena jako JavaScriptový výraz a výsledná hodnota bude použita jako konečná hodnota parametru. Pokud má například instance vaší komponenty datovou vlastnost `attributeName`, jejíž hodnota je `"href"`, bude tento binding ekvivalentní zápisu `v-bind:href`.

Podobně můžete použít dynamické parametry k bindingu handleru na dynamický název události (eventu):

```vue-html
<a v-on:[eventName]="doSomething"> ... </a>

<!-- zkrácený zápis -->
<a @[eventName]="doSomething">
```

V této ukázce, pokud je hodnota `eventName` rovna `"focus"`, `v-on:[eventName]` bude ekvivalentní zápisu `v-on:focus`.

#### Omezení hodnot dynamických parametrů {#dynamic-argument-value-constraints}

Očekává se, že dynamické argumenty budou vyhodnoceny jako řetězec, s výjimkou `null`. Speciální hodnotu `null` lze použít k explicitnímu odstranění bindingu. Jakákoli jiná non-string hodnota vyvolá varování (warning).

#### Omezení syntaxe dynamických parametrů {#dynamic-argument-syntax-constraints}

Výrazy pro dynamické parametry mají určitá omezení syntaxe, protože některé znaky, jako jsou mezery a uvozovky, jsou v názvech  HTML atributů neplatné. Například je neplatné následující:

```vue-html
<!-- toto vyvolá varování (warning) překladače -->
<a :['foo' + bar]="value"> ... </a>
```

Pokud potřebujete předat složitý dynamický parametr, je pravděpodobně lepší použít [computed proměnnou](./computed), kterou si již brzy probereme.

Při používání DOM-šablon (šablony zapsané přímo v HTML souboru) byste se také měli vyvarovat pojmenovávání klíčů velkými písmeny, protože prohlížeče budou názvy atributů vynuceně převádět na malá písmena:

```vue-html
<a :[someAttr]="value"> ... </a>
```

Výše uvedené bude v DOM-šablonách převedeno na `:[someattr]`. Pokud má vaše komponenta proměnnou nazvanou `someAttr` místo `someattr`, váš kód nebude fungovat. Šablony uvnitř Single-File komponent (SFC) toto omezení **nemají**.

### Modifikátory {#modifiers}

Modifikátory jsou speciální přípony označené tečkou, které označují, že binding direktiva by měla proběhnout nějakým speciálním způsobem. Například modifikátor `.prevent` říká direktivě `v-on`, aby při vyvolání příslušné události zavolala `event.preventDefault()`:

```vue-html
<form @submit.prevent="onSubmit">...</form>
```

Další příklady modifikátorů uvidíte později, [pro `v-on`](./event-handling#event-modifiers) a [pro `v-model`](./forms#modifiers), až budeme objevovat jejich možnosti.

Na závěr je zde zobrazena úplná syntaxe direktivy:

![graf syntaxe direktivy](./images/directive.png)

<!-- https://www.figma.com/file/BGWUknIrtY9HOmbmad0vFr/Directive -->
