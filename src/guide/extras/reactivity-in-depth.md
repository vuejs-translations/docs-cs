---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# Reaktivita podrobně {#reactivity-in-depth}

Jednou z nejvýraznějších vlastností Vue je nenápadný systém reaktivity. Stav komponenty se skládá z reaktivních JavaScript objektů. Když je upravíte, zobrazení se aktualizuje. To dělá správu stavu jednodušší a intuitivní. Je však také důležité pochopit, jak to funguje, abyste se vyhnuli běžným problémům. Na této stránce se budeme zabývat některými podrobnostmi reaktivního systému Vue na nižší úrovni.

## Co je reaktivita? {#what-is-reactivity}

Tento termín se v programování často používá, ale co tím lidé myslí? Reaktivita je programovací paradigma, které nám umožňuje přizpůsobit se změnám deklarativním způsobem. Klasickým příkladem, který lidé obvykle ukazují, protože je velmi názorný, je tabulkový procesor Excel:

<SpreadSheet />

Zde je buňka A2 definována pomocí vzorce `= A0 + A1` (kliknutím na A2 si můžete zobrazit nebo upravit vzorec), takže tabulkový procesor nám dává výsledek 3. Žádné překvapení. Když však aktualizujete A0 nebo A1, všimnete si, že A2 se také automaticky aktualizuje.

JavaScript obvykle takto nefunguje. Kdybychom chtěli napsat něco srovnatelného v&nbsp;JavaScriptu:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // Stále 3
```

Když změníme `A0`, `A2` se automaticky nezmění.

Jak bychom to tedy v JavaScriptu udělali? Abychom znovu spustili kód, který aktualizuje `A2`, zabalme ho nejprve do funkce:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

Potom musíme definovat několik pojmů:

- Funkce `update()` produkuje **vedlejší efekt** (side effect), nebo zkráceně **efekt**, protože mění stav programu.

- `A0` a `A1` jsou považovány za **závislosti** (dependencies) efektu, protože jejich hodnoty se používají k provedení efektu. Efekt je nazýván **odběratelem** (subscriber) svých závislostí.

Co potřebujeme, je magická funkce, která může vyvolat `update()` (efekt) pokaždé, když se změní `A0` nebo `A1` (závislosti):

```js
whenDepsChange(update)
```

Tato funkce `whenDepsChange()` má následující úkoly:

1. Sledovat, když je proměnná čtena. Například při vyhodnocování výrazu `A0 + A1` jsou čteny obě proměnné `A0` a `A1`.

2. Pokud je proměnná čtena, když je právě spuštěný efekt, stane se tento efekt odběratelem této proměnné. Například protože jsou proměnné `A0` a `A1` čteny při vykonávání `update()`, po prvním volání se `update()` stane odběratelem obou proměnných `A0` a `A1`.

3. Detekovat, když se proměnná změní. Například když je proměnné `A0` přiřazena nová hodnota, upozornit všechny efekty odběratelů, aby se znovu spustily.

## Jak funguje reaktivita ve Vue {#how-reactivity-works-in-vue}

Ve skutečnosti nemůžeme čtení a zápis lokálních proměnných sledovat jako v příkladu. V&nbsp;čistém JavaScriptu pro to prostě neexistuje mechanismus. Co ale **můžeme** udělat, je zachytit čtení a zápis **vlastností objektů**.

Existují dva způsoby, jak zachytit přístup k vlastnostem v JavaScriptu: [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) / [setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) funkce a&nbsp;[Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Vue 2 používalo výhradně getters / setters kvůli omezením podpory prohlížečů. Ve Vue 3 se pro reaktivní objekty používají proxies a pro refs se používají getters / setters. Zde je pseudokód, který ilustruje, jak fungují:

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
Ukázky kódu zde a níže mají za úkol vysvětlit základní koncepty co nejjednodušším způsobem, takže je mnoho detailů vynecháno a okrajové případy jsou ignorovány.
:::

Toto vysvětluje několik [omezení reaktivních objektů](/guide/essentials/reactivity-fundamentals#limitations-of-reactive), o kterých jsme mluvili v kapitole základů:

- Když přiřadíte nebo destruujete vlastnost reaktivního objektu do místní proměnné, přístup nebo přiřazení k této proměnné není reaktivní, protože již nevyvolává get / set proxy traps na zdrojovém objektu. Toto „odpojení“ však ovlivňuje pouze vazbu proměnné - pokud proměnná odkazuje na neprimitivní hodnotu, jako je objekt, změna objektu reaktivní pořád bude.

- Vrácená proxy z `reactive()`, i když se chová stejně jako originál, má odlišnou identitu, pokud ji porovnáme s původním objektem pomocí operátoru `===`.

Uvnitř `track()` kontrolujeme, zda je právě spuštěný efekt. Pokud ano, vyhledáme efekty odběratelů (uložené v Set kolekci) pro sledovanou vlastnost a přidáme efekt do kolekce:

```js
// Toto bude nastaveno před spuštěním efektu.
// Vrátíme se k tomu později.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

Odběry efektů jsou uloženy ve globální datové struktuře `WeakMap<target, Map<key, Set<effect>>>`. Pokud nebyl nalezen Set odběratelů efektů pro vlastnost (sledovanou poprvé), bude vytvořen. To je v krátkosti to, co funkce `getSubscribersForProperty()` dělá. Pro jednoduchost se vyhneme jejím podrobnostem.

Uvnitř funkce `trigger()` pro vlastnost opět vyhledáváme efekty odběratelů. Tentokrát je však voláme:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Nyní se vraťme k funkci `whenDepsChange()`:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

Obaluje původní funkci `update` v efektu, který nastavuje sám sebe jako aktuální aktivní efekt před spuštěním skutečné aktualizace. To umožňuje volání `track()` během aktualizace pro nalezení aktuálního aktivního efektu.

V tomto bodě jsme vytvořili efekt, který automaticky sleduje své závislosti a znovu se spouští, kdykoli se změní některá závislost. Tento efekt nazýváme **Reaktivní efekt** (reactive effect).

Vue poskytuje API, které vám umožňuje reaktivní efekty vytvářet: [`watchEffect()`](/api/reactivity-core#watcheffect). Vlastně jste si možná všimli, že funguje docela podobně jako magická funkce `whenDepsChange()` v příkladu. Nyní můžeme přepracovat původní příklad pomocí skutečných Vue API:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // sleduje A0 a A1
  A2.value = A0.value + A1.value
})

// spustí efekt
A0.value = 2
```

Použití reaktivního efektu pro změnu `ref` není nejzajímavější použití - vlastně to bude názornější při použití computed proměnné:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

Interně `computed` spravuje svou neplatnost a nový výpočet pomocí reaktivního efektu.

Takže jaký je příklad běžného a užitečného reaktivního efektu? Například aktualizace DOM! Jednoduché „reaktivní vykreslování“ můžeme implementovat takto:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `Počet je: ${count.value}`
})

// aktualizuje DOM
count.value++
```

Vlastně je to velmi podobné tomu, jak Vue komponenta udržuje synchronizaci svého stavu s DOM - každá instance komponenty vytváří reaktivní efekt pro vykreslování a&nbsp;aktualizaci DOM. Samozřejmě, Vue komponenty používají mnohem efektivnější způsoby aktualizace DOM než `innerHTML`. O nich se mluví v [Mechanismu vykreslování](./rendering-mechanism).

<div class="options-api">

API `ref()`, `computed()` a `watchEffect()` jsou součástí Composition API. Pokud jste dosud Vue používali pouze s Options API, zjistíte, že Composition API je blíže tomu, jak reaktivní systém Vue funguje uvnitř. Ve praxi je Options API ve Vue 3 implementováno na vrstvě Composition API. Přístup k vlastnostem instance komponenty (`this`) spouští gettery / settery pro sledování reaktivity a volby jako `watch` a `computed` interně vyvolávají jejich ekvivalenty v Composition API.

</div>

## Runtime vs. Compile-time reaktivita {#runtime-vs-compile-time-reactivity}

Reaktivní systém Vue je převážně runtime-based: sledování a spouštění se provádí přímo v prohlížeči během spouštění kódu. Výhodou runtime reaktivity je, že může fungovat bez build fáze a je zde méně okrajových případů. Na druhou stranu je omezena syntaxí JavaScriptu, což vede k potřebě kontejnerů pro hodnoty jako jsou Vue refs.

Některé frameworky, například [Svelte](https://svelte.dev/), se rozhodly tyto omezení překonat implementací reaktivity během kompilace. Analyzují a transformují kód, aby reaktivitu simulovaly. Kompilační krok umožňuje frameworku změnit sémantiku samotného JavaScriptu - například implicitně vkládá kód, který provádí analýzu závislostí a spouštění efektů při přístupu k lokálně definovaným proměnným. Nevýhodou je, že takové transformace vyžadují build fázi a změna sémantiky JavaScriptu v podstatě vytváří jazyk, který vypadá jako JavaScript, ale kompiluje se do něčeho jiného.

Tým Vue tuto cestu zkoumal pomocí experimentální funkce nazvané [transformace reaktivity](/guide/extras/reactivity-transform), ale nakonec jsme se rozhodli, že by to pro projekt nebylo vhodné z důvodů uvedených [zde](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

## Ladění reaktivity {#reactivity-debugging}

Je skvělé, že reaktivní systém Vue sleduje závislosti automaticky, ale občas se může hodit zjistit, které závislosti jsou sledovány nebo co způsobuje překreslení komponenty.

### Debugging Hooks komponenty {#component-debugging-hooks}

Pomocí lifecycle hooks <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> a <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span> můžeme ladit, které závislosti jsou během vykreslování komponenty používány a která závislost spouští aktualizaci. Oba hooks obdrží debug událost, která obsahuje informace o dané závislosti. Doporučuje se do těchto callbacků umístit příkaz `debugger`, abyste mohli závislost interaktivně prozkoumat:

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
Debugging hooks komponent fungují pouze v režimu vývoje.
:::

Objekty debug událostí mají následující typ:

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### Ladění computed proměnných {#computed-debugging}

<!-- TODO options API ekvivalent -->

Computed proměnné můžeme ladit tak, že `computed()` předáme druhý objekt s&nbsp;možnostmi `onTrack` a `onTrigger`:

- `onTrack` se zavolá, když je reaktivní vlastnost nebo ref sledován jako závislost.
- `onTrigger` se zavolá, když je změnou závislosti spuštěn callback watcheru.

Oba callbacky obdrží debug události ve [stejném formátu](#debugger-event) jako debug události komponent:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // spuštěno, když je count.value sledováno jako závislost
    debugger
  },
  onTrigger(e) {
    // spuštěno, když je count.value změněno
    debugger
  }
})

// přístup k plusOne, mělo by spustit onTrack
console.log(plusOne.value)

// změna count.value, mělo by spustit onTrigger
count.value++
```

:::tip
Možnosti `onTrack` a `onTrigger` pro computed proměnné fungují pouze v režimu vývoje.
:::

### Ladění watcherů {#watcher-debugging}

<!-- TODO options API ekvivalent -->

Podobně jako `computed()`, watchery také podporují možnosti `onTrack` a `onTrigger`:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
Možnosti `onTrack` a `onTrigger` watcheru fungují pouze v režimu vývoje.
:::

## Integrace s externími systémy pro správu stavu {#integration-with-external-state-systems}

Reaktivní systém Vue funguje tak, že převádí běžné JavaScriptové objekty na hluboce reaktivní proxy. Hluboká konverze může být zbytečná a někdy i nežádoucí při integraci s&nbsp;externími systémy pro správu stavu (např. pokud i externí řešení používá Proxies).

Obecná myšlenka integrace reaktivního systému Vue s externím řešením pro správu stavu je uchovávat externí stav v [`shallowRef`](/api/reactivity-advanced#shallowref). „Mělký“ ref je reaktivní pouze tehdy, když se přistupuje k jeho vlastnosti `.value` - vnitřní hodnota zůstává nedotčena. Při změně externího stavu nahraďte hodnotu ref, aby se spustily aktualizace.

### Neměnná data {#immutable-data}

Pokud implementujete funkci undo / redo, pravděpodobně chcete po každé úpravě uživatele vytvořit snímek stavu aplikace. Nicméně pokud je strom stavu rozsáhlý, měnitelný reaktivní systém Vue pro to není nejvhodnější, protože serializace celého stavového objektu při každé aktualizaci může být drahá z hlediska výkonu a paměťových nákladů.

[Neměnné (immutable) datové struktury](https://en.wikipedia.org/wiki/Persistent_data_structure) řeší tento problém tím, že stavové objekty nikdy nemění - místo toho vytvářejí nové objekty, které s těmi starými sdílejí stejné, nezměněné části. Existuje různé způsoby použití neměnných dat v JavaScriptu, ale s&nbsp;Vue doporučujeme použít [Immer](https://immerjs.github.io/immer/), protože vám umožňuje používat neměnná data a&nbsp;zachovává ergonomičtější, měnitelnou syntaxi.

Immer můžeme integrovat s Vue pomocí jednoduché composable:

```js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)

### Stavové automaty {#state-machines}

[Stavový automat (State machine)](https://cs.wikipedia.org/wiki/Kone%C4%8Dn%C3%BD_automat) je model pro popis všech možných stavů, ve kterých se aplikace může nacházet, a všech možných způsobů, jak může přecházet z jednoho stavu do druhého. Ačkoli může být zbytečný pro jednoduché komponenty, může pomoci vytvořit robustnější a snadno spravovatelné složité stavové toky (state flows).

Jednou z nejpopulárnějších implementací stavových automatů v JavaScriptu je [XState](https://xstate.js.org/). Zde je composable, která s ním integruje:

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) je knihovna pro práci s asynchronními event streamy. Knihovna [VueUse](https://vueuse.org/) poskytuje add-on [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) na propojení RxJS proudů s reaktivním systémem Vue.

## Propojení se signály {#connection-to-signals}

Celá řada dalších frameworků zavedla reaktivní prvky podobné refs z Composition API Vue pod termínem „signály“:

- [Solid Signals](https://www.solidjs.com/docs/latest/api#createsignal)
- [Angular Signals](https://angular.dev/guide/signals)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [Qwik Signals](https://qwik.builder.io/docs/components/state/#usesignal)

V jádru jsou signály stejným druhem prosté reaktivity (reactivity primitive) jako Vue refs. Jedná se o kontejner hodnot, který poskytuje sledování závislostí při přístupu a&nbsp;spouštění vedlejších efektů při změně. Toto paradigma založené na prosté reaktivitě není ve světě frontendu nijak zvlášť nový koncept: sahá až do implementací jako [Knockout observables](https://knockoutjs.com/documentation/observables.html) a [Meteor Tracker](https://docs.meteor.com/api/tracker.html) z doby před více než deseti lety. Vue Options API a knihovna pro správu stavu Reactu [MobX](https://mobx.js.org/) jsou také založeny na stejných principech, ale skrývají prostou reaktivitu za vlastnosti objektů.

  I když to není nutná vlastnost, aby se něco kvalifikovalo jako signály, dnes se tento koncept často diskutuje ve spojitosti s modelem vykreslování, kde aktualizace probíhají prostřednictvím jemně granulovaných odběrů (fine-grained subscriptions). Vue v&nbsp;současné době díky použití virtuálního DOM pro dosažení podobných optimalizací [spoléhá na překladač](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom). Zkoumáme však také novou kompilační strategii inspirovanou frameworkem Solid (zvanou [Vapor mode](https://github.com/vuejs/core-vapor)), která na virtuální DOM nespoléhá a více využívá vestavěný reaktivní systém Vue.

### Kompromisy návrhu API {#api-design-trade-offs}

Návrh signálů v Preactu a Qwik je velmi podobný Vue [shallowRef](/api/reactivity-advanced#shallowref): všechny tři poskytují měnitelné rozhraní prostřednictvím vlastnosti `.value`. Zaměříme se na diskuzi o&nbsp;signálech v Solidu a Angularu.

#### Solid Signály {#solid-signals}

Návrh API `createSignal()` v Solidu zdůrazňuje oddělení čtení a zápisu. Signály jsou přístupné jako getter pouze pro čtení a samostatný setter:

```js
const [count, setCount] = createSignal(0)

count() // přístup k hodnotě
setCount(1) // aktualizace hodnoty
```

Všimněte si, jak může být signál `count` předán bez setteru. Tím se zajistí, že stav nemůže být nikdy měněn, pokud není setter explicitně vystaven. Zda tato záruka bezpečnosti ospravedlňuje více složitou syntaxi, může být závislé na požadavcích projektu a osobních preferencích - ale pokud tento styl API preferujete, můžete ho ve Vue snadno replikovat:

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Angular Signály  {#angular-signals}

Angular prochází některými zásadními změnami, jak se vzdává konceptu dirty-checking a představuje vlastní implementaci prosté reaktivity. API pro signály v Angularu vypadá takto:

```js
const count = signal(0)

count() // přístup k hodnotě
count.set(1) // nastavení nové hodnoty
count.update((v) => v + 1) // aktualizace na základě předchozí hodnoty
```

Toto API opět můžeme snadno replikovat ve Vue:

```js
import { shallowRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  return s
}
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9Ul1v0zAU/SuWX9ZCSRh7m9IKGHuAB0AD8WQJZclt6s2xLX+ESlH+O9d2krbr1Df7nnPu17k9/aR11nmgt7SwleHaEQvO6w2TvNXKONITyxtZihWpVKu9g5oMZGtUS66yvJSNF6V5lyjZk71ikslKSeuQ7qUj61G+eL+cgFr5RwGITAkXiyVZb5IAn2/IB+QWeeoHO8GPg1aL0gH+CCl215u7mJ3bW9L3s3IYihyxifMlFRpJqewL1qN3TknysRK8el4zGjNlXtdYa9GFrjryllwvGY18QrisDLQgXZTnSX8pF64zzD7pDWDghbbI5/Hoip7tFL05eLErhVD/HmB75Edpyd8zc9DUaAbso3TrZeU4tjfawSV3vBR/SuFhSfrQUXLHBMvmKqe8A8siK7lmsi5gAbJhWARiIGD9hM7BIfHSgjGaHljzlDyGF2MEPQs6g5dpcAIm8Xs+2XxODTgUn0xVYdJ5RxPhKOd4gdMsA/rgLEq3vEEHlEQPYrbgaqu5APNDh6KWUTyuZC2jcWvfYswZD6spXu2gen4l/mT3Icboz3AWpgNGZ8yVBttM8P2v77DH9wy2qvYC2RfAB7BK+NBjon32ssa2j3ix26/xsrhsftv7vQNpp6FCo4E5RD6jeE93F0Y/tHuT3URd2OLwHyXleRY=)

Ve srovnání s Vue refs poskytuje getter-based API styl  Solidu a Angularu při použití ve Vue komponentách některé zajímavé kompromisy:

- `()` je o něco kratší než `.value`, ale aktualizace hodnoty je rozsáhlejší.
- Neexistuje ref-unwrapping: přístup k hodnotám vždy vyžaduje `()`. To zajišťuje všude konzistentní přístup k hodnotám. Také to znamená, že můžete předávat nezpracované signály jako vlastnosti (props) komponenty.

Zda se vám tyto API styly hodí, je do značné míry subjektivní. Naším cílem zde je demonstrovat podobnost a kompromisy mezi těmito různými návrhy API. Chceme také ukázat, že Vue je flexibilní: opravdu nejste uzamčeni do existujících API. Pokud je to nutné, můžete si vytvořit vlastní API pro reaktivitu, které lépe vyhovuje konkrétním potřebám.
