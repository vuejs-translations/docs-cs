# Obsluha událostí {#event-handling}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Lekce o událostech ve Vue.js zdarma"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Lekce o událostech ve Vue.js zdarma"/>
</div>

## Naslouchání událostem {#listening-to-events}

Pro naslouchání DOM událostem (events) můžeme použít direktivu `v-on`, která se typicky zapisuje zkráceně symbolem `@`. Poté, co jsou vyvolány, můžeme skrz ni spustit nějaký JavaScript kód. Použití bude `v-on:click="handler"` nebo zkráceným zápisem `@click="handler"`.

Handler může mít jednu z následujících hodnot:

1. **Inline handlery:** Inline JavaScript, který je spuštěn po vyvolání události (stejně jako nativní atribut `onclick`).

2. **Method handlery:** Název proměnné nebo cesta, která ukazuje na funkci definovanou v rámci komponenty.

## Inline handlery {#inline-handlers}

Inline handlery se typicky používají v jednoduchých případech, například:

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnRlciA9IHJlZigwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcblx0ICByZXR1cm4ge1xuICAgIFx0Y291bnRlcjogMFxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

## Method handlery {#method-handlers}

Logika mnoha event handlerů však bude složitější a pravděpodobně nebude proveditelná pouze s inline handlery. To je důvod, proč může `v-on` přijmout i název nebo cestu funkce, kterou chcete v rámci komponenty volat.

Například:

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` je nativní událost DOM
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // `this` uvnitř funkce odkazuje na právě aktivní instanci
    alert(`Hello ${this.name}!`)
    // `event` je nativní událost DOM
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` je název funkce definované výše -->
<button @click="greet">Greet</button>
```

<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgbmFtZSA9IHJlZignVnVlLmpzJylcblxuZnVuY3Rpb24gZ3JlZXQoZXZlbnQpIHtcbiAgYWxlcnQoYEhlbGxvICR7bmFtZS52YWx1ZX0hYClcbiAgLy8gYGV2ZW50YCBpcyB0aGUgbmF0aXZlIERPTSBldmVudFxuICBpZiAoZXZlbnQpIHtcbiAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJncmVldFwiPkdyZWV0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1Z1ZS5qcydcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBncmVldChldmVudCkge1xuICAgICAgLy8gYHRoaXNgIGluc2lkZSBtZXRob2RzIHBvaW50cyB0byB0aGUgY3VycmVudCBhY3RpdmUgaW5zdGFuY2VcbiAgICAgIGFsZXJ0KGBIZWxsbyAke3RoaXMubmFtZX0hYClcbiAgICAgIC8vIGBldmVudGAgaXMgdGhlIG5hdGl2ZSBET00gZXZlbnRcbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxidXR0b24gQGNsaWNrPVwiZ3JlZXRcIj5HcmVldDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

Method handler automaticky přijímá objekt nativní události DOM, který ji vyvolá – ve výše uvedeném příkladu jsme schopni přistupovat k elementu odesílajícímu událost přes `event.target.tagName`.

<div class="composition-api">

Viz také: [Typování Event handlerů](/guide/typescript/composition-api.html#typing-event-handlers) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Viz také: [Typování Event handlerů](/guide/typescript/options-api.html#typing-event-handlers) <sup class="vt-badge ts" />

</div>

### Detekce Method vs. Inline {#method-vs-inline-detection}

Kompilátor šablon detekuje method handlery kontrolou, zda je hodnota `v-on` platným JavaScript identifikátorem nebo přístupovou cestou k vlastnosti. Například `foo`, `foo.bar` a `foo['bar']` jsou považovány za method handlery, zatímco `foo()` a `count++` jsou považovány za inline handlery.

## Volání funkcí v Inline handleru {#calling-methods-in-inline-handlers}

Namísto bindingu přímo na název funkce můžeme tyto funkce také volat přímo v inline handleru. To nám umožňuje předat funkci vlastní parametry namísto nativní události:

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eNp9kN1uwjAMhV8l8g1Dos191aHtGXabm7QzUNb8yHaYKtR3X0KnCoHEnY/j88XHV/iMsb4khAZa7mmIohglxb3xh+R7GYJXbKc3h8z2iFt1NV4pOyLJ2jN+Nr7Viz0bsxB0cbSCRUnbJZHM+ejHof95N1CAmxOOY9hsDey/7KRuqtXL5AtXN+HqyfWdo9Xrp7CDwcVAUjkb6zMHn+PdFjf/D2ygWaKUXs5ftIGTSORGaz705ShnrgMdda5qSl4GhzWyqzoKv4yUwQZ2dwydmxekitB/IyG9Yj6MPnELNl91hvkPugmTrw==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0aG9kczoge1xuXHQgIHNheShtZXNzYWdlKSB7XG4gICAgXHRhbGVydChtZXNzYWdlKVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ2hpJylcIj5TYXkgaGk8L2J1dHRvbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ3doYXQnKVwiPlNheSB3aGF0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

## Přístup k parametru nativní události in Inline handleru {#accessing-event-argument-in-inline-handlers}

Někdy potřebujeme přistupovat k původní události DOM i přímo v inline handleru. Můžete jej předat do funkce pomocí speciální proměnné `$event` nebo použít inline arrow funkci:

```vue-html
<!-- použití speciální proměnné $event -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- použití inline arrow funkce -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // nyní máme přístup k nativnému eventu
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // nyní máme přístup k nativnému eventu
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## Modifikátory události {#event-modifiers}

Uvnitř event handlerů je vcelku běžné volat `event.preventDefault()` nebo `event.stopPropagation()`. Ačkoliv to můžeme snadno udělat uvnitř funkcí, bylo by lepší, kdyby funkce mohly být čistě o datové logice, než aby se musely zabývat detaily událostí DOM.

K vyřešení tohoto požadavku poskytuje Vue pro `v-on` **modifikátory události**. Jde o direktivní postfixy označené tečkou.

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- šíření události kliknutí bude zastaveno -->
<a @click.stop="doThis"></a>

<!-- událost odeslání nebude znovu načítat stránku -->
<form @submit.prevent="onSubmit"></form>

<!-- modifikátory lze řetězit -->
<a @click.stop.prevent="doThat"></a>

<!--  nebo napsat pouze samotný modifikátor -->
<form @submit.prevent></form>

<!-- vyvolat handler pouze tehdy, pokud je event.target samotný element -->
<!-- t.j. např. ne z potomka -->
<div @click.self="doThat">...</div>
```

::: tip
Při použití modifikátorů záleží na pořadí, protože příslušný kód je ve stejném pořadí generován. Proto použití `@click.prevent.self` zabrání **výchozí akci kliknutí na element samotný i jeho potomky**, zatímco `@click.self.prevent` zabrání pouze výchozí akci kliknutí na samotný element.
:::

Modifikátory `.capture`, `.once` a `.passive` představují [možnosti natívní funkce `addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options):

```vue-html
<!-- při přidávání event listeneru použít capture mód -->
<!-- tj. událost zacílená na vnitřní element je zde zpracována dříve, než je zpracována tam
 -->
<div @click.capture="doThis">...</div>

<!-- událost kliknutí bude vyvolána nejvýš jednou -->
<a @click.once="doThis"></a>

<!-- výchozí chování události scroll (scrolling) nastane -->
<!-- okamžitě místo čekání na dokončení `onScroll` -->
<!-- v případě, že obsahuje `event.preventDefault()` -->
<div @scroll.passive="onScroll">...</div>
```

Modifikátor `.passive` je typicky používán s dotykovými event listenery pro [zlepšení výkonu na mobilních zařízeních](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners).

::: tip
Nepoužívejte `.passive` a `.prevent` dohromady, protože `.passive` již prohlížeči naznačuje, že _nemáte_ v úmyslu bránit výchozímu chování události. Pokud tak přesto učiníte, pravděpodobně se vám zobrazí varování z prohlížeče.
:::

## Modifikátory kláves {#key-modifiers}

Když nasloucháme událostem klávesnice, často potřebujeme zkontrolovat konkrétní klávesy. Vue proto umožňuje při poslechu událostí klávesnice přidávat pro `v-on` nebo `@` modifikátory kláves:

```vue-html
<!-- zavolat `submit` pouze pokud byl stisknut `Enter` -->
<input @keyup.enter="submit" />
```

Jakékoli platné názvy kláves vystavené prostřednictvím [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) můžete přímo použít jako modifikátory převedením na kebab-case.

```vue-html
<input @keyup.page-down="onPageDown" />
```

Ve výše uvedeném příkladu je handler zavolán pouze, pokud se `$event.key` rovná `'PageDown'`.

### Aliasy kláves {#key-aliases}

Vue poskytuje aliasy pro nejčastěji používané klávesy:

- `.enter`
- `.tab`
- `.delete` (zachytí jak "Delete", tak "Backspace")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### Systémové klávesy {#system-modifier-keys}

Následující modifikátory můžete použít k vyvolání event listenerů naslouchajících myši nebo klávesnici pouze, pokud je stisknuta odpovídající modifikační klávesa:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Poznámka
Na klávesnicích Macintosh je meta klávesa příkazu (⌘). Na klávesnicích Windows je meta klávesa Windows (⊞). Na klávesnicích Sun Microsystems je meta označena jako plný kosočtverec (◆). Na určitých klávesnicích, konkrétně na strojových klávesnicích MIT a Lisp a jejich nástupcích jako je Knight keyboard a space-cadet keyboard, je meta označena jako „META“. Na klávesnicích Symbolics je meta označena „META“ nebo „Meta“.
:::

Například:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
Všimněte si, že modifikační klávesy se od běžných kláves liší a při použití s událostmi `keyup` je nutné je stisknout, když je událost emitována. Jinými slovy, `keyup.ctrl` se spustí pouze tehdy, když uvolníte klávesu a zároveň držíte `ctrl`. Nespustí se, pokud pouze uvolníte klávesu `ctrl`.
:::

### Modifikátor `.exact` {#exact-modifier}

Modifikátor `.exact` umožňuje ovládat přesnou kombinaci systémových modifikátorů potřebných k vyvolání události. 

```vue-html
<!-- bude aktivováno i když je zároveň stisknuto Alt nebo Shift -->
<button @click.ctrl="onClick">A</button>

<!-- bude aktivováno pouze když je jen samotné Ctrl -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- bude aktivováno pouze když není stisknut žádný systémový modifikátor -->
<button @click.exact="onClick">A</button>
```

## Modifikátory tlačítek myši {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

Tyto modifikátory omezují vyvolání event handlerů spouštěných určitým tlačítkem myši.
