# Reactivity API: Pokročilé {#reactivity-api-advanced}

## shallowRef() {#shallowref}

„Mělká“ verze [`ref()`](./reactivity-core#ref).

- **Typ**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **Podrobnosti**

  Na rozdíl od `ref()` je vnitřní hodnota mělké reference uložena a vystavena tak, jak je, a nebude hluboce (deep) reaktivní. Reaktivní je pouze přístup k `.value`.

  `shallowRef()` se obvykle používá pro optimalizaci výkonu velkých datových struktur nebo pro integraci s externími systémy pro správu stavu.

- **Příklad**

  ```js
  const state = shallowRef({ count: 1 })

  // nezpůsobí změnu
  state.value.count = 2

  // způsobí změnu
  state.value = { count: 2 }
  ```

- **Viz také:**
  - [Průvodce - Snížení reaktivního zatížení pro velké neměnné struktury](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
  - [Průvodce - Integrace s externími systémy pro správu stavu](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

## triggerRef() {#triggerref}

Vynutí spuštění efektů, které závisí na [shallow ref](#shallowref). To se obvykle používá po provedení hlubokých mutací vnitřní hodnoty mělké reference.

- **Typ**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **Příklad**

  ```js
  const shallow = shallowRef({
    greet: 'Ahoj, Vue'
  })

  // 'Ahoj, Vue' se zaloguje jednou při prvním spuštění
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // Toto nezpůsobí spuštění efektu, protože reference je mělká
  shallow.value.greet = 'Ahoj, Vue 3'

  // Zaloguje 'Ahoj, Vue 3'
  triggerRef(shallow)
  ```

## customRef() {#customref}

Vytvoří upravenou referenci s explicitní kontrolou sledování závislostí a spouštění aktualizací.

- **Typ**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **Podrobnosti**

  `customRef()` očekává tovární funkci, která přijímá funkce `track` a `trigger` jako parametry a měla by vrátit objekt s metodami `get` a `set`.

  Obecně by mělo být voláno `track()` uvnitř `get()` a `trigger()` uvnitř `set()`. Nicméně máte plnou kontrolu nad tím, kdy by měly být volány nebo zda by vůbec měly být volány.

- **Příklad**

  Vytvoření „debounced“ ref, který aktualizuje hodnotu až po určitém časovém prodlení po posledním volání `set`:

  ```js
  import { customRef } from 'vue'

  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  Použití v komponentě:

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('ahoj')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [Vyzkoušejte si to](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

## shallowReactive() {#shallowreactive}

„Mělká“ verze [`reactive()`](./reactivity-core#reactive).

- **Typ**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **Podrobnosti**

  Na rozdíl od `reactive()` zde není hluboká konverze: reaktivní jsou pouze vlastnosti na nejvyšší úrovni mělce reaktivního objektu. Hodnoty vlastností jsou uloženy a&nbsp;vystaveny tak, jak jsou - to také znamená, že vlastnosti s hodnotami ref **nebudou** automaticky rozbaleny.

  :::warning Používejte opatrně
  Měl byste používat mělké datové struktury pouze pro stav na kořenové úrovni komponenty. Vyhněte se vnořování do hluboké reaktivní struktury, protože to vytváří strom s nekonzistentním chováním reaktivity, což může být obtížné pochopit a ladit.
  :::

- **Příklad**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // změna vlastností stavu je reaktivní
  state.foo++

  // ...ale nekonvertuje vnořené objekty
  isReactive(state.nested) // false

  // NENÍ reaktivní
  state.nested.bar++
  ```

## shallowReadonly() {#shallowreadonly}

„Mělká“ verze [`readonly()`](./reactivity-core#readonly).

- **Typ**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **Detaily**

  Na rozdíl od `readonly()` zde není hluboká konverze: pouze vlastnosti na nejvyšší úrovni jsou nastaveny jako pouze pro čtení. Hodnoty vlastností jsou uloženy a&nbsp;vystaveny tak, jak jsou - to znamená, že vlastnosti s ref hodnotami nebudou automaticky rozbaleny.

  :::warning Používejte opatrně
  Měl byste používat mělké datové struktury pouze pro stav na kořenové úrovni komponenty. Vyhněte se vnořování do hluboké reaktivní struktury, protože to vytváří strom s nekonzistentním chováním reaktivity, což může být obtížné pochopit a ladit.
  :::

- **Příklad**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // změna vlastností stavu selže
  state.foo++

  // ...ale funguje na vnořených objektech
  isReadonly(state.nested) // false

  // funguje
  state.nested.bar++
  ```

## toRaw() {#toraw}

Vrátí původní objekt vytvořený z proxy vytvořené Vue.

- **Typ**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **Detaily**

  `toRaw()` může vrátit původní objekt z proxy vytvořeného pomocí [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](#shallowreactive) nebo [`shallowReadonly()`](#shallowreadonly).

  Toto je únikový mechanismus, který lze použít k dočasnému čtení bez nákladů na přístup / sledování proxy nebo k zápisu bez vyvolání změn. **Není** doporučeno uchovávat trvalý odkaz na původní objekt. Používejte s rozvahou.

- **Příklad**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw() {#markraw}

Označuje objekt tak, aby nikdy nebyl převeden na proxy. Vrací samotný (raw) objekt.

- **Typ**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **Příklad**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // funguje také v případě, když je vnořený v jiných reaktivních objektech
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning Používejte opatrně
  `markRaw()` a mělké API funkce, jako je `shallowReactive()`, vám umožňují selektivně odmítnout výchozí hlubokou reaktivní/readonly konverzi a vložit do vašeho stavového grafu neupravené, neproxyované objekty. Můžete je použít z různých důvodů:

  - Některé hodnoty jednoduše nemají být reaktivní, například složitá instance třetí strany nebo objekt Vue komponenty.

  - Přeskočení proxy konverze může znamenat vylepšení výkonu při vykreslování velkých seznamů s neměnnými zdroji dat.

  Jsou považovány za pokročilé, protože možnost opt-outu z výchozího chování platí pouze na nejvyšší úrovni objektu, takže pokud nastavíte vnořený, neoznačený a&nbsp;neupravený objekt do reaktivního objektu, a poté na něj znovu přistoupíte, dostanete zpět proxy verzi. To může vést k **rizikům identity** - tj. provádění operace, která se spoléhá na identitu objektu, ale používá jak původní, tak proxy verzi stejného objektu:

  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // i když je `foo` označen jako neupravený (raw), foo.nested není.
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  Rizika identity jsou obecně vzácná. Ovšem správné využití těchto API při bezpečném vyhýbání se problémům vyžaduje dobré porozumění tomu, jak systém reaktivity funguje.

  ::: 

## effectScope() {#effectscope}

Vytváří objekt efektového rozsahu (effect scope), který může zachytit reaktivní efekty (tj. computed proměnné a watchery) vytvořené uvnitř něj, aby bylo možné tyto efekty zrušit společně. Pro podrobné použití tohoto API se prosím obraťte na příslušnou [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md).

- **Typ**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // undefined, pokud je rozsah neaktivní
    stop(): void
  }
  ```

- **Příklad**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Počet: ', doubled.value))
  })

  // zrušení všech efektů v rozsahu
  scope.stop()
  ```

## getCurrentScope() {#getcurrentscope}

Vrátí aktuálně aktivní [effect scope](#effectscope), pokud existuje.

- **Typ**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose() {#onscopedispose}

Zaregistruje callback pro zrušení v aktuálně aktivním [effect scope](#effectscope). Callback bude vyvolán při zastavení příslušného rozsahu efektů.

Tato metoda může být použita jako nesouvisející náhrada `onUnmounted` v opakovaně použitelných kompozičních funkcích, protože každá funkce `setup()` Vue komponenty je také volána v rozsahu efektů.

- **Typ**

  ```ts
  function onScopeDispose(fn: () => void): void
  ```
