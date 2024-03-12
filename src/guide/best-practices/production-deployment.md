# Nasazení do produkce {#production-deployment}

## Vývoj versus produkce {#development-vs-production}

Během vývoje Vue poskytuje několik funkcí, které zlepšují developer experience (DX):

- Varování před běžnými chybami a úskalími
- Validace vlastností (props) / událostí (events)
- [Ladicí nástroje pro reaktivitu](/guide/extras/reactivity-in-depth#reactivity-debugging)
- Integrace s DevTools

Tyto funkce jsou však v produkci zbytečné. Některé kontrolní mechanismy pro varování mohou způsobit i o něco větší zátěž na výkon. Při nasazení do produkce bychom měli veškerý nepoužitý kód určený pouze pro vývoj odstranit, což sníží velikost přenášených dat a zlepší výkon.

## Bez nástrojů pro sestavení {#without-build-tools}

Pokud používáte Vue bez build nástroje tím, že jej načítáte z CDN nebo vlastního skriptu, ujistěte se, že při nasazení do produkce používáte produkční build (soubory v adresáři `dist`, které končí na `.prod.js`). Produkční sestavení jsou předem zmenšena a obsahují pouze kód určený pro produkci.

- Pokud používáte globální build (přístup pomocí globální proměnné `Vue`): použijte&nbsp;`vue.global.prod.js`.
- Pokud používáte ESM build (přístup pomocí nativních ESM importů): použijte&nbsp;`vue.esm-browser.prod.js`.

Pro více informací se podívejte do [průvodce soubory distribuce](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use).

## S nástroji pro sestavení {#with-build-tools}

Projekty vytvořené pomocí `create-vue` (založené na Vite) nebo Vue CLI (založené na webpack) jsou přednastaveny pro produkční sestavení.

Pokud používáte vlastní nastavení, ujistěte se, že:

1. `vue` se překládá na `vue.runtime.esm-bundler.js`.
2. [Compile-Time flags](https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags) jsou správně nakonfigurovány.
3. <code>process.env<wbr>.NODE_ENV</code> je během sestavení nahrazeno hodnotou `"production"`.

Další odkazy:

- [Průvodce produkčním sestavením s Vite](https://vitejs.dev/guide/build.html)
- [Průvodce nasazením s Vite](https://vitejs.dev/guide/static-deploy.html)
- [Průvodce nasazením s Vue CLI](https://cli.vuejs.org/guide/deployment.html)

## Sledování běhových chyb {#tracking-runtime-errors}

[Error handler na úrovni aplikace](/api/application#app-config-errorhandler) lze použít k hlášení chyb do sledovacích služeb:

```js
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // hlášení chyby do sledovacích služeb
}
```

Služby jako [Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) a [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) také poskytují oficiální integrace pro Vue.
