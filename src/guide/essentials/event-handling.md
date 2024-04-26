# Obsluha událostí {#event-handling}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Lekce o událostech ve Vue.js zdarma"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Lekce o událostech ve Vue.js zdarma"/>
</div>

## Naslouchání událostem {#listening-to-events}

Pro naslouchání DOM událostem (events) můžeme použít direktivu `v-on`, která se typicky zapisuje zkráceně symbolem `@`. Poté, co jsou události vyvolány, můžeme skrz ni spustit nějaký JavaScript kód. Použití bude `v-on:click="handler"` nebo zkráceným zápisem `@click="handler"`.

Handler může mít jednu z následujících hodnot:

1. **Inline handlery:** Inline JavaScript, který je spuštěn po vyvolání události (stejně jako nativní atribut `onclick`).

2. **Method handlery:** Název proměnné nebo cesta, která ukazuje na funkci definovanou v rámci komponenty.

## Inline handlery {#inline-handlers}

Inline handlery se typicky používají v jednoduchých případech, například:

<div class="composition-api">

```js
const pocet = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    pocet: 0
  }
}
```

</div>

```vue-html
<button @click="pocet++">Přidat 1</button>
<p>Počet je: {{ pocet }}</p>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9jssKgzAURH/lko0tgrbbEqX+Q5fZaLxiqHmQ3LgJ+fdqFZcD58xMYp1z1RqRvRgP0itHEJCia4VR2llPkMDjBBkmbzUUG1oII4y0JhBIGw2hh2Znbo+7MLw+WjZ/C4TaLT3hnogPkcgaeMtFyW8j2GmXpWBtN47w5PWBHLhrPzPCKfWDXRHmPsCAaOBfgSOkdH3IGUhpDBWv9/e8vsZZ/gFFhFJN)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9jcEKgzAQRH9lyKlF0PYqqdR/6DGXaLYo1RjiRgrivzepIizLzu7sm1XUzuVLIFEKObe+d1wpS183eYahtw4DY1UWMJr15ZpmxYAnDt7uF0BxOwXL5Evc0kbxlmyxxZLFyY2CaXSDZkqKZROYJ4tnO/Tt56HEgckyJaraGNxlsVt2u6teHeF40s20EDo9oyGy+CPIYF1xULBt4H6kOZeFiwBZnOFi+wH0B1hk)

</div>

## Method handlery {#method-handlers}

Logika mnoha event handlerů však bude složitější a pravděpodobně nebude jen s inline handlery proveditelná. To je důvod, proč může `v-on` přijmout i název funkce, kterou chcete v rámci komponenty volat, nebo cestu k ní.

Například:

<div class="composition-api">

```js
const jmeno = ref('Vue.js')

function greet(event) {
  alert(`Ahoj, ${jmeno.value}!`)
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
    jmeno: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // `this` uvnitř funkce odkazuje na právě aktivní instanci
    alert(`Ahoj, ${this.jmeno}!`)
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
<button @click="greet">Pozdravit</button>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpVj0FLxDAQhf/KMwjtXtq7dBcFQS/qzVMOrWFao2kSkkkvpf/dJIuCEBgm771vZnbx4H23JRJ3YogqaM+IxMlfpNWrd4GxI9CMA3NwK5psbaSVVjkbGXZaCediaJv3RN1XbE5FnZNVrJ3FEoi4pY0sn7BLC0yGArfjMxnjcLsXQrdNJtFxM+Ys0PcYa2CEjuBPylNYb4THtxdUobj0jH/YX3D963gKC5WyvGZ+xR7S5jf01yPzeblhWr2ZmErHw0dizivfK6PV91mKursUl6dSh/4qZ+vQ/+XE8QODonDi)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)

</div>

Method handler automaticky přijímá objekt nativní události DOM, který ji vyvolá – ve výše uvedeném příkladu jsme schopni přistupovat k elementu odesílajícímu událost přes `event.target`.

<div class="composition-api">

Viz také: [Typování Event handlerů](/guide/typescript/composition-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Viz také: [Typování Event handlerů](/guide/typescript/options-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>

### Detekce Method vs. Inline {#method-vs-inline-detection}

Kompilátor šablon detekuje method handlery kontrolou, zda je hodnota `v-on` platným JavaScript identifikátorem nebo přístupovou cestou k vlastnosti. Například `foo`, `foo.bar` a `foo['bar']` jsou považovány za method handlery, zatímco `foo()` a&nbsp;`count++` jsou vyhodnoceny jako inline handlery.

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
<button @click="say('ahoj')">Pozdrav</button>
<button @click="say('nashledanou')">Rozluč se</button>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9jTEOwjAMRa8SeSld6I5CBWdg9ZJGBiJSN2ocpKjq3UmpFDGx+Vn//b/ANYTjOxGcQEc7uyAqkqTQI98TW3ETq2jyYaQYzYNatSArZTzNUn/IK7Ludr2IBYTG4I3QRqKHJFJ6LtY7+zojbIXNk7yfmhahv5msvqS7PfnHGjJVp9w/hu7qKKwfEd1NSg==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)

</div>

## Přístup k parametru nativní události in Inline handleru {#accessing-event-argument-in-inline-handlers}

Někdy potřebujeme přistupovat k původní události DOM i přímo v inline handleru. Můžete jej předat do funkce pomocí speciální proměnné `$event` nebo použít inline arrow funkci:

```vue-html
<!-- použití speciální proměnné $event -->
<button @click="warn('Formulář ještě nelze odeslat', $event)">
  Odeslat
</button>

<!-- použití inline arrow funkce -->
<button @click="(event) => warn('Formulář ještě nelze odeslat', event)">
  Odeslat
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

Uvnitř event handlerů je vcelku běžné volat `event.preventDefault()` nebo `event.stopPropagation()`. Ačkoli to můžeme snadno udělat uvnitř funkcí, bylo by lepší, kdyby funkce mohly být čistě o datové logice, než aby se musely zabývat detaily událostí DOM.

K vyřešení tohoto požadavku poskytuje Vue pro `v-on` **modifikátory události**.<br>Jde o direktivní postfixy označené tečkou.

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
<!-- při přidávání event listeneru použít capture mód    -->
<!-- tj. událost zacílená na vnitřní element je dříve    -->
<!-- zpracována zde, než je zpracována uvnitř            -->
<div @click.capture="doThis">...</div>

<!-- událost kliknutí bude vyvolána nejvýš jednou        -->
<a @click.once="doThis"></a>

<!-- výchozí chování události scroll (scrolling) nastane -->
<!-- okamžitě místo čekání na dokončení `onScroll`       -->
<!-- v případě, že obsahuje `event.preventDefault()`     -->
<div @scroll.passive="onScroll">...</div>
```

Modifikátor `.passive` je typicky používán s dotykovými event listenery pro [zlepšení výkonu na mobilních zařízeních](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scroll_performance_using_passive_listeners).

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
- `.delete` (zachytí jak „Delete“, tak „Backspace“)
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
Na klávesnicích Macintosh je meta klávesa příkazu (⌘). Na klávesnicích Windows je meta klávesa Windows (⊞). Na klávesnicích Sun Microsystems je meta označena jako plný kosočtverec (◆). Na určitých klávesnicích, konkrétně na strojových klávesnicích MIT a&nbsp;Lisp a jejich nástupcích jako je Knight keyboard a space-cadet keyboard, je meta označena jako „META“. Na klávesnicích Symbolics je meta označena „META“ nebo „Meta“.
:::

Například:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="foo">Udělej něco</div>
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
