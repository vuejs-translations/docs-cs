# Props {#props}

Komponenta potomka přijímá vstup z rodiče přes vlastnosti (**props**). Nejprve je třeba deklarovat props, které přijímá:

<div class="composition-api">
<div class="sfc">

```vue
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

Poznámka: `defineProps()` je compile-time makro a není nutné jej importovat. Po deklaraci lze vlastnost `msg` použít v šabloně podřízené komponenty. Lze k ní také přistupovat v JavaScript kódu prostřednictvím objektu vráceného z `defineProps()`.

</div>

<div class="html">

```js
// v komponentě potomka
export default {
  props: {
    msg: String
  },
  setup(props) {
    // přístup k props.msg
  }
}
```

Jakmile je deklarována, vlastnost `msg` je vystavena přes `this` a může být použita v šabloně komponenty potomka. Přijaté vlastnosti (props) jsou předávány do funkce `setup()` jako první parametr.

</div>

</div>

<div class="options-api">

```js
// v komponentě potomka
export default {
  props: {
    msg: String
  }
}
```

Jakmile je deklarována, vlastnost `msg` je vystavena přes `this` a může být použita v šabloně komponenty potomka.

</div>

Rodič může předat vlastnosti svému potomkovi stejně jako atributy. K předání dynamické hodnoty můžeme také použít `v-bind` syntaxi:

<div class="sfc">

```vue-html
<ChildComp :msg="pozdrav" />
```

</div>
<div class="html">

```vue-html
<child-comp :msg="pozdrav"></child-comp>
```

</div>

Nyní to zkuste sami v editoru.
