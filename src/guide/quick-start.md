---
footer: false
---

# Jak začít {#quick-start}

## Vyzkoušejte Vue Online {#try-vue-online}

- Pokud si chcete Vue rychle vyzkoušet, lze použít přímo naše [Hřiště](https://sfc.vuejs.org/#eNo9j01qAzEMha+iapMWOjbdDm6gu96gG2/cjJJM8B+2nBaGuXvlpBMwtj4/JL234EfO6toIRzT1UObMexvpN6fCMNHRNc+w2AgwOXbPL/caoBC3EjcCCPU0wu6TvE/wlYqfnnZ3ae2PXHKMfiwQYArZOyYhAHN+2y9LnwLrarTQ7XeOuTFch5Am8u8WRbcoktGPbnzFOXS3Q3BZXWqKkuRmy/4L1eK4GbUoUTtbPDPnOmpdj4ee/1JVKictlSot8hxIUQ3Dd0k/lYoMtrglwfUPkXdoJg==).

- Pokud máte raději čistě HTML setup bez dalších build kroků, můžete jako váš počáteční bod využít toto [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/).

- Pokud už ovládáte Note.js a koncept build nástrojů, můžete si také vyzkoušet kompletní build setup ve vašem prohlížeči na [StackBlitz](https://vite.new/vue).

## Vytvoření Vue aplikace {#creating-a-vue-application}

:::tip Předpoklady

- Znalost použití command line
- Nainstalovaný [Node.js](https://nodejs.org/) ve verzi 16.0 nebo vyšší
  :::

V této sekci si ukážeme jak vystavět základ Vue [Single Page aplikaci](/guide/extras/ways-of-using-vue.html#single-page-application-spa) na vašem lokálním počítači. Vytvořený projekt bude používat build setup založený na [Vite](https://vitejs.dev) a umožní nám použít Vue [Single-File Components](/guide/scaling-up/sfc) (SFCs).

Zkontrolujte, že máte nainstalovanou aktuální verzi [Node.js](https://nodejs.org/) a poté spusťte následující příkaz ve vašem příkazovém řádku (bez znaku `>`):

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Tento příkaz nainstaluje a spustí [create-vue](https://github.com/vuejs/create-vue), oficiální nástroj Vue pro přípravu základů nové aplikace. Objeví se vstup s několika možnostmi nastavení jako je TypeScript a podpora testování:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">jmeno-vaseho-projektu</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Cypress for both Unit and End-to-End testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">jmeno-vaseho-projektu</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Pokud si nejste nastavením jisti, zvolte prozatím jednoduše volbu `No` stisknutím Enter. Poté, co je projekt vytvořen, zadejte následující příkazy pro instalaci závislostí a spuštění vývojového (dev) serveru:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">jmeno-vaseho-projektu</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm install</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run dev</span></span>
<span class="line"></span></code></pre></div>

Nyní by už váš první Vue projekt měl běžet! Všimněte si, že ukázkové komponenty ve vygenerovaném projektu jsou napsány s využitím [Composition API](/guide/introduction.html#composition-api) a `<script setup>`, a nikoliv v [Options API](/guide/introduction.html#options-api). Zde jsou nějaké další tipy:

- Doporučené vývojové prostředí (IDE) je [Visual Studio Code](https://code.visualstudio.com/) + [plugin Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Pokud používáte jiný editor, zkontrolujte [sekci IDE podpory](/guide/scaling-up/tooling.html#ide-support).
- Více o vývojových nástrojích vč. integrace s frameworky pro backend, je řešeno v sekci [Tooling průvodci](/guide/scaling-up/tooling.html).
- Pokud se chcete dozvědět víc o build nástroji Vite v pozadí, podívejte se na [Vite dokumentaci](https://vitejs.dev).
- Pokud si vyberete použití TypeScriptu, podívejte se na [průvodce použitím TypeScriptu](typescript/overview.html).

Jakmile budete připraveni nasadit vaši aplikaci do produkce, spusťte následující:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

Příkaz vytvoří build připravený k produkčnímu nasazení aplikace v podsložce `./dist` uvnitř projektu. Podívejte se na [průvodce Produkčním nasazením](/guide/best-practices/production-deployment.html), abyste se o nasazování vaší aplikace do produkce dozvěděli víc.

[Další kroky >](#next-steps)

## Použití Vue z CDN {#using-vue-from-cdn}

Můžete použít distribuci Vue přímo z CDN úložiště pomocí script tagu:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Zde jsme použili [unpkg](https://unpkg.com/), ale je možné využití jakékoliv CDN které umí distribuovat npm balíčky, například [jsdelivr](https://www.jsdelivr.com/package/npm/vue) nebo [cdnjs](https://cdnjs.com/libraries/vue). Samozřejmě si můžete soubor také stáhnout a distribuovat sami.

Při použití Vue z CDN není v procesu žádný "build step". Díky tomu je příprava mnohem jednodušší. Je to vhodné např. pro obohacení statického HTML nebo integraci s backend frameworkem. Nicméně nebudete moci použít Single-File Component (SFC) syntaxi.

### Použití globálního buildu {#using-the-global-build}

výše uvedený odkaz vede na *globalní build* Vue, kde jsou všechny API nejvyšší úrovně publikované jako vlastnosti globálního `Vue` objektu. Zde je kompletní příklad s použitím globálního buildu:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[JSFiddle demo](https://jsfiddle.net/yyx990803/nw1xg8Lj/)

### Použití ES Module buildu {#using-the-es-module-build}

Ve zbytku dokumentace budeme primárně používat [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) syntaxi. Téměř všechny moderní prohlížeče dnes přirozeně podporují ES moduly, takže můžeme použít Vue z CDN přes nativní ES moduly takto:

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

Všimněte si, že používáme `<script type="module">` a importovaná CDN URL vede na  **ES modules build** verzi Vue.

[JSFiddle demo](https://jsfiddle.net/yyx990803/vo23c470/)

### Použití Import map {#enabling-import-maps}

Ve výše uvedeníém příkladu importujeme z plné CDN URL, ale ve většině následující dokumentace uvidíte kód podobný tomuto:

```js
import { createApp } from 'vue'
```

Můžeme naučit prohlížeč, kde najde `vue` import s využitím [Import Maps](https://caniuse.com/import-maps):

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[JSFiddle demo](https://jsfiddle.net/yyx990803/2ke1ab0z/)

Do import mapy můžete přidat i záznamy pro další závislosti - ujistěte se ale, že ukazují na ES modules verzi knihovny, kterou chcete použít.

:::tip Podpora Import Maps v prohlížečích
Import mapy jsou defaultně podporované v Chromium-based prohlížečích, takže během učení doporučujeme používat Chrome nebo Edge.

Pokud používáte Firefox, podpora je až od verze 102+ a v tuto chvíli je nutné ji povolit přes nastavení `dom.importMaps.enabled`  v `about:config`.

Pokud váš oblíbený prohlížeč import mapy zatím nepodporuje, můžete použít polyfill [es-module-shims](https://github.com/guybedford/es-module-shims).
:::

:::warning Poznámka k produkčnímu použití
Dosavadní příklady jsou používány při development buildech Vue - pokud chcete Vue z CDN používat i v produkci, nezapomeňte zkonzultovat [Průvodce produkčním nasazením](/guide/best-practices/production-deployment.html#without-build-tools).
:::

### Rozdělování modulů {#splitting-up-the-modules}

Jak se budeme nořit hlouběji do příručky, možná budete potřebovat rozdělit kód do samostatných JavaScript souborů, aby je bylo možné jednodušeji udržovat. Například:

```html
<!-- index.html -->
<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

```js
// my-component.js
export default {
  data() {
    return { pocet: 0 }
  },
  template: `<div>Počet je {{ pocet }}</div>`
}
```

Pokud otevřete výše uvedené `index.html` v prohlížeči, uvidíte, že stránka vrací chybu, protože ES moduly neumí pracovat přes  `file://` protokol. Aby to mohlo fungovat, musíte svůj `index.html` vystavit přes `http://` protokol,  pomocí lokálního HTTP serveru.

Pro spuštění lokálního HTTP serveru napřed nainstalujte [Node.js](https://nodejs.org/en/) a potom zadejte `npx serve` z příkazové řádky ve stejném adresáři, v jakém je váš HTML soubor. Můžete použít i jakýkoliv jiný HTTP server, který umí poskytovat statické soubory se správnými MIME typy.

Mohli jste si povšimnout, že šablona importované komponenty je zapsaná jako inline JavaScript řetězec. Pokud používáte VSCode, můžete nainstalovat [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) rozšíření a uvodit řetězce předponou `/*html*/` pro zapnutí zvýraznění syntaxe.

### Použití Composition API bez Build fáze {#using-composition-api-without-a-build-step}

Řada příkladů pro Composition API bude používat `<script setup>` syntaxi. Pokud plánujete používat Composition API bez build fáze,
podívejte se na použití [`setup()` option](/api/composition-api-setup.html).

## Další kroky {#next-steps}

Pokud jste překročili [Představení](/guide/introduction), silně doporučujme přečíst si ho předtím, než se pustíte do zbytku dokumentace.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">Pokračovat s příručkou</p>
    <p class="next-steps-caption">Příručka vás detailně provede všemi vlastnostmi frameworku.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Vyzkoušejte tutorial</p>
    <p class="next-steps-caption">Pro ty, kterým vyhovuje, když si mohou věci sami vyzkoušet.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Podívejte se na příklady</p>
    <p class="next-steps-caption">Prozkoumejte příklady základních vlastností a běžných UI úkolů.</p>
  </a>
</div>
