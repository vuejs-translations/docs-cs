<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Nástroje {#tooling}

## Vyzkoušejte si to online {#try-it-online}

Abyste si mohli vyzkoušet Vue SFC, nemusíte na svém počítači nic instalovat - existují online "hřiště", která vám to umožní udělat přímo ve webovém prohlížeči:

- [Vue SFC Playground](https://play.vuejs.org)
  - Vždy nasazeno z nejnovějšího commitu
  - Navrženo pro prohlížení výsledků kompilace komponent
- [Vue + Vite na StackBlitz](https://vite.new/vue)
  - Prostředí podobné IDE, které spouští skutečný Vite dev server ve webovém prohlížeči
  - Nejbližší k lokálnímu nastavení

Tato online hřiště je rovněž doporučeno používat pro poskytování reprodukcí při hlášení chyb.

## Scaffolding projektu {#project-scaffolding}

### Vite {#vite}

[Vite](https://vitejs.dev/) je odlehčený a rychlý build tool s prvotřídní podpory pro Vue SFC. Je vytvořen Evanem You, který je také autorem Vue!

Pro zahájení práce s Vite + Vue jednoduše spusťte:

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

Tento příkaz nainstaluje a spustí [create-vue](https://github.com/vuejs/create-vue), oficiální nástroj pro sestavení Vue projektů.

- Chcete-li se o Vite dozvědět víc, podívejte se do [Vite dokumentace](https://vitejs.dev).
- Chcete-li ve Vite projektu nakonfigurovat chování specifické pro Vue, například předávání možností (options) kompilátoru Vue, podívejte se do dokumentace pro [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme).

Obě výše zmíněná online hřiště také podporují stahování souborů ve formě Vite projektu.

### Vue CLI {#vue-cli}

[Vue CLI](https://cli.vuejs.org/) je oficiální sada nástrojů pro Vue založená na technologii webpack. Nyní už je pouze v režimu údržby a doporučujeme začínat nové projekty s Vite, pokud se nespoléháte na funkce specifické pouze pro webpack. Ve většině případů poskytne Vite vývojářům lepší DX.

Pro informace o migraci z Vue CLI na Vite:

- [Průvodce migrací Vue CLI -> Vite od VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Nástroje / Pluginy, které pomáhají s automatickou migrací](https://github.com/vitejs/awesome-vite#vue-cli)

### Poznámka k kompilaci šablon v prohlížeči {#note-on-in-browser-template-compilation}

Při použití Vue bez build fáze jsou šablony komponent psány buďto přímo v HTML stránky nebo jako vložené JavaScriptové řetězce. V takových případech musí Vue dodat kompilátor šablon do prohlížeče, aby bylo možné provádět kompilaci šablon na požádání (on-the-fly). Na druhou stranu, kompilátor není potřebný, pokud šablony během build fáze předkompilujeme. Pro snížení velikosti klientského JS balíčku Vue poskytuje [různé "buildy"](https://unpkg.com/browse/vue@3/dist/) optimalizované pro různé použití.

- Soubory buildu, které začínají `vue.runtime.*`, jsou **buildy pouze pro runtime**: neobsahují kompilátor. Při použití těchto buildů musí být všechny šablony předkompilovány pomocí build fáze.

- Soubory buildu, které neobsahují `.runtime`, jsou **úplné buildy**: obsahují kompilátor a podporují kompilaci šablon přímo v prohlížeči. Nicméně zvětší velikost přeneseného balíčku o ~14kb.

Naše výchozí nástroje používají build pouze pro runtime, protože všechny šablony ve SFC jsou předkompilovány. Pokud z nějakého důvodu potřebujete kompilaci šablon v prohlížeči i s build fází, můžete tak učinit konfigurací nástroje pro sestavení, který přiřadí `vue` na `vue/dist/vue.esm-bundler.js`.

Pokud hledáte odlehčenou alternativu pro použití bez build fáze, podívejte se na [petite-vue](https://github.com/vuejs/petite-vue).

## Podpora v IDE {#ide-support}

- Doporučené nastavení IDE je [VSCode](https://code.visualstudio.com/) + [rozšíření Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (dříve Volar). Rozšíření poskytuje zvýrazňování syntaxe, podporu TypeScriptu a inteligentní nápovědu pro výrazy šablon a vlastnosti (props) komponent.

  :::tip
    Vue - Official nahrazuje [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), naše předchozí oficiální rozšíření VSCode pro Vue 2. Pokud máte momentálně nainstalovaný Vetur, ujistěte se, že ho ve Vue 3 projektech vypnete.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) též poskytuje skvělou vestavěnou podporu pro Vue SFC.

- Další IDE, která podporují [Language Service Protocol](https://microsoft.github.io/language-server-protocol/) (LSP), mohou základní Volar funkce pomocí LSP také využívat:

  - Podpora v Sublime Textu pomocí [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - Podpora ve vim / Neovim pomocí [coc-volar](https://github.com/yaegassy/coc-volar).

  - Podpora v emacs pomocí [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Devtools pro prohlížeč {#browser-devtools}

<VueSchoolLink href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3" title="Lekce o Vue.js Devtools zdarma"/>

Rozšíření prohlížeče Vue devtools vám umožňuje prozkoumat strom komponent Vue aplikace, prohlédnout si stav jednotlivých komponent, sledovat události správy stavu a profilovat výkon.

![Screenshot z devtools](https://raw.githubusercontent.com/vuejs/devtools/main/media/screenshot-shadow.png)

- [Dokumentace](https://devtools.vuejs.org/)
- [Rozšíření pro Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Addon pro Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Rozšíření pro Edge](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl)
- [Samostatná aplikace Electron](https://devtools.vuejs.org/guide/installation.html#standalone)

## TypeScript {#typescript}

Hlavní článek: [Používání Vue s TypeScriptem](/guide/typescript/overview).

- [Rozšíření Vue - Official](https://github.com/vuejs/language-tools) poskytuje typovou pro SFC pomocí bloků `<script lang="ts">`, včetně výrazů šablony a ověřování vlastností (props) mezi komponentami.

- Použijte [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) pro provádění stejné typové kontroly z příkazového řádku nebo pro generování souborů `d.ts` pro SFC.

## Testování {#testing}

Hlavní článek: [Průvodce testováním](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) je doporučen pro E2E testy. Lze jej také použít pro component testing Vue SFC pomocí [Cypress Component Test Runner](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) je testovací nástroj vytvořený členy týmu Vue / Vite, který se zaměřuje na rychlost. Je speciálně navržen pro aplikace založené na Vite, aby poskytoval stejnou okamžitou zpětnou vazbu pro unit / component testing.

- [Jest](https://jestjs.io/) lze použít s Vite pomocí [vite-jest](https://github.com/sodatea/vite-jest). Nicméně, toto se doporučuje pouze v případě, že máte existující sady testů založené na Jest, které potřebujete migrovat do projektu založeného na Vite, protože Vitest poskytuje podobné funkcionality s mnohem efektivnější integrací.

## Linting {#linting}

Vue tým udržuje [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), plugin pro [ESLint](https://eslint.org/), který podporuje lintovací pravidla specifická pro SFC.

Uživatelé, kteří dříve používali Vue CLI, mohou být zvyklí na konfiguraci linterů pomocí webpack loaderů. Nicméně, při použití nastavení založeného na Vite je naše obecné doporučení:

1. `npm install -D eslint eslint-plugin-vue`, poté postupujte podle [průvodce konfigurací](https://eslint.vuejs.org/user-guide/#usage) `eslint-plugin-vue`.

2. Nastavte rozšíření IDE pro ESLint, například [ESLint pro VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), abyste měli během vývoje zpětnou vazbu linteru přímo ve vašem editoru. Tím se také zabrání zbytečným nákladům na lintování při spuštění vývojového (dev) serveru.

3. Spusťte ESLint jako součást příkazu pro produkční build, abyste získali úplnou zpětnou vazbu linteru před odesláním do produkce.

4. (Volitelné) Nastavte nástroje jako [lint-staged](https://github.com/okonet/lint-staged), abyste automaticky lintovali upravené soubory při commitu do gitu.

## Formátování {#formatting}

- [Rozšíření Vue - Official](https://github.com/vuejs/language-tools) pro VSCode samo o sobě poskytuje formátování pro Vue SFC.

- Alternativně nabízí vestavěnou podporu pro formátování Vue SFC také [Prettier](https://prettier.io/).

## Nástroje pro integraci vlastních SFC bloků  {#sfc-custom-block-integrations}

Vlastní bloky jsou zkompilovány do importů do stejného Vue souboru s různými request queries. Je na v projektu použitém build nástroji, jak se s těmito importy zachází.

- Pokud používáte Vite, měl by být k přeměně odpovídajících vlastních bloků na spustitelný JavaScript použit vlastní Vite plugin. [Příklad](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Pokud používáte Vue CLI nebo čistý webpack, měl by být k přeměně odpovídajících bloků nakonfigurován webpack loader. [Příklad](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Balíčky nižší úrovně {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Dokumentace](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Tento balíček je součástí monorepa Vue jádra a je vždy publikován se stejnou verzí jako hlavní balíček `vue`. Je zahrnut jako závislost hlavního balíčku `vue` a je nastaven jako proxy pod `vue/compiler-sfc`, takže jej nemusíte samostatně instalovat.

Samotný balíček poskytuje nástroje nižší úrovně pro zpracování Vue SFC a je určen pouze pro autory nástrojů, kteří potřebují podporovat Vue SFC ve vlastních knihovnách.

:::tip
Vždy upřednostňujte použití tohoto balíčku pomocí deep importu `vue/compiler-sfc`, protože to zajišťuje, že jeho verze je synchronizována s běhovým prostředím Vue.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Dokumentace](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Oficiální plugin, který poskytuje podporu Vue SFC pro Vite.

### `vue-loader` {#vue-loader}

- [Dokumentace](https://vue-loader.vuejs.org/)

Oficiální loader, který poskytuje podporu Vue SFC pro webpack. Pokud používáte Vue CLI, podívejte se také na [dokumentaci k úpravě nastavení `vue-loader` ve Vue CLI](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

## Ostatní online hřiště {#other-online-playgrounds}

- [VueUse Playground](https://play.vueuse.org)
- [Vue + Vite na Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue na CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue na Codepen](https://codepen.io/pen/editor/vue)
- [Vue na Components.studio](https://components.studio/create/vue3)
- [Vue na WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->
