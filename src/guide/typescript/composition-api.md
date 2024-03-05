# TypeScript s Composition API {#typescript-with-composition-api}

> Tato stránka předpokládá, že jste již přečetli přehled o [Používání Vue s TypeScriptem](./overview).

## Typování vlastností komponenty {#typing-component-props}

### Při použití `<script setup>` {#using-script-setup}

Při použití `<script setup>` podporuje odvozování typů vlastností (props) macro `defineProps()` na základě svého parametru:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Toto se nazývá "runtime deklarace", protože parametr předaný do `defineProps()` bude za běhu použit jako sekce `props` .

Je ovšem obvykle přímočařejší definovat vlastnosti pomocí čistých typů (pure types) pomocí generického typového parametru:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

Toto se nazývá "deklarace na základě typu". Kompilátor se pokusí na základě typového parametru odvodit ekvivalentní runtime vlastnosti. V tomto případě se náš druhý příklad kompiluje do přesně stejných runtime vlastností jako první příklad.

Můžete použít buď deklaraci na základě typu NEBO runtime deklaraci, ale nemůžete je použít současně.

Můžeme také přesunout typy vlastností do samostatného rozhraní:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

To funguje i tehdy, pokud je `Props` importováno z externího zdroje. Tato funkce vyžaduje, aby TypeScript byl závislostí na úrovni vrstvy (peer dependency) Vue.

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### Omezení syntaxe {#syntax-limitations}

Ve verzi 3.2 a nižší byl generický typový parametr pro `defineProps()` omezen na typový literál nebo odkaz na lokální rozhraní.

Toto omezení bylo vyřešeno ve verzi 3.3. Nejnovější verze Vue podporuje odkazování na importované a omezenou sadu složitějších typů na pozici typového parametru. Nicméně, protože runtime konverze typu stále závisí na AST, některé složité typy, které vyžadují skutečnou typovu analýzu, např. podmíněné typy, podporovány nejsou. Můžete použít podmíněné typy pro typ jedné vlastnosti, ale ne pro celý objekt vlastností.

### Výchozí hodnoty props {#props-default-values}

Při použití deklarace založené na typu ztrácíme schopnost deklarovat výchozí hodnoty pro vlastnosti. To lze vyřešit pomocí makra `withDefaults`:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

Výše uvedené bude pro runtime props přeloženo na ekvivalentní `default` vlastnosti. Navíc pomocná funkce `withDefaults` poskytuje typovou kontrolu pro výchozí hodnoty a zajistí, že vrácený typ `props` má odstraněny příznaky volitelosti pro ty vlastnosti, které mají výchozí hodnoty deklarované.

### Bez `<script setup>` {#without-script-setup}

Pokud nepoužíváte `<script setup>`, je nutné  k povolení odvozování typu vlastností použít `defineComponent()`. Typ objektu vlastností předaný do `setup()` je odvozen z možnosti `props`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- typ: string
  }
})
```

### Složité typy props {#complex-prop-types}

Při deklaraci založené na typu může prop používat složitý typ stejně jako jakýkoli jiný typ:

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

Pro runtime deklaraci můžeme použít utility třídu `PropType`:

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

Funguje to stejným způsobem, i pokud specifikujeme sekci `props` přímo:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

Sekce `props` se nejčastěji používá s Options API, takže v průvodci [TypeScript s Options API](/guide/typescript/options-api#typing-component-props) najdete podrobnější příklady. Techniky ukázané v těchto příkladech se také vztahují na runtime deklarace pomocí `defineProps()`.

## Typování emitovaných událostí komponenty {#typing-component-emits}

Ve `<script setup>` může být funkce `emit` také typována pomocí buď runtíme deklarace NEBO deklarace na základě typu:

```vue
<script setup lang="ts">
// runtime deklarace
const emit = defineEmits(['change', 'update'])

// deklarace na základě typu
const emit = defineEmits({
  change: (id: number) => {
    // vrátit `true` nebo `false` pro indikaci
    // úspěchu / selhání ověření
  },
  update: (value: string) => {
    // vrátit `true` nebo `false` pro indikaci
    // úspěchu / selhání ověření
  }
})

// deklarace na základě typu
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: alternativní, stručnější syntaxe
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

Typový parametr může být jeden z následujících:

1. Typ callable funkce, ale zapsaný jako typový literál s [call signaturami](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). Bude použit jako typ vrácené funkce `emit`.
2. Typový literál, kde klíče jsou názvy událostí a hodnoty jsou pole / n-tice typů představujících další událostí přijímané parametry. Výše uvedený příklad používá pojmenované n-tice, takže každý parametr může mít explicitní název.

Jak můžeme vidět, deklarace na základě typu nám poskytuje mnohem jemnější kontrolu nad typovými omezeními emitovaných událostí.

Pokud nepoužíváme `<script setup>`, `defineComponent()` je schopna odvodit povolené události pro funkci `emit` vystavenou v kontextu nastavení:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- kontrola typu / automatické dokončování
  }
})
```

## Typování `ref()` {#typing-ref}

Refs odvozují typ z počáteční hodnoty:

```ts
import { ref } from 'vue'

// odvozený typ: Ref<number>
const year = ref(2020)

// => TS chyba: Typ 'string' být přiřazen do typu 'number'.
year.value = '2020'
```

Někdy může být potřeba pro vnitřní ref hodnotu specifikovat složité typy. To můžeme udělat pomocí typu `Ref`:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

Nebo také předáním generického parametru při volání `ref()` pro přepsání výchozího odvození:

```ts
// výsledný typ: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

Pokud specifikujete generický typový parametr, ale vynecháte počáteční hodnotu, výsledný typ bude union, který zahrnuje `undefined`:

```ts
// odvozený typ: Ref<number | undefined>
const n = ref<number>()
```

## Typování `reactive()` {#typing-reactive}

`reactive()` také implicitně odvozuje typ z argumentu:

```ts
import { reactive } from 'vue'

// odvozený typ: { title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

Pro explicitní typování `reactive` vlastnosti můžeme použít interface:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

:::tip
Není doporučeno používat generický parametr `reactive()`, protože vrácený typ, který zpracovává rozbalování vnořených refs, se od typu generického argumentu liší.
:::

## Typování `computed()` {#typing-computed}

`computed()` odvozuje svůj typ na základě návratové hodnoty getteru:

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// odvozený typ: ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS chyba: Vlastnost 'split' na typu 'number' neexistuje.
const result = double.value.split('')
```

Můžete také specifikovat explicitní typ pomocí generického argumentu:

```ts
const double = computed<number>(() => {
  // typová chyba, pokud nebude vráceno `number`
})
```

## Typování event handlerů {#typing-event-handlers}

Při práci s nativními DOM událostmi může být užitečné správně označit argument, který předáváme obslužnému handleru. Podívejme se na tento příklad:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` má implicitně typ `any`
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Bez typového označení bude mít argument `event` implicitně typ `any`. To povede k chybu v TS, pokud je v `tsconfig.json` použita volba `"strict": true` nebo `"noImplicitAny": true`. Proto se doporučuje argumenty event handlerů explicitně označit. Kromě toho můžete potřebovat odvození typů při přístupu k vlastnostem `event`:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Typování Provide / Inject {#typing-provide-inject}

Poskytování (provide) a implementace (inject) se obvykle provádí v oddělených komponentách. Pro správné typování vkládaných hodnot poskytuje Vue rozhraní `InjectionKey`, což je generický typ rozšiřující `Symbol`. Může být použito k synchronizaci typu vkládané hodnoty mezi poskytovatelem a konzumentem:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // poskytnutí hodnoty, která není řetězcem, způsobí chybu

const foo = inject(key) // typ foo: string | undefined
```

Je doporučeno umístit injection key do samostatného souboru, aby mohl být importován do více komponent.

Při použití řetězcových injection keys bude typ vkládané hodnoty `unknown` a musí být explicitně deklarován pomocí generického typového parametru:

```ts
const foo = inject<string>('foo') // typ: string | undefined
```

Mějte na paměti, že vkládaná hodnota může být stále `undefined`, protože není zaručeno, že poskytovatel tuto hodnotu poskytne za běhu.

Typ `undefined` lze odstranit poskytnutím výchozí hodnoty:

```ts
const foo = inject<string>('foo', 'bar') // typ: string
```

Pokud jste si jisti, že hodnota je vždy poskytnuta, můžete také hodnotu přímo přetypovat:

```ts
const foo = inject('foo') as string
```

## Typování Template Refs {#typing-template-refs}

Template refs by měly být vytvářeny s explicitním generickým typovým parametrem a počáteční hodnotou `null`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

Pro získání správného DOM interface můžete zkontrolovat stránky jako [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#technical_summary).

Pamatujte, že pro přísnou typovou bezpečnost je při přístupu k `el.value` nutné použít optional chaining nebo type guards. Je to způsobeno tím, že počáteční hodnota ref je `null`, dokud není komponenta připojena (mounted), a může být také nastavena na `null`, pokud je odkazovaný prvek odstraněn pomocí `v-if`.

## Typování Template Refs komponenty {#typing-component-template-refs}

Někdy může být potřeba anotovat template ref pro komponentu potomka, aby bylo možné zavolat jeho veřejnou metodu. Například máme komponentu potomka `MyModal` s metodou, která otevírá modální okno:

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>
```

Pro získání typu instance `MyModal` musíme nejprve získat jeho typ pomocí `typeof` a poté použít vestavěnou utilitu `InstanceType` v TypeScriptu k extrakci jeho instančního typu:

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

V případech, kdy přesný typ komponenty není dostupný nebo není důležitý, lze místo toho použít `ComponentPublicInstance`. Pak bude obsahovat pouze vlastnosti, které jsou sdílené všemi komponentami, jako například `$el`:

```ts
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = ref<ComponentPublicInstance | null>(null)
```
