# Composition API: setup() {#composition-api-setup}

## Základní použití {#basic-usage}

V následujících případech slouží hook `setup()` jako vstupní bod pro použití Composition API v komponentách:

1. Použití Composition API bez build fáze;
2. Integrace s kódem založeným na Composition API v komponentě s Options API.

:::info Poznámka
Pokud používáte Composition API v Single-File komponentách (SFC), silně se doporučuje použít [`<script setup>`](/api/sfc-script-setup) pro stručnější a ergonomičtější syntaxi.
:::

Pomocí [Reaktivního API](./reactivity-core) můžeme deklarovat reaktivní stav a vystavit jej šabloně návratem v objektu ze `setup()`. Vlastnosti vráceného objektu budou na instanci komponenty také dostupné (pokud jsou použity jiné vlastnosti):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // vystavit šabloně a dalším sekcím Options API
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

[refs](/api/reactivity-core#ref) vrácené ze `setup` jsou při přístupu ze šablony [automaticky rozbaleny](/guide/essentials/reactivity-fundamentals#deep-reactivity), takže nemusíte pro přístup k hodnotám používat `.value`. Stejným způsobem jsou rozbaleny při přístupu přes `this`.

Samotný `setup()` nemá přístup k instanci komponenty - `this` bude mít uvnitř `setup()` hodnotu `undefined`. Z Options API můžete přistupovat k hodnotám vystaveným Composition API, ale ne naopak.

`setup()` by měl _synchronně_ vrátit objekt. Jediný případ, kdy může být použito `async setup()`, je když je komponenta potomkem komponenty [Suspense](../guide/built-ins/suspense).

## Přístup k vlastnostem (props) {#accessing-props}

Prvním argumentem v funkci `setup` je argument `props`. Stejně jako byste očekávali v běžné komponentě, `props` uvnitř funkce `setup` jsou reaktivní a budou při předání nových vlastností aktualizovány.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Všimněte si, že pokud destrukturujete objekt `props`, destrukturované proměnné ztratí reaktivitu. Proto se doporučuje k props vždy přistupovat ve formě `props.xxx`.

Pokud skutečně potřebujete props destrukturovat nebo je předat do externí funkce a zachovat reaktivitu, můžete to udělat pomocí utilitních API [toRefs()](./reactivity-utilities#torefs) a [toRef()](/api/reactivity-utilities#toref):

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // převede `props` na objekt složený z refs a poté destrukturuje
    const { title } = toRefs(props)
    // `title` je ref, který sleduje `props.title`
    console.log(title.value)

    // NEBO, převede jednu vlastnost z `props` na ref
    const title = toRef(props, 'title')
  }
}
```

## Setup Context {#setup-context}

Druhý argument předaný do funkce `setup` je objekt **Setup Context**. Kontextový objekt poskytuje další hodnoty, které mohou být uvnitř `setup` užitečné:

```js
export default {
  setup(props, context) {
    // Atributy (ne-reaktivní objekt, ekvivalent k $attrs)
    console.log(context.attrs)

    // Sloty (ne-reaktivní objekt, ekvivalent k $slots)
    console.log(context.slots)

    // Vysílání událostí (funkce, ekvivalent k $emit)
    console.log(context.emit)

    // Vystavení veřejných vlastností (funkce)
    console.log(context.expose)
  }
}
```

Kontextový objekt není reaktivní a může být bezpečně destrukturován:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` a `slots` jsou objekty se stavem, které jsou vždy aktualizovány, když je aktualizována samotná komponenta. To znamená, že byste se měli vyhnout destrukturování a vždy odkazovat na vlastnosti jako `attrs.x` nebo `slots.x`. Také si uvědomte, že na rozdíl od `props` jsou vlastnosti `attrs` a `slots` **ne**reaktivní. Pokud plánujete provádět vedlejší efekty na základě změn v `attrs` nebo `slots`, měli byste tak činit uvnitř lifecycle hooku `onBeforeUpdate`.

### Vystavení veřejných vlastností {#exposing-public-properties}

`expose` je funkce, která se používá k explicitnímu omezení vystavených vlastností, když je instance komponenty přistupována komponentou rodiče pomocí [template refs](/guide/essentials/template-refs#ref-on-component):

```js{5,10}
export default {
  setup(props, { expose }) {
    // udělat instanci "uzavřenou" -
    // tj. do rodiče nevystavit nic
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // selektivně vystavit lokální stav
    expose({ count: publicCount })
  }
}
```

## Použití s funkcemi pro vykreselní{#usage-with-render-functions}

`setup` může také vrátit [funkci pro vykreslení](/guide/extras/render-function), která může přímo využívat reaktivní stav deklarovaný ve stejném rozsahu:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Vrácení funkce pro vykreslení nám zabrání vrátit cokoli jiného. Interně by to nemělo vadit, ale může to být problematické, pokud chceme vystavit metody této komponenty do komponenty rodiče pomocí template refs.

Tento problém můžeme vyřešit voláním [`expose()`](#exposing-public-properties):

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

Metoda `increment` bude pak dostupná v komponentně rodiče pomocí template ref.
