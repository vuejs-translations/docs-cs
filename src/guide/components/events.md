<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // The docs for v-model used to be part of this page. Attempt to redirect outdated links.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>
# Události komponent (Events) {#component-events}

> Tato stránka předpokládá, že už jste četli [Základy komponent](/guide/essentials/component-basics). Pokud jsou pro vás komponenty nové, přečtěte si je jako první.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Lekce o definici vlastních událostí ve Vue.js zdarma"/>
</div>

## Vyvolání událostí a naslouchání jim {#emitting-and-listening-to-events}

Komponenta může vysílat (emit) vlastní události přímo ve výrazech šablony (např. ve `v-on` handleru) pomocí vestavěné metody `$emit`:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">klikni na mě</button>
```

<div class="options-api">

Metoda `$emit()` je také dostupná v rámci instance komponenty přes `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

Komponenta rodiče může událostem naslouchat s využitím `v-on`:

```vue-html
<MyComponent @some-event="callback" />
```

Event listenery komponenty podporují i modifikátor `.once`:

```vue-html
<MyComponent @some-event.once="callback" />
```

Stejně jako komponenty a vlastnosti poskytují názvy událostí automatickou transformaci názvů. Všimněte si, že jsme emitovali událost jako camelCase, ale můžeme jí v komponentě rodiče naslouchat pomocí listeneru s kebab-cased zápisem. Stejně jako v případě [velkých a malých písmen v názvech vlastností](/guide/components/props#prop-name-casing) doporučujeme v šablonách používat kebab-cased event listenery.

:::tip
Na rozdíl od nativních DOM událostí, události vysílané komponentou **neprobublávají**. Můžete naslouchat pouze událostem vysílaným přímo komponentou potomka. Pokud je potřeba komunikovat mezi sourozeneckými nebo hluboce vnořenými komponentami, použijte externí sběrnici událostí (event bus) nebo [globální state management](/guide/scaling-up/state-management).
:::

## Parametry událostí {#event-arguments}

Někdy je užitečné vysílat spolu s událostí určitou hodnotu. Například můžeme chtít, aby komponenta `<BlogPost>` určovala, o kolik se má zvětšit text. V takových případech můžeme události `$emit` předat další parametry, které tuto hodnotu poskytnou:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Zvýšit o 1
</button>
```

Když pak nasloucháme události v komponentě rodiče, můžeme jako listener použít inline arrow funkci, která nám umožní přistupovat k parametrům události:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Nebo pokud je event handler funkce:

```vue-html
<MyButton @increase-by="increaseCount" />
```

Pak bude hodnota předána do této funkce jako první parametr:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
Všechny další parametry předané do `$emit()` za názvem události budou předány do listeneru. Například při `$emit('foo', 1, 2, 3)` obdrží funkce listeneru tři parametry.
:::

## Deklarování vysílaných událostí {#declaring-emitted-events}

Komponenta může explicitně deklarovat události, které bude vysílat, pomocí <span class="composition-api">makra [`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits)</span><span class="options-api">sekce [`emits`](/api/options-state#emits)</span>:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

Metoda `$emit`, kterou jsme použili v `<template>`, není v sekci `<script setup>` komponenty přístupná, ale `defineEmits()` vrací ekvivalentní funkci, kterou můžeme použít místo ní:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

Makro `defineEmits()` **nemůže** být použito uvnitř funkce, musí být umístěno přímo do `<script setup>` jako ve výše uvedeném případě.

Pokud používáte explicitní funkci `setup` místo `<script setup>`, měly by být události deklarovány pomocí sekce [`emits`](/api/options-state#emits) a funkce `emit` je vystavena v kontextu `setup()`:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

Stejně jako ostatní vlastnosti kontextu `setup()`, `emit` může být bezpečně dekonstruována:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

Sekce `emits` a `defineEmits()` makro také podporují objektovou syntaxi. Při použití TypeScriptu je možné typovat argumenty, což nám umožňuje provádět runtime validaci obsahu (payload) emitovaných událostí:

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // vrací `true` nebo `false` pro určení,
    // zda validace prošla / selhala
  }
})
</script>
```

Pokud používáte TypeScript dohromady se `<script setup>`, je také možné deklarovat vysílané události pomocí "pure" typových anotací:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

Více detailů: [Typování událostí komponent](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
    // vrací `true` nebo `false` pro určení,
    // zda validace prošla / selhala
    }
  }
}
```

Viz také: [Typování událostí komponent](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Ačkoli to není povinné, doporučuje se definovat všechny vysílané události, aby bylo možné lépe zdokumentovat, jak má komponenta fungovat. Umožňuje to také Vue vyloučit známé listenery z ["fallthrough" atributů](/guide/components/attrs#v-on-listener-inheritance), čímž se vyhnete okrajovým případům způsobeným DOM událostmi odesílanými ručně kódem třetí strany.

:::tip
Pokud je v možnosti `emits` definována nativní událost (např. `click`), bude nyní listener naslouchat pouze událostem `click` vysílaným komponentou a nebude již reagovat na nativní události `click`.
:::

## Validace událostí {#events-validation}

Podobně jako u validace typů u vlastností lze validovat emitovanou událost, pokud je definována pomocí syntaxe objektu namísto syntaxe pole.

Pro přidání validace je události přiřazena funkce, která obdrží parametry předané do volání <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> a vrátí boolean hodnotu označující, zda je událost platná, nebo ne.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // bez validace
  click: null,

  // validace události `submit`
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Neplatná data události!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // bez validace
    click: null,

    // validace události `submit`
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Neplatná data události!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>

## Events as Props {#events-props}

You may also declare and pass `events` as `props`, by prefixing the capitalized event name with `on`
Using `props.onEvent` has a different behaviour than using `emit('event')`, as the former will pass only handle the property based listener (either `@event` or `:on-event`)

:::warning
If both `:onEvent` and `@event` are passed `props.onEvent` might be an array of `functions` instead of `function`, this behavior is not stable and might change in the future.
:::

Because of this, it is recommended to use `emit('event')` instead of `props.onEvent` when emitting events.
