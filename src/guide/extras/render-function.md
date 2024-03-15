---
outline: deep
---

# Funkce pro vykreslení & JSX {#render-functions-jsx}

Vue doporučuje pro většinu případů tvorby aplikací používat šablony. Nicméně existují situace, kdy potřebujeme plnou programovou sílu JavaScriptu. A právě pro tyto případy můžeme použít **funkci pro vykreslení**.

> Pokud je koncept virtuálního DOM a funkcí pro vykreslení nový, přečtěte si nejprve kapitolu [Mechanismus vykreslování](/guide/extras/rendering-mechanism).

## Základní použití {#basic-usage}

### Vytváření VNodes {#creating-vnodes}

Vue poskytuje funkci `h()` pro vytváření VNodes:

```js
import { h } from 'vue'

const vnode = h(
  'div', // typ
  { id: 'foo', class: 'bar' }, // vlastnosti
  [
    /* potomci */
  ]
)
```

`h()` je zkratka pro **hyperscript** - což znamená „JavaScript, který produkuje HTML (hypertext markup language)“. Tento název je dědictvím konvencí sdílených mnoha implementacemi virtuálního DOM. Popisnější název by mohl být `createVnode()`, ale kratší název pomáhá, když tuto funkci musíte v rámci funkce pro vykreslení volat mnohokrát.

Funkce `h()` je navržena tak, aby byla velmi flexibilní:

```js
// všechny parametry kromě typu jsou volitelné
h('div')
h('div', { id: 'foo' })

// Vue automaticky vybere správný způsob přiřazení hodnot z props objektu
// - zda jde o html atributy nebo vlastnosti (props) komponenty
h('div', { class: 'bar', innerHTML: 'hello' })

// mohou být přidány modifikátory vlastností, jako `.prop` a `.attr`
// s předponami `.` resp. `^`
h('div', { '.name': 'some-name', '^width': '100' })

// třída a styl mají stejnou podporu objektu / pole
// hodnot, kterou mají ve šablonách
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// event listenery je třeba předávat jako onXxx
h('div', { onClick: () => {} })

// potomci mohou být řetězec
h('div', { id: 'foo' }, 'hello')

// objekt props lze vynechat, pokud není potřeba
h('div', 'hello')
h('div', [h('span', 'hello')])

// pole potomků může obsahovat směs VNodes a řetězců
h('div', ['hello', h('span', 'hello')])
```

Výsledný VNode má následující strukturu:

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning Poznámka
Plné rozhraní `VNode` obsahuje mnoho dalších interních vlastností, ale je silně doporučeno nespoléhat se na žádné vlastnosti kromě těchto uvedených. Tím se zabrání nechtěným problémům, pokud se interní vlastnosti změní.
:::

### Deklarace funkcí pro vykreslení{#declaring-render-functions}

<div class="composition-api">

Při použití šablon s Composition API se k vystavení dat šabloně návratová hodnota `setup()` hooku používá. Při použití funkcí pro vykreslení však můžeme přímo vrátit takovou funkci:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // vrátit funkci pro vykreslení
    return () => h('div', props.msg + count.value)
  }
}
```

Funkce pro vykreslení je deklarována uvnitř `setup()` a má tak přirozený přístup k&nbsp;vlastnostem (props) a jakémukoli reaktivnímu stavu deklarovanému ve stejném scope.

Kromě vrácení jednoho VNode můžete také vrátit řetězce nebo pole:

```js
export default {
  setup() {
    return () => 'Ahoj, Vue!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // použít pole pro vrácení více root elementů
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
Ujistěte se, že vrátíte funkci místo přímého vrácení hodnot! Funkce `setup()` je pro každou komponentu volána pouze jednou, zatímco vrácená funkce pro vykreslení bude volána vícekrát.
:::

</div>
<div class="options-api">

Můžeme deklarovat funkce pro vykreslení pomocí volby `render`:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'ahoj'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

Funkce `render()` má přístup k instanci komponenty pomocí `this`.

Kromě vrácení jednoho VNode můžete také vrátit řetězce nebo pole:

```js
export default {
  render() {
    return 'Ahoj, Vue!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // použít pole pro vrácení více root elementů
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

Pokud komponenta funkce pro vykreslení nepotřebuje žádný stav instance, může být pro stručnost deklarována také přímo jako funkce:

```js
function Hello() {
  return 'Ahoj, Vue!'
}
```

Ano, toto je platná Vue komponenta! Pro více podrobností o této syntaxi viz [Funkční komponenty](#functional-components).

### VNodes musí být jedinečné {#vnodes-must-be-unique}

Všechny VNodes ve stromu komponent musí být jedinečné. To znamená, že následující funkce pro vykreslení je neplatná:

```js
function render() {
  const p = h('p', 'ahoj')
  return h('div', [
    // Oops - duplicitní VNodes!
    p,
    p
  ])
}
```

Pokud opravdu chcete mnohokrát zduplikovat stejný element/komponentu, můžete to udělat pomocí tovární funkce. Například následující funkce pro vykreslení je naprosto platným způsobem vykreslování 20 identických odstavců:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'ahoj')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) je XML-like rozšíření pro JavaScript, které nám umožňuje psát kód takto:

```jsx
const vnode = <div>ahoj</div>
```

V rámci JSX výrazů použijte pro vložení dynamických hodnot složené závorky:

```jsx
const vnode = <div id={dynamicId}>ahoj, {userName}</div>
```

Jak `create-vue`, tak Vue CLI umožňují vytvářet projekty s předkonfigurovanou podporou JSX. Pokud konfigurujete JSX manuálně, podívejte se prosím na podrobnosti do dokumentace [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next).

I když byl JSX původně představen v Reactu, ve skutečnosti nemá definovanou běhovou sémantiku a může být zkompilován do různých výstupů. Pokud jste již s JSX pracovali, mějte na paměti, že **Vue JSX transformace se liší od React JSX transformace**, takže React JSX transformaci nemůžete použít ve Vue aplikacích. Některé významné rozdíly oproti React JSX zahrnují:

- Můžete použít HTML atributy jako `class` a `for` jako vlastnosti (props) - není třeba používat `className` nebo `htmlFor`.
- Předávání potomků komponentám (tj. sloty) [funguje jinak](#passing-slots).

Definice typů ve Vue také poskytuje odvozování typů pro použití TSX. Při použití TSX se ujistěte, že ve vašem souboru `tsconfig.json` je specifikováno `"jsx": "preserve"`, aby TypeScript nechal JSX syntaxi nedotčenou pro zpracování Vue JSX transformace.

### Odvozování JSX typů {#jsx-type-inference}

Podobně jako transformace, JSX Vue také potřebuje odlišné definice typů.

Od verze 3.4 už Vue implicitně neregistruje globální `JSX` namespace. Abyste řekli TypeScriptu, že má používat Vue JSX definice typů, přidejte do vašeho `tsconfig.json` následující:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

Toto chování můžete také nastavit samostatně pouze pro vybrané soubory přidáním komentáře `/* @jsxImportSource vue */` na začátek souboru.

Pokud existuje kód, který závisí na přítomnosti globálního jmenného prostoru `JSX`, můžete zachovat přesně stejné chování jako před verzí 3.4 explicitním odkazováním na `vue/jsx`, který registruje globální jmenný prostor `JSX`.

## Návody k funkcím pro vykreslení{#render-function-recipes}

Níže poskytneme několik návodů pro běžnou implementaci funkcí šablony pomocí jejich ekvivalentních funkcí pro vykreslení / JSX.

### `v-if` {#v-if}

Šablona:

```vue-html
<div>
  <div v-if="ok">ano</div>
  <span v-else>ne</span>
</div>
```

Ekvivalentní funkce pro vykreslení / JSX:

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'ano') : h('span', 'ne')])
```

```jsx
<div>{ok.value ? <div>ano</div> : <span>ne</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'ano') : h('span', 'ne')])
```

```jsx
<div>{this.ok ? <div>ano</div> : <span>ne</span>}</div>
```

</div>

### `v-for` {#v-for}

Šablona:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Ekvivalentní funkce pro vykreslení / JSX:

<div class="composition-api">

```js
h(
  'ul',
  // předpokládá se, že `items` je ref s hodnotou pole
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

Vlastnosti (props) s názvy začínajícími na `on` a následovanými velkým písmenem jsou považovány za event listenery. Například `onClick` je ekvivalentem `@click` ve šablonách.

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'klikni na mě'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  klikni na mě
</button>
```

#### Modifikátory událostí {#event-modifiers}

Modifikátory událostí `.passive`, `.capture` a `.once` lze připojit za název události pomocí camelCase.

Například:

```js
h('input', {
  onClickCapture() {
    /* listener v režimu capture */
  },
  onKeyupOnce() {
    /* spustí se pouze jednou */
  },
  onMouseoverOnceCapture() {
    /* once + capture */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

Pro ostatní modifikátory událostí a klávesové modifikátory lze použít pomocnou funkci [`withModifiers`](/api/render-function#withmodifiers):

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Komponenty {#components}

K vytvoření VNode pro komponentu by měl být první parametr předaný do `h()` definice komponenty. To znamená, že při použití funkcí pro vykreslení není nutné komponenty registrovat - můžete je použít přímo:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

Jak můžeme vidět, `h` může pracovat s komponentami importovanými z jakéhokoli formátu souboru, pokud je to platná Vue komponenta.

Dynamické komponenty jsou s funkcemi pro vykreslení jednoduché:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

Pokud je komponenta registrována podle jména a nelze ji importovat přímo (například je globálně registrována knihovnou), lze ji programově vyřešit pomocnou funkcí [`resolveComponent()`](/api/render-function#resolvecomponent).

### Vykreslování slotů {#rendering-slots}

<div class="composition-api">

Ve funkcích pro vykreslení lze sloty (slots) získat z kontextu `setup()`. Každý slot na objektu `slots` je **funkce, která vrací pole VNodes**:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // default slot:
      // <div><slot /></div>
      h('div', slots.default()),

      // pojmenovaný slot:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

Ekvivalent v JSX:

```jsx
// default
<div>{slots.default()}</div>

// pojmenovaný
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

Ve funkcích pro vykreslení lze sloty (slots) získat z [`this.$slots`](/api/component-instance#slots):

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

JSX ekvivalent:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### Předávání slotů {#passing-slots}

Předávání potomků komponentám funguje trochu jinak než předávání potomků elementům. Místo pole musíme předat buď funkci slotu, nebo objekt funkcí slotů. Funkce slotů mohou vrátit cokoli, co může vrátit běžná funkce pro vykreslení - což bude vždy normalizováno na pole VNodes, když je přístupováno v dceřiné komponentě.

```js
// jediný výchozí slot
h(MyComponent, () => 'ahoj')

// pojmenované sloty
// `null` je nutné použít, aby se
// objekt slotů nezaměňoval s props
h(MyComponent, null, {
  default: () => 'výchozí slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'jeden'), h('span', 'dva')]
})
```

JSX ekvivalent:

```jsx
// výchozí
<MyComponent>{() => 'hello'}</MyComponent>

// pojmenované
<MyComponent>{{
  default: () => 'výchozí slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>jeden</span>, <span>dva</span>]
}}</MyComponent>
```

Předávání slotů jako funkcí umožňuje jejich „lazy“ volání v komponentě potomka. Díky tomu jsou závislosti slotu sledovány komponentou potomka místo rodičovské, což vede k přesnějším a efektivnějším aktualizacím.

### Scoped sloty {#scoped-slots}

Pro vykreslení scoped slotu v komponentě rodiče je slot předán potomkovi. Všimněte si, že slot má nyní parametr `text`. Slot bude zavolán v komponentně potomka a její data budou předány nahoru do rodiče.

```js
// komponenta rodiče
export default {
  setup() {
    return () => h(MyComp, null, {
      default: ({ text }) => h('p', text)
    })
  }
}
```

Nezapomeňte předat `null`, aby sloty nebyly vyhodnoceny jako props.

```js
// komponenta potomka
export default {
  setup(props, { slots }) {
    const text = ref('ahoj')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

JSX ekvivalent:

```jsx
<MyComponent>{{
  default: ({ text }) => <p>{ text }</p>  
}}</MyComponent>
```

### Vestavěné komponenty {#built-in-components}

[Vestavěné komponenty](/api/built-in-components) jako `<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` a `<Suspense>` musí být pro použití ve funkcích pro vykreslení importovány:

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

Direktiva `v-model` je při kompilaci šablony rozšířena na vlastnosti `modelValue` a&nbsp;`onUpdate:modelValue` - tyto vlastnosti (props) musíme poskytnout sami:

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### Vlastní direktivy {#custom-directives}

Vlastní direktivy lze na VNode aplikovat pomocí [`withDirectives`](/api/render-function#withdirectives):

```js
import { h, withDirectives } from 'vue'

// vlastní direktiva
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

Pokud je direktiva registrována pod názvem a nelze ji importovat přímo, lze ji vyřešit pomocnou funkcí [`resolveDirective`](/api/render-function#resolvedirective).

### Template Refs {#template-refs}

<div class="composition-api">

S Composition API jsou template refs vytvářeny předáním samotného `ref()` jako vlastnosti VNode:

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```

</div>
<div class="options-api">

S Options API jsou template refs vytvářeny předáním názvu ref jako řetězce ve vlastnostech VNode:

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## Funkční komponenty {#functional-components}

Funkční (Functional) komponenty jsou alternativní formou komponent, které nemají vlastní stav. Chovají se jako čisté funkce: přijímají props a vrací VNodes. Jsou vykreslovány bez vytváření instance komponenty (tj. žádné `this`) a bez běžných lifecycle hooks komponenty.

Pro vytvoření funkční komponenty používáme běžnou funkci místo objektu s možnostmi (options object). Tato funkce je vlastně `render` funkcí pro komponentu.

<div class="composition-api">

Signatura funkční komponenty je stejná jako `setup()` hook:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

Protože funkční komponenta nemá odkaz na `this`, Vue předává `props` jako první parametr:

```js
function MyComponent(props, context) {
  // ...
}
```

Druhý parametr `context` obsahuje tři vlastnosti: `attrs`, `emit` a `slots`. Tyto vlastnosti jsou ekvivalentem instančních vlastností [`$attrs`](/api/component-instance#attrs), [`$emit`](/api/component-instance#emit), resp. [`$slots`](/api/component-instance#slots).

</div>

Většina běžných konfiguračních možností pro komponenty není pro funkční komponenty dostupná. Nicméně je možné definovat [`props`](/api/options-state#props) a [`emits`](/api/options-state#emits) přidáním těchto vlastností:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

Pokud není specifikována možnost `props`, objekt `props` předaný funkci bude obsahovat všechny atributy, stejně jako `attrs`. Pokud není specifikována možnost `props`, názvy props nebudou normalizovány na camelCase.

Pro funkční komponenty s explicitními `props` fungují [fallthrough atributy](/guide/components/attrs) stejně jako u&nbsp;běžných komponent. Pro funkční komponenty, které své `props` explicitně nezadávají, však budou ve výchozím stavu děděny pouze `class`, `style` a event listenery `onXxx` z&nbsp;`attrs`. V obou případech lze pomocí `inheritAttrs` nastavit `false`, aby se dědění atributů zakázalo:

```js
MyComponent.inheritAttrs = false
```

Funkční komponenty mohou být registrovány a používány stejně jako běžné komponenty. Pokud předáte funkci jako první parametr do `h()`, bude považována za funkční komponentu.

### Typování funkčních komponent<sup class="vt-badge ts" /> {#typování-funkčních-komponent}

Funkční komponenty mohou být typovány na základě toho, zda jsou pojmenované nebo anonymní. [Rozšíření Vue - Official](https://github.com/vuejs/language-tools) také podporuje kontrolu typů správně typovaných funkčních komponent při jejich použití v SFC šablonách.

**Pojmenovaná funkční komponenta**

```tsx
import type { SetupContext } from 'vue'
type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

function FComponent(
  props: FComponentProps,
  context: SetupContext<Events>
) {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value: unknown) => typeof value === 'string'
}
```

**Anonymní funkční komponenta**

```tsx
import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

const FComponent: FunctionalComponent<FComponentProps, Events> = (
  props,
  context
) => {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value) => typeof value === 'string'
}
```
