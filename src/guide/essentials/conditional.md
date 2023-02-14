# Podmíněné vykreslování {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Lekce o podmíněném vykreslování ve Vue.js zdarma"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Lekce o podmíněném vykreslování ve Vue.js zdarma"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

Direktiva `v-if` se používá k podmíněnému vykreslení bloku. Blok bude vykreslen pouze v případě, že výraz direktivy vrátí pravdivou hodnotu.

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else` {#v-else}

Můžete použít direktivu `v-else` pro indikaci "else" bloku k `v-if`:

```vue-html
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Toggle</button>
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</div>

<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYXdlc29tZSA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJhd2Vzb21lID0gIWF3ZXNvbWVcIj50b2dnbGU8L2J1dHRvbj5cblxuXHQ8aDEgdi1pZj1cImF3ZXNvbWVcIj5WdWUgaXMgYXdlc29tZSE8L2gxPlxuXHQ8aDEgdi1lbHNlPk9oIG5vIPCfmKI8L2gxPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgXHRyZXR1cm4ge1xuXHQgICAgYXdlc29tZTogdHJ1ZVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJhd2Vzb21lID0gIWF3ZXNvbWVcIj50b2dnbGU8L2J1dHRvbj5cblxuXHQ8aDEgdi1pZj1cImF3ZXNvbWVcIj5WdWUgaXMgYXdlc29tZSE8L2gxPlxuXHQ8aDEgdi1lbHNlPk9oIG5vIPCfmKI8L2gxPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

Element `v-else` musí vždy následovat bezprostředně za `v-if` nebo za `v-else-if` - jinak nebude rozpoznán.

## `v-else-if` {#v-else-if}

Jak název `v-else-if` napovídá, slouží tato direktiva jako "else if" blok k `v-if`. Může být zřetězena i několikrát za sebou:

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

Stejně jako `v-else`, musí element `v-else-if` následovat bezprostředně po `v-if` nebo `v-else-if`.

## `v-if` na `<template>` {#v-if-on-template}

Protože je `v-if` direktiva, musí být připojena k jedinému prvku. Ale co když chceme přepnout více než jeden prvek? V tom případě můžeme použít `v-if` na element `<template>`, který slouží jako neviditelný obal. Konečný vykreslený výsledek nebude prvek `<template>` obsahovat.

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

Na `<template>` lze použít i `v-else` a `v-else-if`.

## `v-show` {#v-show}

Jiná možnost pro podmíněné zobrazení elementu je direktiva `v-show`. Použití je v zásadě to samé:

```vue-html
<h1 v-show="ok">Hello!</h1>
```

Rozdíl je v tom, že prvek s `v-show` bude vždy vykreslen a zůstane v DOM; `v-show` pouze přepíná vlastnost CSS elementu `display`.

`v-show` nelze použití na element `<template>` a také nefunguje dohromady s `v-else`.

## `v-if` vs. `v-show` {#v-if-vs-v-show}

`v-if` je "skutečné" podmíněné vykreslování, protože zajišťuje, že event listenery a vnořené komponenty uvnitř podmíněného bloku budou správně zničeny a znovu vytvořeny během přepínání.

`v-if` je také **lazy**: pokud je podmínka při počátečním vykreslení nepravdivá, neudělá nic - podmíněný blok se nevykreslí, dokud se podmínka poprvé nestane pravdivou.

Ve srovnání `v-show` je mnohem jednodušší - prvek je vždy vykreslen bez ohledu na počáteční podmínku, s přepínáním založeným na CSS.

Obecně řečeno, `v-if` má vyšší náklady na přepínání, zatímco `v-show` má vyšší počáteční náklady na vykreslování. Takže upřednostněte `v-show`, pokud potřebujete něco přepínat velmi často, a použijte `v-if`, pokud je nepravděpodobné, že se podmínka za běhu změní.

## `v-if` s `v-for` {#v-if-with-v-for}

::: warning Note
**Nedoporučuje se** používat `v-if` a `v-for` na stejném prvku kvůli jejich implicitní prioritě. Podrobnosti naleznete v [Průvodci stylováním](/style-guide/rules-essential.html#avoid-v-if-with-v-for).
:::

Když jsou `v-if` a `v-for` použity na stejném prvku, bude nejprve vyhodnoceno `v-if`. Podrobnosti naleznete v [průvodci vykreslováním seznamu](list#v-for-with-v-if).
