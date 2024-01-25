---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Jak začít {#quick-start}

## Vyzkoušejte Vue online {#try-vue-online}

- Pokud si chcete Vue rychle vyzkoušet, lze ho spustit přímo v našem [Hřišti](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==).

- Pokud máte raději čistě HTML setup bez build fáze, můžete jako počáteční bod využít toto [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/).

- Pokud už ovládáte Note.js a koncept build nástrojů, můžete si kompletní build vyzkoušet jen ve vašem prohlížeči na [StackBlitz](https://vite.new/vue).

## Vytvoření Vue aplikace {#creating-a-vue-application}

:::tip Předpoklady

- Znalost použití příkazového řádku (command line)
- Nainstalovaný [Node.js](https://nodejs.org/) ve verzi 18.0 nebo vyšší
  :::

V této sekci si ukážeme jak vystavět základ Vue [Single Page aplikaci](/guide/extras/ways-of-using-vue#single-page-application-spa) na vašem lokálním počítači. Vytvořený projekt bude používat build setup založený na [Vite](https://vitejs.dev) a umožní nám použít Vue [Single-File komponenty](/guide/scaling-up/sfc) (SFCs).

Zkontrolujte, že máte nainstalovanou nejnovější verzi [Node.js](https://nodejs.org/) a váš aktuální pracovní adresář je ten, v němž chcete založit projekt. Spusťte ve vašem příkazovém řádku následující příkaz (bez znaku `$`):

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ npm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">
  
  ```sh
  $ pnpm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">
  
  ```sh
  $ yarn create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">
  
  ```sh
  $ bun create vue@latest
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

Tento příkaz nainstaluje a spustí [create-vue](https://github.com/vuejs/create-vue), oficiální nástroj Vue pro přípravu základů nové aplikace. Objeví se vstup s několika možnostmi nastavení jako je TypeScript a&nbsp;podpora testování:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">jmeno-vaseho-projektu</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add an End-to-End Testing Solution? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">jmeno-vaseho-projektu</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Pokud si nejste nastavením jisti, zvolte prozatím jednoduše stisknutím Enter volbu `No`. Poté, co je projekt vytvořen, zadejte následující příkazy pro instalaci závislostí a spuštění vývojového (dev) serveru:

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ cd <jmeno-vaseho-projektu>
  $ npm install
  $ npm run dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">
  
  ```sh
  $ cd <jmeno-vaseho-projektu>
  $ pnpm install
  $ pnpm run dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">
  
  ```sh
  $ cd <jmeno-vaseho-projektu>
  $ yarn
  $ yarn dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">
  
  ```sh
  $ cd <jmeno-vaseho-projektu>
  $ bun install
  $ bun run dev
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

Nyní by už váš první Vue projekt měl běžet! Všimněte si, že ukázkové komponenty ve vygenerovaném projektu jsou napsány s využitím [Composition API](/guide/introduction#composition-api) a `<script setup>`, a&nbsp;nikoli v [Options API](/guide/introduction#options-api). Zde jsou nějaké další tipy:

- Doporučené vývojové prostředí (IDE) je [Visual Studio Code](https://code.visualstudio.com/) + [plugin Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Pokud používáte jiný editor, zkontrolujte [sekci podpory v IDE](/guide/scaling-up/tooling#ide-support).
- Více o vývojových nástrojích vč. integrace s frameworky pro backend, je řešeno v&nbsp;sekci [Nástroje](/guide/scaling-up/tooling).
- Pokud se chcete dozvědět víc o build nástroji Vite v pozadí, podívejte se na [dokumentaci pro Vite](https://vitejs.dev).
- Pokud si vyberete použití TypeScriptu, podívejte se na [průvodce použitím TypeScriptu](typescript/overview).

Jakmile budete připraveni nasadit vaši aplikaci do produkce, spusťte následující:

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ npm run build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">
  
  ```sh
  $ pnpm run build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">
  
  ```sh
  $ yarn build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">
  
  ```sh
  $ bun run build
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

Příkaz vytvoří build připravený k produkčnímu nasazení aplikace v podsložce `./dist` uvnitř projektu. Podívejte se na [průvodce Nasazením do produkce](/guide/best-practices/production-deployment), abyste se o&nbsp;nasazování vaší aplikace do produkce dozvěděli víc.

[Další kroky >](#next-steps)

## Použití Vue z CDN {#using-vue-from-cdn}

Můžete použít distribuci Vue přímo z CDN úložiště pomocí script tagu:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Zde jsme použili [unpkg](https://unpkg.com/), ale je možné využití jakékoli CDN které umí distribuovat npm balíčky, například [jsdelivr](https://www.jsdelivr.com/package/npm/vue) nebo [cdnjs](https://cdnjs.com/libraries/vue). Samozřejmě si můžete soubor také stáhnout a&nbsp;distribuovat sami.

Při použití Vue z CDN není v procesu žádná build fáze. Díky tomu je příprava mnohem jednodušší. Je to vhodné např. pro obohacení statického HTML nebo integraci s&nbsp;backend frameworkem. Nicméně nebudete moci použít SFC syntaxi.

### Použití globálního buildu {#using-the-global-build}

Výše uvedený odkaz vede na _globalní build_ Vue, kde jsou všechny API nejvyšší úrovně publikované jako vlastnosti globálního `Vue` objektu. Zde je kompletní příklad s použitím globálního buildu:

<div class="options-api">

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

[Codepen demo](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/eYQpQEG)

:::tip
Řada příkladů pro Composition API napříč celým průvodcem bude používat syntaxi `<script setup>`, která vyžaduje build nástroje. Pokud plánujete používat Composition API bez build fáze, podívejte se na použití [hooku `setup()`](/api/composition-api-setup).
:::

</div>

### Použití ES Module buildu {#using-the-es-module-build}

Ve zbytku dokumentace budeme primárně používat [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) syntaxi. Téměř všechny moderní prohlížeče dnes přirozeně podporují ES moduly, takže můžeme použít Vue z&nbsp;CDN přes nativní ES moduly takto:

<div class="options-api">

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

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

Všimněte si, že používáme `<script type="module">` a importovaná CDN URL vede na  **ES modules build** verzi Vue.

<div class="options-api">

[Codepen demo](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[Codepen demo](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### Použití Import map {#enabling-import-maps}

Ve výše uvedeníém příkladu importujeme z plné CDN URL, ale ve většině následující dokumentace uvidíte kód podobný tomuto:

```js
import { createApp } from 'vue'
```

Můžeme naučit prohlížeč, kde najde `vue` import s využitím [Import Maps](https://caniuse.com/import-maps):

<div class="options-api">

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

[Codepen demo](https://codepen.io/vuejs-examples/pen/wvQKQyM)

</div>

<div class="composition-api">

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
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

Do import mapy můžete přidat i záznamy pro další závislosti - ujistěte se ale, že ukazují na ES modules verzi knihovny, kterou chcete použít.

:::tip Podpora Import Maps v prohlížečích
Import Maps jsou relativně nová funkcionalita prohlížečů. Ujistěte se že používáte prohlížeč, který je [podporuje](https://caniuse.com/import-maps). Zejména pozor, že jsou podporovány až od Safari 16.4+.
:::

:::warning Poznámka k produkčnímu použití
Dosavadní příklady jsou používány při development buildech Vue - pokud chcete Vue z&nbsp;CDN používat i v produkci, konzultujte s [Průvodcem nasazením do produkce](/guide/best-practices/production-deployment#without-build-tools).
:::

### Rozdělování modulů {#splitting-up-the-modules}

Jak se budeme nořit hlouběji do průvodce, možná budete potřebovat rozdělit kód do samostatných JavaScript souborů, aby je bylo možné jednodušeji udržovat. Například:

```html
<!-- index.html -->
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

<div class="options-api">

```js
// my-component.js
export default {
  data() {
    return { pocet: 0 }
  },
  template: `<div>Počet je {{ pocet }}</div>`
}
```

</div>
<div class="composition-api">

```js
// my-component.js
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>Počet je {{ count }}</div>`
}
```

</div>

Pokud otevřete výše uvedené `index.html` v prohlížeči, uvidíte, že stránka vrací chybu, protože ES moduly neumí pracovat přes  `file://` protokol, který prohlížeč používá pro otevírání lokálních souborů.

Z bezpečnostních důvodů mohou ES moduly fungovat jen přes protokol `http://` používaný prohlížeči při otevírání webových stránek. Aby ES moduly fungovaly i na vašem lokálním stroji, musíme `index.html` servírovat přes `http://` pomocí lokálního HTTP serveru.

Pro spuštění lokálního HTTP serveru si napřed nainstalujte [Node.js](https://nodejs.org/en/) a potom zadejte `npx serve` z příkazové řádky ve stejném adresáři, v jakém je váš HTML soubor. Můžete použít i jakýkoli jiný HTTP server, který umí poskytovat statické soubory se správnými MIME typy.

Mohli jste si povšimnout, že šablona importované komponenty je zapsaná jako inline JavaScript řetězec. Pokud používáte VSCode, můžete nainstalovat rozšíření [es6&#8209;string&#8209;html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) a pro zapnutí zvýraznění syntaxe řetězce uvést předponou `/*html*/`.

## Další kroky {#next-steps}

Pokud jste přeskočili [Úvod](/guide/introduction), silně doporučujme přečíst si ho dřív, než se pustíte do zbytku dokumentace.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application">
    <p class="next-steps-link">Pokračovat s průvodcem</p>
    <p class="next-steps-caption">Průvodce vás detailně provede všemi vlastnostmi frameworku.</p>
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
