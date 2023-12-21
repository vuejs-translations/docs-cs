---
outline: deep
---

# Používání Vue s TypeScriptem {#using-vue-with-typescript}

Typový systém jako TypeScript dokáže pomocí statické analýzy při sestavování odhalit mnoho běžných chyb. To snižuje riziko runtime chyb v produkci a také nám umožňuje s větší jistotou refaktorovat kód ve velkých aplikacích. TypeScript také zlepšuje ergonomi0 proi vývojáře pomocí automatického doplňování na základě typů v IDE.

Vue je samo o sobě napsáno v TypeScriptu a poskytuje pro TypeScript plnou podporu. Všechny oficiální Vue balíčky obsahují zabalené deklarace typů, které by měly fungovat ihned po instalaci.

## Nastavení projektu {#project-setup}

Oficiální nástroj pro vytváření projektových šablon [`create-vue`](https://github.com/vuejs/create-vue) nabízí možnost vytvořit Vue projekt připravený pro TypeScript s podporou [Vite](https://vitejs.dev/).

### Přehled {#overview}

Při použití Vite-based nastavení jsou vývojový (dev) server a bundler transpile-only a neprovádějí žádnou typovou kontrolu. To zajišťuje, že vývojový server Vite zůstává i při použití TypeScriptu velmi rychlý.

- Během vývoje doporučujeme pro okamžitou zpětnou vazbu pro typové chyby spoléhat na dobře nastavené [IDE](#ide-support).

- Pokud používáte SFC, použijte pro kontrolu typů a generování deklarací typů z příkazové řádky nástroj [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc). `vue-tsc` je wrapper okolo `tsc`, vlastního příkazového rozhraní TypeScriptu. Pracuje podobně jako `tsc`, s tím rozdílem, že  kromě souborů TypeScriptu podporuje i Vue SFC. Můžete spustit `vue-tsc` v režimu sledování (watch mode) paralelně s Vite dev serverem nebo použít Vite plugin jako [vite-plugin-checker](https://vite-plugin-checker.netlify.app/), který kontroluje v samostatném pracovním vlákně.

- Vue CLI podporu pro TypeScript také poskytuje, ale již není doporučován. Viz [poznámky níže](#note-on-vue-cli-and-ts-loader).

### Podpora IDE {#ide-support}

- Silně doporučujeme [Visual Studio Code](https://code.visualstudio.com/) (VSCode) pro jeho skvělou podporu TypeScriptu bez dalšího nastavování.

  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) je oficiální rozšíření pro VSCode, které poskytuje podporu TypeScriptu pro Vue SFC, spolu s mnoha dalšími skvělými funkcemi.

    :::tip
    Volar nahrazuje [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), naše předchozí oficiální rozšíření VSCode pro Vue 2. Pokud máte momentálně nainstalovaný Vetur, ujistěte se, že ho ve Vue 3 projektech vypnete.
    :::

  - Pro typovou podporu pro importy `*.vue` v TS souborech je také potřeba [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

- [WebStorm](https://www.jetbrains.com/webstorm/) též poskytuje nativní podporu jak pro TypeScript, tak pro Vue. Další JetBrains IDE je také podporují, buď nativně nebo pomocí [bezplatného pluginu](https://plugins.jetbrains.com/plugin/9442-vue-js). Od verze 2023.2 obsahuje WebStorm a Vue Plugin vestavěnou podporu pro Vue Language Server. Můžete nastavit službu Vue tak, aby používala integraci Volar na všech verzích TypeScriptu v _Settings > Languages & Frameworks > TypeScript > Vue_. Výchozí nastavení používá Volar pro verze TypeScriptu 5.0 a vyšší.

### Konfigurace `tsconfig.json` {#configuring-tsconfig-json}

Projekty vytvořené pomocí `create-vue` obsahují přednastavený `tsconfig.json`. Základní konfigurace je abstrahována v balíčku [`@vue/tsconfig`](https://github.com/vuejs/tsconfig). V rámci projektu používáme [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) pro zajištění správných typů pro kód spouštěný v různých prostředích (např. kód aplikace a testovací kód by měly mít různé globální proměnné).

Při ruční konfiguraci `tsconfig.json` jsou zvlášť zajímavé některé možnosti:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) je nastaveno na `true`, protože Vite pro transpilaci TypeScriptu používá [esbuild](https://esbuild.github.io/) a je omezen na transpilaci jednoho souboru. [`compilerOptions.verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) je [nadmnozžina `isolatedModules`](https://github.com/microsoft/TypeScript/issues/53601) a je to také dobrá volba - používá ji [`@vue/tsconfig`](https://github.com/vuejs/tsconfig).

- Pokud používáte Options API, musíte nastavit [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) na `true` (nebo alespoň povolit [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), což je součástí volby `strict`), abyste mohli využít typovou kontrolu `this` ve vlastnostech (options) komponenty. Jinak bude `this` považováno za `any`.

- Pokud jste nakonfigurovali aliasy resolveru ve svém build nástroji, například alias `@/*` nakonfigurovaný výchozím způsobem v projektu `create-vue`, musíte jej pro TypeScript také nakonfigurovat pomocí [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths).

Viz také:

- [Oficiální dokumentace k volbám TypeScript překladače](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Poznámky k překladu TypeScriptu v esbuild](https://esbuild.github.io/content-types/#typescript-caveats)

### Režim převzetí Volar {#volar-takeover-mode}

> Tato sekce se vztahuje pouze na VSCode + Volar.

Pro zajištění spolupráce Vue SFC a TypeScriptu dohromady vytváří Volar samostatnou instanci služby jazyka TS se specifickou podporou pro Vue a používá ji ve Vue SFC. Zároveň jsou běžné soubory TS stále zpracovávány vestavěnou službou jazyka TS ve VSCode, a proto potřebujeme [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) pro podporu importů Vue SFC v TS souborech. Tato výchozí konfigurace funguje, ale pro každý projekt spouštíme dvě instance služby jazyka TS: jednu od Volar a jednu od vestavěné služby ve VSCode. To je trochu neefektivní a může vést k problémům s výkonem v rozsáhlých projektech.

Volar pro zlepšení výkonu poskytuje funkci nazvanou "Režim převzetí" (Takeover Mode). V režimu převzetí Volar poskytuje podporu jak pro soubory Vue, tak pro soubory TS pomocí jediné instance služby jazyka TS.

Pro povolení režimu převzetí musíte v **pracovním prostoru svého projektu** zakázat vestavěnou službu jazyka TS ve VSCode pomocí těchto kroků:

1. Ve pracovním prostoru svého projektu zobrazte nabídku příkazů pomocí `Ctrl + Shift + P` (macOS: `Cmd + Shift + P`).
2. Zadejte `built` a vyberte "Extensions: Show Built-in Extensions".
3. Do vyhledávacího pole rozšíření zadejte `typescript` (neodstraňujte předponu `@builtin`).
4. Klepněte na malou ikonu ozubeného kola u "TypeScript and JavaScript Language Features" a vyberte "Disable (Workspace)".
5. Obnovte pracovní prostor. Režim převzetí bude povolen při otevření souboru Vue nebo TS.

<img src="./images/takeover-mode.png" width="590" height="426" style="margin:0px auto;border-radius:8px">

### Poznámka k Vue CLI a `ts-loader` {#note-on-vue-cli-and-ts-loader}

V nastavení založeném na nástroji webpack, jako je Vue CLI, je běžné provádět typovou kontrolu jako součást transformačního procesu modulu, například pomocí `ts-loader`. To však není čisté řešení, protože systém typů potřebuje pro provedení typové kontroly znalost celého grafu modulů. Transformační krok jednotlivého modulu jednoduše není správné místo pro tuto úlohu. Vede to k následujícím problémům:

- `ts-loader` může provádět typovou kontrolu pouze po transformaci kódu. To neodpovídá chybám, které vidíme v IDE nebo od `vue-tsc`, jenž se zpětně mapují přímo na zdrojový kód.

- Typová kontrola může být pomalá. Když se provádí ve stejném vlákně/procesu jako transformace kódu, výrazně to ovlivňuje rychlost sestavení celé aplikace.

- Již máme typovou kontrolu běžící přímo v našem IDE v samostatném procesu, takže náklady na zpomalení vývojového (dev) prostředí jednoduše nejsou dobrým kompromisem.

Pokud v současnosti používáte Vue 3 + TypeScript přes Vue CLI, silně doporučujeme přejít na Vite. Také pracujeme na možnostech CLI, které umožní podporu pouze pro překlad TS, abyste mohli pro typovou kontrolu přejít na `vue-tsc`.

## Obecné poznámky k použití {#general-usage-notes}

### `defineComponent()` {#definecomponent}

Aby TypeScript správně odvozoval typy uvnitř vlastností (options) komponenty, musíme komponenty definovat pomocí [`defineComponent()`](/api/general#definecomponent):

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // povolené odvozování typů
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // typ: string | undefined
    this.msg // typ: string
    this.count // typ: number
  }
})
```

`defineComponent()` také podporuje odvozování props předaných do `setup()` při použití Composition API bez `<script setup>`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // povolená inference typu
  props: {
    message: String
  },
  setup(props) {
    props.message // typ: string | undefined
  }
})
```

Viz také:

- [Poznámka k webpack Treeshaking](/api/general#note-on-webpack-treeshaking)
- [Testování typů pro `defineComponent`](https://github.com/vuejs/core/blob/main/packages/dts-test/defineComponent.test-d.tsx)

:::tip
`defineComponent()` umožňuje odvozování typů i pro komponenty definované v čistém JavaScriptu.
:::

### Použití v Single-file komponentách (SFC){#usage-in-single-file-components}

Pro použití TypeScriptu v SFC přidejte atribut `lang="ts"` do tagu `<script>`. Když je zadáno `lang="ts"`, přísnějšímu ověřování typů podléhají i všechny výrazy v šabloně.

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- povolené ověřování typů a automatické dokončování -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` lze použít i spolu se `<script setup>`:

```vue
<script setup lang="ts">
// TypeScript povolen
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- povolené ověřování typů a automatické dokončování -->
  {{ count.toFixed(2) }}
</template>
```

### TypeScript v šablonách {#typescript-in-templates}

Sekce `<template>` také podporuje TypeScript pro binding výrazů, pokud je použita značka `<script lang="ts">` nebo `<script setup lang="ts">`. To je užitečné v případech, kdy potřebujete provést přetypování ve výrazech šablon.

Zde je uměle vytvořený příklad:

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- chyba, protože x může být řetězec -->
  {{ x.toFixed(2) }}
</template>
```

To lze obejít pomocí inline přetypování:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
Pokud používáte Vue CLI nebo nastavení založené na nástroji webpack, TypeScript ve výrazech šablon vyžaduje `vue-loader@^16.8.0`.
:::

### Použití s TSX

Vue také podporuje tvorbu komponent s JSX / TSX. Podrobnosti jsou popsány v průvodci [Funkce pro vykrslování & JSX](/guide/extras/render-function.html#jsx-tsx).

## Generické komponenty {#generic-components}

Generické komponenty jsou podporovány ve dvou případech:

- SFC: [`<script setup>` s atributem `generic`](/api/sfc-script-setup.html#generics)
- Komponenty vykreslovací funkce / JSX: [funkční signatura `defineComponent()`](/api/general.html#function-signature)

## Návody pro specifická API {#api-specific-recipes}

- [TS s Composition API](./composition-api)
- [TS s Options API](./options-api)
