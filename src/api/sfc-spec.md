# Specifikace syntaxe SFC {#sfc-syntax-specification}

## Přehled {#overview}

Vue Single-File komponenta (SFC), dle konvence označována příponou `*.vue`, je proprietární formát souboru, který používá syntaxi podobnou HTML k popisu Vue komponent. Vue SFC je syntakticky kompatibilní s HTML.

Každý soubor `*.vue` se skládá ze tří typů bloků nejvyšší úrovně: `<template>`, `<script>` a `<style>`, a volitelně dalších vlastních bloků:

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Ahoj, Vue!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  Toto může být například dokumentace komponenty.
</custom1>
```

## Jazykové bloky {#language-blocks}

### `<template>` {#template}

- Každý soubor `*.vue` může obsahovat maximálně jeden blok `<template>` nejvyšší úrovně.

- Obsah bude extrahován a předán do `@vue/compiler-dom`, předkompilován do JavaScriptových funkcí pro vykreslování a připojen k exportované komponentě jako její možnost (option) `render`.

### `<script>` {#script}

- Každý soubor `*.vue` může obsahovat maximálně jeden blok `<script>` (s výjimkou [`<script setup>`](/api/sfc-script-setup)).

- Skript je spuštěn jako ES modul.

- **Default export** by měl být objekt s možnostmi Vue komponenty, buď jako prostý objekt nebo jako návratová hodnota funkce [defineComponent](/api/general#definecomponent).

### `<script setup>` {#script-setup}

- Každý soubor `*.vue` může obsahovat maximálně jeden blok `<script setup>` (s&nbsp;výjimkou normálního `<script>`).

- Skript je předzpracován a používán jako `setup()` funkce komponenty, což znamená, že bude spuštěn **pro každou instanci komponenty**. Hlavní (top-level) vazby uvnitř `<script setup>` jsou automaticky vystaveny šabloně. Pro více informací se podívejte na [samostatnou dokumentaci pro `<script setup>`](/api/sfc-script-setup).

### `<style>` {#style}

- Každý soubor `*.vue` může obsahovat více bloků `<style>`.

- Element `<style>` může mít atributy `scoped` nebo `module` (podrobnosti naleznete na stránce [CSS funkce pro SFC](/api/sfc-css-features)), které pomáhají zapouzdřit styly do aktuální komponenty. V jedné komponentě mohou být smíchány různé značky `<style>` s&nbsp;různými režimy zapouzdření.

### Vlastní bloky {#custom-blocks}

Do souboru `*.vue` můžete navíc přidat další vlastní bloky pro potřeby konkrétního projektu, například blok `<docs>`. Některé příklady vlastních bloků z reálného světa zahrnují:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#i18n-custom-block)

Zpracování vlastních bloků závisí na nástrojích - pokud chcete vytvořit vlastní integrace, podívejte se pro další informace na sekci [Nástroje pro integraci vlastních SFC bloků](/guide/scaling-up/tooling#sfc-custom-block-integrations).

## Automatické odvození názvu {#automatic-name-inference}

SFC v následujících případech automaticky odvozuje název komponenty z jejího **názvu souboru**:

- Formátování varování pro vývojáře
- Inspekce v DevTools
- Rekurzivní odkaz na sebe sama, například soubor pojmenovaný `FooBar.vue` se může ve své šabloně odkazovat sám na sebe jako `<FooBar/>`. Toto má nižší prioritu než explicitně registrované/importované komponenty.

## Pre-Procesory {#pre-processors}

Bloky mohou pomocí atributu `lang` deklarovat programovací jazyk, v němž má proběhnout pre-processing. Nejběžnější případ je použití TypeScriptu pro blok `<script>`:

```vue-html
<script lang="ts">
  // použití TypeScriptu
</script>
```

`lang` lze použít na jakýkoli blok - například můžeme použít `<style>` se [Sass](https://sass-lang.com/) a&nbsp;`<template>` + [Pug](https://pugjs.org/api/getting-started.html):

```vue-html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

Dejte pozor, že integrace s různými pre-procesory se může lišit podle zvolené sady softwarových nástrojů. Pro příklady se podívejte do příslušné dokumentace:

- [Vite](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Importy `src` {#src-imports}

Pokud dáváte přednost rozdělení vašich `*.vue` komponent do více souborů, můžete použít atribut `src` pro import externího souboru do příslušného bloku jazyka:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Pozor na to, že pro importy pomocí `src` platí stejná pravidla pro zadávání cest jako pro požadavky na webpack moduly, což znamená:

- Relativní cesty musí začínat s `./`
- Můžete importovat zdroje z npm závislostí:

```vue
<!-- import souboru z nainstalovaného npm balíčku "todomvc-app-css" -->
<style src="todomvc-app-css/index.css" />
```

`src` importy fungují í s vlastními bloky, např.:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## Komentáře {#comments}

V každém bloku byste měli používat syntaxi komentářů používanou v daném jazyce (HTML, CSS, JavaScript, Pug, atd.). Pro komentáře na nejvyšší úrovni použijte syntaxi HTML komentářů: `<!-- obsah komentáře -->`
