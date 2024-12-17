---
footer: false
---

# Úvod {#introduction}

:::info Toto je dokumentace pro Vue 3!

- Podpora Vue 2 skončila 31. prosince 2023. Více v příspěvku [Vue 2 EOL](https://v2.vuejs.org/eol/).
- Chcete Vue 2 povýšit na Vue 3? Podívejte se na [Návod na migraci](https://v3-migration.vuejs.org/).
  :::

<style src="@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses/" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Vue Mastery banner" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">Naučte se Vue s video-tutoriály na <span>VueMastery.com</span></p>
    <div class="logo-wrapper">
        <img alt="Vue Mastery Logo" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## Co je to Vue? {#what-is-vue}

Vue (výslovnost /vjú/) je JavaScriptový framework pro tvorbu uživatelského rozhraní. Je&nbsp;postaven na standardech HTML, CSS a JavaScriptu a poskytuje deklarativní programovací model orientovaný na komponenty, který pomáhá efektivně vyvíjet libovolně složitá UI.

Zde je minimální příklad:

<div class="options-api">

```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```

</div>
<div class="composition-api">

```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```

</div>

```vue-html
<div id="app">
  <button @click="count++">
    Počet: {{ count }}
  </button>
</div>
```

**Výsledek**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    Počet: {{ count }}
  </button>
</div>

Výše uvedený příklad ukazuje dva klíčové principy Vue:

- **Deklarativní vykreslování**: Vue rozšiřuje standardní HTML o tzv. template syntaxi, což umožňuje deklarativně popisovat HTML výstup založený na JavaScript proměnných.

- **Reaktivita**: Vue automaticky sleduje změny stavu JavaScript proměnných a efektivně aktualizuje DOM zobrazené stránky, když dojde ke změně.

Pokud k tomu už teď máte otázky, žádný strach. Ve zbytku dokumentace pokryjeme každý jednotlivý detail. Prozatím prosím pokračujte ve čtení, ať získáte obecné povědomí o tom, co Vue nabízí.

:::tip Předpoklady
Zbytek dokumentace předpokládá základní znalost HTML, CSS a JavaScriptu. Pokud je pro vás frontend vývoj úplnou novinkou, není možná nejlepší nápad vrhnout se jako první rovnou na framework. Raději se napřed trochu seznamte se základy a teprve poté se vraťte zpět! Úroveň svých znalostí si můžete vyzkoušet na těchto [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript), [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) a [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps) přehledech. Předchozí zkušenost s jinými frameworky pomůže, ale není nezbytná.
:::

## Progresivní framework {#the-progressive-framework}
Vue je framework a ekosystém, který pokrývá většinu z běžných potřeb frontendového vývoje. Ale internet je extrémně různorodý - věci, které na webových stránkách tvoříme se mohou dramaticky lišit ve formě i objemu. Vue bylo s přihlédnutím k tomu navrženo tak, aby bylo flexibilní a přírůstkově adaptibilní. V závislosti na vašich potřebách, může být Vue používáno různými způsoby:

- Obohacení statických HTML bez build fáze
- Webová komponenta (Web Component) vložená do jakékoli stránky
- Single-Page Application (SPA)
- Fullstack / Server-Side Rendering (SSR)
- Jamstack / Static Site Generation (SSG)
- Použitelné pro desktop, mobilní zařízení, WebGL a dokonce i terminál

Pokud vám tyto pojmy přijdou strašidelné, nebojte se! Tento tutoriál a průvodce vyžaduje pouze základní znalost HTML a JavaScriptu a nemusíte být odborník na žádnou z výše uvedených oblastí.

Pokud jste zkušený vývojář, kterého zajímá, jak nejlépe zapracovat Vue do svého portfolia, nebo jste zvědaví co tyto pojmy znamenají, rozebíráme je více podrobně ve [Způsobech použití Vue](/guide/extras/ways-of-using-vue).

Navzdory flexibilitě jsou základní znalosti o fungování Vue sdílené napříč všemi způsoby použití. I pokud jste nyní pouze začátečník, znalosti získané zde vám budou užitečné na další cestě při zdolávání více ambiciózních cílů v budoucnosti. Pokud už jste veterán, můžete si vybrat optimální způsob využití Vue podle toho, jaké problémy se právě snažíte řešit, a přitom si zachovat stejnou úroveň produktivity. Proto nazýváme Vue "Progresivní Framework": je to technologie, která může růst spolu s vámi a přizpůsobovat se vašim potřebám.

## Single-File komponenty {#single-file-components}

Ve většině Vue projektů s build fází používáme Vue komponenty v souborovém formátu á la HTML nazývaném **Single-File Component** (také známé jako `*.vue` soubory, zkráceně **SFC**). Vue SFC, jak název napovídá, obaluje do jednoho souboru logiku (JavaScript), šablonu (HTML) a styly (CSS). Zde je přechozí příklad přepsaný do SFC formátu:

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Počet: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Počet: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>

SFC je určující vlastnost Vue a je to doporučený postup, jak tvořit Vue komponenty, **pokud** vaše použití zahrnuje build fázi. Více o tématu [jak a proč na SFC](/guide/scaling-up/sfc) najdete v&nbsp;příslušné kapitole. Prozatím je potřeba vědět, že Vue za vás zvládne veškeré nastavení build nástrojů.

## API styly {#api-styles}

Vue komponenty lze tvořit dvěma odlišnými API styly: **Options API** a **Composition API**.

### Options API {#options-api}

S Options API definujeme logiku komponent jako objekt s možnostmi (options) jako jsou `data`, `methods`, and `mounted`. Definované možnosti jsou přístupné přes `this` uvnitř funkcí, které odkazují na instanci komponenty:

```vue
<script>
export default {
  // možnosti vrácené z data() budou mít reaktivní stav
  // a budou přístupné přes `this`
  data() {
    return {
      pocet: 0
    }
  },

  // funkce, které mění stav a spouští aktualizace
  // mohou být navázány jako 'event listener' v šablonách
  methods: {
    increment() {
      this.pocet++
    }
  },

  // tzv. 'lifecycle hooks' jsou volané v různých stavech
  // životního cyklu komponenty
  // Tato funkce se za volá ve chvíli připojení (mount) komponenty do DOM
  mounted() {
    console.log(`Výchozí počet je ${this.pocet}.`)
  }
}
</script>

<template>
  <button @click="increment">Počet: {{ pocet }}</button>
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNptkMFqxCAQhl9lkB522ZL0HNKlpa/Qo4e1ZpLIGhUdl5bgu9es2eSyIMio833zO7NP56pbRNawNkivHJ25wV9nPUGHvYiaYOYGoK7Bo5CkbgiBBOFy2AkSh2N5APmeojePCkDaaKiBt1KnZUuv3Ky0PppMsyYAjYJgigu0oEGYDsirYUAP0WULhqVrQhptF5qHQhnpcUJD+wyQaSpUd/Xp9NysVY/yT2qE0dprIS/vsds5Mg9mNVbaDofL94jZpUgJXUKBCvAy76ZUXY53CTd5tfX2k7kgnJzOCXIF0P5EImvgQ2olr++cbRE4O3+t6JxvXj0ptXVpye1tvbFY+ge/NJZt)

### Composition API {#composition-api}

S Composition API definujeme komponentu importem API funkcí. V SFC souborech se Compostion API typicky používá spolu se [`<script setup>`](/api/sfc-script-setup). Atribut `setup` je příznak pro Vue k použití transformací během kompilace, které umožňují použití Composition API s&nbsp;menším množstvím boilerplate kódu. Například importy a proměnné/funkce nejvyšší úrovně deklarované uvnitř `<script setup>` mohou být přímo použity v šabloně.

Zde je ta samá komponenta, s úplně stejnou šablonou, ale s použitím Composition API a&nbsp;`<script setup>`:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// reaktivní stav
const pocet = ref(0)

// funkce, která mění stav a spouští aktualizace
function increment() {
  pocet.value++
}

// 'lifecycle hook'
onMounted(() => {
  console.log(`Výchozí počet je ${pocet.value}.`)
})
</script>

<template>
  <button @click="increment">Počet: {{ pocet }}</button>
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNpNkMFqwzAQRH9lMYU4pNg9Bye09NxbjzrEVda2iLwS0spQjP69a+yYHnRYad7MaOfiw/tqSliciybqYDxDRE7+qsiM3gWGGQJ2r+DoyyVivEOGLrgRDkIdFCmqa1G0ms2EELllVKQdRQa9AHBZ+PLtuEm7RCKVd+ChZRjTQqwctHQHDqbvMUDyd7mKip4AGNIBRyQujzArgtW/mlqb8HRSlLcEazrUv9oiDM49xGGvXgp5uT5his5iZV1f3r4HFHvDprVbaxPhZf4XkKub/CDLaep1T7IhGRhHb6WoTADNT2KWpu/aGv24qGKvrIrr5+Z7hnneQnJu6hURvKl3ryL/ARrVkuI=)

### Co si vybrat? {#which-to-choose}

Oba API styly jsou schopné běžné případy užití plně pokrýt. Jsou to různá rozhraní nad stejným systémem v pozadí. Options API je vlastně implementováno nad Composition API! Základní koncepty a znalosti o Vue jsou sdíleny nad oběma styly.

Options API se zaměřuje na koncept "instance komponenty" (`this` jak je vidět v&nbsp;příkladu), což je typicky bližší uživatelům zvyklým na mentální model založený na třídách z objektově orientovaných programovacích jazyků (OOP). Je také lépe přístupnější začátečníkům tím, že abstrahuje detaily o reaktivitě a vynucuje organizaci kódu přes skupiny možností.

Composition API je zaměřeno na deklarování reaktivních proměnných přímo ve funkčním rámci a skládáním stavu dohromady z různých funkcí tak, aby bylo možné zvládnout jejich komplexitu. Je to volnější forma a vyžaduje porozumění, jak funguje reaktivita ve Vue, aby bylo možné ji používat efektivně. Výměnou za to její flexibilita umožňuje silnější vzory pro organizaci a znovupoužití logiky.

Více o porovnání těchto dvou stylů a potenciálních přínosech Composition API si můžete přečíst v [FAQ o Composition API](/guide/extras/composition-api-faq).

Pokud jste ve Vue nováčky, zde je naše základní doporučení:

- Pro učení zvolte styl, který vám připadá jednodušší na pochopení. Opakujeme, že většina klíčových konceptů je sdílena mezi oběma styly. Vždy si můžete později zvolit druhý styl.

- Pro produkci:

  - Zvolte Options API, pokud nepoužíváte build nástroje, nebo máte v plánu Vue použít primárně pro méně složité scénáře, např. progresivní vylepšení.

  - Zvolte Composition API + Single-File komponenty (SFC), pokud plánujete ve Vue vytvořit celou aplikaci.

V průběhu vašeho učení se nemusíte upsat jednomu stylu. Zbytek dokumentace poskytuje tam, kde to je možné, příklady kódu pro oba styly, a můžete mezi nimi kdykoli přepínat pomocí **přepínače API preference** nahoře ve sloupci levého menu.

## Máte další otázky? {#still-got-questions}

Podívejte se na [FAQ - často kladené dotazy](/about/faq).

## Vyberte si další cestu {#pick-your-learning-path}

Různí vývojáři mají různé způsoby učení. Vyberte si způsob, který vyhovuje vašim preferencím. Ačkoli, pokud je to možné, doporučujeme postupně projít všechen obsah!

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Vyzkoušejte tutoriál</p>
    <p class="next-steps-caption">Pro ty, kterým vyhovuje, když si mohou věci sami vyzkoušet.</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Přečtěte si průvodce</p>
    <p class="next-steps-caption">Průvodce vás detailně provede všemi vlastnostmi frameworku.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Podívejte se na příklady</p>
    <p class="next-steps-caption">Prozkoumejte příklady základních vlastností a běžných UI úkolů.</p>
  </a>
</div>
