# Template refs {#template-refs}

I když od vás deklarativní model vykreslování ve Vue většinu přímých operací s DOM abstrahuje, stále mohou nastat případy, kdy potřebujeme k základním elementům DOM přímý přístup. Abychom toho dosáhli, můžeme použít speciální atribut `ref`:

```vue-html
<input ref="input">
```

`ref` je speciální atribut, podobný jako atribut `key` popsaný v kapitole `v-for`. Umožňuje nám získat přímý odkaz na konkrétní DOM element nebo instanci podřízené komponenty poté, co je připojena (mounted). To může být užitečné, když chcete například programově zaměřit vstup na připojenou komponentu nebo na elementu inicializovat knihovnu třetí strany.

## Přístup k refs {#accessing-the-refs}

<div class="composition-api">

Pro získání odkazu s Composition API můžeme využít pomocnou funkci [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" />:

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
// první parametr musí odpovídat hodnotě ref v šabloně 
const input = useTemplateRef('muj-ref')
onMounted(() => {
  input.value.focus()
})
</script>
<template>
  <input ref="muj-ref" />
</template>
```

Při použití TypeScriptu podpora Vue v IDE a `vue-tsc` automaticky odvodí typ `inputRef.value` podle toho, na jaký element nebo komponentu je použit odpovídající `ref` atribut.

<details>
<summary>Použití před verzí 3.5</summary>

Ve verzích před 3.5, kde `useTemplateRef()` ještě není dostupné, musíme deklarovat ref s&nbsp;názvem, který odpovídá hodnotě atributu `ref` v šabloně:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// deklarujte ref, který bude obsahovat referenci na element
// jméno musí odpovídat hodnotě template ref
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

Pokud nepoužíváte `<script setup>`, ujistěte se, že ref v metodě `setup()` také vracíte:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</details>

</div>
<div class="options-api">

Výsledný ref je zpřístupněn jako `this.$refs`:

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

Upozorňujeme, že k ref můžete přistupovat pouze **po připojení komponenty**. Pokud se pokusíte o přístup k <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span> ve výrazu šablony, bude při prvním vykreslení <span class="options-api">`undefined`</span><span class="composition-api">`null`</span>. Je to proto, že element existuje až po prvním vykreslení!

<div class="composition-api">

Pokud se pokoušíte na template ref apikovat watcher, nezapomeňte vzít v úvahu případ, kdy má ref hodnotu `null`:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // ještě není připojeno, nebo je komponenta ve stavu "unmounted"
    // (například kvůli v-if)
  }
})
```

Viz také: [Typování Template Refs](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## Refs uvnitř `v-for` {#refs-inside-v-for}

> Vyžaduje Vue 3.2.25+

<div class="composition-api">

Když je `ref` použitý uvnitř `v-for`, odpovídající ref by měl obsahovat prázdné pole, které bude po připojení komponenty naplněno příslušnými elementy:

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'
const list = ref([
  /* ... */
])
const itemRefs = useTemplateRef('items')
onMounted(() => console.log(itemRefs.value))
</script>
<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)

<details>
<summary>Použití před verzí 3.5</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

</details>

</div>
<div class="options-api">

Když je `ref` použitý uvnitř `v-for`, výsledná ref hodnota bude pole obsahující příslušné elementy:

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

Je třeba poznamenat, že ref pole **nezaručuje** stejné pořadí jako zdrojové pole.

## Funkční refs {#function-refs}

Namísto klíče typu string může být atribut `ref` svázán i s funkcí, která bude volána při každé aktualizaci komponenty a poskytne vám plnou flexibilitu, kam uložit odkaz na element. Funkce obdrží odkaz na element jako první parametr:

```vue-html
<input :ref="(el) => { /* přiřadit `el` do proměnné nebo ref */ }">
```

Všimněte si, že používáme dynamický binding `:ref`, takže můžeme předat přímo funkci místo názvu ref v podobě string. Když je prvek odpojen, parametr bude `null`. Místo inline funkce můžete samozřejmě použít metodu.

## Ref na komponentě {#ref-on-component}

> Tato sekce předpokládá znalost [základů komponent](/guide/essentials/component-basics). Klidně ji teď přeskočte a vraťte se později.

`ref` může být také použit na komponentu potomka. V tomto případě povede reference na odpovídající instanci komponenty:

<div class="composition-api">

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'
const childRef = useTemplateRef('child')
onMounted(() => {
  // childRef.value bude obsahovat instanci <Child />
})
</script>
<template>
  <Child ref="child" />
</template>
```

<details>
<summary>Použití před verzí 3.5</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value bude obsahovat instanci <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

</details>

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child bude obsahovat instanci <Child />
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">Pokud komponenta potomka používá Options API nebo nepoužívá `<script setup>`, odkazovaná</span><span class="options-api">Odkazovaná</span> instance bude identická s `this` komponenty potomka, což znamená, že komponenta rodiče bude mít plný přístup ke každé vlastnosti a metodě komponenty potomka. To usnadňuje vytváření těsně propojených implementačních detailů mezi rodičem a potomkem, takže odkazy na komponenty by se měly používat pouze tehdy, když je to absolutně nutné – ve většině případů byste se měli nejprve pokusit implementovat interakce rodiče a potomka pomocí standardních rozhraní `props` a&nbsp;`emit`.

<div class="composition-api">

Výjimkou zde je, že komponenty používající `<script setup>` jsou **ve výchozím nastavení soukromé**: komponenta rodiče odkazující na komponentu potomka pomocí `<script setup>` nebude mít přístupk ničemu, pokud se komponenta potomka nerozhodne vystavit své veřejné rozhraní pomocí makra `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// makra překladače, jako je defineExpose, nemusí být importovány
defineExpose({
  a,
  b
})
</script>
```

Když rodič získá instanci této komponenty prostřednictvím template refs, získaná instance bude mít tvar `{ a: number, b: number}` (refs se automaticky rozbalí stejně jako u normálních instancí).

Viz také: [Typování Template refs komponenty](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

K omezení přístupu k instanci potomka lze použít volbu `expose`:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

Ve výše uvedeném příkladu bude mít rodič odkazující na tuto komponentu prostřednictvím template ref přístup pouze na `publicData` a `publicMethod`.

</div>
