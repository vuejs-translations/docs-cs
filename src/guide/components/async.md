# Asynchronní komponenty {#async-components}

## Základní použití {#basic-usage}

V rozsáhlých aplikacích můžeme potřebovat rozdělit aplikaci na menší části a načíst komponentu ze serveru pouze v případě potřeby. Aby to bylo možné, má Vue funkci [`defineAsyncComponent`](/api/general#defineasynccomponent):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...načíst komponentu ze serveru
    resolve(/* načtená komponenta */)
  })
})
// ... použití `AsyncComp` jako běžné komponenty
```

Jak můžete vidět, funkce `defineAsyncComponent` přijímá „loader“ funkci, která vrací Promise. Callback funkce `resolve` tohoto Promise by se měla zavolat po načtení definice komponenty ze serveru. Můžete také zavolat `reject(reason)`, abyste dali najevo, že se načtení nezdařilo.

[Dynamický import ES modulů](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) také vrací Promise,
takže jej většinou budeme v kombinaci s `defineAsyncComponent` používat. Bundler nástroje jako Vite nebo webpack tuto syntaxi také podporují (a budou ji používat jako body pro rozdělení balíčků), takže ji můžeme použít k importu Vue Single-File komponent (SFC):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

Výsledná `AsyncComp` je obalová (wrapper) komponenta, která zavolá „loader“ funkci až při skutečném vykreslení na stránce. Kromě toho předá vnitřní komponentě všechny vlastnosti (props) a sloty (slots), takže můžete tento asynchronní wrapper použít k&nbsp;plynulému nahrazení původní komponenty a zároveň dosáhnout „lazy“ načítání.

Stejně jako normální komponenty, mohou být i asynchronní komponenty [registrovány globálně](/guide/components/registration#global-registration) pomocí `app.component()`:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

Také můžete použít `defineAsyncComponent` když [registrujete komponentu lokálně](/guide/components/registration#local-registration):

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

Lze je také definovat přímo uvnitř jejich rodičovské komponenty:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## Načítání a chybové stavy {#loading-and-error-states}

Asynchronní operace nevyhnutelně zahrnují stav načítání a chybový stav. Funkce `defineAsyncComponent()` podporuje zpracování těchto stavů pomocí pokročilých možností nastavení:

```js
const AsyncComp = defineAsyncComponent({
  // „loader“ funkce
  loader: () => import('./Foo.vue'),

  // Komponenta, která bude použita během asynchronního načítání
  loadingComponent: LoadingComponent,
  // Zpoždění před zobrazením komponenty pro načítání. Výchozí: 200ms.
  delay: 200,

  // Komponenta, která bude použita, pokud načítání selže
  errorComponent: ErrorComponent,
  // Chybová komponenta bude zobrazena,
  // pokud je zadán a překročen timeout. Výchozí: nekonečno.
  timeout: 3000
})
```

Pokud je předána komponenta pro načítání, zobrazí se jako první, zatímco se vnitřní komponenta načítá. Než se načítací komponenta zobrazí, je výchozí prodleva 200 ms. To&nbsp;proto, že v rychlých sítích může být stav načítání nahrazen příliš rychle a vypadalo by to jako blikání.

Pokud je předána komponenta pro chybový stav, zobrazí se, když je Promise vrácený „loader“ funkcí odmítnut (rejected). Můžete také zadat časový limit pro zobrazení chybové komponenty, pokud požadavek trvá příliš dlouho.

## Použití s Suspense {#using-with-suspense}

Asynchronní komponenty lze použít dohromady s vestavěnou komponentou `<Suspense>`. Interakce `<Suspense>` a ansynchronními komponentami je popsána v&nbsp;[kapitole určené pro `<Suspense>`](/guide/built-ins/suspense).
