# Pluginy {#plugins}

## Úvod {#introduction}

Pluginy jsou samostatné kusy kódu, které obvykle přidávají do Vue funkcionalitu na úrovni aplikace. Plugin instalujeme takto:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* nepovinné parametry */
})
```

Plugin je definován buď jako objekt, který vystavuje metodu `install()`, nebo jednoduše jako funkce, která se jako instalátor chová sama. Instalační funkce obdrží [instanci aplikace](/api/application) spolu s dalšími parametry předanými do `app.use()`, pokud existují:

```js
const myPlugin = {
  install(app, options) {
    // konfigurace aplikace
  }
}
```

Pro pluginy neexistuje žádný přesně definovaný rozsah, ale běžné scénáře, ve kterých jsou užitečné, zahrnují:

1. Registrace jedné nebo více globálních komponent nebo vlastních direktiv pomocí [`app.component()`](/api/application#app-component) a [`app.directive()`](/api/application#app-directive).

2. Označení zdroje jako [injectable](/guide/components/provide-inject) napříč aplikací prostředinctvím volání [`app.provide()`](/api/application#app-provide).

3. Přidání globálních promměných instance či metod jejich připojením k&nbsp;[`app.config.globalProperties`](/api/application#app-config-globalproperties).

4. Knihovna, která potřebuje provést kombinaci výše uvedného (např. [vue-router](https://github.com/vuejs/vue-router-next)).

## Tvorba pluginu {#writing-a-plugin}

Abychom lépe pochopili, jak vlastní Vue.js pluginy vytvářet, vytvoříme velmi zjednodušenou verzi pluginu, který zobrazuje překladové `i18n` (zkratka pro [Internationalization](https://en.wikipedia.org/wiki/Internationalization_and_localization)) řetězce.

Začněme nastavením objektu pluginu. Doporučujeme jej vytvořit v samostatném souboru a exportovat ho, jak je uvedeno níže, aby byla logika uzavřená a oddělená.

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // kód pluginu bude zde
  }
}
```

Chceme vytvořit překladovou funkci. Tato funkce obdrží string `key` s tečkovým oddělovačem, který použijeme k vyhledání přeloženého textu v možnostech zadaných uživatelem. Toto je zamýšlené použití v šablonách:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Protože by tato funkce měla být dostupná globálně ve všech šablonách, vytvoříme ji tak, že ji v našem pluginu připojíme k `app.config.globalProperties`:

```js{4-11}
// plugins/i18n.js
export default {
  install: (app, options) => {
    // vložit globálně dostupnou funkci `$translate()`
    app.config.globalProperties.$translate = (key) => {
      // získat proměnnou vnořenou v `options`
      // při použití `key` jako cesty
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

Naše funkce `$translate` přijme string jako např. `greetings.hello`, podívá se do konfigurace poskytnuté uživatelem a vrátí přeloženou hodnotu.

Objekt obsahující přeložené klíče by měl být předán pluginu během instalace prostřednictvím dodatečných parametrů v `app.use()`:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

Nyní bude naše volání `$translate('greetings.hello')` za běhu nahrazeno textem `Bonjour!`.

Viz také: [Rozšiřování globálních vlastností](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
Globální vlastnosti používejte jen zřídka, protože pokud se v aplikaci používá příliš mnoho globálních promnených vložených různými pluginy, může se rychle stát nepřehlednou.
:::

### Provide / Inject spolu s pluginy {#provide-inject-with-plugins}

Pluginy nám také umožňují použít `inject` k poskytování funkce nebo parametru uživatelům pluginu. Například můžeme aplikaci umožnit přístup k parametru `options`, aby mohla používat objekt s překlady.

```js{10}
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

Uživatelé pluginu nyní budou schopni vložit `options` pluginu do svých komponent pomocí klíče `i18n`:

<div class="composition-api">

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>
