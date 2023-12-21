# \<script setup> {#script-setup}

`<script setup>` je alias pro pro použití Composition API uvnitř Single-file komponent (SFC). Pokud používáte jak SFC, tak Composition API, je to doporučená syntaxe. Oproti běžnému `<script>` poskytuje několik výhod:

- Stručnější zápis s menším množstvím boilerplate kódu
- Možnost deklarovat vlastnosti (props) a emitované události (emits) čistě v TypeScriptu
- Lepší runtime výkon (šablona je zkompilována do funkce pro vykreslování ve stejném scope, bez prostředníka)
- Lepší výkon odvozování typů v IDE (méně práce pro jazykový server při extrakci typů z kódu)

## Základní syntaxe {#basic-syntax}

Pro použití této syntaxe přidejte do bloku `<script>` atribut `setup`:

```vue
<script setup>
console.log('ahoj ze script setup')
</script>
```

Kód uvnitř je zkompilován jako obsah `setup()` funkce komponenty. To znamená, že na rozdíl od normálního `<script>`, který se vykoná pouze jednou při prvním importu komponenty, kód uvnitř `<script setup>` se **vykoná pokaždé, když je vytvořena instance komponenty**.

### Hlavní (top-level) vazby jsou vystaveny pro šablonu {#top-level-bindings-are-exposed-to-template}

Při použití `<script setup>` jsou všechny hlavní vazby (včetně proměnných, deklarací funkcí a importů) deklarované uvnitř `<script setup>` přímo použitelné v šabloně:

```vue
<script setup>
// proměnná
const msg = 'Ahoj!'

// funkce
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

Stejným způsobem jsou přístupné i importy. To znamená, že můžete importovanou pomocnou funkci přímo použít ve výrazech v šabloně, aniž byste ji museli vystavit pomocí bloku `methods`:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('ahoj') }}</div>
</template>
```

## Reaktivita {#reactivity}

Reaktivní stav musí být explicitně vytvořen pomocí [API pro reaktivitu](./reactivity-core). Podobně jako hodnoty vrácené z funkce `setup()`, pokud jsou refs odkazovány v šablonách, jsou automaticky "rozbaleny":

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Použití komponent {#použití-komponent}

Hodnoty ve scope `<script setup>` mohou být také přímo použity jako vlastní názvy tagů komponent:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Představte si `MyComponent` jako proměnnou. Pokud jste používali JSX, je to podobný mentální model. Kebab-case ekvivalent `<my-component>` funguje v šabloně také - nicméně pro konzistenci je silně doporučeno používat komponenty s PascalCase názvem. To je také pomůže odlišit od nativních vlastních elementů.

### Dynamické komponenty {#dynamické-komponenty}

Protože jsou komponenty  namísto registrace pod klíči typu string odkazovány jako proměnné, měli bychom při použití dynamických komponent uvnitř `<script setup>` použít dynamické vázání `:is`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Všimněte si, jak jsou v ternárním výrazu komponenty použity jako proměnné.

### Rekurzivní komponenty {#rekurzivní-komponenty}

SFC se může implicitně odkazovat na sebe sama pomocí svého názvu souboru. Například soubor pojmenovaný `FooBar.vue` se může ve své šabloně odkazovat sám na sebe jako `<FooBar/>` 

Pozor ale, že to má nižší prioritu než importované komponenty. Pokud máte pojmenovaný import, jehož název je s odvozeným názvem komponenty v konfliktu, můžete import přejmenovat:

```js
import { FooBar as FooBarChild } from './components'
```

### Komponenty ve jmenném prostoru {#namespaced-components}

Lze použít tagy komponent s tečkami jako `<Foo.Bar>` pro odkazování na komponenty vnořené pod vlastnostmi objektu. To je užitečné, když z jednoho souboru importujete více komponent:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## Používání vlastních direktiv {#using-custom-directives}

Globálně registrované vlastní direktivy fungují normálně. Místní custom direktivy nemusí být pomocí `<script setup>` explicitně registrovány, ale musí dodržovat názvosloví `vNazevDirektivy`:

```vue
<script setup>
const vMojeDirektiva = {
  beforeMount: (el) => {
    // udělat něco s prvkem
  }
}
</script>
<template>
  <h1 v-moje-direktiva>Toto je nadpis</h1>
</template>
```

Pokud importujete direktivu odjinut, může být přejmenována tak, aby odpovídala požadovanému názvosloví:

```vue
<script setup>
import { mojeDirektiva as vMojeDirektiva } from './MojeDirektiva.js'
</script>
```

## defineProps() & defineEmits() {#defineprops-defineemits}

Pro deklaraci vlastností jako `props` a `emits` s plnou podporou odvozování typů můžeme použít API `defineProps` a `defineEmits`, které jsou uvnitř `<script setup>` automaticky dostupné:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])

// další setup kód
</script>
```

- `defineProps` a `defineEmits` jsou **makra překladače** použitelná pouze uvnitř `<script setup>`. Nemusí být importovány a jsou kompilovány, když je zpracováno `<script setup>`.

- `defineProps` přijímá stejnou hodnotu jako sekce `props`, zatímco `defineEmits` přijímá stejnou hodnotu jako sekce `emits`.

- `defineProps` a `defineEmits` poskytují správné odvozování typů na základě předaných možností.

- Vlastnosti předané `defineProps` a `defineEmits` budou vytaženy (hoisted) z nastavení do scope celého modulu. Proto vlastnosti nemohou odkazovat na místní proměnné deklarované v rozsahu setup funkce. Pokud tak učiníte, dojde při kompilaci k chybovému hlášení. Nicméně lze odkazovat na importované vazby, protože jsou také ve scope modulu.

### Pouze typové deklarace props/emit<sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

Props a emits lze také deklarovat pomocí "pure-type" syntaxe tím, že předáte literal type argument do `defineProps` nebo `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: alternativa, stručnější syntaxe
const emit = defineEmits<{
  change: [id: number] // "named tuple" syntaxe
  update: [value: string]
}>()
```

- `defineProps` nebo `defineEmits` mohou používat pouze BUĎ runtime deklaraci NEBO deklaraci typu. Použití obojího zároveň povede k chybovému sestavení.

- Při použití deklarace typu je automaticky generována ekvivalentní runtime deklarace z analýzy statického kódu, aby se odstránila potřeba dvojité deklarace a zároveň zajistila správná funkčnost za běhu.

  - V režimu vývoje (dev) kompilátor zkusí odvodit odpovídající ověření za běhu z typů. Například zde je `foo: String` odvozeno z typu `foo: string`. Pokud je typ odkazem na importovaný typ, odvozený výsledek bude `foo: null` (rovnocenný typu `any`), protože kompilátor nemá informace o externích souborech.

  - V režimu produkce kompilátor vygeneruje deklaraci ve formátu pole, aby se snížila velikost balíčku (props zde budou zkompilovány do `['foo', 'bar']`)

- Ve verzi 3.2 a nižší byl generický typový parametr pro `defineProps()` omezen na type literal nebo odkaz na lokální rozhraní.

  Toto omezení bylo vyřešeno ve verzi 3.3. Nejnovější verze Vue podporuje odkazování na importované a omezenou sadu složitějších typů na pozici typového parametru. Nicméně, protože runtime konverze typu stále závisí na AST, některé složité typy, které vyžadují skutečnou typovu analýzu, např. podmíněné typy, podporovány nejsou. Můžete použít podmíněné typy pro typ jedné vlastnosti, ale ne pro celý objekt props.

### Výchozí hodnoty props při použití deklarace typu {#default-props-values-when-using-type-declaration}

Jednou z nevýhod type-only deklarace `defineProps` je, že nemá způsob, jak pro props poskytnout výchozí hodnoty. Pro vyřešení tohoto problému je dostupné další makro překladače `withDefaults`:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'ahoj',
  labels: () => ['jeden', 'dva']
})
```

Výše uvedené bude pro runtime props přeloženo na ekvivalentní `default` vlastnosti. Navíc pomocná funkce `withDefaults` poskytuje typovou kontrolu pro výchozí hodnoty a zajistí, že vrácený typ `props` má odstraněny příznaky volitelosti pro ty vlastnosti, které mají výchozí hodnoty deklarované.

## defineExpose() {#defineexpose}

Komponenty používající `<script setup>` jsou **implicitně uzavřené** - tj. veřejná instance komponenty, která je získána pomocí template refs nebo `$parent` řetězců, **nevystavuje** žádné vazby deklarované uvnitř `<script setup>`.

Pro explicitní exponování vlastností ve `<script setup>` komponenty použijte makro prohlížeče `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

Když rodič získá instanci této komponenty pomocí template refs, získaná instance bude ve tvaru `{ a: number, b: number }` (referenční hodnoty jsou automaticky "rozbaleny" stejně jako u normálních instancí).

## defineOptions() {#defineoptions}

Tato makra mohou být použita k deklaraci vlastností komponenty přímo uvnitř `<script setup>` bez použití samostatného bloku `<script>`:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
  customOptions: {
    /* ... */
  }
})
</script>
```

- Podporováno pouze ve verzi 3.3 a vyšší.
- Jedná se o makro. Vlastnosti budou vyzvednuty (hoisted) na úroveň modulu a nebudou mít přístup k lokálním proměnným ve `<script setup>`, které nejsou konstantní literály.

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

Toto makro může být použito k poskytnutí typové nápovědy pro IDE pro kontrolu názvu slotu a typů props.

`defineSlots()` přijímá pouze parametr typu a žádné runtime argumenty. Parametr typu by měl být typový literál, kde klíč vlastnosti je název slotu a typ hodnoty je funkce slotu. První parametr funkce je props, které slot očekává přijmout, a jeho typ bude použit pro slot props ve šabloně. Návratový typ je aktuálně ignorován a může být `any`, ale v budoucnu jej možná budeme chtít využít pro kontrolu obsahu slotu.

Také vrací objekt `slots`, který je ekvivalentní objektu `slots` dostupnému v kontextu `setup` nebo vrácenému funkcí `useSlots()`.

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

- Podporováno pouze ve verzi 3.3+.

## `useSlots()` & `useAttrs()` {#useslots-useattrs}

Použití `slots` a `attrs` uvnitř `<script setup>` by mělo být relativně vzácné, protože k nim můžete přistupovat přímo jako `$slots` a `$attrs` ve šabloně. V případě, kdy je opravdu potřebujete, použijte příslušné pomocné funkce `useSlots` a `useAttrs`:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` a `useAttrs` jsou ve skutečnosti runtime funkce, které vracejí ekvivalent `setupContext.slots` a `setupContext.attrs`. Můžete je použít i v běžných funkcích Composition API.

## Použití společně s normálním `<script>` {#usage-alongside-normal-script}

`<script setup>` může být použito společně s normálním `<script>`. Jednoduchý `<script>` může být potřeba v případech, kdy chceme:

- Deklarovat vlastnosti, které nelze vyjádřit v `<script setup>`, například `inheritAttrs` nebo custom možnosti zpřístupněné pomocí pluginů (Může být nahrazeno funkcí [`defineOptions`](/api/sfc-script-setup#defineoptions) ve verzi 3.3+).
- Deklarovat pojmenované exporty.
- Provést vedlejší efekty nebo vytvořit objekty, které by měly být spuštěny pouze jednou.

```vue
<script>
// normální <script>, vykonáno v rozsahu modulu (pouze jednou)
runSideEffectOnce()

// deklarovat další vlastnosti
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// vykonáno v rozsahu setup() (pro každou instanci)
</script>
```

Podpora pro kombinaci `<script setup>` a `<script>` ve stejné komponentně je omezena na výše popsané scénáře. Konkrétně:

- **NEPOUŽÍVEJTE** samostatnou sekci `<script>` pro vlastnosti, které již lze definovat pomocí `<script setup>`, jako například `props` a `emits`.
- Proměnné vytvořené uvnitř `<script setup>` nejsou přidány jako vlastnosti instance komponenty, a nelze k nim přistupovat pomocí Options API. Mísení API tímto způsobem je silně nedoporučováno.

Pokud se ocitnete v jedné z situací, které nejsou podporovány, měli byste zvážit přechod na explicitní funkci [`setup()`](/api/composition-api-setup) místo použití `<script setup>`.

## Top-level `await` {#top-level-await}

Top-level `await` může být použit uvnitř `<script setup>`. Výsledný kód bude zkompilován jako `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

Navíc, výraz, na který se čeká, bude automaticky zkompilován ve formátu, který zachovává aktuální kontext komponenty po `await`.

:::warning Poznámka
`async setup()` musí být použit ve spojení s `Suspense`, což je v současné době stále ještě experimentální funkce. Plánujeme ji dokončit a zdokumentovat v budoucích verzích - ale pokud jste zvědaví nyní, můžete se podívat na její [testy](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts), abyste viděli, jak funguje.
:::

## Generika <sup class="vt-badge ts" /> {#generics}

Generické typové parametry lze deklarovat pomocí atributu `generic` na značce `<script>`:

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

Hodnota `generic` funguje úplně stejně jako seznam parametrů mezi `<...>` v TypeScriptu. Například můžete použít více parametrů, omezení `extends`, výchozí typy a odkazovat na importované typy:

```vue
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

## Omezení {#restrictions}

* Kvůli rozdílu v semantice vykonávání modulů se kód uvnitř `<script setup>` spoléhá na kontext SFC. Při přesunu do externích souborů `.js` nebo `.ts` může dojít k zmatení jak u vývojářů, tak i SW nástrojů. Proto **`<script setup>`** nelze použít s atributem `src`.
* `<script setup>` nepodporuje in-DOM šablonu root komponenty. ([Související diskuze](https://github.com/vuejs/core/issues/8391))
