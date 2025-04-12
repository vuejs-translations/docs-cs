# \<script setup> {#script-setup}

`<script setup>` je alias pro použití Composition API uvnitř Single-file komponent (SFC). Pokud používáte jak SFC, tak Composition API, je to doporučená syntaxe. Oproti běžnému `<script>` poskytuje několik výhod:

- Stručnější zápis s menším množstvím boilerplate kódu
- Možnost deklarovat vlastnosti (props) a emitované události (emits) čistě v&nbsp;TypeScriptu
- Lepší runtime výkon (šablona je zkompilována do funkce pro vykreslení ve stejném scope, bez prostředníka)
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

Reaktivní stav musí být explicitně vytvořen pomocí [Reactivity API](./reactivity-core). Podobně jako hodnoty vrácené z funkce `setup()`, pokud jsou refs odkazovány v šablonách, jsou automaticky „rozbaleny“:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Použití komponent {#using-components}

Hodnoty ve scope `<script setup>` mohou být také přímo použity jako vlastní názvy tagů komponent:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Představte si `MyComponent` jako proměnnou. Pokud jste používali JSX, je to podobný mentální model. Kebab-case ekvivalent `<my-component>` funguje v šabloně také, nicméně pro konzistenci je silně doporučeno používat komponenty s PascalCase názvem. To je také pomůže odlišit od nativních custom elementů.

### Dynamické komponenty {#dynamic-components}

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

### Rekurzivní komponenty {#recursive-components}

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

Pokud importujete direktivu odjinud, může být přejmenována tak, aby odpovídala požadovanému názvosloví:

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

- `defineProps` přijímá stejnou hodnotu jako možnost `props`, zatímco `defineEmits` přijímá stejnou hodnotu jako možnost `emits`.

- `defineProps` a `defineEmits` poskytují správné odvozování typů na základě předaných vlastností.

- Vlastnosti předané `defineProps` a `defineEmits` budou vytaženy (hoisted) z nastavení do scope celého modulu. Proto vlastnosti nemohou odkazovat na místní proměnné deklarované v rozsahu setup funkce. Pokud tak učiníte, dojde při kompilaci k chybovému hlášení. Nicméně lze odkazovat na importované vazby, protože jsou také ve scope modulu.

### Pouze typové deklarace props/emit<sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

Props a emits lze také deklarovat pomocí „pure-type“ syntaxe tím, že  do `defineProps` nebo `defineEmits` jako parametr předáte typový literál:

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

- `defineProps` nebo `defineEmits` mohou používat pouze BUĎ runtime deklaraci NEBO deklaraci na zákldě typu. Použití obojího zároveň povede k chybě při kompilaci.

- Při použití deklarace typu je automaticky generována ekvivalentní runtime deklarace z&nbsp;analýzy statického kódu, aby se odstranila potřeba dvojité deklarace a zároveň zajistila správná funkčnost za běhu.

  - V režimu vývoje (dev) překladač zkusí odvodit odpovídající ověření za běhu z typů. Například zde je `foo: String` odvozeno z typu `foo: string`. Pokud je typ odkazem na importovaný typ, odvozený výsledek bude `foo: null` (rovnocenný typu `any`), protože překladač nemá informace o externích souborech.

  - V režimu produkce překladač vygeneruje deklaraci ve formátu pole, aby se snížila velikost balíčku (props zde budou zkompilovány do `['foo', 'bar']`)

- Ve verzi 3.2 a nižší byl generický typový parametr pro `defineProps()` omezen na typový literál nebo odkaz na lokální rozhraní.

  Toto omezení bylo vyřešeno ve verzi 3.3. Nejnovější verze Vue podporuje na pozici typového parametru odkazování na importované typy a omezenou sadu složitějších typů. Nicméně, protože runtime konverze typu stále závisí na AST, některé složité typy, které vyžadují skutečnou typovu analýzu, např. podmíněné typy, podporovány nejsou. Můžete použít podmíněné typy pro typ jedné vlastnosti, ale ne pro celý objekt vlastností.

### Reaktivní destrukturování vlastností <sup class="vt-badge" data-text="3.5+" /> {#reactive-props-destructure}

Ve Vue 3.5+ jsou proměnné destrukturované z návratové hodnoty `defineProps` reaktivní. Vue překladač automaticky doplní `props.`, když kód ve stejném `<script setup>` bloku přistupuje na proměnné destrukturované z `defineProps`:

```ts
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // před Vue 3.5 se spustí pouze jednou
  // ve Vue 3.5+ se spustí znovu při každé změně "foo"
  console.log(foo)
})
```

Výše uvedený kód bude zkompilován do následujícího ekvivalentu:

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` je překladačem transformováno na `props.foo`
  console.log(props.foo)
})
```

Navíc je možné použít nativní JavaScript syntaxi pro deklaraci výchozích hodnot vlastností. To je zvlášť užitečné při použití type-based deklarace:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'ahoj', labels = ['jedna', 'dva'] } = defineProps<Props>()
```

### Výchozí hodnoty props při použití deklarace typu <sup class="vt-badge ts" /> {#default-props-values-when-using-type-declaration}

Ve Vue 3.5+ lze výchozí hodnoty vlastností (props) deklarovat přirozeně při použití reaktivního destrukturování. Ovšem ve verzích 3.4 a nižších není tato možnost dostupná. Pro type-based deklaraci výchozích hodnot vlastností je třeba použít makro překladače `withDefaults`:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'ahoj',
  labels: () => ['jedna', 'dva']
})
```

Výše uvedené bude pro runtime vlastnosti přeloženo na ekvivalentní `default` vlastnosti. Navíc pomocná funkce `withDefaults` poskytuje typovou kontrolu pro výchozí hodnoty a&nbsp;zajistí, že vrácený typ `props` má odstraněny příznaky volitelnosti pro ty vlastnosti, které mají výchozí hodnoty deklarované.

:::info
Pamatujte, že výchozí hodnoty pro měnitelné (mutable) referenční typy (jako jsou pole či objekty) by měly být při použití `withDefaults` zabaleny do funkcí, aby se předešlo nechtěným změnám a vedlejším efektům zvnějšku. Použití funkce zajistí, že každá instance komponenty dostane svou vlastní kopii výchozí hodnoty. U reaktivního destrukturování proměnných to potřeba **není**.
:::

## defineModel() {#definemodel}

- Podporováno až od verze 3.4+

Toto makro slouží k deklaraci obousměrného (two-way)  bindingu vlastnosti (prop), který může být konzumován pomocí `v-model` z komponenty rodiče. Příklad použití je také rozebrán v průvodci [Komponenta – Binding přes v-model](/guide/components/v-model).

Interně toto makro deklaruje vlastnost (prop) modelu a odpovídající událost (event) aktualizace hodnoty. Pokud je první parametr řetězecový literál, bude použit jako název vlastnosti; jinak se název vlastnosti nastaví na výchozí hodnotu `"modelValue"`. V obou případech můžete také předat další objekt, který může obsahovat možnosti (options) pro vlastnost a možnosti transformace ref pro hodnotu modelu.

```js
// deklaruje prop "modelValue", která je konzumována 
// komponentou rodiče pomocí v-model
const model = defineModel()
// NEBO: deklaruje prop "modelValue" s možnostmi
const model = defineModel({ type: String })

// vyvolá událost "update:modelValue" při změně
model.value = 'hello'

// deklaruje prop "count", která je konzumována 
// komponentou rodiče pomocí v-model:count
const count = defineModel('count')
// NEBO: deklaruje prop "count" s možnostmi
const count = defineModel('count', { type: Number, default: 0 })

function inc() {
  // při změně vyvolá událost "update:count"
  count.value++
}
```

:::warning VAROVÁNÍ
Pokud pro vlastnost `defineModel` použijete `default` a neposkytnete v komponentě rodiče žádnou hodnotu, může to způsobit de-synchronizaci mezi rodičem a potomkem. V&nbsp;příkladu níže je `myRef` v rodiči `undefined`, zatímco `model` v potomkovi je `1`:

```js
// komponenta potomka:
const model = defineModel({ default: 1 })

// komponenta rodiče:
const myRef = ref()
```

```html
<Child v-model="myRef"></Child>
```

:::

### Modifikátory a transformátory {#modifiers-and-transformers}

Pro přístup k modifikátorům použitým s direktivou `v-model` můžeme destrukturovat návratovou hodnotu z `defineModel()` následovně:

```js
const [modelValue, modelModifiers] = defineModel()

// odpovídá v-model.trim
if (modelModifiers.trim) {
  // ...
}
```

Když je modifikátor přítomen, pravděpodobně potřebujeme transformovat hodnotu při jejím čtení nebo synchronizaci zpět do komponenty rodiče. Toho můžeme dosáhnout pomocí možností transformátoru `get` a `set`:

```js
const [modelValue, modelModifiers] = defineModel({
  // get() je vynechán, protože zde není potřeba
  set(value) {
    // pokud je použit modifikátor .trim, vrátíme hodnotu ořezanou o bílé znaky
    if (modelModifiers.trim) {
      return value.trim()
    }
    // jinak vrátíme hodnotu tak, jak je
    return value
  }
})
```

### Použití s TypeScriptem <sup class="vt-badge ts" /> {#usage-with-typescript}

Stejně jako `defineProps` a `defineEmits`, `defineModel` může také přijímat typové parametry k určení typů hodnoty modelu a modifikátorů:

```ts
const modelValue = defineModel<string>()
//    ^? Ref<string | undefined>

// výchozí model s možnostmi, required odstraňuje možné `undefined` hodnoty
const modelValue = defineModel<string>({ required: true })
//    ^? Ref<string>

const [modelValue, modifiers] = defineModel<string, 'trim' | 'uppercase'>()
//    ^? Record<'trim' | 'uppercase', true | undefined>
```

## defineExpose() {#defineexpose}

Komponenty používající `<script setup>` jsou **implicitně uzavřené** – tj. veřejná instance komponenty, která je získána pomocí template refs nebo `$parent` řetězců, **nevystavuje** žádné vazby deklarované uvnitř `<script setup>`.

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

Když rodič získá instanci této komponenty pomocí template refs, získaná instance bude ve tvaru `{ a: number, b: number }` (referenční hodnoty jsou automaticky „rozbaleny“ stejně jako u normálních instancí).

## defineOptions() {#defineoptions}

- Podporováno až od verze 3.3+

Toto makro může být použito k deklaraci vlastností komponenty přímo uvnitř `<script setup>` bez použití samostatného bloku `<script>`:

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
- Jedná se o makro. Vlastnosti budou vytaženy (hoisted) na úroveň modulu a nebudou mít přístup k lokálním proměnným ve `<script setup>`, které nejsou konstantní literály (literal constants).

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

- Podporováno až od verze 3.3+

Toto makro může být použito k poskytnutí typové nápovědy pro IDE pro kontrolu názvu slotu a typů props.

`defineSlots()` přijímá pouze parametr typu a žádné runtime parametry. Parametr typu by měl být typový literál, kde klíč vlastnosti je název slotu a typ hodnoty je funkce slotu. První parametr funkce jsou props, které slot očekává přijmout, a jeho typ bude použit pro slot props ve šabloně. Návratový typ je aktuálně ignorován a může být `any`, ale v&nbsp;budoucnu jej možná budeme chtít využít pro kontrolu obsahu slotu.

Také vrací objekt `slots`, který je ekvivalentní objektu `slots` dostupnému v kontextu `setup` nebo vrácenému funkcí `useSlots()`.

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

## `useSlots()` & `useAttrs()` {#useslots-useattrs}

Použití `slots` a `attrs` uvnitř `<script setup>` by mělo být relativně vzácné, protože k&nbsp;nim můžete přistupovat přímo jako `$slots` a `$attrs` ve šabloně. V případě, kdy je opravdu potřebujete, použijte příslušné pomocné funkce `useSlots` a `useAttrs`:

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

- Deklarovat vlastnosti, které nelze vyjádřit v `<script setup>`, například `inheritAttrs` nebo custom možnosti zpřístupněné pomocí pluginů (Může být nahrazeno makrem [`defineOptions`](/api/sfc-script-setup#defineoptions) od verze 3.3+).
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

Podpora pro kombinaci `<script setup>` a `<script>` ve stejné komponentě je omezena na výše popsané scénáře. Konkrétně:

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

Navíc platí, že výraz, na který se čeká, bude automaticky zkompilován ve formátu, jenž zachovává aktuální kontext komponenty po `await`.

:::warning Poznámka
`async setup()` musí být použit ve spojení se [`Suspense`](/guide/built-ins/suspense.html), což je v současné době stále ještě experimentální funkce. Plánujeme ji dokončit a zdokumentovat v budoucích verzích, ale pokud jste zvědaví už teď, můžete se podívat na její [testy](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts), abyste viděli, jak funguje.
:::

## Importy {#imports-statements}
Importy ve Vue odpovídají [specifikaci ECMAScript modulů](https://nodejs.org/api/esm.html).
Navíc můžete použít aliasy definované v nastavení vašeho build nástroje:
```vue
<script setup>
import { ref } from 'vue'
import { componentA } from './Components'
import { componentB } from '@/Components'
import { componentC } from '~/Components'
</script>
```

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

Hodnota `generic` funguje úplně stejně jako seznam parametrů mezi `<...>` v&nbsp;TypeScriptu. Například můžete použít více parametrů, omezení `extends`, výchozí typy a odkazovat na importované typy:

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

Pokud typ nemůže být odvozen, lze použít direktivu `@vue-generic` pro explicitní předání typů:

```vue
<template>
  <!-- @vue-generic {import('@/api').Actor} -->
  <ApiSelect v-model="peopleIds" endpoint="/api/actors" id-prop="actorId" />

  <!-- @vue-generic {import('@/api').Genre} -->
  <ApiSelect v-model="genreIds" endpoint="/api/genres" id-prop="genreId" />
</template>
```

Pokud chcete použít odkaz na generickou komponentu uvnitř `ref`, musíte použít knihovnu [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers), protože `InstanceType` nebude fungovat.

```vue
<script
  setup
  lang="ts"
>
import componentWithoutGenerics from '../component-without-generics.vue';
import genericComponent from '../generic-component.vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
// funguje pouze pro instanci komponenty bez generických typů
ref<InstanceType<typeof componentWithoutGenerics>>();
ref<ComponentExposed<typeof genericComponent>>();
// ...
</script>
```

## Omezení {#restrictions}

- Kvůli rozdílu v sémantice vykonávání modulů se kód uvnitř `<script setup>` spoléhá na kontext SFC. Při přesunu do externích souborů `.js` nebo `.ts` může dojít k zmatení jak u vývojářů, tak i SW nástrojů. Proto **`<script setup>`** nelze použít s atributem `src`.
- `<script setup>` nepodporuje in-DOM šablonu root komponenty. ([Související diskuze](https://github.com/vuejs/core/issues/8391))
