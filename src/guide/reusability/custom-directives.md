# Vlastní direktivy {#custom-directives}

<script setup>
const vFocus = {
  mounted: el => {
    el.focus()
  }
}
</script>

## Představení {#introduction}

Kromě výchozí sady vestavěných direktiv (jako je `v-model` nebo `v-show`) umožňuje Vue také registraci vašich vlastních (custom) direktiv.

Ve Vue jsme zavedli dvě formy znovupoužitelného kódu: [komponenty](/guide/essentials/component-basics) a [composables](./composables). Komponenty jsou hlavními stavebními bloky, zatímco composables se zaměřují na znovupoužití stavové logiky. Vlastní direktivy jsou naproti tomu určeny hlavně ke znovupoužití logiky, která se týká low-level přístupu k DOM na prostých elementech.

Vlastní direktiva je definována jako objekt obsahující lifecycle hooks podobné těm, které má komponenta. Hooks obdrží element, na který je direktiva navázána. Zde je příklad direktivy, která provede focus na input, když je element vložen do DOM pomocí Vue:

<div class="composition-api">

```vue
<script setup>
// umožní v šablonách v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

</div>

<div class="options-api">

```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // umožní v šablonách v-focus
    focus
  }
}
```

```vue-html
<input v-focus />
```

</div>

<div class="demo">
  <input v-focus placeholder="Na tento prvek by měl být focus" />
</div>

Za předpokladu, že jste na stránce neklikli jinam, by měl být na výše uvedeném input elementu automaticky nastavený focus. Tato direktiva je užitečnější než atribut `autofocus`, protože funguje nejen při načítání stránky - funguje i tehdy, když je prvek vkládán dynamicky pomocí Vue.

<div class="composition-api">

Ve `<script setup>` lze jako vlastní direktivu použít jakoukoli proměnnou zapsanou v camelCase tvaru, která začíná předponou `v`. Ve výše uvedeném příkladu lze `vFocus` použít v šabloně jako `v-focus`.

Pokud se `<script setup>` nepoužvá, lze vlastní direktivy registrovat pomocí sekce `directives`:

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // umožní v šablonách v-focus
    focus: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

Podobně jako u komponent musí být vlastní direktivy zaregistrovány, aby je bylo možné použít v šablonách. Ve výše uvedeném příkladu používáme lokální registraci pomocí sekce `directives`.

</div>

Běžné je i registrovat vlastní direktivy globálně na úrovni aplikace:

```js
const app = createApp({})

// v-focus bude použitelný ve všech komponentách
app.directive('focus', {
  /* ... */
})
```

:::tip
Vlastní direktivy by se měly používat pouze v případě, že požadované funkcionality lze dosáhnout pouze přímou manipulací s DOM. Pokud je to možné, dávejte přednost deklarativnímu použití šablon pomocí vestavěných direktiv, jako je `v-bind`, protože jsou efektivnější a šetrnější k vykreslování na serveru.
:::

## Lifecycle Hooks direktiv {#directive-hooks}

Objekt definice direktivy může poskytovat několik "hook" funkcí (všechny jsou nepovinné):

```js
const mojeDirektiva = {
  // volána před aplikací
  // navázaných atributů elementů či event listenerů
  created(el, binding, vnode, prevVnode) {
    // detaily jednotlivých argumentů viz níže
  },
  // volána těsně před vložením elementu do DOM
  beforeMount(el, binding, vnode, prevVnode) {},
  // volána po `mounted` (vložení do DOM) 
  // na komponentě rodiče a všech jejích potomcích
  mounted(el, binding, vnode, prevVnode) {},
  // volána před `updated` na komponentě rodiče
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // volána po `updated` na komponentě rodiče
  // a všech jejích potomcích
  updated(el, binding, vnode, prevVnode) {},
  // volána před `unmounted` na komponentě rodiče
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // volána po `unmounted` na komponentě rodiče
  unmounted(el, binding, vnode, prevVnode) {}
}
```

### Parametry lifecycle hooks direktiv {#hook-arguments}

Hooks direktiv obdrží tyto parametry:

- `el`: Prvek, na který je direktiva navázána. Lze jej použít k přímé manipulaci s DOM.

- `binding`: Objekt, který obsahuje následující vlastnosti:

  - `value`: Hodnota předávaná do direktivy. Například pro `v-my-directive="1 + 1"` bude hodnota `2`.
  - `oldValue`: Předchozí hodnota. Dostupná pouze v `beforeUpdate` a `updated`. Je dostupná, ať už se hodnota změnila nebo ne.
  - `arg`: Parametr předávaný do direktivy, pokud existuje. Například pro `v-my-directive:foo` bude parametr `"foo"`.
  - `modifiers`: Objekt, který obsahuje modifikátory, pokud jsou. Například pro `v-my-directive.foo.bar` bude objekt modifikátorů `{ foo: true, bar: true }`.
  - `instance`: Instance komponent, ve které je direktiva použita.
  - `dir`: Objekt definice direktivy

- `vnode`: VNode objekt, který představuje navázaný element.
- `prevNode`: VNode objekt, který představoval navázaný element při předchozím vykreslení. Dostupný pouze v `beforeUpdate` a `updated`.

Jako příklad uvažte následující použití direktivy:

```vue-html
<div v-example:foo.bar="baz">
```

Parametr `binding` bude objekt ve tvaru:

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* hodnota `baz` */,
  oldValue: /* hodnota `baz` z předchozího `update` */
}
```

Podobně jako vestavěné direktivy mohou být argumenty vlastních direktiv dynamické. Například:

```vue-html
<div v-example:[arg]="value"></div>
```

Zde bude parametr směrnice reaktivně aktualizován na základě vlastnosti `arg` ze stavu naší komponenty.

:::tip Poznámka
Kromě `el` byste s těmito argumenty měli zacházet jako s read-only hodnotami a nikdy je neměnit. Pokud potřebujete sdílet informace napříč hooks, doporučujeme to dělat prostřednictvím elementu [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).
:::

## Zkrácený zápis funkcí {#function-shorthand}

Pro vlastní direktivy je běžné, že mají stejné chování pro `mounted` i `updated` a nepotřebují další hooks. V takových případech můžeme direktivu definovat jako funkci:

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // toto bude zavoláno pro `mounted` i `updated`
  el.style.color = binding.value
})
```

## Object Literals {#object-literals}

Pokud vaše direktiva potřebuje více hodnot, můžete předat také JavaScript object literal. Vzpomeňte, že direktivy mohou přebírat libovolný platný JavaScript výraz.

```vue-html
<div v-demo="{ color: 'bílá', text: 'Ahoj!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "bílá"
  console.log(binding.value.text) // => "Ahoj!"
})
```

## Použití na komponenty {#usage-on-components}

Při použití na komponenty se vlastní direktivy vždy vztahují na root element komponenty, podobně jako u [Fallthrough atributů](/guide/components/attrs).

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- šablona MyComponent -->

<div> <!-- direktiva v-demo bude aplikována zde -->
  <span>Obsah mé komponenty</span>
</div>
```

Pamatujte, že komponenty mohou mít potenciálně více než jeden root element. Při použití na multi-root komponentu bude direktiva ignorována a bude vypsáno varování. Na rozdíl od atributů předat direktivy jinému elementu pomocí `v-bind="$attrs"` nelze. Obecně se **nedoporučuje** používat vlastní direktivy u komponent.
