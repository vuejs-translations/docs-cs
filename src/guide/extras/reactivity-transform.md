# Transformace reaktivity {#reactivity-transform}

:::danger Zastaralá funkce
Transformace reaktivity (Reactivity transform) byla experimentální funkcí a byla odstraněna v release verzi 3.4. Přečtěte si [zdůvodnění](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

Pokud si ji stále přejete používat, je nyní dostupná prostřednictvím pluginu [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html).
:::

:::tip Specifické pro Composition API
Transformace reaktivity je funkcí specifickou pro Composition API a vyžaduje build fázi.
:::

## Refs vs. reaktivní proměnné {#refs-vs-reactive-variables}

Od zavedení Composition API je jednou z hlavních nevyřešených otázek použití refs oproti reaktivním objektům. Při destruování reaktivních objektů je snadné ztratit reaktivitu, zatímco při použití refs je obtížné všude používat `.value`. Navíc, pokud nepoužíváte  typový systém, `.value` snadno přehlédnete.

[Vue Reactivity Transform](https://github.com/vuejs/core/tree/main/packages/reactivity-transform) je compile-time transformace, která nám umožňuje psát kód takto:

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

Metoda `$ref()` je **compile-time makro**: není to skutečná metoda, která by se spustila za běhu. Místo toho ji kompilátor Vue používá jako nápovědu, aby s výslednou proměnnou `count` zacházel jako s **reaktivní proměnnou**.

Reaktivní proměnné lze přistupovat a přiřazovat stejně jako běžné proměnné, ale tyto operace jsou kompilovány do refs s `.value`. Například část `<script>` výše uvedené komponenty je kompilována do:

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

Každé Reactivity API, které vrací refs, bude mít ekvivalentní makro s předponou `$`. Tato API zahrnují:

- [`ref`](/api/reactivity-core#ref) -> `$ref`
- [`computed`](/api/reactivity-core#computed) -> `$computed`
- [`shallowRef`](/api/reactivity-advanced#shallowref) -> `$shallowRef`
- [`customRef`](/api/reactivity-advanced#customref) -> `$customRef`
- [`toRef`](/api/reactivity-utilities#toref) -> `$toRef`

Tato makra jsou globálně dostupná a nemusí být importována, pokud je transformace reaktivity povolena. Nicméně, můžete je volitelně importovat z `vue/macros`, pokud chcete být explicitnější:

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## Dekonstrukce s `$()` {#destructuring-with}

Je běžné, že composable funkce vrací objekt refs a používá se dekonstrukce k jejich získání. K tomuto účelu poskytuje transformace reaktivity makro **`$()`**:

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

Přeložený výstup:

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

Všimněte si, že pokud `x` již je ref, `toRef(__temp, 'x')` ho jednoduše vrátí tak, jak je, a žádný další ref nebude vytvořen. Pokud je dekonstruovaná hodnota není ref (např. funkce), stále to funguje - hodnota bude obalena v ref, aby zbytek kódu fungoval, jak se očekává.

Dekonstrukce s `$()` funguje jak na reaktivních objektech, tak na obyčejných objektech obsahujících refs.

## Převod existujících refs na reaktivní proměnné s `$()` {#convert-existing-refs-to-reactive-variables-with}

V některých případech můžeme mít obalující funkce, které také vrací refs. Nicméně, kompilátor Vue nebude schopen předem poznat, že funkce vrátí ref. V takových případech lze makro `$()` použít i k převodu existujících refs na reaktivní proměnné:

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## Dekonstrukce reaktivních props {#reactive-props-destructure}

S aktuálním použitím `defineProps()` v `<script setup>` existují dva problémy:

1. Podobně jako `.value`, musíte vždy přistupovat k props jako `props.x`, abyste zachovali reaktivitu. To znamená, že nemůžete dekonstruovat `defineProps`, protože výsledné dekonstruované proměnné nejsou reaktivní a nebudou se aktualizovat.

2. Při použití [pouze typové deklarace props](/api/sfc-script-setup#type-only-props-emit-declarations) neexistuje snadný způsob, jak deklarovat výchozí hodnoty. Pro tento účel jsme zavedli API `withDefaults()`, ale stále je obtížné ho používat.

Tyto problémy můžeme řešit pomocí compile-time transformace, když se `defineProps` použije s dekonstrukcí, podobně jako jsme viděli dříve s `$()`:

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // výchozí hodnota funguje
    count = 1,
    // lokální přejmenování také funguje
    // zde přejmenováváme `props.foo` na `bar`
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // bude logovat vždy, když se props změní
    console.log(msg, count, bar)
  })
</script>
```

Výše uvedený kód bude zkompilován na následující runtime ekvivalent:

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## Zachování reaktivity přes hranice funkcí {#retaining-reactivity-across-function-boundaries}

Zatímco reaktivní proměnné nás zbavují nutnosti používat všude `.value`, vytváří problém "ztráty reaktivity", když reaktivní proměnné předáváme přes hranice funkcí. To se může stát ve dvou případech:

### Předání do funkce jako parametr {#passing-into-function-as-argument}

Předpokládejme funkci, která očekává jako parametr ref, např.:

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x změněno!')
  })
}

let count = $ref(0)
trackChange(count) // nefunguje!
```

Výše uvedený případ nebude fungovat podle očekávání, protože se překládá na:

```ts
let count = ref(0)
trackChange(count.value)
```

Zde je `count.value` předáváno jako číslo, zatímco `trackChange` očekává skutečný ref. To lze opravit obalením `count` do `$$()` před jeho předáním:

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

Výše uvedený kód se překládá na:

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

Jak můžeme vidět, `$$()` je makro, které slouží jako **escape hint**: reaktivní proměnné uvnitř `$$()` nedostanou přidáno `.value`.

### Návrat v rámci rozsahu funkce {#returning-inside-function-scope}

Reaktivita může být také ztracena, pokud jsou reaktivní proměnné použity přímo v návratovém výrazu:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // naslouchat události mousemove...

  // nefunguje!
  return {
    x,
    y
  }
}
```

Výše uvedený návratový výraz se překládá na:

```ts
return {
  x: x.value,
  y: y.value
}
```

Abychom zachovali reaktivitu, měli bychom vracet skutečné refs, ne aktuální hodnotu v době návratu.

Opět můžeme k opravě použít `$$()`. V tomto případě lze `$$()` použít přímo na vráceném objektu - jakýkoli odkaz na reaktivní proměnné uvnitř volání `$$()` si zachová odkaz na jejich podkladové refs:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // naslouchat události mousemove...

  // opraveno
  return $$({
    x,
    y
  })
}
```

### Použití `$$()` na dekonstruovaných vlastnostech {#using-on-destructured-props}

`$$()` funguje i na destrukturovaných vlastnostech (props), protože jsou to také reaktivní proměnné. Kompilátor je pro větší efektivitu převede pomocí `toRef`:

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

se překládá na:

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## Integrace TypeScriptu <sup class="vt-badge ts" /> {#typescript-integration}

Vue poskytuje typy pro tyto makra (dostupné globálně) a všechny typy budou fungovat správně. Nejsou zde žádné neslučitelnosti se standardními sémantikami TypeScriptu, takže syntaxe bude fungovat se všemi existujícími nástroji.

To také znamená, že makra mohou fungovat v jakémkoli souboru, kde jsou povoleny platné JS / TS - nejen uvnitř Vue SFC.

Protože makra jsou dostupná globálně, jejich typy musí být explicitně odkazovány (např. v souboru `env.d.ts`):

```ts
/// <reference types="vue/macros-global" />
```

Při explicitním importu z `vue/macros` bude typ fungovat bez deklarování globálních proměnných.

## Explicitní povolení {#explicit-opt-in}

:::warning
Následující se vztahuje pouze na verze Vue 3.3 a nižší. Její podpora byla odstraněna ve verze 3.4 Vue Core a z `@vitejs/plugin-vue` verze 5.0+. Pokud plánujete transformaci nadále používat, přejděte prosím na [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html).
:::

### Vite {#vite}

- Vyžaduje `@vitejs/plugin-vue@>=2.0.0`
- Používá se u SFC a js(x)/ts(x) souborů. Před aplikací transformace se na soubory provede rychlá kontrola použití, takže pro soubory, které makra nepoužívají, by neměly být žádné náklady na výkon.
- Poznámka: `reactivityTransform` je nyní volbou na nejvyšší úrovni pluginu místo vnořeného jako `script.refSugar`, protože ovlivňuje nejen SFC.

```js
// vite.config.js
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- V současné době ovlivňuje pouze SFC
- Vyžaduje `vue-loader@>=17.0.0`

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### Čistý `webpack` + `vue-loader` {#plain-webpack-vue-loader}

- V současné době ovlivňuje pouze SFC
- Vyžaduje `vue-loader@>=17.0.0`

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```
