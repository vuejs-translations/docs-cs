# Registrace komponent {#component-registration}

> Tato stránka předpokládá, že už jste četli [Základy komponent](/guide/essentials/component-basics). Pokud jsou pro vás komponenty nové, přečtěte si je jako první.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="Lekce o registraci komponent ve Vue.js zdarma"/>

Komponenta Vue musí být "zaregistrována", aby Vue vědělo, kde má najít její implementaci, když na ni narazí v šabloně. Existují dva způsoby registrace komponent: globální a lokální.

## Globální registrace {#global-registration}

Komponenty můžeme zpřístupnit globálně v aktuální [Vue aplikaci](/guide/essentials/application) pomocí metody `app.component()`:

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // registrované jméno
  'MyComponent',
  // implementace
  {
    /* ... */
  }
)
```

Pokud používáte Single-File komponenty (SFC), budete registrovat importované soubory `.vue`:

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

Metodu `app.component()` lze řetězit:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Globálně registrované komponenty lze použít v šabloně libovolné komponenty v rámci této aplikace:

```vue-html
<!-- toto bude fungovat v jakékoliv komponentě v aplikaci -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

To platí dokonce i pro všechny dílčí komponenty, což znamená, že všechny tři tyto komponenty budou také dostupné _jedna v druhé_.

## Lokální registrace {#local-registration}

I když je globální registrace pohodlná, má několik nevýhod:

1. Globální registrace zabraňuje build nástrojům odstraňovat nepoužívané komponenty (tzv. "tree-shaking"). Pokud komponentu globálně zaregistrujete, ale nakonec ji v aplikaci nikde nepoužijete, bude stále zahrnuta do výsledného distribučního balíčku.

2. Kvůli globální registraci jsou vztahy závislostí v rozsáhlých aplikacích méně jednoznačné. Ztěžuje to vyhledání implementace komponenty potomka z komponenty rodiče, který ji používá. To může mít vliv na dlouhodobou udržovatelnost podobně jako používání příliš mnoha globálních proměnných.

Lokální registrace omezuje dostupnost registrovaných komponent pouze pro scope aktuální komponenty. Díky tomu je vztah závislosti jasnější, což usnadňuje "tree-shaking" proces.

<div class="composition-api">

Když používáte SFC a `<script setup>`, importované komponety lze lokálně použít bez registreace:

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

Ve variantě bez `<script setup>` budete muset použít sekci `components`:

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

Lokální registrace se provádí v sekci `components`:

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

Pro každou vlastnost v sekci `components` bude klíčem registrovaný název komponenty, zatímco hodnota bude obsahovat její implementaci. Výše uvedený příklad používá zkrácený zápis "property shorthand" podle specifikace ES2015 a je ekvivalentní:

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

Zapamatujte si, že **lokálně registrované komponenty  _nejsou_ přístupné v komponentách potomků**. V tomto případě bude `ComponentA` dostupá pouze v aktuální komponentě, v komponentách potomků nikoliv.

## Velká a malá písmena v názvech komponent {#component-name-casing}

V celém průvodci používáme při registraci komponent PascalCase názvy. Je to proto, že:

1. PascalCase názvy jsou platné JavaScript identifikátory. To usnadňuje import a registraci komponent v JavaScriptu. Pomáhá to také vývojovým prostředím IDE při funkci automatického dokončování.

2. `<PascalCase />` činí zřejmější, že se v šablonách jedná o Vue komponentu, nikoli o nativní HTML element. Odlišuje také Vue komponenty od jiných custom prvků (Web Components).

Toto je doporučený způsob když pracujete s SFC nebo string šablonami. Nicméně jak rozebíráme v části [Omezení při anlýze DOM-šablon](/guide/essentials/component-basics#dom-template-parsing-caveats), PascalCase tagy nelze použít v DOM-šablonách.

Vue naštěstí podporuje překlad kebab-case tagů na komponenty registrované pomocí PascalCase. To znamená, že na komponentu registrovanou jako `MyComponent` lze v šabloně odkazovat jak prostřednictvím `<MyComponent>`, tak i `<my-component>`. To nám umožňuje používat stejný JavaScript kód registrace komponent bez ohledu na zdroj šablony.
