# API funkce pro vykreslení {#render-function-apis}

## h() {#h}

Vytváří virtuální DOM elementy (VNodes).

- **Typ**

  ```ts
  // plná signatura
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // s vynecháním props
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Typy jsou pro lepší čitelnost zjednodušeny.

- **Detaily**

  První parametr může být buď řetězec (pro nativní elementy) nebo definice Vue komponenty. Druhý parametr jsou vlastnosti (props), které mají být předány, a třetí parametr jsou potomci (children).

  Při vytváření VNode komponenty musí být potomci předány jako slotové funkce. Pokud komponenta očekává pouze výchozí slot, může být předána jediná slotová funkce. Jinak musí být sloty předány jako objekt slotových funkcí.

  Pokud potomci nejsou objekt typu `Slots`, může být pro pohodlnější zápis vynechán parametr props.

- **Příklad**

  Vytváření nativních elementů:

  ```js
  import { h } from 'vue'

  // všechny parametry kromě typu jsou volitelné
  h('div')
  h('div', { id: 'foo' })

  // v props mohou být použity jak atributy, tak vlastnosti
  // Vue automaticky vybere správný způsob přiřazení
  h('div', { class: 'bar', innerHTML: 'hello' })

  // class a style mají stejný objekt / pole
  // podpora hodnoty je jako v šablonách
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // event listenery je třeba předávat jako onXxx
  h('div', { onClick: () => {} })

  // potomci mohou být řetězec
  h('div', { id: 'foo' }, 'hello')

  // pokud neexistují žádné props, mohou být vynechány
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // pole potomků může obsahovat mix VNodes a řetězců
  h('div', ['hello', h('span', 'hello')])
  ```

  Vytváření komponent:

  ```js
  import Foo from './Foo.vue'

  // předávání props
  h(Foo, {
    // ekvivalent k some-prop="hello"
    someProp: 'hello',
    // ekvivalent k @update="() => {}"
    onUpdate: () => {}
  })

  // předávání jednoho výchozího slotu
  h(Foo, () => 'výchozí slot')

  // předávání pojmenovaných slotů
  // `null` je nutné použít, aby se
  // objekt slotů nezaměňoval s props
  h(MyComponent, null, {
    default: () => 'výchozí slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **Viz také:** [Průvodce - Funkce pro vykreslení - Vytváření VNodes](/guide/extras/render-function#creating-vnodes)

## mergeProps() {#mergeprops}

Sloučí více objektů props se speciálním zpracováním některých vlastností.

- **Typ**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Podrobnosti**

  `mergeProps()` podporuje sloučení více objektů props se speciálním zpracováním následujících vlastností:

  - `class`
  - `style`
  - `onXxx` event listenery - více posluchačů se stejným názvem bude sloučeno do pole.

  Pokud nepotřebujete sloučení a chcete jednoduché přepisy, můžete místo toho použít nativní JS spread operátor.

- **Příklad**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode() {#clonevnode}

Klonuje VNode.

- **Typ**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Podrobnosti**

  Vrací klonovaný VNode, volitelně s dalšími props, které se sloučí s původním.

  VNodes by měly být po vytvoření považovány za neměnné a neměli byste měnit vlastnosti existujícího VNode. Místo toho je klonujte s odlišnými / dalšími props.

  VNodes mají speciální interní vlastnosti, takže jejich klonování není tak jednoduché jako použití JS spread operátoru. `cloneVNode()` se o většinu interní logiky postará.

- **Příklad**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

Zkontroluje, zda je hodnota VNode.

- **Typ**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

Pro ruční vyhledání registrované komponenty podle jména.

- **Typ**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Podrobnosti**

  **Poznámka: Pokud můžete komponentu importovat přímo, tuto funkci nepotřebujete.**

  `resolveComponent()` musí být volána uvnitř<span class="composition-api"> funkce `setup()` nebo</span> funkce pro vykreslení, aby se vyhledávalo ve správném kontextu komponenty.

  Pokud komponenta není nalezena, bude vygenerováno runtime varování a vrácena string hodnota zadaného jména.

- **Příklad**

  <div class="composition-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **Viz také:** [Průvodce - Funkce pro vykreslení - Komponenty](/guide/extras/render-function#components)

## resolveDirective() {#resolvedirective}

Pro ruční vyhledání registrované direktivy podle jména.

- **Typ**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Podrobnosti**

  **Poznámka: Pokud můžete direktivu importovat přímo, tuto funkci nepotřebujete.**

  `resolveDirective()` musí být volána uvnitř<span class="composition-api"> funkce `setup()` nebo</span> funkce pro vykreslení, aby se vyhledávalo ve správném kontextu komponenty.

  Pokud direktiva není nalezena, bude vygenerováno runtime varování a funkce vrátí `undefined`.

- **Viz také:** [Průvodce - Funkce pro vykreslení - Vlastní direktivy](/guide/extras/render-function#custom-directives)

## withDirectives() {#withdirectives}

Pro přidání vlastních direktiv do VNode.

- **Typ**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [direktiva, hodnota, parametr, modifikátory]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Detaily**

  Obaluje existující VNode vlastními direktivami. Druhý parametr je pole vlastních direktiv. Každá vlastní direktiva je také reprezentována jako pole ve formě `[direktiva, hodnota, parametr, modifikátory]`. Poslední prvky pole mohou být vynechány, pokud nejsou potřeba.

- **Příklad**

  ```js
  import { h, withDirectives } from 'vue'

  // vlastní direktiva
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **Viz také:** [Průvodce - Funkce pro vykreslení - Vlastní direktivy](/guide/extras/render-function#custom-directives)

## withModifiers() {#withmodifiers}

Pro přidání vestavěných [`v-on` modifikátorů](/guide/essentials/event-handling#event-modifiers) do funkce event handleru.

- **Typ**

  ```ts
  function withModifiers(fn: Function, modifiers: ModifierGuardsKeys[]): Function
  ```

- **Příklad**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // ekvivalent v-on:click.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **Viz také:** [Průvodce - Funkce pro vykreslení - Modifikátory událostí](/guide/extras/render-function#event-modifiers)
