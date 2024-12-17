# Single-File komponenty (SFC) {#single-file-components}

## Úvod {#introduction}

Vue Single-File komponenty (alias `*.vue` soubory, zkráceně **SFC**) jsou speciální formát souboru, který nám umožňuje zapouzdřit šablonu, logiku **a** stylování Vue komponenty do jednoho souboru. Zde je příklad SFC:

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Ahoj, Vue!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Ahoj, Vue!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

Jak můžeme vidět, Vue SFC je přirozeným rozšířením klasické trojice HTML, CSS a&nbsp;JavaScriptu. Bloky `<template>`, `<script>` a `<style>` zapouzdřují a umisťují zobrazení, logiku a stylování komponenty do stejného souboru. Úplná syntaxe je definována ve [specifikaci syntaxe SFC](/api/sfc-spec).

## Proč používat SFC {#why-sfc}

I když je pro použití SFC potřeba build fáze, existuje mnoho výhod:

- Vytváření modulárních komponent pomocí známé syntaxe HTML, CSS a JavaScriptu
- [Umístění inherentně provázaných zájmů na jednom místě](#what-about-separation-of-concerns)
- Předkompilované šablony bez nákladů na runtime kompilaci
- [CSS omezené na rozsah komponenty](/api/sfc-css-features)
- [Pohodlnější syntaxe při práci s Composition API](/api/sfc-script-setup)
- Více optimalizací během kompilace díky vzájemné analýze šablony a skriptu
- [Podpora v IDE](/guide/scaling-up/tooling#ide-support) s automatickým doplňováním a typovou kontrolou pro výrazy v šabloně
- Out-of-the-box podpora pro Hot-Module Replacement (HMR)

SFC je klíčovou vlastností Vue jako frameworku a je doporučeným přístupem pro použití Vue v následujících scénářích:

- Single-page aplikace (SPA)
- Statické generování stránek (SSG)
- Jakýkoli složitější frontend, kde je možné odůvodnit využití build fáze pro lepší development experience (DX).

Navzdory dosud řečenému si uvědomujeme, že existují i případy užití, kdy se SFC mohou jevit zbytečně složité. Proto je možné Vue stále používat jen pomocí čistého JavaScriptu bez build fáze. Pokud se chcete zaměřit pouze na vylepšení převážně statického HTML s lehkými interakcemi, můžete se také podívat na [petite-vue](https://github.com/vuejs/petite-vue), což je 6&nbsp;kB podmnožina Vue optimalizovaná pro progresivní vylepšování.

## Jak to funguje {#how-it-works}

Vue SFC je specifický formát souboru pro framework a musí být předkompilován pomocí [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) do standardního JavaScriptu a CSS. Kompilovaná SFC je standardní JavaScriptový (ES) modul, což znamená, že s odpovídajícím nastavením buildu můžete SFC importovat jako modul:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

Tagy `<style>` uvnitř SFC jsou během vývoje obvykle implementovány jako nativní `<style>` tagy, aby byla podporována okamžitá aktualizace (hot reload). Pro produkci mohou být extrahovány a sloučeny do jednoho CSS souboru.

S SFC si můžete hrát a prozkoumat, jak jsou kompilovány, na našem [Hřišti](https://play.vuejs.org/).

V reálných projektech obvykle integrujeme kompilátor SFC s build nástrojem, jako je [Vite](https://vitejs.dev/) nebo [Vue CLI](http://cli.vuejs.org/) (který je založen na [webpack](https://webpack.js.org/)), a Vue poskytuje oficiální nástroje pro vytvoření základní struktury SFC, abyste mohli začít co nejdříve. Podrobnosti najdete v&nbsp;sekci [Nástroje pro SFC](/guide/scaling-up/tooling).

## Jak je to s oddělením zájmů? {#what-about-separation-of-concerns}

Někteří uživatelé zvyklí na tradiční přístup k vývoji webových stránek mohou mít obavy, že SFC míchají různé zájmy (concerns) na jednom místě - zatímco HTML/CSS/JS by měly být oddělené!

Na tuto otázku je důležité si uvědomit, že **oddělení zájmů není to samé jako oddělení typů souborů**. Konečným cílem inženýrských principů je zlepšit udržovatelnost kódu. Oddělení zájmů, pokud je aplikováno dogmaticky jako oddělení typů souborů, nám v&nbsp;kontextu stále složitějších frontendových aplikací nepomáhá tohoto cíle dosáhnout.

V moderním vývoji uživatelského rozhraní jsme zjistili, že namísto rozdělení kódu do tří obrovských vrstev, které se vzájemně proplétají, je mnohem smysluplnější rozdělit jej do volně provázaných komponent a ty skládat. Uvnitř komponenty jsou její šablona, logika a&nbsp;styly neoddělitelně propojeny a umístěním dohromady se komponenta stává koherentnější a snáze udržovatelnou.

Poznámka: I kdyby se vám myšlenka Single-File komponent nelíbila, stále můžete využít jejich funkce pro automatické načítání a předkompilaci oddělením JavaScriptu a CSS do samostatných souborů pomocí [`src` importů](/api/sfc-spec#src-imports).
