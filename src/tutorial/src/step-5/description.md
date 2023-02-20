# Binding dat z formulářů {#form-bindings}

Použitím `v-bind` a `v-on` dohromady můžeme vytvořit obousměrný (two-way) binding na vstupní elementy formulářů:

```vue-html
<input :value="text" @input="onInput">
```

<div class="options-api">

```js
methods: {
  onInput(e) {
    // `v-on` handler obdrží jako parametr nativní událost DOM
    this.text = e.target.value
  }
}
```

</div>

<div class="composition-api">

```js
function onInput(e) {
  // `v-on` handler obdrží jako parametr nativní událost DOM
  text.value = e.target.value
}
```

</div>

Zkuste začít do vstupního pole psát – text v `<p>` by se měl během psaní aktualizovat.

Pro zjednodušení two-way bindingu, Vue obsahuje direktivu `v-model`, která je prakticky pouze aliasem pro výše uvedené:

```vue-html
<input v-model="text">
```

`v-model` automaticky synchronizuje hodnotu `<input>` s navázaným stavem, takže pro to už nemusíme vytvářet vlastní event handler.

`v-model` funguje nejen na textových vstupech, ale také na jiných typech vstupů, jako je `<checkbox>`, `<radio>` a `<select>`. Další podrobnosti popisuje <a target="_blank" href="/guide/essentials/forms.html">Průvodce - Binding dat z formulářů</a>.

Nyní zkuste provést refaktoring kódu tak, aby místo aktuální podoby používal `v-model`.
