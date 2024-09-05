# TypeScript utility typy {#utility-types}

:::info Poznámka
Tato stránka vypisuje pouze několik běžně používaných utility typů, které pro své použití mohou vyžadovat vysvětlení. Pro úplný seznam exportovaných typů se podívejte do [zdrojového kódu](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Používá se k anotaci vlastnosti (prop) s pokročilejšími typy při použití runtime props deklarací.

- **Příklad**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // poskytne konkrétnější typ k základnímu `Object`
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **Viz také:** [Průvodce - Typování vlastností komponenty](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

- Podporováno až od verze 3.3+

Alias pro `T | Ref<T>`. Užitečné pro anotaci vstupních parametrů v [Composables](/guide/reusability/composables.html).

## ExtractPropTypes\<T> {#extractproptypes}

Extrahuje typy vlastností (props) z objektu s runtime props. Extrahované typy jsou interně orientované - tj. vyřešené vlastnosti přijaté komponentou. To znamená, že vlastnosti typu boolean a vlastnosti s výchozími hodnotami jsou vždy definovány, i když nejsou povinné.

Pro extrakci veřejně orientovaných vlastností, tj. vlastností, které může předat rodič, použijte [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Příklad**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

- Podporováno až od verze 3.3+

Extrahuje typy vlastností (props) z objektu s runtime props. Extrahované typy jsou veřejně orientované - tj. vlastnosti, které může předat rodič.

- **Příklad**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

Používá se k obohacení typu instance komponenty pro podporu custom globálních vlastností.

- **Příklad**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  Obohacení musí být umístěno v souboru modulu `.ts` nebo `.d.ts`. Pro více informací se podívejte na [obohacování globálních vlastností](/guide/typescript/options-api#augmenting-global-properties).
  :::

- **Viz také:** [Průvodce - Obohacování globálních vlastností](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

Používá se k obohacení typu vlastností komponenty pro podporu custom vlastností.

- **Příklad**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  Obohacení musí být umístěno v souboru modulu `.ts` nebo `.d.ts`. Pro více informací se podívejte na [obohacování globálních vlastností](/guide/typescript/options-api#augmenting-global-properties).
  :::

- **Viz také:** [ Obohacování globálních vlastností](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

Používá se k obohacení povolených TSX vlastností (props) pro použití nedeklarovaných vlastností na prvcích TSX.

- **Příklad**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // nyní funguje, i když `hello` není deklarovanou vlastností
  <MyComponent hello="world" />
  ```

  :::tip
  Obohacení musí být umístěno v souboru modulu `.ts` nebo `.d.ts`. Pro více informací se podívejte na [obohacování globálních vlastností](/guide/typescript/options-api#augmenting-global-properties).
  :::

## CSSProperties {#cssproperties}

Používá se k obohacení povolených hodnot u vazeb vlastností stylů.

- **Příklad**

  Povolí libovolnou custom CSS vlastnost

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```

  ```html
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
Obohacení musí být umístěno v souboru modulu `.ts` nebo `.d.ts`. Pro více informací se podívejte na [obohacování globálních vlastností](/guide/typescript/options-api#augmenting-global-properties).
:::

:::info Viz také
Podpora SFC `<style>` tagů pro propojení hodnot CSS s dynamickým stavem komponenty pomocí CSS funkce `v-bind`. To umožňuje custom vlastnosti bez obohacení typů.

- [v-bind() v CSS](/api/sfc-css-features#v-bind-in-css)
  :::
