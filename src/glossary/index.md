# Slovník {#glossary}

:::tip Čeština
Další jazykově-specifické poznámky k některým překladům naleznete na [této stránce](/about/cs).
:::

Tento glosář má za úkol poskytnout vodítko ohledně významu technických termínů, které se běžně používají, když mluvíme o Vue. Má sloužit *popisně* ohledně toho, jak jsou termíny obvykle používány, nikoli jako *předpisová* specifikace toho, jak musí být používány. Některé termíny mohou mít mírně odlišné významy nebo nuance v závislosti na kontextu.

[[TOC]]

## Asynchronní komponenta {#async-component}

*Asynchronní komponenta* (*Async component*) je obal kolem jiné komponenty, který umožňuje „lazy“ načítání komponenty uvnitř. Obvykle se používá jako způsob snížení velikosti souborů `.js`, které jsou rozděleny do menších částí načítaných pouze tehdy, když je třeba.

Vue Router má podobnou funkci pro [„lazy“ načítání routovacích komponent](https://router.vuejs.org/guide/advanced/lazy-loading.html), ta ovšem asynchronní Vue komponenty nevyužívá.

Další podrobnosti naleznete zde:
- [Průvodce – Asynchronní komponenty](/guide/components/async.html)

## Makro překladače {#compiler-macro}

*Makro překladače* (*Compiler macro*) je speciální kód, který je zpracován překladačem a&nbsp;převeden na něco jiného. Jsou to vlastně pokročilé formy nahrazení řetězců.

Vue překladač podporuje různá makra pro [SFC](#single-file-component), jako například `defineProps()`, `defineEmits()` a `defineExpose()`. Tato makra jsou záměrně navržena tak, aby vypadala jako běžné JavaScriptové funkce, takže mohou využívat stejného parseru a nástrojů typového odvozování jako běžný JavaScript / TypeScript. Nejedná se však o opravdové funkce, které se spouštějí v prohlížeči. Jsou to pouze speciální řetězce, které překladač detekuje a nahradí JS kódem, jenž se skutečně spustí.

Makra mají omezení svého použití, která se na běžný JS kód nevztahují. Například byste si mohli myslet, že `const dp = defineProps` vám umožní vytvořit alias pro `defineProps`, ale ve skutečnosti to skončí chybou. Existují také omezení ohledně hodnot, které lze do `defineProps()` předat, protože „parametry“ musí být zpracovány překladačem a ne až za běhu.

Pro více informací se podívejte na:
- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup.html#defineexpose)

## Komponenta {#component}

Termín *komponenta* (*component*) není pro Vue unikátní. Je běžný v mnoha UI frameworcích. Popisuje část uživatelského rozhraní, jako je tlačítko (button) nebo zaškrtávací políčko (checkbox). Komponenty lze také kombinovat do větších komponent.

Komponenty jsou hlavním mechanismem, který Vue poskytuje k rozdělení uživatelského rozhraní na menší části, jak pro zlepšení udržovatelnosti, tak pro umožnění znovupoužití kódu.

Vue komponenta je objekt. Všechny vlastnosti jsou volitelné, ale pro vykreslení komponenty je vyžadována buďto šablona nebo funkce pro vykreslení. Například následující objekt by byl platnou komponentou:

```js
const SimpleComponent = {
  render() {
    return 'Ahoj, Vue!'
  }
}
```

V praxi jsou většinou Vue aplikace psány pomocí [Single-File komponent (SFC)](#single-file-component) (soubory s příponou `.vue`). I když se tyto komponenty nemusí na první pohled jevit jako objekty, kompilátor SFC je převede na objekt, který je následně použit jako výchozí (default) export souboru. Z vnějšího pohledu je tak `.vue` soubor vlastně jen ES modul, který exportuje objekt komponenty.

Vlastnosti objektu komponenty jsou obvykle označovány jako *možnosti* (*options*). Odtud pochází termín [Options API](#options-api).

Vlastnosti pro komponentu definují, jak mají být vytvářeny instance této komponenty. Komponenty jsou konceptuálně podobné třídám, i když Vue k jejich definici nepoužívá skutečné JavaScriptové třídy.

Termín komponenta se také může používat volněji k odkazování na jednotlivé instance komponent.

Pro více informací se podívejte na:
- [Průvodce – Základy komponent](/guide/essentials/component-basics.html)

Slovo „komponenta“ se také objevuje v několika dalších termínech:
- [asynchronní komponenta](#async-component)
- [dynamická komponenta](#dynamic-component)
- [funkční komponenta](#functional-component)
- [Web Component](#web-component)

## Composable {#composable}

Termín *composable* popisuje běžně používaný vzor ve Vue. Není to samostatná funkce Vue, je to jen způsob použití [Composition API](#composition-api) frameworku.

* Composable je funkce.
* Composable funkce slouží k zapouzdření a znovupoužití stavové logiky.
* Název funkce obvykle začíná `use`, aby ostatní vývojáři věděli, že se jedná o&nbsp;composable funkci.
* Očekává se, že funkce bude volána během synchronního zpracování funkce `setup()` v komponentě (nebo ekvivalentně během vykonávání bloku `<script setup>`). Tím je volání composable svázáno s aktuálním kontextem komponenty, například běhen volání funkcí `provide()`, `inject()` nebo `onMounted()`.
* Composable obvykle vrací běžný, nikoli reaktivní objekt. Tento objekt obvykle obsahuje refs a funkce a očekává se, že bude destrukturován v kódu, který composable spustil.

Stejně jako u mnoha vzorů může být někdy rozpor ohledně toho, zda konkrétní kód daný vzor splňuje. Ne všechny JavaScript utility funkce jsou composables. Pokud funkce nepoužívá Composition API, pravděpodobně se o composable nejedná. Pokud neočekává, že bude volána během synchronního vykonávání funkce `setup()`, pravděpodobně se o composable nejedná. Composables jsou specificky používány k&nbsp;zapouzdření stavové logiky, nejedná se jen o konvenci pro pojmenování funkcí.

Podívejte se na [Průvodce – Composables](/guide/reusability/composables.html) pro více informací o jejich tvorbě a použití.

## Composition API {#composition-api}

*Composition API* je soubor funkcí používaných ve Vue k psaní definic komponent a&nbsp;composables.

Termín se také používá k popisu jednoho ze dvou hlavních stylů používaných k psaní komponent, druhým je [Options API](#options-api). Komponenty psané pomocí Composition API používají buď `<script setup>` nebo explicitní funkci `setup()`.

Pro více informací se podívejte na [Composition API FAQ](/guide/extras/composition-api-faq).

## Custom element {#custom-element}

*Custom element* je funkce standardu [Web Components](#web-component), která je implementována v&nbsp;moderních webových prohlížečích. Odkazuje na schopnost používat vlastní HTML element ve vašem HTML kódu pro zahrnutí Web Compoment na daném místě stránky.

Vue má vestavěnou podporu pro vykreslování custom elementů a umožňuje je používat přímo v šablonách Vue komponent.

Custom elementy by neměly být zaměňovány s možností zahrnutí Vue komponent jako tagů v šabloně jiné Vue komponenty. Custom elementy slouží k vytváření Web Components, nikoli Vue komponent.

Další podrobnosti naleznete zde:
- [Průvodce – Vue a Web Components](/guide/extras/web-components.html)

## Direktiva {#directive}

Termín *direktiva* (*directive*) se vztahuje na atributy šablony začínající prefixem `v-` nebo jejich zkratky.

Vestavěné direktivy zahrnují `v-if`, `v-for`, `v-bind`, `v-on` a `v-slot`.

Vue také podporuje vytváření vlastních direktiv, i když se obvykle používají pouze jako „únikový východ“ (escape hatch) pro přímou manipulaci s DOM elementy. Vlastní direktivy obecně nelze použít k reprodukci funkcionality vestavěných direktiv.

Další podrobnosti naleznete zde:
- [Průvodce – Syntaxe šablon – Direktivy](/guide/essentials/template-syntax.html#directives)
- [Průvodce – Vlastní direktivy](/guide/reusability/custom-directives.html)

## Dynamická komponenta {#dynamic-component}

Termín *dynamická komponenta* (*dynamic component*) se používá pro popis případů, kdy je potřeba dynamicky rozhodnout, která komponenta potomka se má vykreslit. Obvykle se toho dosahuje pomocí `<component :is="type">`.

Dynamická komponenta není zvláštní typ komponenty. Jako dynamická může být použita jakákoli komponenta. Dynamická je volba komponenty, nikoli komponenta samotná.

Další podrobnosti naleznete zde:
- [Průvodce – Základy komponent – Dynamické komponenty](/guide/essentials/component-basics.html#dynamic-components)

## Efekt {#effect}

Viz [reaktivní efekt](#reactive-effect) a [vedlejší efekt](#side-effect).

## Událost {#event}

Používání událostí (events) pro komunikaci mezi různými částmi programu je běžné v&nbsp;mnoha oblastech programování. V rámci Vue se termín obvykle používá jak pro události nativních HTML prvků, tak pro události Vue komponent. Direktiva `v-on` se používá v šablonách k naslouchání oběma typům událostí.

Pro více podrobností viz:
- [Průvodce – Obsluha událostí](/guide/essentials/event-handling.html)
- [Průvodce – Události komponent](/guide/components/events.html)

## Fragment {#fragment}

Termín *Fragment* se odkazuje na speciální typ [VNode](#vnode), který se používá jako rodič pro další VNodes, ale sám nevykresluje žádné prvky.

Název pochází ze stejného konceptu jako [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) v nativním DOM API.

Fragmenty se používají k podpoře komponent s více root elementy. I když se takové komponenty mohou jevit jako s více kořeny, v pozadí používají fragmentový uzel jako jediný kořen, jako rodiče „root“ elementů.

Fragmenty jsou také používány kompilátorem šablon jako způsob obalení více dynamických uzlů, například těch vytvořených pomocí `v-for` nebo `v-if`. To umožňuje předávat další informace algoritmu pro úpravu [VDOM](#virtual-dom). Většina toho je řešena interně, ale jedno místo, kde se s tím můžete setkat přímo, je použití atributu `key` na elementu `<template>` s `v-for`. V tomto scénáři je `key` přidán jako [vlastnost (prop)](#prop) do fragmentového VNode.

Fragmentové uzly jsou v současné době vykreslovány do DOM jako prázdné textové uzly, byť jde o implementační detail. Můžete však na tyto textové uzly narazit, pokud používáte `$el` nebo se pokoušíte procházet DOM pomocí vestavěných API prohlížeče.

## Funkční komponenta {#functional-component}

Definice komponenty je obvykle objekt obsahující vlastnosti. Nemusí to tak vypadat, pokud používáte `<script setup>`, ale komponenta exportovaná z `.vue` souboru bude stále objektem.

*Funkční komponenta* (*Functional component*) je alternativní forma komponenty, která je deklarována pomocí funkce. Tato funkce slouží jako [funkce pro vykreslení](#render-function) pro komponentu.

Funkční komponenta nemůže mít vlastní stav. Také neprochází běžným životním cyklem komponenty, takže nemůžete používat lifecycle hooks. To je dělá o něco jednodušší než běžné stavové komponenty.

Pro více podrobností viz:
- [Průvodce – Funkce pro vykreslení a JSX – Funkční komponenty](/guide/extras/render-function.html#functional-components)

## Hoisting {#hoisting}

Termín *hoisting* se používá k označení spuštění části kódu předtím, než je dosažen, před ostatním kódem. Vykonávání je „vytaženo“ na dřívější bod.

JavaScript používá hoisting pro některé konstrukce, jako jsou `var`, `import` a deklarace funkcí.

V kontextu Vue aplikace používá kompilátor šablon  *statický hoisting* pro zlepšení výkonu. Při převodu šablony na vykreslovací funkci mohou být VNodes, které odpovídají statickému obsahu, vytvořeny jednou a poté znovu použity. Tyto statické VNodes jsou popsány jako hoisted, protože jsou vytvořeny mimo vykreslovací funkci, před jejím spuštěním. Podobná forma hoistingu se aplikuje na statické objekty nebo pole, které jsou generovány kompilátorem šablon.

Další podrobnosti naleznete zde:
- [Průvodce – Mechanismus vykreslování - Statický hoisting](/guide/extras/rendering-mechanism.html#static-hoisting)

## In-DOM šablona {#in-dom-template}

Existuje několik způsobů, jak definovat šablonu pro komponentu. Většinou je šablona poskytována jako string.

Termín *in-DOM šablona* (*in-DOM template*) se vztahuje na situaci, kdy je šablona poskytována ve formě DOM elementů, namísto řetězce. Vue poté převede DOM elementy na řetězec šablony pomocí `innerHTML`.

Obvykle in-DOM šablona začíná jako HTML přímo vepsané do HTML kódu stránky. Prohlížeč ji pak převede na DOM elementy, které použije Vue k přečtení `innerHTML`.

Další podrobnosti naleznete zde:
- [Průvodce – Vytvoření Vue aplikace – In-DOM šablona root komponenty](/guide/essentials/application.html#in-dom-root-component-template)
- [Průvodce – Základy komponent – Omezení při parsování in-DOM šablon](/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)
- [Možnosti: Options API: Vykreslování – #template](/api/options-rendering.html#template)

## Inject {#inject}

Viz [provide / inject](#provide-inject).

## Lifecycle hooks {#lifecycle-hooks}

Instance Vue komponenty prochází životním cyklem. Například je vytvořena (created), připojena (mounted), aktualizována (updated) a odpojena (unmounted).

*Lifecycle hooks* jsou způsobem, jak těmto událostem životního cyklu naslouchat.

S Options AP je každý hook poskytován jako samostatná sekce, např. `mounted`. Composition API místo toho používá funkce, jako například `onMounted()`.

Další podrobnosti naleznete zde:
- [Průvodce – Lifecycle hooks](/guide/essentials/lifecycle.html)

## Makro {#macro}

Viz [Makro překladače](#compiler-macro).

## Pojmenovaný slot {#named-slot}

Komponenta může mít více slotů, které se liší svým jménem. Sloty jiné než výchozí (default) slot se nazývají *pojmenované sloty* (*named slots*).

Další podrobnosti naleznete zde:
- [Průvodce – Sloty (Slots) - Pojmenované sloty](/guide/components/slots.html#named-slots)

## Options API {#options-api}

Vue komponenty jsou definovány pomocí objektů. Vlastnosti těchto objektů komponent se nazývají *možnosti* (*options*).

Komponenty mohou být psány ve dvou stylech. Jeden styl používá [Composition API](#composition-api) ve spojení s `setup` (buď pomocí volby `setup()` nebo `<script setup>`). Druhý styl nepoužívá přímo Composition API, ale místo toho používá různé možnosti komponent (options) k dosažení podobného výsledku. Možnosti komponent, které jsou použity tímto způsobem, se nazývají *Options API*.

Options API zahrnuje možnosti jako `data()`, `computed`, `methods` a `created()`.

Některé možnosti, jako `props`, `emits` a `inheritAttrs`, lze použít při tvorbě komponent s oběma API. Jelikož jsou to možnosti komponent, mohly by být považovány za součást Options API. Nicméně, jelikož tyto volby jsou také používány ve spojení se `setup()`, je obvykle lepší je považovat za sdílené mezi oběma styly komponent.

Samotná funkce `setup()` je možnost komponenty, takže by se *mohla* popsat jako součást Options API. Nicméně, to není běžný způsob používání termínu „Options API“. Místo toho se funkce `setup()` považuje za součást Composition API.

## Plugin {#plugin}

Zatímco termín *plugin* může být použit v široké škále kontextů, Vue má specifický koncept pluginu jako způsobu přidání funkcionality do aplikace.

Pluginy jsou přidávány do aplikace voláním `app.use(plugin)`. Samotný plugin je buď funkce nebo objekt s funkcí `install`. Tato funkce obdrží instanci aplikace a může poté provést cokoli, co potřebuje.

Pro více informací se podívejte na:
- [Průvodce – Pluginy](/guide/reusability/plugins.html)

## Vlastnosti (props) {#prop}

Existují tři běžné použití termínu *prop* ve Vue:

* Props komponenty
* Props VNode
* Props slotu

*Vlastnosti (props) komponenty* jsou to, na co většina lidí myslí při použití termínu „props“. Ty jsou explicitně definovány komponentou přes `defineProps()` nebo možnost `props`.

Termín *Props VNode* se odkazuje na vlastnosti objektu předaného jako druhý parametr do `h()`. Ty mohou zahrnovat vlastnosti (props) komponenty, ale také mohou obsahovat její události, nebo události, atributy a vlastnosti DOM. S vlastnostmi VNode se obvykle setkáte pouze tehdy, pokud pracujete s funkcemi pro vykreslení pro přímou manipulaci s&nbsp;VNodes.

*Props slotu* jsou vlastnosti předané do scoped slotu.

Ve všech případech jsou „props“ vlastnosti, které jsou předány z jiného místa.

I když je slovo „props“ odvozeno od slova *properties* (*vlastnosti*), termín „props“ má ve Vue mnohem specifičtější význam. Měli byste se vyvarovat jeho používání jako pouhé zkratky pro vlastnosti.

Pro více informací se podívejte na:
- [Průvodce – Vlastnosti (Props)](/guide/components/props.html)
- [Průvodce – Funkce pro vykreslení a JSX](/guide/extras/render-function.html)
- [Průvodce – Sloty (Slots) - Scoped sloty](/guide/components/slots.html#scoped-slots)

## Provide / Inject {#provide-inject}

`provide` a `inject` jsou formou komunikace mezi komponentami.

Když komponenta *poskytuje* (*provides*) hodnotu, všechny komponenty potomků mohou tuto hodnotu získat (implementovat) pomocí `inject`. Na rozdíl od vlastností (props) neví poskytující komponenta přesně, která komponenta hodnotu přijímá.

`provide` a `inject` se někdy používají pro zamezení *drillingu vlastností* (*prop drilling*). Mohou ovšem také sloužit jako implicitní způsob, jak komponenta komunikuje s obsahem svého slotu.

`provide` lze také použít na úrovni celé aplikace, čímž se hodnota stane dostupnou pro všechny komponenty v rámci této aplikace.

Pro více informací se podívejte na:
- [Průvodce – Provide / Inject](/guide/components/provide-inject.html)

## Reaktivní efekt {#reactive-effect}

*Reaktivní efekt* (*Reactive effect*) je součástí systému reaktivity ve Vue. Odkazuje se na proces sledování závislostí funkce a opětovného spuštění této funkce, když se hodnoty těchto závislostí změní.

Nejpřímočařejší způsob vytvoření tohoto efektu je `watchEffect()`. Různé části Vue reaktivní efekty interně používají, například aktualizace vykreslování komponent, `computed()` a `watch()`.

Vue může sledovat reaktivní závislosti pouze uvnitř reaktivního efektu. Pokud je hodnota vlastnosti čtena mimo reaktivní efekt, „ztratí“ svou reaktivitu ve smyslu, že pokud se tato vlastnost následně změní, Vue nebude vědět, co dělat.

Termín je odvozen od „vedlejšího efektu“ (side effect). Volání funkce reaktivního efektu je vedlejším efektem změny hodnoty vlastnosti.

Další podrobnosti naleznete zde:
- [Průvodce – Reaktivita podrobně](/guide/extras/reactivity-in-depth.html)

## Reaktivita {#reactivity}

Obecně se *reaktivita* (*reactivity*) odkazuje na schopnost automaticky provádět akce v&nbsp;reakci na změny dat. Například aktualizace DOM nebo vytváření síťového požadavku při změně hodnoty dat.

V kontextu Vue se reaktivita používá k popisu souboru funkcí. Tyto funkce se kombinují do *systému reaktivity* (*reactivity system*), který je zpřístupněn pomocí [Reactivity API](#reactivity-api).

Existuje několik různých způsobů, jak by mohl být  systém reaktivity implementován. Například by mohla být provedena statická analýza kódu pro určení jeho závislostí. Vue však tento způsob nepoužívá.

Místo toho systém reaktivity Vue sleduje přístup k vlastnostem za běhu. K tomu používá jak Proxy obálky (wrappers), tak [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) / [setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) funkce pro vlastnosti.

Další podrobnosti naleznete zde:
- [Průvodce – Základy reaktivity](/guide/essentials/reactivity-fundamentals.html)
- [Průvodce – Reaktivita podrobně](/guide/extras/reactivity-in-depth.html)

## Reactivity API {#reactivity-api}

*Reactivity API* je soubor základních funkcí Vue souvisejících s [reaktivitou](#reactivity). Tyto funkce lze používat nezávisle na komponentách. Zahrnuje funkce jako `ref()`, `reactive()`, `computed()`, `watch()` a `watchEffect()`.

Reactivity API je podmnožinou Composition API.

Další podrobnosti naleznete zde:
- [Reactivity API: Core](/api/reactivity-core.html)
- [Reactivity API: Utility](/api/reactivity-utilities.html)
- [Reactivity API: Pokročilé](/api/reactivity-advanced.html)

## ref {#ref}

> Tento záznam se zabývá použitím `ref` pro reaktivitu. Pro atribut `ref` používaný v&nbsp;šablonách se podívejte na [template ref](#template-ref).

`ref` je součástí systému reaktivity ve Vue. Jedná se o objekt s jedinou reaktivní vlastností, nazvanou `value`.

Existuje několik různých typů `ref`. Například `ref()`, `shallowRef()`, `computed()` a&nbsp;`customRef()`. Funkce `isRef()` se používá k ověření, zda se jedná o ref, a&nbsp;`isReadonly()` lze použít ke kontrole, zda ref umožňuje přímé přiřazení do své hodnoty.

Další podrobnosti naleznete zde:
- [Reactivity API: Core](/api/reactivity-core.html)
- [Reactivity API: Utility](/api/reactivity-utilities.html)
- [Reactivity API: Pokročilé](/api/reactivity-advanced.html)

## Funkce pro vykreslení {#render-function}

*Funkce pro vykreslení* (*render function*) je část komponenty, která generuje VNodes používané během vykreslování. Šablony jsou během kompilace převedeny na funkce pro&nbsp;vykreslení.

Další podrobnosti naleznete zde:
- [Průvodce – Funkce pro vykreslení a JSX](/guide/extras/render-function.html)

## Scheduler {#scheduler}

*Scheduler* je část interního systému Vue, která řídí časování spouštění [reaktivních efektů](#reactive-effect).

Když se změní reaktivní stav, Vue nevyvolá aktualizace vykreslování ihned. Místo toho jsou aktualizace dávkovány pomocí fronty. To zajišťuje, že se komponenta překreslí pouze jednou, i když se provede více změn v základních datech.

[Watchery](/guide/essentials/watchers.html) jsou také dávkovány pomocí fronty scheduleru. Watchery s `flush: 'pre'` (výchozí hodnota) se spustí před vykreslením komponenty, zatímco ty s `flush: 'post'` se spustí až po vykreslení komponenty.

Scheduler také používá úlohy k provádění různých dalších interních úkolů, jako je spouštění některých [lifecycle hooks](#lifecycle-hooks) a aktualizace [template ref](#template-ref).

## Scoped slot {#scoped-slot}

Termín *scoped slot* se používá k označení [slotu](#slot), který přijímá [vlastnosti (props)](#prop).

Historicky mělo Vue mnohem větší rozlišení mezi scoped a non-scoped sloty. Do jisté míry mohly být považovány za dvě samostatné funkce, sjednocené za společnou syntaxí v šabloně.

Ve Vue 3 bylo API slotů zjednodušeno tak, aby se všechny sloty chovaly jako scoped sloty. Nicméně, použití scoped a non-scoped slotů se často liší, takže termín stále slouží jako způsob odkazování na sloty s vlastnostmi.

Vlastnosti předané do slotu mohou být použity pouze v určité části rodičovské šablony, která je zodpovědná za definování obsahu slotu. Tato část šablony se chová jako rozsah platnosti pro vlastnosti slotu, odtud název „scoped“.

Pro více informací viz:
- [Průvodce – Sloty (Slots) - Scoped sloty](/guide/components/slots.html#scoped-slots)

## SFC {#sfc}

Viz [Single-File komponenta](#single-file-component).

## Vedlejší efekt {#side-effect}

Termín *vedlejší efekt* (*side effect*) není specifický pro Vue. Používá se k popisu operací nebo funkcí, které dělají něco navíc mimo svůj lokální rozsah.

Například, v kontextu nastavení vlastnosti jako `user.name = null`, se očekává, že toto změní hodnotu `user.name`. Pokud to také udělá něco jiného, například spustí systém reaktivity ve Vue, pak by to bylo označeno jako vedlejší efekt. To je původ termínu [reaktivní efekt](#reactive-effect) ve Vue.

Když je funkce popsána jako mající vedlejší efekty, znamená to, že funkce provádí nějakou akci kromě vrácení hodnoty, která je pozorovatelná mimo funkci. To může znamenat, že aktualizuje hodnotu stavu nebo spouští síťový požadavek.

Termín se často používá, když mluvíme o vykreslování nebo computed proměnných. Je považováno za dobrou praxi, aby vykreslování žádné vedlejší efekty nemělo. Stejně tak by je neměla mít getter funkce pro computed proměnnou.

## Single-File komponenta (SFC){#single-file-component}

Termín *Single-File komponenta* (*Single-File Component*), nebo SFC, se vztahuje na formát souboru `.vue`, který sepro Vue komponenty běžně používá.

Viz také:
- [Průvodce – Single-File komponenty (SFC)](/guide/scaling-up/sfc.html)
- [Specifikace syntaxe SFC](/api/sfc-spec.html)

## Slot {#slot}

Sloty se používají k předávání obsahu do komponent potomka. Zatímco vlastnosti (props) slouží k předávání datových hodnot, sloty slouží k předávání bohatšího obsahu sestávajícího z HTML elementů a dalších Vue komponent.

Další podrobnosti naleznete zde:
- [Průvodce – Sloty (Slots)](/guide/components/slots.html)

## Template ref {#template-ref}

Termín *template ref* se odkazuje na použití atributu `ref` na elementu uvnitř šablony. Po vykreslení komponenty se tento atribut použije k naplnění odpovídající vlastnosti buďto HTML elementem, nebo instancí komponenty, která odpovídá tagu ve šabloně.

Pokud používáte Options API, jsou refs dostupné jako vlastnosti objektu `$refs`.

S Composition API se template refs naplňují do reaktivního [ref](#ref) se stejným názvem.

Template refs by neměly být zaměňovány s reaktivními refs ze systému Vue reaktivity.

Další podrobnosti naleznete zde:
- [Průvodce – Template refs](/guide/essentials/template-refs.html)

## VDOM {#vdom}

Viz [virtuální DOM](#virtual-dom).

## Virtuální DOM {#virtual-dom}

Termín *virtuální DOM* (VDOM) není unikátní pro Vue. Jedná se o běžný princip používaný několika webovými frameworky pro správu aktualizací uživatelského rozhraní.

Prohlížeče používají strom elementů k reprezentaci aktuálního stavu stránky. Tento strom a JavaScriptová API používaná k interakci s ním se nazývají *document object model* nebo *DOM*.

Manipulace s DOM je hlavním omezením pro výkon. Virtuální DOM nabízí jednu strategii pro řešení tohoto problému.

Namísto přímého vytváření DOM elementů generují Vue komponenty popis toho, jaké DOM uzly by chtěly mít. Tyto popisy jsou běžné JS objekty, známé jako VNodes (virtuální DOM uzly). Vytváření VNodes je relativně levné.

Pokaždé, když se komponenta znovu vykresluje, je nový strom VNodes porovnán s&nbsp;předchozím stromem VNodes a jakékoli rozdíly jsou poté aplikovány na skutečný DOM. Pokud se nic nezměnilo, nemusí se DOM upravovat.

Vue používá hybridní přístup, který nazýváme [Překladačem informovaný virtuální DOM](/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom). Kompilátor šablon Vue je schopen aplikovat optimalizace výkonu na základě statické analýzy šablony. Namísto provádění úplného porovnání starého a nového stromu VNodes komponenty za běhu, může Vue použít informace extrahované kompilátorem k&nbsp;redukci porovnání pouze na ty části stromu, které se mohou skutečně změnit.

Pro více informací se podívejte na:
- [Průvodce – Mechanismus vykreslování](/guide/extras/rendering-mechanism.html)
- [Průvodce – Funkce pro vykreslení a JSX](/guide/extras/render-function.html)

## VNode {#vnode}

*VNode* je *virtuální DOM element*. Může být vytvořen pomocí funkce [`h()`](/api/render-function.html#h).

Více informací naleznete v sekci [virtuální DOM](#virtual-dom).

## Web Component {#web-component}

Standard *Web Components* je soubor funkcí implementovaných v moderních webových prohlížečích.

Vue komponenty nejsou Web Components, ale funkce `defineCustomElement()` může být použita k vytvoření [custom elementu](#custom-element) z Vue komponenty. Vue také podporuje použití custom elementů uvnitř Vue komponent.

Pro více informací se podívejte na:
- [Průvodce – Vue a Web Components](/guide/extras/web-components.html)
