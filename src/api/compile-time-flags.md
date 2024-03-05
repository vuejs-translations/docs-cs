---
outline: deep
---

# Compile-Time flags {#compile-time-flags}

:::tip
Compile-Time flags se uplatní pouze při použití Vue buildu pomocí `esm-bundler` (tj. `vue/dist/vue.esm-bundler.js`).
:::

Při použití Vue s build fází je možné konfigurovat několik příznaků (compile-time flags) umožňujích povolit / zakázat určité funkce. Výhodou jejich použití je, že funkce zakázané tímto způsobem lze odstranit z finálního balíčku pomocí tree-shakingu.

Vue bude fungovat i tehdy, pokud tyto příznaky nejsou explicitně nakonfigurovány. Nicméně se doporučuje je nakonfigurovat vždy, aby bylo možné příslušné funkce správně odstranit, pokud jto jde.

Podívejte se na [Průvodce konfigurací](#configuration-guides), jak je nakonfigurovat v závislosti na vašem build nástroji.

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **Výchozí hodnota:** `true`

  Povolit / zakázat podporu Options API. Zakázání tohoto nastavení povede ke snížení velikosti balíčku, ale může ovlivnit kompatibilitu s knihovnami třetích stran, pokud se na Options API spoléhají.

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **Výchozí hodnota:** `false`

  Povolit / zakázat podporu nástrojů pro vývoj (DevTools) v produkčních buildech. Povolení povede k zahrnutí více kódu do distribučního balíčku, proto se doporučuje tuto možnost povolit pouze pro účely ladění.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` <sup class="vt-badge" data-text="3.4+" /> {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **Výchozí hodnota:** `false`

  Povolit / zakázat podrobná varování o nesouladech hydratace (hydration mismatch) v produkčních buildech. Povolení povede k zahrnutí více kódu do distribučního balíčku, proto se doporučuje tuto možnost povolit pouze pro účely ladění.

## Průvodce konfigurací {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` pro tyto příznaky automaticky poskytuje výchozí hodnoty. Pro změnu výchozích hodnot použijte Vite konfigurační možnost `define`  ([dokumentace](https://vitejs.dev/config/shared-options.html#define)):

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // povolit podrobnosti o nesouladu hydratace v produkčním buildu
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` automaticky poskytuje výchozí hodnoty pro některé z těchto příznaků. Pro konfiguraci / změnu hodnot:

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

Příznaky by měly být definovány pomocí webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

Příznaky by měly být definovány pomocí [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js
// rollup.config.js
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```
