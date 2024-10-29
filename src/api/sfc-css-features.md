# CSS funkce pro SFC {#sfc-css-features}

## Scoped CSS {#scoped-css}

Když má sekce `<style>` atribut `scoped`, její CSS se aplikuje pouze na prvky aktuální komponenty. To je podobné zapouzdření stylů v Shadow DOM. S tím jsou spojena některá omezení, ale nejsou vyžadovány žádné polyfills. Toho se dosáhne pomocí PostCSS transformace následujícího kódu:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">ahoj</div>
</template>
```

Na toto:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>ahoj</div>
</template>
```

### Root elementy komponent potomka{#child-component-root-elements}

Se `scoped` atributem nebudou styly komponenty rodiče prosakovat do komponent potomků. Nicméně root element komponenty potomka bude ovlivněn jak rodičovským `scoped` CSS, tak vlastním `scoped` CSS. Toto je záměr, aby rodič mohl stylovat root element svého potomka pro účely rozvržení (layout).

### Deep selektory {#deep-selectors}

Pokud chcete, aby selektor ve `scoped` stylech byl „hluboký“ a ovlivňoval i komponenty potomků, můžete použít pseudotřídu `:deep()`:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

Výše uvedený kód se zkompiluje na:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
Obsah DOM vytvořený pomocí `v-html` není ovlivněn `scoped` styly, ale pomocí deep selektorů jej stále lze stylovat.
:::

### Selektory pro sloty {#slotted-selectors}

Ve výchozím nastavení `scoped` styly neovlivňují obsah vykreslený pomocí `<slot/>`, protože ty jsou považovány za vlastnictví komponenty rodiče, která je předává. Pro explicitní cílení na obsah slotu použijte pseudotřídu `:slotted`:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Globální selektory {#global-selectors}

Pokud chcete, aby se pravidlo aplikovalo globálně, můžete místo vytváření dalšího `<style>` použít pseudotřídu `:global` (viz níže):

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Kombinace lokálních a globálních stylů {#mixing-local-and-global-styles}

Můžete také do stejné komponenty zahrnout jak lokální, tak globální styly:

```vue
<style>
/* globální styly */
</style>

<style scoped>
/* lokální styly */
</style>
```

### Tipy pro lokální styly {#scoped-style-tips}

- **Lokální styly neodstraňují potřebu tříd**. Kvůli způsobu, jakým prohlížeče vyhodnocují různé CSS selektory, bude `p { color: red }` mnohem pomalejší, když je použit s&nbsp;atributovým selektorem. Pokud místo toho použijete třídy nebo id, například `.example { color: red }`, prakticky tím tento problém výkonosti eliminujete.

- **Buďte opatrní s selektory potomků v rekurzivních komponentách!** Pro CSS pravidlo se selektorem `.a .b`, pokud prvek odpovídající `.a` obsahuje rekurzivní komponentu potomka, pak všechny `.b` v této komponentě potomka budou pravidlu odpovídat.

## CSS moduly {#css-modules}

Tag `<style module>` je kompilován jako [CSS moduly](https://github.com/css-modules/css-modules) a vystavuje výsledné CSS třídy komponenty jako objekt pod klíčem `$style`:

```vue
<template>
  <p :class="$style.red">Toto by mělo být červené</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

Výsledné třídy jsou hashovány, aby se předešlo kolizím, čímž se dosáhne stejného efektu omezování platnosti CSS pouze na aktuální komponentu.

Pro více podrobností, jako jsou [globální výjimky](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#exceptions) a [kompozice](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#composition), se podívejte na [specifikaci CSS modulů](https://github.com/css-modules/css-modules).

### Vlastní název implementovaných tříd {#custom-inject-name}

Můžete přizpůsobit klíč vlastnosti implementovaného objektu tříd tím, že atributu `module` přiřadíte hodnotu:

```vue
<template>
  <p :class="classes.red">červená</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Použití s Composition API {#usage-with-composition-api}

Na implementované třídy lze přistupovat v `setup()` a `<script setup>` pomocí API `useCssModule`. Pro bloky `<style module>` s vlastními implementovanými názvy přijímá `useCssModule` odpovídající hodnotu atributu `module` jako první parametr:

```js
import { useCssModule } from 'vue'

// uvnitř scope setup()...
// výchozí, vrací třídy pro <style module>
useCssModule()

// pojmenovaný, vrací třídy pro <style module="classes">
useCssModule('classes')
```

- **Příklad**

```vue
<script setup lang="ts">
import { useCssModule } from 'vue'

const classes = useCssModule()
</script>

<template>
  <p :class="classes.red">ahoj</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

## `v-bind()` v CSS {#v-bind-in-css}

SFC sekce `<style>` podporuje propojení CSS hodnot s dynamickým stavem komponenty pomocí funkce `v-bind` v CSS:

```vue
<template>
  <div class="text">ahoj</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

Syntaxe funguje s [`<script setup>`](./sfc-script-setup) a podporuje JavaScriptové výrazy (musí být obalené v jednoduchých uvozovkách):

```vue
<script setup>
import { ref } from 'vue'
const theme = ref({
    color: 'red',
})
</script>

<template>
  <p>ahoj</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

Skutečná hodnota bude zkompilována do hashované custom CSS vlastnosti, takže CSS je stále statické. Custom vlastnost bude aplikována na root element komponenty pomocí inline stylů a reaktivně aktualizována, pokud se změní zdrojová hodnota.
