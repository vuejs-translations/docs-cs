---
pageClass: api
---

# Vestavěné komponenty {#built-in-components}

:::info Registrace a použití
Vestavěné komponenty lze používat přímo v šablonách bez nutnosti registrace. Jsou také optimalizovány pro odstranění nepoužívaného kódu (tree-shaking): ve výsledném buildu jsou zahrnuty pouze, pokud jsou použity.

Pro použití ve [funkcích pro vykreslení](/guide/extras/render-function) je třeba je explicitně importovat. Například:

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```

:::

## `<Transition>` {#transition}

Poskytuje animované přechodové (transition) efekty pro **jeden** element nebo **jednu** komponentu.

- **Props**

  ```ts
  interface TransitionProps {
    /**
     * Slouží k automatickému generování názvů CSS tříd pro přechody.
     * Např. `name: 'fade'` se automaticky rozšíří na `.fade-enter`,
     * `.fade-enter-active`, atd.
     */
    name?: string
    /**
     * Určuje, zda se mají CSS třídy přechodů použít.
     * Výchozí hodnota: true
     */
    css?: boolean
    /**
     * Určuje typ událostí přechodů, na které se má čekat
     * pro určení času ukončení přechodu.
     * Výchozí chování je automatické detekování typu s delší dobou trvání.
     */
    type?: 'transition' | 'animation'
    /**
     * Určuje explicitní doby trvání přechodu.
     * Výchozí chování je čekání na první událost `transitionend`
     * nebo `animationend` na root elementu přechodu.
     */
    duration?: number | { enter: number; leave: number }
    /**
     * Ovládá časovou posloupnost přechodů při vstupu/výstupu.
     * Výchozí chování je současné provedení.
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * Určuje, zda se má přechod aplikovat při počátečním vykreslení.
     * Výchozí hodnota: false
     */
    appear?: boolean

    /**
     * Vlastnosti pro přizpůsobení tříd přechodů.
     * V šablonách použijte kebab-case zápis, např. enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **Události**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (pouze pro `v-show`)
  - `@appear-cancelled`

- **Příklad**

  Jednoduchý element:

  ```vue-html
  <Transition>
    <div v-if="ok">přepnutý obsah</div>
  </Transition>
  ```

  Vynucení přechodu změnou atributu `key`:

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  Dynamická komponenta s režimem přechodu + animace při zobrazení:

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  Naslouchání událostem přechodu:

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">přepnutý obsah</div>
  </Transition>
  ```

- **Viz také:** [Průvodce - Transition](/guide/built-ins/transition)

## `<TransitionGroup>` {#transitiongroup}

Poskytuje přechodové efekty pro **více** elementů nebo komponent v seznamu.

- **Props**

  `<TransitionGroup>` přijímá stejné props jako `<Transition>` s výjimkou `mode`, plus dvě další vlastnosti:

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * Pokud není definováno, vykresluje se jako fragment.
     */
    tag?: string
    /**
     * Pro přizpůsobení CSS třídy použité během přechodových animací.
     * V šablonách použijte kebab-case zápis, např. move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **Události**

  `<TransitionGroup>` emituje stejné události jako `<Transition>`.

- **Podrobnosti**

  Ve výchozím nastavení `<TransitionGroup>` nevykresluje obalový DOM element, ale lze jej definovat pomocí vlastnosti `tag`.

  Pamatujte, že každý potomek v `<transition-group>` musí být [**jednoznačně označen**](/guide/essentials/list#maintaining-state-with-key), aby animace fungovaly správně.

  `<TransitionGroup>` podporuje pohyblivé přechody pomocí CSS transformace. Pokud se pozice potomka na obrazovce po aktualizaci změní, bude mu aplikována pohybová CSS třída (automaticky generovaná z atributu `name` nebo konfigurovaná pomocí vlastnosti `move-class`). Pokud je CSS vlastnost `transform` při aplikaci pohybové třídy „transition-able“, element bude na své cílové místo plynule animován pomocí [techniky FLIP](https://aerotwist.com/blog/flip-your-animations/).

- **Příklad**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **Viz také:** [Průvodce - TransitionGroup](/guide/built-ins/transition-group)

## `<KeepAlive>` {#keepalive}

Ukládá stav dynamicky přepínatelných komponent obalených uvnitř do cache.

- **Props**

  ```ts
  interface KeepAliveProps {
    /**
     * Pokud je specifikováno, budou do cache ukládány pouze komponenty
     * s názvy odpovídajícími `include`.
     */
    include?: MatchPattern
    /**
     * Jakákoli komponenta s názvem odpovídajícím `exclude` nebude 
     * ukládána do cache.
     */
    exclude?: MatchPattern
    /**
     * Maximální počet instancí komponenty, které se mají ukládat do cache.
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Podrobnosti**

  Když obaluje dynamickou komponentu, `<KeepAlive>` ukládá neaktivní instance komponent, aniž by je ničila.

  V `<KeepAlive>` může být v každém okamžiku pouze jedna aktivní instance komponenty jako přímý potomek.

  Když je komponenta uvnitř `<KeepAlive>` přepnuta, budou se volat odpovídající lifecycle hooky `activated` a `deactivated` poskytující alternativu k `mounted` a&nbsp;`unmounted`, které volány nejsou. To platí jak pro přímého potomka `<KeepAlive>`, tak&nbsp;pro všechny jeho potomky.

- **Příklad**

  Základní použití:

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  Při použití s větvemi `v-if` / `v-else` musí být vždy zobrazena pouze jedna komponenta:

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  Použití společně s `<Transition>`:

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  Použití `include` / `exclude`:

  ```vue-html
  <!-- čárkami oddělený řetězec -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- regex (použijte `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- Pole (použijte `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  Použití s `max`:

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **Viz také:** [Průvodce - KeepAlive](/guide/built-ins/keep-alive)

## `<Teleport>` {#teleport}

Vykresluje obsah svého slotu na jiné části DOM.

- **Props**

  ```ts
  interface TeleportProps {
    /**
     * Povinné. Určuje cílový kontejner.
     * Může být buď selektor nebo samotný element.
     */
    to: string | HTMLElement
    /**
     * Když je `true`, obsah zůstane na svém původním
     * místě místo přesunu do cílového kontejneru.
     * Lze měnit dynamicky.
     */
    disabled?: boolean
  }
  ```

- **Příklad**

  Určení cílového kontejneru:

  ```vue-html
  <Teleport to="#some-id" />
  <Teleport to=".some-class" />
  <Teleport to="[data-teleport]" />
  ```

  Podmíněné vypnutí:

  ```vue-html
  <Teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </Teleport>
  ```

- **Viz také:** [Průvodce - Teleport](/guide/built-ins/teleport)

## `<Suspense>` <sup class="vt-badge experimental" /> {#suspense}

Používá se pro orchestraci vnořených asynchronních závislostí ve stromu komponent.

- **Props**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
    suspensible?: boolean
  }
  ```

- **Události**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Podrobnosti**

  `<Suspense>` přijímá dva sloty: `#default` a `#fallback`. Zobrazí obsah fallback slotu, zatímco v paměti vykresluje default slot.

  Pokud narazí na asynchronní závislosti ([Asynchronní komponenty](/guide/components/async) a komponenty s&nbsp;[`async setup()`](/guide/built-ins/suspense#async-setup)) při vykreslování default slotu, počká, dokud nebudou všechny vyřešeny, než ho zobrazí.

  Nastavením komponenty Suspense na `suspensible` budou všechny asynchronní závislosti obsluhovány nadřazenou Suspense. Podívejte se na [detaily implementace](https://github.com/vuejs/core/pull/6736).

- **Viz také:** [Průvodce - Suspense](/guide/built-ins/suspense)
