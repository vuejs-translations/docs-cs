# Options API: Vykreslování {#options-rendering}

## template {#template}

Šablona pro komponentu ve formě textového řetězce.

- **Typ**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Podrobnosti**

  Šablona poskytnutá pomocí možnosti `template` bude kompilována na požádání za běhu (on-the-fly). Tato volba je podporována pouze při použití takového Vue buildu, který zahrnuje kompilátor šablon. Kompilátor šablon **NENÍ** zahrnut ve Vue buildech, které mají ve svém názvu slovo `runtime`, např. `vue.runtime.esm-bundler.js`. Pro více informací o různých variantách se podívejte do [průvodce distribučními soubory](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use).

  Pokud řetězec začíná znakem `#`, bude použit jako `querySelector` a jako řetězec šablony se použije `innerHTML` vybraného prvku. To umožňuje vytvářet zdrojovou šablonu pomocí nativních prvků `<template>`.

  Pokud je ve stejné komponentě přítomna i možnost `render`, bude `template` ignorováno.

  Pokud root komponenta vaší aplikace nemá specifikováno `template` ani `render`, Vue se místo toho pokusí použít jako šablonu `innerHTML` připojeného prvku.

  :::warning Bezpečnostní poznámka
  Používejte pouze zdroje šablon, kterým důvěřujete. Nepoužívejte jako šablonu obsah poskytovaný uživatelem. Pro více informací se podívejte do [průvodce bezpečností](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates).
  :::

## render {#render}

Funkce, která programově vrací virtuální DOM strom komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Podrobnosti**

  `render` je alternativou ke string templates, která vám pro deklaraci výstupu vykreslení komponenty umožňuje využít plnou programovou sílu JavaScriptu.

  Předkompilované šablony, například ty v Single-File komponentách (SFC), jsou při buildu zkompilovány do možnosti `render`. Pokud jsou v komponentě přítomny jak `render`, tak `template`, `render` má vyšší prioritu.

- **Viz také:**
  - [Mechanismus vykreslování](/guide/extras/rendering-mechanism)
  - [Funkce pro vykreslení](/guide/extras/render-function)

## compilerOptions {#compileroptions}

Nastavuje možnosti runtime kompilátoru pro šablonu komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // výchozí: 'condense'
      delimiters?: [string, string] // výchozí: ['{{', '}}']
      comments?: boolean // výchozí: false
    }
  }
  ```

- **Detaily**

  Tato konfigurační vlastnost je respektována pouze při použití plného (full) buildu (tj. samostatného `vue.js`, který může kompilovat šablony v prohlížeči). Podporuje stejné parametry jako [app.config.compilerOptions](/api/application#app-config-compileroptions) na úrovni aplikace a má pro aktuální komponentu vyšší prioritu.

- **Viz také:** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## slots<sup class="vt-badge ts"/> {#slots}

- Podporováno až od verze 3.3+

Možnost pomoci s odvozením typů při programovém použití slotů ve funkcích pro vykreslení. 

- **Detaily**

  Runtime hodnota této vlastnosti se nepoužívá. Skutečné typy by měly být deklarovány přes přetypování prostřednictvím pomocného typu `SlotsType`:

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(slots.item)
    }
  })
  ```
