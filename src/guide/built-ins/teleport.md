# Teleport {#teleport}

 <VueSchoolLink href="https://vueschool.io/lessons/vue-3-teleport" title="Lekce o komponentě Teleport ve Vue.js zdarma"/>

`<Teleport>` je vestavěná komponenta, který nám umožňuje „teleportovat“ část šablony komponenty do DOM elementu, který existuje mimo DOM hierarchii této komponenty.

## Základní použití {#basic-usage}

Někdy se můžeme setkat s tímto scénářem: část šablony komponenty k ní logicky patří, ale z vizuálního hlediska by měla být zobrazena jinde v DOM, mimo Vue aplikaci.

Nejběžnějším příkladem je vytváření modálního okna přes celou obrazovku. Ideálně bychom chtěli, aby tlačítko modálního okna a samotné modální okno existovaly uvnitř stejné komponenty, protože obě souvisí se stavem otevření/zavření modálního okna. Ale&nbsp;to znamená, že modální okno bude vykresleno spolu s tlačítkem, hluboce vnořeno v&nbsp;DOM hierarchii aplikace. To může přinést různé záludné problémy při pozicování modálního okna pomocí CSS.

Představte si následující HTML strukturu:

```vue-html
<div class="outer">
  <h3>Příklad na Vue Teleport</h3>
  <div>
    <MyModal />
  </div>
</div>
```

A zde je implementace komponenty `<MyModal>`:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Otevřít modální okno</button>

  <div v-if="open" class="modal">
    <p>Ahoj z modálního okna!</p>
    <button @click="open = false">Zavřít</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Otevřít modální okno</button>

  <div v-if="open" class="modal">
    <p>Ahoj z modálního okna!</p>
    <button @click="open = false">Zavřít</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

Komponenta obsahuje `<button>`, který vyvolá otevření modálního okna, a element `<div>` s třídou `.modal`, který obklopuje samotný obsah modálního okna a tlačítko pro jeho uzavření.

Při použití této komponenty uvnitř původní HTML struktury může nastat několik potenciálních problémů:

- `position: fixed` umisťuje prvek relativně k oknu prohlížeče pouze tehdy, když žádný nadřazený prvek nemá nastavenou vlastnost `transform`, `perspective` nebo `filter`. Pokud například chceme animovat nadřazený prvek `<div class="outer">` pomocí CSS transformace, způsobí to narušení layoutu modálního okna!

- `z-index` modálního okna je omezen na jeho nadřazené prvky. Pokud existuje jiný prvek, který překrývá `<div class="outer">` a má vyšší `z-index`, překryje náš modální dialog.

`<Teleport>` poskytuje čistý způsob, jak tyto problémy obejít, umožňuje nám vymanit se z vnořené DOM struktury. Upravme komponentu `<MyModal>`, aby používala `<Teleport>`:

```vue-html{3,8}
<button @click="open = true">Otevřít modální okno</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Ahoj z modálního okna!</p>
    <button @click="open = false">Zavřít</button>
  </div>
</Teleport>
```

Atribut `to` uvnitř `<Teleport>` slouží jako cíl a očekává CSS selektor nebo samotný DOM element. Zde v podstatě říkáme Vue, ať _„**teleportuje** tento fragment šablony **do** tagu **`body`**“_.

Můžete kliknout na tlačítko níže a pomocí nástrojů pro vývojáře ve vašem prohlížeči zkontrolovat tag `<body>`:

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<div class="demo">
  <button @click="open = true">Otevřít modální okno</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">Ahoj z modálního okna!</p>
        <button @click="open = false">Zavřít</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

Pro vytvoření animovaných modálních oken můžete `<Teleport>` kombinovat s&nbsp;[`<Transition>`](./transition) - viz [příklad zde](/examples/#modal).

:::tip
Cíl teleportace `to` už musí být v DOM, když je komponenta `<Teleport>` připojena (mounted). Ideálně by to měl být prvek mimo celou Vue aplikaci. Pokud je cílem teleportace jiný prvek vykreslený Vue, musíte se ujistit, že je tento prvek připojen dříve než `<Teleport>`.
:::

## Použití s komponentami {#using-with-components}

`<Teleport>` upravuje pouze vykreslenou strukturu DOM - neovlivňuje logickou hierarchii komponent. To znamená, že pokud `<Teleport>` obsahuje komponentu, tato komponenta zůstane logickým potomkem rodičovské komponenty obsahující `<Teleport>`. Předávání vlastností (props) a emitování událostí (emits) bude fungovat stále stejným způsobem.

To také znamená, že `inject` z rodičovské komponenty funguje podle očekávání a že komponenta potomka bude pod komponentu rodiče vnořena i ve Vue Devtools, místo aby byla umístěna tam, kam se přesunul výsledný obsah.

## Zakázání teleportace {#disabling-teleport}

V některých případech můžeme chtít `<Teleport>` podmíněně zakázat. Například můžeme chtít vykreslit komponentu jako overlay pro desktop, ale inline na mobilu. `<Teleport>` podporuje vlastnost `disabled`, která může být dynamicky přepínána:

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

Stav `isMobile` může být dynamicky aktualizován pomocí detekce změn v media query.

## Více teleportací na stejný cíl {#multiple-teleports-on-the-same-target}

Běžným použitím by byla znovupoužitelná komponenta `<Modal>`, která může mít současně více aktivních  instancí. Pro tento případ může více komponent `<Teleport>` připojit svůj obsah ke stejnému cílovému elementu. Pořadí bude jednoduché připojení na konec (append) - později připojené fragmenty šablony budou uvnitř cílového elementu umístěny za dřívějšími.

S následujícím použitím:

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

Bude vykresleným výsledkem:

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## Odložený Teleport <sup class="vt-badge" data-text="3.5+" /> {#deferred-teleport}

Ve Vue 3.5+ můžeme použít vlastnost  `defer` pro odložení vyhodnocení cíle Teleportu, dokud nebudou připojeny (mounted) další části aplikace. To umožní Teleportu cílit na kontejner, který je také vykreslován Vue, ale až v pozdější části stromu komponent:

```vue-html
<Teleport defer to="#late-div">...</Teleport>
<!-- někdy později v šabloně -->
<div id="late-div"></div>
```

Pamatujte, že cílový element musí být vykreslen v stejném mount / update cyklu jako Teleport - např. pokud je `<div>` vykreslen pouze o vteřinu později, Teleport stejně ohlásí chybu. Odložení funguje stejně jako lifecycle hook `mounted`.

---

**Související**

- [API reference pro `<Teleport>`](/api/built-in-components#teleport)
- [Zpracování teleportace v SSR režimu](/guide/scaling-up/ssr#teleports)
