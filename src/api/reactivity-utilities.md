# Reactivity API: Utility {#api-pro-reaktivitu-pomucky}

## isRef() {#isref}

Zkontroluje, zda je hodnota ref objektem.

- **Typ**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Všimněte si, že návratový typ je [typový predikát](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), což znamená, že `isRef` může být použit jako type guard:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // typ foo je zúžen na Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Vrátí vnitřní hodnotu, pokud je parametr ref, jinak vrátí samotný parametr. Toto je zkrácená funkce pro `val = isRef(val) ? val.value : val`.

- **Typ**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Příklad**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped je nyní zaručeně číslo
  }
  ```

## toRef() {#toref}

Může být použito k normalizaci hodnot / refs / getterů na refs (3.3+).

Může také být použito k vytvoření ref pro vlastnost na zdrojovém reaktivním objektu. Vytvořený ref je synchronizován se svou zdrojovou vlastností: změna zdrojové vlastnosti aktualizuje ref a naopak.

- **Typ**

  ```ts
  // normalizační signatura (3.3+)
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // signatura pro vlastnost objektu
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Příklad**

  Normalizační signatura (3.3+):

  ```js
  // vrátí existující ref beze změny
  toRef(existingRef)

  // vytvoří readonly ref, který volá getter při přístupu k .value
  toRef(() => props.foo)

  // vytvoří normální ref z ne-funkčních hodnot
  // ekvivalentní ref(1)
  toRef(1)
  ```

  Signatura pro vlastnost objektu:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })
  
  // dvousměrný odkaz, který se synchronizuje s původní vlastností
  const fooRef = toRef(state, 'foo')

  // změna odkazu aktualizuje původní hodnotu
  fooRef.value++
  console.log(state.foo) // 2

  // změna původní hodnoty také aktualizuje odkaz
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Všimněte si, že to je odlišné od:

  ```js
  const fooRef = ref(state.foo)
  ```

  Výše uvedený odkaz **není** synchronizován s `state.foo`, protože `ref()` přijímá pouze prostou číselnou hodnotu.

  `toRef()` je užitečné, když chcete předat odkaz na vlastnost do composable funkce:

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // převést `props.foo` na odkaz a předat ho do
  // composable funkce
  useSomeFeature(toRef(props, 'foo'))

  // getter syntaxe - doporučeno od verze 3.3+
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  Při použití `toRef` s vlastnostmi (props) komponenty jsou stále aplikována běžná omezení týkající se změny vlastností. Pokus o přiřazení nové hodnoty k odkazu je ekvivalentní pokusu o změnu vlastnosti přímo a není povolen. V takovém případě byste měli zvážit použití [`computed`](./reactivity-core#computed) s `get` a `set`. Pro více informací se podívejte se na průvodce [použitím `v-model` s komponentami](/guide/components/v-model).

  Při použití signatury pro vlastnosti objektu vrátí `toRef()` použitelný odkaz i v případě, že zdrojová vlastnost v současné době neexistuje. To umožňuje pracovat s volitelnými vlastnostmi, které by nebyly zachyceny pomocí [`toRefs`](#torefs).

## toValue() {#tovalue}

Normalizuje hodnoty / refs / gettery na hodnoty. Podobá se [unref()](#unref) s tím rozdílem, že&nbsp;normalizuje i gettery. Pokud je argument getter, bude vyvolán a bude vrácena jeho návratová hodnota.

To lze použít v [composable funkcích](/guide/reusability/composables.html) k normalizaci parametru, který může být buď hodnota, ref nebo getter.

- Podporováno až od verze 3.3+

- **Typ**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **Příklad**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  Normalizace argumentů v composable funkcích:

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(() => toValue(id), id => {
      // reagovat na změny id
    })
  }

  // tato composable funkce podporuje následující:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## toRefs() {#torefs}

Převede reaktivní objekt na obyčejný, kde každá vlastnost výsledného objektu je ref odkazující na odpovídající vlastnost původního objektu. Každý jednotlivý ref je vytvořen pomocí [`toRef()`](#toref).

- **Typ**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Příklad**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Typ stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // Ref a původní vlastnost jsou „propojeny“
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` je užitečné při vrácení reaktivního objektu z composable funkce, aby cílová komponenta mohla destrukturovat / rozložit vrácený objekt bez ztráty reaktivity:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...logika pracující s objektem `state`

    // převést návratovou hodnotu na refs 
    return toRefs(state)
  }

  // lze destrukturovat bez ztráty reaktivity
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` vygeneruje refs pouze pro vlastnosti, které jsou na zdrojovém objektu [enumerable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) v době volání. Pro vytvoření ref pro vlastnost, která ještě nemusí existovat, místo toho použijte [`toRef`](#toref).

## isProxy() {#isproxy}

Zkontroluje, zda je objekt proxy vytvořenou pomocí [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](./reactivity-advanced#shallowreactive) nebo [`shallowReadonly()`](./reactivity-advanced#shallowreadonly).

- **Typ**

  ```ts
  function isProxy(value: any): boolean
  ```

## isReactive() {#isreactive}

Zkontroluje, zda je objekt proxy vytvořený pomocí [`reactive()`](./reactivity-core#reactive) nebo [`shallowReactive()`](./reactivity-advanced#shallowreactive).

- **Typ**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Zkontroluje, zda je předaná hodnota objektem pouze pro čtení. Vlastnosti objektu pouze pro čtení se mohou měnit, ale nelze je přímo přiřadit pomocí předaného objektu.

Proxy vytvořené pomocí [`readonly()`](./reactivity-core#readonly) a [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) jsou považovány za pouze pro čtení, stejně jako [`computed()`](./reactivity-core#computed) ref bez funkce `set`.

- **Typ**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
