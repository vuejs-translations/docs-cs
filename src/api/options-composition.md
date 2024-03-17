# Options API: Kompozice {#options-composition}

## provide {#provide}

Poskytujte hodnoty, které mohou být implementovány potomky komponent.

- **Typ**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Podrobnosti**

  `provide` a [`inject`](#inject) se používají společně, aby umožnili komponentě předka fungovat jako injektor závislostí pro všechny své potomky, bez ohledu na to, jak hluboká je hierarchie komponent, dokud jsou ve stejném rodičovském řetězci.

  Volba `provide` by měla být buď objekt nebo funkce, která vrací objekt. Tento objekt obsahuje vlastnosti, které jsou dostupné pro vkládání do komponent potomků. V&nbsp;tomto objektu můžete použít klíče typu Symbol.

- **Příklad**

  Základní použití:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  Použití funkce pro poskytování stavu pro každou komponentu:

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  Mějte na paměti, že výše uvedená poskytnutá hodnota `msg` nebude reaktivní. Pro více informací se podívejte na [Práci s reaktivitou](/guide/components/provide-inject#working-with-reactivity).

- **Viz také:** [Provide / Inject](/guide/components/provide-inject)

## inject {#inject}

Deklaruje vlastnosti, které se mají implementovat do aktuální komponenty vyhledáváním z poskytovatelů v hierarchii předků.

- **Typ**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **Podrobnosti**

  Volba `inject` by měla být buď:

  - Pole řetězců, nebo
  - Objekt, kde klíče jsou názvy místních vazeb a hodnota je buď:
    - Klíč (string nebo Symbol), který se má vyhledat v dostupných injections, nebo
    - Objekt, kde:
      - Vlastnost `from` je klíč (string nebo Symbol), který se má vyhledat v&nbsp;dostupných injections, a
      - Vlastnost `default` se používá jako fallback hodnota. Podobně jako u&nbsp;výchozích hodnot props, pro objektové typy je třeba použít tovární funkci, aby se zabránilo sdílení hodnot mezi více instancemi komponent.

  Implementovaná vlastnost bude `undefined`, pokud nebyla poskytnuta odpovídající vlastnost ani výchozí hodnota.

  Všimněte si, že vazby implemetovaných hodnot **nejsou reaktivní**. To je záměrné. Nicméně, pokud je vložená hodnota reaktivní objekt, vlastnosti tohoto objektu zůstávají reaktivní. Pro více informací se podívejte na [Práci s reaktivitou](/guide/components/provide-inject#working-with-reactivity).

- **Příklad**

  Základní použití:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  Použití implementované hodnoty jako výchozí hodnoty pro vlastnost (prop):

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Použití implementované hodnoty jako vstupu do dat:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  Implementace může být volitelná s výchozí hodnotou:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Pokud je třeba implementovat hodnotu z vlastnosti s jiným názvem, použijte pro označení zdrojové vlastnosti `from`:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Podobně jako u výchozích hodnot vlastností, pro neprimitivní hodnoty je třeba použít tovární funkci:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **Viz také:** [Provide / Inject](/guide/components/provide-inject)

## mixins {#mixins}

Pole objektů s možnostmi (options), které se mají smíchat do aktuální komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Detaily**

  Volba `mixins` přijímá pole mixin objektů. Tyto objekty mohou obsahovat volby instance (instance options) jako normální objekty instance (instance objects) a budou sloučeny do konečné podoby pomocí určité logiky sloučení volby. Například, pokud váš mixin obsahuje `created` hook a sama komponenta také, budou volány obě funkce.

  Hooks pro mixins jsou volány v pořadí, v jakém jsou poskytnuty, a před hooks samotného komponentu.

  :::warning Už není doporučeno
  V Vue 2 byly mixinové funkce hlavním mechanismem pro vytváření znovupoužitelných částí logiky komponenty. Ačkoli jsou mixinové funkce ve Vue 3 nadále podporovány, nyní jsou preferovaným přístupem pro znovupoužití kódu mezi komponentami [composable funkce pomocí Composition API](/guide/reusability/composables).
  :::

  - **Příklad**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

„Základní třída“ komponenty, ze které se dědí.

- **Typ**

```ts
interface ComponentOptions {
  extends?: ComponentOptions
}
```

- **Detaily**

  Umožňuje jedné komponentě rozšířit jinou a zdědit její možnosti.

  Z implementačního hlediska je `extends` téměř identické jako `mixins`. S komponentou specifikovanou pomocí `extends` bude zacházeno tak, jako by byla prvním mixinem.

  Nicméně, `extends` a `mixins` vyjadřují různé záměry. Volba `mixins` se především používá k sestavování částí funkcionality, zatímco `extends` se především zabývá dědičností.

  Stejně jako u `mixins` budou jakékoli možnosti (kromě `setup()`) sloučeny pomocí příslušné strategie pro sloučení.

- **Příklad**

```js
const CompA = { ... }

const CompB = {
  extends: CompA,
  ...
}
```

:::warning Nedoporučeno pro Composition API
`extends` je navrženo pro Options API a neřeší sloučení hooku `setup()`.

V Composition API je preferovaný mentální model pro znovupoužití logiky „kompozice“ před „dědičností“. Pokud máte logiku z komponenty, kterou chcete znovu použít v jiné komponentě, zvažte extrakci příslušné logiky do [composable objektu](/guide/reusability/composables#composables).

Pokud stále chcete „rozšířit“ komponentu pomocí Composition API, můžete zavolat `setup()` základní komponenty v `setup()` rozšiřující komponenty:

```js
import Base from './Base.js'
export default {
  extends: Base,
  setup(props, ctx) {
    return {
      ...Base.setup(props, ctx),
      // místní vazby
    }
  }
}
```
:::
