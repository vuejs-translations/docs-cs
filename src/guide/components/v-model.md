# Binding přes v-model {#component-v-model}

## Základní použití {#basic-usage}

Direkrivu `v-model` lze použít pro implementaci obousměrného (two-way) bindingu.

<div class="composition-api">

Od verze Vue 3.4 je doporučený postup použití makra [`defineModel()`](/api/sfc-script-setup#definemodel):

```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>hodnota v-model z rodiče je: {{ model }}</div>
</template>
```

Komponenta rodiče pak může provést binding hodnoty pomocí `v-model`:

```vue-html
<!-- Parent.vue -->
<Child v-model="count" />
```

Hodnota vrácená z  `defineModel()` je ref. Může být přistupována a měněna jako jakýkoli jiný ref, kromě toho, že slouží jako obousměrný binding mezi hodnotou z rodiče a tou lokální:

- Jeho `.value` je synchronizována s hodnotou navázanou pomocí `v-model` v komponentě rodiče;
- Když je změněna komponentou potomka, způsobí automaticky aktualizaci hodnoty i v komponentě rodiče.

To znamená, že můžete také provést binding tohoto refu na nativní input element pomocí `v-model`, čímž se dá vstupní pole jednoduše a přímočaře obalit:

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=)

### Pod pokličkou {#under-the-hood}

`defineModel` je makro pro usnadnění zápisu. Překladač jej rozšíří na:

- vlastnost (prop) `modelValue`, se kterou je synchronizována lokální hodnota ref;
- událost (event) `update:modelValue`, která je emitována při změně lokální hodnoty ref.

Takto se implementovala komponenta potomka se stejnou funkcionalitou před verzí 3.4:

```vue
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

Jak můžete vidět, je to trochu zbytečně složité. Nicméně je dobré vědět, jak to ve skutečnosti funguje.

Protože `defineModel` deklaruje vlastnost (prop), mužete následně upravovat její možnosti (options) předáním do `defineModel`:

```js
// v-model bude povinná hodnota
const model = defineModel({ required: true })

// poskytnutí výchozí hodnoty
const model = defineModel({ default: 0 })
```

</div>

<div class="options-api">

Napřed si připomeňme, jak se `v-model` používá v nativních elementech:

```vue-html
<input v-model="searchText" />
```

Kompilátor šablon zápis `v-model` na pozadí expanduje. Výše uvedený kód se chová stejně jako následující:

```vue-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

Při použití na komponentě, je `v-model` místo toho expandován na toto:

```vue-html
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```

Aby to však mohlo fungovat, musí komponenta `<CustomInput>` udělat dvě věci:

1. Provést binding atributu `value` nativního `<input>` elementu na vlastnost (prop) `modelValue`
2. Když je vyvolána nativní událost (event) `input`, vyvolat (emit) vlastní událost `update:modelValue` s novou hodnotou

Zde to vidíte v praxi:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Na této komponentě by nyní měl `v-model` perfektně fungovat:

```vue-html
<CustomInput v-model="searchText" />
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFkctqwzAQRX9lEAEn4Np744aWrvoD3URdiHiSGvRCHpmC8b93JDfGKYGCkJjXvTrSJF69r8aIohHtcA69p6O0vfEuELzFgZx5tz4SXIIzUFT1JpfGCmmlxe/c3uFFRU0wSQtwdqxh0dLQwHSnNJep3ilS+8PSCxCQYrC3CMDgMKgrNlB8odaOXVJ2TgdvvNp6vSwHhMZrRcgRQLs1G5+M61A/S/ErKQXUR5immwXMWW1VEKX4g3j3Mo9QfXCeKU9FtvpQmp/lM0Oi6RP/qYieebHZNvyL0acLLODNmGYSxCogxVJ6yW1c2iWz/QOnEnY48kdUpMIVGSllD8t8zVZb+PkHqPG4iw==)

Dalším způsobem implementace `v-model` v rámci této komponenty je použití zapisovatelné `computed` proměnné s getterem a setterem. Metoda `get` by měla vracet vlastnost `modelValue` a metoda `set` by měla vyvolat odpovídající událost:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<template>
  <input v-model="value" />
</template>
```

</div>

## `v-model` parametry {#v-model-arguments}

`v-model` na komponentě může také přijmout parametr:

```vue-html
<MyComponent v-model:title="bookTitle" />
```

<div class="composition-api">

V komponentě potomka můžeme takový parametr podporovat předáním řetězce do  `defineModel()`

```vue
<!-- MyComponent.vue -->
<script setup>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFkl9PwjAUxb9K05dhglsMb2SQqOFBE9Soj31Zxh0Uu7bpHxxZ9t29LWOiQXzaes7p2a+9a+mt1unOA53S3JaGa0csOK/nTPJaK+NISwxUpCOVUTVJMJoM1nJ/r/BNgnS9nWYnWujFMCFMlkpaRxx3AsgsFI6S3XWtViBIYda+Dg3QFLUWkFwxmWcHFqTAhQPUCwe4IiTf3Mzbtq/qujzDddRPYfruaUzNGI1PRkmG0Twb+uiY/sI9cw0/0VdQcQnL0D5KovgfL5fa4/69jiDQOOTo+S6SOYtfrvg63VolkauNN0lLxOUCzLN2HMkYnZLoBK8QQn0+Rs0ZD+OjXm6g/Dijb20TNEZfDFgwOwQZPIdzAWQN9uLtKXIPJtL7gH3BfAWrhA+Mh9idlyvEPslF2of4J3G5freLxoG0x0MF0JDsYp5RHE6Y1F9H/8adpJO4j8mOdl/Hw/nf)

Pokud je potřeba předat i možnosti (options) vlastnosti (prop), je mpžné je předat jako druhý parametr po názvu:

```js
const title = defineModel('title', { required: true })
```

<details>
<summary>Použití před Vue 3.4</summary>

```vue
<!-- MyComponent.vue -->
<script setup>
defineProps(['title'])
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9kE1rwzAMhv+KMIW00DXsGtKyMXYc7D7vEBplM8QfOHJoCfnvk+1QsjJ2svVKevRKk3h27jAGFJWoh7NXjmBACu4kjdLOeoIJPHYwQ+ethoJLi1vq7fpi+WfQ0JI+lCstcrkYQJqzNQMBKeoRjhG4LcYHbVvsofFfQUcCXhrteix20tRl9sIuOCBkvSHkCKD+fjxN04Ka57rkOOlrMwu7SlVHKdIrBZRcWpc3ntiLO7t/nKHFThl899YN248ikYpP9pj1V60o6sG1TMwDU/q/FZRxgeIPgK4uGcQLSZGlamz6sHKd1afUxOoGeeT298A9bHCMKxBfE3mTSNjl1vud5x8qNa76)

</details>
</div>
<div class="options-api">

V tomto případě místo výchozí vlastnosti `modelValue` a události `update:modelValue` může komponenta potomka očekávat vlastnost  `title` a emitovat událost `update:title` pro aktualizaci hodnoty v rodiči:

```vue
<!-- MyComponent.vue -->
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFUNFqwzAM/BVhCm6ha9hryMrGnvcFdR9Mo26B2DGuHFJC/n2yvZakDAohtuTTne5G8eHcrg8oSlFdTr5xtFe2Ma7zBF/Xz45vFi3B2XcG5K6Y9eKYVFZZHBK8xrMOLcGoLMDphrqUMC6Ypm18rzXp9SZjATxS8PZWAVBDLZYg+xfT1diC9t/BxGEctHFtlI2wKR78468q7ttzQcgoTcgVQPXzuh/HzAnTVBVcp/58qz+lMqHelEinElAwtCrufGIrHhJYBPdfEs53jkM4yEQpj8k+miYmc5DBcRKYZeXxqZXGukDZPF1dWhQHUiK3yl63YbZ97r6nIe6uoup6KbmFFfbRCnHGyI4iwyaPPnqffgGMlsEM)

</div>

## Vícenásobný binding přes `v-model` {#multiple-v-model-bindings}

yužitím možnosti zaměřit se na konkrétní vlastnost a událost, jak jsme se to naučili dříve pomocí [`v-model` parametrů](#v-model-arguments), můžeme nyní na jedné instanci komponenty vytvořit více `v-model` vazeb.

Každý `v-model` se bude synchronizovat s jinou vlastností bez nutnosti speciální konfigurace uvnitř komponenty:

```vue-html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFkstuwjAQRX/F8iZUAqKKHQpIfbAoUmnVx86bKEzANLEt26FUkf+9Y4MDSAg2UWbu9fjckVv6oNRw2wAd08wUmitLDNhGTZngtZLakpZoKIkjpZY1SdCadNK3Ab3IazhowzQ2/ES0MVFIYSwpucbvxA/qJXO5FsldlKr8qDxL8EKW7kEQAQsLtapyC1gRkq3vp217mOccwf8wwLksRSlYIoMvCNkOarmEahyODAT2J4yGgtFzhx8UDf5/r6c4NEs7CNqnpxkvbO0kcVjNhCyh5AJe/SW9pBPOV3DJGvu3dsKFaiyxf8qTW9gheQwVs4Z90BDm5oF47cF/Ht4aZC75argxUmD61g9ktJC14hXoN2U5ZmJ0TILitbyq5O889KxuoB/7xRqKnwv9jdn5HqPvGnDVWwTpNJvrFSCul2efi4DeiRigqdB9RfwAI6vGM+5tj41YIvaJL9C+hOfNxerLzHYWhImhPKh3uuBnFJ/A05XoR9zRcBTOMeGo+wcs+yse)

<details>
<summary>Pre 3.4 Usage</summary>

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNUc1qwzAMfhVjCk6hTdg1pGWD7bLDGIydlh1Cq7SGxDaOEjaC332yU6cdFNpLsPRJ348y8idj0qEHnvOi21lpkHWAvdmWSrZGW2Qjs1Azx2qrWyZoVMzQZwf2rWrhhKVZbHhGGivVTqsOWS0tfTeeKBGv+qjEMkJNdUaeNXigyCYjZIEKhNY0FQJVjBXHh+04nvicY/QOBM4VGUFhJHrwBWPDutV7aPKwslbU35Q8FCX/P+GJ4oB/T3hGpEU2m+ArfpnxytX2UEsF71abLhk9QxDzCzn7QCvVYeW7XuGyWSpH0eP6SyuxS75Eb/akOpn302LFYi8SiO8bJ5PK9DhFxV/j0yH8zOnzoWr6+SbhbifkMSwSsgByk1zzsoABFKZY2QNgGpiW57Pdrx2z3JCeI99Svvxh7g8muf2x)

</details>
</div>
<div class="options-api">

```vue
<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNkk1rg0AQhv/KIAETSJRexYYWeuqhl9JTt4clmSSC7i7rKCnif+/ObtYkELAiujPzztejQ/JqTNZ3mBRJ2e5sZWgrVNUYbQm+WrQfskE4WN1AmuXRwQmpUELh2Qv3eJBdTTAIBbDTLluhoraA4VpjXHNwL0kuV0EIYJE6q6IFcKhsSwWk7/qkUq/nq5be+aa5JztGfrmHu8t8GtoZhI2pJaGzAMrT03YYQk0YR3BnruSOZe5CXhKnC3X7TaP3WBc+ZaOc/1kk3hDJvYILRQGfQzx3Rct8GiJZJ7fA7gg/AmesNszMrUIXFpxbwCfZSh09D0Hc7tbN6sAWm4qZf6edcZgxrMHSdA3RF7PTn1l8lTIdhbXp1/CmhOeJRNHLupv4eIaXyItPdJEFD7R8NM0Ce/d/ZCTtESnzlVZXhP/vHbeZaT0tPdf59uONfx7mDVM=)

</div>

## Obsluha `v-model` modifikátorů {#handling-v-model-modifiers}

Když jsme se učili o bindingu dat z formuláře, viděli jsme, že `v-model` má [vestavěné modifikátory](/guide/essentials/forms#modifiers) - `.trim`, `.number` a `.lazy`. V některých případech můžete chtít, aby `v-model` na vaší vlastní input komponentě podporoval vlastní modifikátory také.

Pojďme vytvořit příklad vlastního modifikátoru `capitalize`, který bude psát první znak řetězce zadaného přes `v-model` binding velkými písmeny:

```vue-html
<MyComponent v-model.capitalize="myText" />
```

<div class="composition-api">

Modifikátory přidané na `v-model` komponenty mohou být získány v komponentně potomka pomocí destrukturování návratové hodnoty `defineModel()` takto:

```vue{4}
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

Pro podmíněné nastavení jak by měla být hodnota na základě modifikátorů čtena / zapisována, můžeme do `defineModel()` předat možnosti `get` a `set`. Tyto dvě nastavení získají hodnotu při čtení / zápisu příslušné ref hodnoty a měly by vrátit transformovanou hodnotu. Takto můžeme použít `set` pro implementaci modifikátoru `capitalize`:

```vue{6-8}
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9UsFu2zAM/RVClzhY5mzoLUgHdEUPG9Bt2LLTtIPh0Ik6WxIkyosb5N9LybFrFG1OkvgeyccnHsWNtXkbUKzE2pdOWQKPFOwnqVVjjSM4gsMKTlA508CMqbMRuu9uDd80ajrD+XISi3WZDCB1abQnaLoNHgiuY8VsNptLvV72TbkdPwgbWxeE/ALY7JUHpW0gKAurqKjVI3rAFl1He6V30JkA3AbdKvLXUzXt+8Zssc6fM6+l6NtLAUtusF6O3cRCvFB9yY2SiYFw+8KSYcY/qfEC+FCVQuf/8rxbrJTG+4hkxyiWq2ZtUQecQ3oDqAqyMWeieyQAu0bBaUh5ebkv3A1lH+Y5md/WorstPGZzeHfGfa1KzD6yxzH11B/TCjHC4dPlX1j3P0CdjQ5S79/Z3WhpPF91lDz7Uald/uCNZj/TFFJE91SN7rslxX5JsRrmk6Koa/P/a4qRC7gY4uUey3+vxB/8Icak+OHQo2tRihGjwu2QtUb47te3pHsEWXWomX0B/Ine1CFq7Gmfg96y7Akvqf2StoKXcePvDoTaD0NFocnhxJeClyRu2FujP8u9yq+GnxGnJxSEO+M=)

<details>
<summary>Použití před verzí 3.4</summary>

```vue{11-13}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9Us1Og0AQfpUJF5ZYqV4JNTaNxyYmVi/igdCh3QR2N7tDIza8u7NLpdU0nmB+v5/ZY7Q0Jj10GGVR7iorDYFD6sxDoWRrtCU4gsUaBqitbiHm1ngqrfuV5j+Fik7ldH6R83u5GaBQlVaOoO03+Emw8BtFHCeFyucjKMNxQNiapiTkCGCzlw6kMh1BVRpJZSO/0AEe0Pa0l2oHve6AYdBmvj+/ZHO4bfUWm/Q8uSiiEb6IYM4A+XxCi2bRH9ZX3BgVGKuNYwFbrKXCZx+Jo0cPcG9l02EGL2SZ3mxKr/VW1hKty9hMniy7hjIQCSweQByHBIZCDWzGDwi20ps0Yjxx4MR73Jktc83OOPFHGKk7VZHUKkyFgsAEAqcG2Qif4WWYUml3yOp8wldlDSLISX+TvPDstAemLeGbVvvSLkncJSnpV2PQrkqHLOfmVHeNrFDcMz3w0iBQE1cUzMYBbuS2f55CPj4D6o0/I41HzMKsP+u0kLOPoZWzkx1X7j18A8s0DEY=)

</details>
</div>

<div class="options-api">

Modifikátory přidané do `v-model` komponenty budou dostupné v komponentě potomka pomocí vlastnosti `modelModifiers`. V příkladu níže jsme vytvořili komponentu, která obsahuje vlastnost `modelModifiers`, jejíž výchozí hodnota je prázdný objekt:

```vue{11}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
}
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

Všimněte si, že vlastnost `modelModifiers` komponenty obsahuje `capitalize` a jeho hodnota je `true` - protože tak byla nastavena pomocí `v-model` bindingu `v-model.capitalize="myText"`.

Teď když máme naši vlastnost nastavenou, můžeme kontrolovat klíče `modelModifiers` a napsat handler, který změní emitovanou hodnotu. V kódu níže převedeme řetězec na velká písmena kdykoli, když `<input />` element vyvolá událost `input`.

```vue{13-15}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFks1qg0AQgF9lkIKGpqa9iikNOefUtJfaw6KTZEHdZR1DbPDdO7saf0qgIq47//PNXL2N1uG5Ri/y4io1UtNrUspCK0Owa7aK/0osCQ5GFeCHq4nMuvlJCZCUeHEOGR5EnRNcrTS92VURXGex2qXVZ4JEsOhsAQxSbcrbDaBo9nihCHyXAaC1B3/4jVdDoXwhLHQuCPkGsD/JCmSpa4JUaEkilz9YAZ7RNHSS5REaVQPXgCay9vG0rPNToTLMw9FznXhdHYkHK04Qr4Zs3tL7g2JG8B4QbZS2LLqGXK5PkdcYwTsZrs1R6RU7lcmDRDPaM7AuWARMbf0KwbVdTNk4dyyk5f3l15r5YjRm8b+dQYF0UtkY1jo4fYDDLAByZBxWCmvAkIQ5IvdoBTcLeYCAiVbhvNwJvEk4GIK5M0xPwmwoeF6EpD60RrMVFXJXj72+ymWKwUvfXt+gfVzGB1tzcKfDZec+o/LfxsTdtlCj7bSpm3Xk4tjpD8FZ+uZMWTowu7MW7S+CWR77)

</div>

### Modifikátory pro `v-model` s parametry {#modifiers-for-v-model-with-arguments}

<div class="options-api">

Pro `v-model` binding, kde jsou jak parametry, tak modifikátory, bude vygenerované jméno vlastnosti `arg + "Modifiers"`. Například:

```vue-html
<MyComponent v-model:title.capitalize="myText">
```

Odpovídající deklarace by měla být:

```js
export default {
  props: ['title', 'titleModifiers'],
  emits: ['update:title'],
  created() {
    console.log(this.titleModifiers) // { capitalize: true }
  }
}
```

</div>

Here's another example of using modifiers with multiple `v-model` with different arguments:

```vue-html
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true}
</script>
```

<details>
<summary>Pre 3.4 Usage</summary>

```vue{5,6,10,11}
<script setup>
const props = defineProps({
firstName: String,
lastName: String,
firstNameModifiers: { default: () => ({}) },
lastNameModifiers: { default: () => ({}) }
})
defineEmits(['update:firstName', 'update:lastName'])

console.log(props.firstNameModifiers) // { capitalize: true }
console.log(props.lastNameModifiers) // { uppercase: true}
</script>
```

</details>
</div>
<div class="options-api">

```vue{15,16}
<script>
export default {
  props: {
    firstName: String,
    lastName: String,
    firstNameModifiers: {
      default: () => ({})
    },
    lastNameModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:firstName', 'update:lastName'],
  created() {
    console.log(this.firstNameModifiers) // { capitalize: true }
    console.log(this.lastNameModifiers) // { uppercase: true}
  }
}
</script>
```

</div>
