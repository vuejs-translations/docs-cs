# Vestavěné speciální elementy {#built-in-special-elements}

:::info Nejsou to komponenty
`<component>`, `<slot>` a `<template>` jsou komponentám-podobné funkce, jenž jsou součástí syntaxe šablon. Nejedná se o skutečné komponenty a jsou zpracovávány během kompilace šablony. Proto se obvykle v šablonách píší malými písmeny.
:::

## `<component>` {#component}

"Meta komponenta" pro vykreslování dynamických komponent nebo elementů.

- **Vlastnosti (Props)**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Podrobnosti**

  Skutečná komponenta k vykreslení je určena vlastností `is`.

  - Když je `is` řetězec, může to být buď název HTML tagu nebo zaregistrovaný název komponenty.

  - Alternativně může být `is` vázán přímo na definici komponenty.

- **Příklad**

  Vykreslování komponent podle zaregistrovaného názvu (Options API):

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  Vykreslování komponent podle definice (Composition API s `<script setup>`):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  Vykreslování HTML elementů:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  Do `is` lze předat všechny [vestavěné komponenty](./built-in-components), ale musíte je zaregistrovat, pokud je chcete předávat jménem. Například:

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

Registrace není vyžadována, pokud do `is` místo jejího názvu předáte samotnou komponentu, např. ve `<script setup>`.

Pokud je na tagu `<component>` použit `v-model`, kompilátor šablony jej transformuje na vlastnost (prop)`modelValue` a event listener `update:modelValue`, podobně jako by to udělal pro jakoukoli jinou komponentu. Není to však kompatibilní s nativními HTML elementy, jako jsou `<input>` nebo `<select>`. Kvůli tomu použití `v-model` s dynamicky vytvořeným nativním elementem nebude fungovat:

```vue
<script setup>
import { ref } from 'vue'

const tag = ref('input')
const username = ref('')
</script>

<template>
  <!-- Toto nebude fungovat, protože 'input' je nativní HTML element -->
  <component :is="tag" v-model="username" />
</template>
```

V praxi se tento okrajový případ běžně nevyskytuje, protože nativní formulářová pole jsou ve skutečných aplikacích obvykle obalena komponentami. Pokud však skutečně potřebujete použít nativní element přímo, můžete `v-model` rozdělit na atribut a událost ručně.

- **Viz také:** [Dynamické komponenty](/guide/essentials/component-basics#dynamic-components)

## `<slot>` {#slot}

Určuje prostor pro vložený obsah uvnitř šablon.

- **Props** 

  ```ts
  interface SlotProps {
    /**
     * Jakékoli vlastnosti předané do <slot> budou předány jako argumenty
     * pro scoped sloty
     */
    [key: string]: any
    /**
     * Rezervováno pro specifikaci jména slotu.
     */
    name?: string
  }
  ```

- **Podrobnosti**

  Element `<slot>` může použít atribut `name` k určení jména slotu. Pokud není specifikováno žádné jméno, bude vykreslen výchozí (default) slot. Další atributy předané do elementu slotu budou předány jako vlastnosti (props) scoped slotu definovaného v rodičovské komponentě.

  Samotný element bude nahrazen obsahem odpovídajícího slotu.

  `<slot>` elementy ve Vue šablonách jsou kompilovány do JavaScriptu, aby nedocházelo k jejich záměně s [nativními `<slot>` elementy](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot).

- **Viz také:** [Průvodce - Sloty](/guide/components/slots)

## `<template>` {#template}

Tag `<template>` se používá jako placeholder, když chceme použít vestavěnou direktivu, aniž bychom vykreslovali element v DOM.

- **Podrobnosti**

  Speciální obsluha je pro `<template>` spuštěna pouze tehdy, pokud je tag použit s jednou z těchto direktiv:

  - `v-if`, `v-else-if` nebo `v-else`
  - `v-for`
  - `v-slot`

  Pokud žádná z těchto direktiv přítomna není, bude vykreslen jako [nativní `<template>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

  `<template>` s `v-for` může mít také atribut [`key`](/api/built-in-special-attributes#key). Všechny ostatní atributy a direktivy budou igorovány, protože nemají bez odpovídajícího prvku význam.

  Single-file komponenty (SFC) používají [tag `<template>` nejvyšší úrovně](/api/sfc-spec#language-blocks) k obalení celé šablony. Tento způsob použití je oddělen od použití `<template>` popsaného výše. Tento tag nejvyšší úrovně není součástí samotné šablony a nepodporuje syntaxi šablony, jako jsou direktivy.

- **Viz také:**
  - [Průvodce - `v-if` na `<template>`](/guide/essentials/conditional#v-if-on-template)
  - [Průvodce - `v-for` na `<template>`](/guide/essentials/list#v-for-on-template)
  - [Průvodce - Pojmenované sloty](/guide/components/slots#named-slots)
