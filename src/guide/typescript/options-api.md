# TypeScript s Options API {#typescript-with-options-api}

> Tato stránka předpokládá, že jste již přečetli přehled o [Používání Vue s TypeScriptem](./overview).

:::tip
I když Vue používání TypeScriptu s Options API podporuje, doporučuje se používat Vue s&nbsp;TypeScriptem pomocí Composition API, protože nabízí jednodušší, efektivnější a&nbsp;robustnější odvozování typů.
:::

## Typování vlastností komponenty {#typing-component-props}

Odvozování typů pro vlastnosti (props) v Options API vyžaduje obalení komponenty pomocí `defineComponent()`. Tímto způsobem je Vue schopno odvodit typy pro vlastnosti na základě možnosti `props`, přičemž bere v úvahu další vlastnosti, jako je `required: true` a `default`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // povolené odvozování typů
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // typ: string | undefined
    this.id // typ: number | string | undefined
    this.msg // typ: string
    this.metadata // typ: any
  }
})
```

Za běhu však `props` podporují pro typ vlastnosti pouze použití konstruktorových funkcí - není možné specifikovat složité typy, jako jsou objekty s vnořenými vlastnostmi nebo signatury volání funkcí.

Pro anotaci složitých typů vlastností můžeme použít utility třídu `PropType`:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // poskytne konkrétnější typ pro `Object`
      type: Object as PropType<Book>,
      required: true
    },
    // lze také anotovat funkce
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS chyba: parametr typu 'string' nemůže
    // být přiřazen do parametru typu 'number'
    this.callback?.('123')
  }
})
```

### Omezení {#caveats}

Pokud máte verzi TypeScriptu nižší než `4.7`, musíte být opatrní při používání funkčních hodnot pro volby vlastností `validator` a `default` - ujistěte se, že používáte arrow funkce:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // ujistěte se, že používáte arrow funkce, 
      // pokud máte verzi TypeScriptu nižší než 4.7
      default: () => ({
        title: 'Výraz arrow funkce'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

Tím se zabrání TypeScriptu v odvozování typu `this` uvnitř těchto funkcí, což bohužel může způsobit selhání odvozování typu. Jednalo se o předchozí [omezení návrhu](https://github.com/microsoft/TypeScript/issues/38845), které bylo vylepšeno v [TypeScript v4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods).

## Typování emitovaných událostí komponenty {#typing-component-emits}

Můžeme deklarovat očekávaný typ dat pro emitovanou událost pomocí objektové syntaxe volby `emits`. Navíc všechny ne-deklarované emitované události vyvolají typovou chybu při volání:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // provést runtime validaci
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Chyba typu!
      })

      this.$emit('nedeklarovana-udalost') // Chyba typu!
    }
  }
})
```

## Typování computed proměnných {#typing-computed-properties}

Computed proměnná odvozuje svůj typ na základě návratové hodnoty:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Ahoj!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // typ: string
  }
})
```

V některých případech můžete chtít typ computed proměnné explicitně označit, abyste zajistili její správnou implementaci:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Ahoj!'
    }
  },
  computed: {
    // explicitně anotovaný návratový typ
    greeting(): string {
      return this.message + '!'
    },

    // anotace zapisovatelné computed proměnné
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

Explicitní označení může být také vyžadováno v některých okrajových případech, kdy TypeScript nedokáže typ computed proměnné odvodit kvůli cyklické inferenci.

## Typování event handlerů {#typing-event-handlers}

Při práci s nativními DOM událostmi může být užitečné správně označit parametr, který předáváme obslužnému handleru. Podívejme se na tento příklad:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` má implicitně typ `any`
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Bez typového označení bude mít parametr `event` implicitně typ `any`. To povede k&nbsp;chybě v TS, pokud je v `tsconfig.json` použita volba `"strict": true` nebo `"noImplicitAny": true`. Proto se doporučuje parametry event handlerů explicitně označit. Kromě toho můžete potřebovat odvození typů při přístupu k vlastnostem objektu `event`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## Obohacování globálních vlastností {#augmenting-global-properties}

Některé pluginy instalují globálně dostupné vlastnosti do všech instancí komponent pomocí [`app.config.globalProperties`](/api/application#app-config-globalproperties). Například můžeme nainstalovat `this.$http` pro načítání dat nebo `this.$translate` pro internacionalizaci (překlad). Aby to dobře fungovalo s TypeScriptem, Vue poskytuje rozhraní `ComponentCustomProperties`, které je navrženo pro rozšíření pomocí [obohacování (augmentation) TypeScript modulů](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation):

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

Viz také:

- [Jednotkové TypeScript testy pro `component type extensions`](https://github.com/vuejs/core/blob/main/packages/dts-test/componentTypeExtensions.test-d.tsx)

### Umístění obohacení typu {#type-augmentation-placement}

Obohacení typu můžeme umístit do souboru `.ts` nebo do souboru `*.d.ts` pro celý projekt. V obou případech se ujistěte, že je zahrnuto v souboru `tsconfig.json`. Pro autory knihoven / pluginů by měl být tento soubor specifikován vlastností `types` v&nbsp;souboru `package.json`.

Abychom mohli obohacení modulu využít, je nutné zajistit, aby bylo umístěno v&nbsp;[TypeScript modulu](https://www.typescriptlang.org/docs/handbook/modules.html). To znamená, že soubor musí obsahovat alespoň jeden import nebo export nejvyšší úrovně, i když je to jen `export {}`. Pokud je obohacení umístěno mimo modul, původní typy místo jejich doplnění přepíše!

```ts
// Nefunguje, přepisuje původní typy.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Funguje správně
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Obohacování custom možností {#augmenting-custom-options}

Některé pluginy, například `vue-router`, poskytují podporu pro vlastní možnosti komponent, jako je `beforeRouteEnter`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Bez správného obohacení typu budou mít parametry tohoto hooku implicitně typ `any`. Můžeme rozšířit rozhraní `ComponentCustomOptions`, abychom tyto vlastní možnosti podporovali:

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Nyní bude možnost `beforeRouteEnter` správně typována. Berte na vědomí, že se jedná pouze o příklad - dobře typované knihovny jako `vue-router` by měly tato obohacení ve vlastních definicích typů provádět automaticky.

Umístění tohoto obohacení podléhá [stejným omezením](#type-augmentation-placement) jako obohacování globálních vlastností.

Viz také:

- [Jednotkové TypeScript testy pro `component type extensions`](https://github.com/vuejs/core/blob/main/packages/dts-test/componentTypeExtensions.test-d.tsx)
