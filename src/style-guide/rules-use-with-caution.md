# Pravidla priority D: Používejte s rozvahou {#priority-d-rules-use-with-caution}

Některé funkce Vue existují pro přizpůsobení se vzácným okrajovým případům nebo kvůli hladší migraci z legacy kódu. Při nadměrném používání však mohou ztížit údržbu vašeho kódu nebo se dokonce stát zdrojem chyb. Tato pravidla upozorňují na potenciálně rizikové funkce a popisují, kdy a proč je třeba se jim vyhnout.

## Selektory prvků + `scoped` {#element-selectors-with-scoped}

**Selektory prvků by neměly být v rámci `scoped` používány.**

Upřednostněte selektory tříd před selektory prvků ve `scoped` stylech, protože velké počty selektorů prvků jsou pomalé.

::: details Podrobné vysvětlení
Pro zajištění omezení stylů přidává Vue do prvků komponent jedinečný atribut, jako je `data-v-f3f3eg9`. Poté jsou selektory upraveny tak, aby byly vybírány pouze odpovídající prvky s tímto atributem (např. `button[data-v-f3f3eg9]`).

Problém je v tom, že velký počet selektorů atributů prvku (např. `button[data-v-f3f3eg9]`) bude podstatně pomalejší než selektory atributů třídy (např. `.btn-close[data-v-f3f3eg9]` ). Proto by selektory tříd měly být preferovány, kdykoli je to možné.
:::

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## Impliitní komunikace rodič-potomek {#implicit-parent-child-communication}

**Vlastnosti (props) a události (events) by měly být v komunikaci rodič-potomek mezi komponentami upřednostňovány před `this.$parent` nebo modifikacemi vlastností.**

Ideální Vue aplikace posílá vlastnosti dolů a události nahoru. Pokud se budete držet této konvence, budou vaše komponenty mnohem srozumitelnější. Existují však okrajové případy, kdy modifikace vlastností nebo použití `this.$parent` může zjednodušit dvě komponenty, které již stejně jsou pevně svázány.

Problém je, že existuje také mnoho _jednoduchých_ případů, kdy tyto vzory mohou nabízet zdánlivé pohodlí. Pozor: nenechte se svést k výměně jednoduchosti (být schopen porozumět toku vašeho aplikačního stavu) za krátkodobé pohodlí (napsat méně kódu).

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>
