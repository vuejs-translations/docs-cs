# Emits {#emits}

Kromě přijímání vlastností (props) může komponenta potomka také vysílat (**emits**) události (events) pro komponentu rodiče:

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// deklaruje vysílané události
const emit = defineEmits(['odpoved'])

// emit s parametrem
emit('odpoved', 'Ahoj z potomka')
</script>
```

</div>

<div class="html">

```js
export default {
  // deklaruje vysílané události
  emits: ['odpoved'],
  setup(props, { emit }) {
    // emit s parametrem
    emit('odpoved', 'Ahoj z potomka')
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // deklaruje vysílané události
  emits: ['odpoved'],
  created() {
    // emit s parametrem
    this.$emit('odpoved', 'Ahoj z potomka')
  }
}
```

</div>

První parametr <span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> je název události. Jakékoli další parametry jsou předávány na event listener.

Rodič může naslouchat událostem vysílaným z potomka pomocí `v-on` – zde handler obdrží další parametr z volání z potomka a nastaví jej do lokální proměnné:

<div class="sfc">

```vue-html
<ChildComp @odpoved="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @odpoved="(msg) => childMsg = msg"></child-comp>
```

</div>

Nyní si to vyzkoušejte sami v editoru.
