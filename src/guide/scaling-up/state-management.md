# Správa stavu  {#state-management}

## Co je správa stavu? {#what-is-state-management}

Technicky vzato každá instance Vue komponenty  již svůj vlastní reaktivní stav "spravuje". Jako příklad si vezměme jednoduchou komponentu počítadla:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// stav
const count = ref(0)

// akce
function increment() {
  count.value++
}
</script>

<!-- zobrazení -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // stav
  data() {
    return {
      count: 0
    }
  },
  // akce
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- zobrazení -->
<template>{{ count }}</template>
```

</div>

Je to samostatná jednotka s následujícími částmi:

- **Stav** - zdroj pravdy, který naši aplikaci řídí;
- **Zobrazení** - deklarativní mapování **stavu**;
- **Akce** - možné způsoby, jak se stav může změnit v reakci na uživatelské vstupy ze **zobrazení**.

Toto je jednoduché zobrazení konceptu "jednosměrného toku dat":

<p style="text-align: center">
  <img alt="Diagram toku dat" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

Bohužel, jednoduchost začíná selhávat, když máme **více komponent, které sdílejí společný stav**:

1. Více zobrazení může záviset na stejné části stavu.
2. Akce z různých zobrazení mohou potřebovat měnit stejnou část stavu.

Pro případ jedna je možným řešením "vyzdvihnutí" sdíleného stavu na společného předka komponenty a poté ho předat dolů jako vlastnost (props). Nicméně, toto začíná být ve stromech komponent s hlubokou hierarchií rychle zdlouhavé a vede to k dalšímu problému známému jako [Prop Drilling](/guide/components/provide-inject#prop-drilling).

Pro případ dva se často uchylujeme k řešením, jako je přístup k přímým instancím komponent rodiče / potomka pomocí template refs nebo pokusy o změnu a synchronizaci více kopií stavu pomocí emitovaných událostí (emits). Obě tyto vzorce jsou křehké a rychle vedou k neudržovatelnému kódu.

Jednodušším a přímočařejším řešením je vyjmout sdílený stav z komponent a spravovat ho v globálním singleton objektu. Díky tomu se náš strom komponent stává velkým "pohledem" (view) a jakákoliv komponenta může přistupovat ke stavu nebo spouštět akce, bez ohledu na to, kde ve stromu se nacházejí!

## Jednoduchá správa stavu s Reactivity API {#simple-state-management-with-reactivity-api}

<div class="options-api">

V Options API se reaktivní data deklarují pomocí sekce `data()`. Interně je objekt vrácený z `data()` učiněn reaktivním pomocí funkce [`reactive()`](/api/reactivity-core#reactive), která je také dostupná jako veřejné API.

</div>

Pokud máte část stavu, která by měla být sdílena mezi více instancemi, můžete k vytvoření reaktivního objektu použít [`reactive()`](/api/reactivity-core#reactive), a poté jej importovat do více komponent:

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue
<!-- ComponentA.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>Od A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>Od B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```vue
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>Od A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>Od B: {{ store.count }}</template>
```

</div>

Kdykoliv je nyní objekt `store` změněn, obě komponenty `<ComponentA>` a `<ComponentB>` automaticky aktualizují svá zobrazení - máme jediný zdroj pravdy.

Ovšem to také znamená, že jakákoliv komponenta, která `store` importuje, ho může libovolně měnit:

```vue-html{2}
<template>
  <button @click="store.count++">
    Z B: {{ store.count }}
  </button>
</template>
```

Přestože to funguje v jednoduchých případech, globální stav, který může být libovolně měněn kteroukoliv komponentou, nebude dlouhodobě udržitelný. Aby byla logika změny stavu centralizována stejně jako samotný stav, doporučuje se definovat v úložišti stavu metody s názvy, které vyjadřují úmysl akcí:

```js{6-8}
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    Z B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNrNkk1uwyAQha8yYpNEiUzXllPVrtRTeJNSqtLGgGBsVbK4ewdwnT9FWWSTFczwmPc+xMhqa4uhl6xklRdOWQQvsbfPrVadNQ7h1dCqpcYaPp3pYFHwQyteXVxKm0tpM0krnm3IgAqUnd3vUFIFUB1Z8bNOkzoVny+wDTuNcZ1gBI/GSQhzqlQX3/5Gng81pA1t33tEo+FF7JX42bYsT1BaONlRguWqZZMU4C261CWMk3EhTK8RQphm8Twse/BscoUsvdqDkTX3kP3nI6aZwcmdQDUcMPJPabX8TQphtCf0RLqd1csxuqQAJTxtYnEUGtIpAH4pn1Ou17FDScOKhT+QNAVM)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNrdU8FqhDAU/JVHLruyi+lZ3FIt9Cu82JilaTWR5CkF8d8bE5O1u1so9FYQzAyTvJnRTKTo+3QcOMlIbpgWPT5WUnS90gjPyr4ll1jAWasOdim9UMum3a20vJWWqxSgkvzTyRt+rocWYVpYFoQm8wRsJh+viHLBcyXtk9No2ALkXd/WyC0CyDfW6RVTOiancQM5ku+x7nUxgUGlOcwxn8Ppu7HJ7udqaqz3SYikOQ5aBgT+OA9slt9kasToFnb5OiAqCU+sFezjVBHvRUimeWdT7JOKrFKAl8VvYatdI6RMDRJhdlPtWdQf5mdQP+SHdtyX/IftlH9pJyS1vcQ2NK8ZivFSiL8BsQmmpMG1s1NU79frYA1k8OD+/I3pUA6+CeNdHg6hmoTMX9pPSnk=)

</div>

:::tip
Všimněte si, že click handler používá `store.increment()` s kulatými závorkami - je to nutné pro volání metody s odpovídajícím kontextem `this`, protože to není metoda komponenty.
:::

I když zde jako úložiště používáme jediný reaktivní objekt, můžete také sdílet reaktivní stav vytvořený pomocí jiných [API pro reaktivitu](/api/reactivity-core) jako `ref()` nebo `computed()`, nebo dokonce vrátit globální stav z [composable](/guide/reusability/composables):

```js
import { ref } from 'vue'

// globální stav, vytvořený v rámci modulu
const globalCount = ref(1)

export function useCount() {
  // lokální stav, vytvořený pro každou komponentu
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

Skutečnost, že reaktivní systém Vue je od modelu komponent oddělený, ho činí extrémně flexibilním.

## Úvahy o SSR {#ssr-considerations}

Pokud vytváříte aplikaci, která využívá [Server-Side Rendering (SSR)](./ssr), výše uvedený vzor může vést k problémům kvůli sdílenému úložišti, které je singletonem sdíleným v rámci více požadavků. Tento problém je podrobněji popsán v [průvodci SSR](./ssr#cross-request-state-pollution).

## Pinia {#pinia}

I když naše vlastní řešení pro správu stavu v jednoduchých scénářích postačuje, existuje mnoho dalších věcí, které je třeba při vývoji rozsáhlých produkčních aplikací zvážit:

- Silnější konvence pro týmovou spolupráci
- Integrace s Vue DevTools, včetně časové osy, inspekce komponent a ladění s možností cestování časem
- Podpora Hot Module Replacement (HMR)
- Podpora Server-Side Rendering (SSR)

[Pinia](https://pinia.vuejs.org) je knihovna pro správu stavu, která implementuje všechny výše uvedené funkce. Je udržována Vue týmem a funguje jak s Vue 2, tak s Vue 3.

Existující uživatelé mohou mít zkušenosti s [Vuex](https://vuex.vuejs.org/), předchozí oficiální knihovnou pro správu stavu ve Vue. S Pinia, která plní v ekosystému stejnou roli, je nyní Vuex pouze v režimu údržby. Stále funguje, ale již nezískává nové funkce. Pro nové aplikace se doporučuje používat Pinia.

Pinia začala jako průzkum toho, jak by mohla  další iterace Vuex vypadat, a zahrnuje mnoho nápadů z diskusí Vue týmu pro Vuex 5. Nakonec jsme si uvědomili, že Pinia již implementuje většinu toho, co jsme chtěli ve Vuex 5, a rozhodli jsme se ji doporučit jako nové řešení.

Ve srovnání s Vuex poskytuje Pinia jednodušší API s méně obřadným zápisem, nabízí API ve stylu Composition API a především má solidní podporu pro odvozování typů při použití s TypeScriptem.
