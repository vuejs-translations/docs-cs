---
outline: deep
---

# Suspense {#suspense}

:::warning Experimentální funkce
`<Suspense>` je experimentální funkce. Není zaručeno, že bude zachována, a API se může změnit dříve, než se stane stabilní součástí Vue.
:::

`<Suspense>` je vestavěná komponenta pro orchestraci asynchronních závislostí ve stromu komponent. Může vykreslit stav načítání, zatímco čeká na vyřešení několika vnořených asynchronních závislostí.

## Asynchronní závislosti {#async-dependencies}

Pro vysvětlení problému, který se `<Suspense>` snaží řešit, a jak s těmito asynchronními závislostmi interaguje, si představte následující hierarchii komponent:

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus> (komponenta s `async setup()`)
   └─ <Content>
      ├─ <ActivityFeed> (`async` komponenta)
      └─ <Stats> (`async` komponenta)
```

Ve stromu komponent je více vnořených komponent, jejichž vykreslování závisí na nějakém asynchronním zdroji, který je třeba vyřešit jako první. Bez `<Suspense>` by každý z nich musel zvládnout zobrazení svého vlastního průběhu načítání a chybových stavů. V&nbsp;krajním případě bychom mohli na stránce vidět tři samostatné indikátory načítání a&nbsp;obsah zobrazený postupně v různých časech.

`<Suspense>` nám dává schopnost zobrazit průběh načítání a chybové stavy pouze na nejvyšší úrovni, zatímco čekáme na vyřešení vnořených asynchronních závislostí.

Jsou dva typy asynchronních závislostí, na které může `<Suspense>` čekat:

1. Komponenty s asynchronní `setup()` sekcí. K nim patří `<script setup>` komponenty s&nbsp;_top&#8209;level `await`_ výrazy.

2. [Asynchronní komponenty](/guide/components/async).

### Asynchronní `setup()` {#async-setup}

Možnost `setup()` v Composition API může být asynchronní:

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

Při použití `<script setup>` vyrobí přítomnost _top-level `await`_ výrazu z komponenty automaticky asynchronní závislost:

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### Asynchronní komponenty {#async-components}

Asynchronní komponenty jsou přirozeně **„suspenzovatelné“**. To znamená, že pokud má komponenta v rodičovském řetězci  `<Suspense>`, bude s ní zacházeno jako s asynchronní závislostí této `<Suspense>`. V tomto případě bude stav načítání ovládán `<Suspense>` a&nbsp;vlastní nastavení načítání, chyb, zpoždění a časového limitu v komponentě budou ignorovány.

Asynchronní komponenta se může z kontroly nadřazené `<Suspense>` vyvázat a&nbsp;kontrolovat svůj vlastní stav načítání pomocí nastavení `suspensible: false` ve&nbsp;vlastnostech komponenty.

## Stav načítání {#loading-state}

Komponenta `<Suspense>` má dva sloty: `#default` a `#fallback`. Oba sloty povolují **pouze jeden** element bezprostředního potomka. Element ve výchozím (default) slotu je zobrazen, pokud je to možné. Pokud není, je místo toho zobrazen element v záložním (fallback) slotu.

```vue-html
<Suspense>
  <!-- komponenta s vnořenými async závislostmi -->
  <Dashboard />

  <!-- stav načítání pomocí #fallback slotu -->
  <template #fallback>
    Načítání...
  </template>
</Suspense>
```

Při úvodním vykreslení `<Suspense>` zobrazí obsah svého výchozího (default) slotu v&nbsp;paměti. Pokud se během procesu objeví nějaké asynchronní závislosti, přejde se do stavu **pending** (čekající). Během čekání se zobrazí záložní (fallback) obsah. Poté, co jsou vyřešeny všechny zjištěné asynchronní závislosti, `<Suspense>` přejde do stavu **resolved** (vyřešeno) a zobrazí se konečný obsah výchozího slotu.

Pokud se během úvodního vykreslení na žádné asynchronní závislosti nenarazí, `<Suspense>` přejde rovnou do stavu vyřešeno.

Jakmile je ve stavu vyřešeno, `<Suspense>` se vrátí do čekajícího (pending) stavu pouze tehdy, pokud je nahrazen kořenový element `#default` slotu. Nové asynchronní závislosti vnořené hlouběji do stromu **nezpůsobí**, že se `<Suspense>` vrátí do čekajícího stavu.

Když dojde k aktualizaci, záložní (fallback) obsah se nezobrazí okamžitě. Místo toho `<Suspense>` zobrazí předchozí obsah `#default` slotu, zatímco čeká na vyřešení nového obsahu a jeho asynchronních závislostí. Toto chování lze konfigurovat pomocí vlastnosti `timeout`: `<Suspense>` se na záložní obsah přepne, pokud vykreslení nového výchozího obsahu trvá déle než `timeout`. Hodnota `timeout: 0` způsobí, že se záložní obsah zobrazí okamžitě po nahrazení výchozího obsahu.

## Události (Events) {#events}

Komponenta `<Suspense>` emituje 3 události: `pending`, `resolve` a `fallback`. Událost `pending` nastává při přechodu do čekajícího stavu. Událost `resolve` se volá, když je dokončeno vyhodnocování nového obsahu v `#default` slotu. Událost `fallback` je emitována v okamžiku zobrazení `#fallback` obsahu.

Tyto události lze použít například k zobrazení indikátoru načítání před starým obsahem DOM během vykreslování nových komponent.

## Obsluha chyb {#error-handling}

`<Suspense>` momentálně obsluhu chyb sama o sobě nenabízí, nicméně můžete použít možnost [`errorCaptured`](/api/options-lifecycle#errorcaptured) nebo [`onErrorCaptured()`](/api/composition-api-lifecycle#onerrorcaptured) hook k zachycení a zpracování asynchronních chyb v komponentě nadřazené `<Suspense>`.

## Kombinace s ostatními komponentami {#combining-with-other-components}

Je běžné používat `<Suspense>` v kombinaci s [`<Transition>`](./transition) a [`<KeepAlive>`](./keep-alive) komponentami. Pořadí vnoření je důležté, aby všechny fungovaly správně.

Dále jsou tyto komponenty často používány ve spojení s `<RouterView>` komponentou z&nbsp;[Vue Router](https://router.vuejs.org/).

Následující příklad ukazuje, jak tyto komponenty správně vnořit, aby se všechny chovaly podle očekávání. Pro jednodušší kombinace můžete odebrat části, které nepotřebujete:

```vue-html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- hlavní obsah -->
          <component :is="Component"></component>

          <!-- stav načítání -->
          <template #fallback>
            Načítání...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

Vue Router má vestavěnou podporu pro [„lazy“ načítání komponent](https://router.vuejs.org/guide/advanced/lazy-loading.html) pomocí dynamických importů. Ty se od asynchronních komponent liší a v současnosti na ně `<Suspense>` nereaguje. Stále však mohou mít další asynchronní komponenty jako potomky a ty mohou `<Suspense>` vyvolat obvyklým způsobem.

## Vnořené Suspense {#nested-suspense}

- Podporováno až od verze 3.3+

Když máme více asynchronních komponent (což je běžné ve vnořených cestách (routes) nebo v cestách založených na layoutech) jako například tyto:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <component :is="DynamicAsyncInner" />
  </component>
</Suspense>
```

`<Suspense>` vytvoří v souladu s očekáváním ohraničení, které vyřeší všechny asynchronní komponenty v celém stromě závislostí. Pokud změníme `DynamicAsyncOuter`, `<Suspense>` na ni správně počká. Ale když změníme `DynamicAsyncInner`, vnořená `DynamicAsyncInner` vykreslí prázdný element, dokud nebude vyřešena (místo předchozí komponenty nebo fallback slotu).

Abychom to vyřešili, můžeme přidat vnořenou suspense k obsluze aktualizace vnořené komponenty tímto způsobem:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <Suspense suspensible> <!-- zde -->
      <component :is="DynamicAsyncInner" />
    </Suspense>
  </component>
</Suspense>
```

Pokud nenastavíte vlastnost `suspensible`, vnitřní `<Suspense>` bude rodičovskou `<Suspense>` považována za synchronní komponentu. To znamená, že má svůj vlastní fallback slot a když se obě `Dynamic` komponenty změní najednou, mohou se objevit prázdné elementy a spustit více aktualizačních cyklů, zatímco vnořená `<Suspense>` načítá svůj strom závislostí. Což nemusí být žádoucí. Když je `suspensible` nastaveno, obsluha asynchronního načítání je předána rodičovské `<Suspense>` (vč. emitovaných událostí) a&nbsp;vnitřní `<Suspense>` slouží jen jako další ohraničení pro řešení závislostí a aktualizace.

---

**Související**

- [API reference pro `<Suspense>`](/api/built-in-components#suspense)
