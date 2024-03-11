<script setup>
import Basic from './transition-demos/Basic.vue'
import SlideFade from './transition-demos/SlideFade.vue'
import CssAnimation from './transition-demos/CssAnimation.vue'
import NestedTransitions from './transition-demos/NestedTransitions.vue'
import JsHooks from './transition-demos/JsHooks.vue'
import BetweenElements from './transition-demos/BetweenElements.vue'
import BetweenComponents from './transition-demos/BetweenComponents.vue'
</script>

# Transition {#transition}

Vue nabízí dvě vestavěné komponenty, které pomáhají pracovat s přechody a animacemi v reakci na změny stavu:

- `<Transition>` pro aplikaci animací, když element nebo komponenta vstupuje či vystupuje z DOM. Tomu se věnuje tato stránka.

- `<TransitionGroup>` pro aplikaci animací při vložení elementu nebo komponenty do seznamu `v-for`, při odebrání elementu nebo komponenty z tohoto seznamu nebo při jejich přesunu v rámci seznamu. Tím se zabývá [další kapitola](/guide/built-ins/transition-group).

Kromě těchto dvou komponent můžeme ve Vue aplikovat animace také pomocí dalších technik, jako je přepínání CSS tříd nebo stavově řízené animace pomocí bindingu stylů. Tyto další techniky jsou popsány v kapitole [Techniky animace](/guide/extras/animation).

## Komponenta `<Transition>` {#the-transition-component}

`<Transition>` je vestavěná komponenta, což znamená, že je k dispozici v jakékoli šabloně komponenty, aniž by bylo nutné ji registrovat. Lze ji použít k aplikaci vstupních a&nbsp;výstupních animací na elementy nebo komponenty, které jsou jí předány prostřednictvím výchozího slotu. Vstup nebo výstup může být spuštěn jednou z&nbsp;následujících akcí:

- Podmíněné vykreslování přes `v-if`
- Podmíněné zobrazení přes `v-show`
- Dynamické přepínání komponent přes speciální element `<component>`
- Změna speciálního atributu `key`

Zde je příklad nejzákladnějšího použití:

```vue-html
<button @click="show = !show">Změnit zobrazení</button>
<Transition>
  <p v-if="show">Ahoj</p>
</Transition>
```

```css
/* Co tyto třídy znamenají, vysvětlíme vzápětí! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

<Basic />

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpVkEFuwyAQRa8yZZNWqu1sunFJ1N4hSzYUjRNUDAjGVJHluxcCipIV/OG/pxEr+/a+TwuykfGogvYEEWnxR2H17F0gWCHgBBtMwc2wy9WdsMIqZ2OuXtwfHErhlcKCb8LyoVoynwPh7I0kzAmA/yxEzsKXMlr9HgRr9Es5BTue3PlskA+1VpFTkDZq0i3niYfU6anRmbqgMY4PZeH8OjwBfHhYIMdIV1OuferQEoZOKtIJ328TgzJhm8BabHR3jeC8VJqusO8/IqCM+CnsVqR3V/mfRxO5amnkCPuK5B+6rcG2fydshks=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)

</div>

:::tip
`<Transition>` podporuje jako obsah svého slotu pouze jediný prvek nebo komponentu. Pokud je obsahem komponenta, musí mít také pouze jeden jediný root element.
:::

Když je element v komponentě `<Transition>` vložen nebo odebrán, stane se toto:

1. Vue automaticky zjistí, zda má cílový prvek aplikovány CSS přechody nebo animace. Pokud ano, budou v odpovídajících časech přidány / odebrány některé [CSS třídy přechodu](#transition-classes).

2. Pokud existují listenery pro [JavaScript události](#javascript-hooks), budou jejich metody v odpovídajících časech provolány.

3. Pokud nejsou detekovány žádné CSS přechody / animace a nejsou nastaveny žádné JavaScriptové události, operace DOM pro vložení a/nebo odebrání elementů budou provedeny v následujícím animačním snímku prohlížeče.

## Přechody založené na CSS {#css-based-transitions}

### Třídy přechodu {#transition-classes}

Existuje šest tříd aplikovaných pro přechody vstupu / výstupu.

![Diagram přechodu](./images/transition-classes.png)

<!-- https://www.figma.com/file/rlOv0ZKJFFNA9hYmzdZv3S/Transition-Classes -->

1. `v-enter-from`: Počáteční stav pro vstup. Je přidána před vložením prvku, odebrána jeden snímek po vložení prvku.

2. `v-enter-active`: Aktivní stav pro vstup. Používá se během celé fáze vstupu. Je přidána před vložením prvku a odstraněna po dokončení přechodu/animace. Třída může být použita k definici trvání (duration), zpoždění (delay) a křivky pro zjemnění (easing) pro vstupní přechod.

3. `v-enter-to`: Koncový stav pro vstup. Je přidána jeden snímek po vložení prvku (ve&nbsp;stejný okamžik, kdy je odstraněno `v-enter-from`) a odstraněna po dokončení přechodu/animace.

4. `v-leave-from`: Počáteční stav pro odchod. Je přidána okamžitě po spuštění odchodového přechodu a odstraněna po jednom snímání.

5. `v-leave-active`: Aktivní stav pro odchod. Používá se během celé fáze odchodu. Je přidána okamžitě po spuštění odchodového přechodu a odstraněna po dokončení přechodu/animace. Tato třída může být použita k definování trvání, zpoždění a křivky pro odchodový přechod.

6. `v-leave-to`: Koncový stav pro odchod. Je přidána jeden snímek po spuštění odchodového přechodu (ve stejný okamžik, kdy je odstraněno `v-leave-from`) a&nbsp;odstraněna po dokončení přechodu/animace.

`v-enter-active` a `v-leave-active` nám pro vstupní / odchodové přechody umožňují specifikovat různé křivky uvolnění, jak uvidíme na příkladu v následujících sekcích.

### Pojmenované přechody {#named-transitions}

Přechod může být pojmenován pomocí vlastnosti `name`:

```vue-html
<Transition name="fade">
  ...
</Transition>
```

Pro pojmenovaný přechod budou jeho přechodové třídy uvozeny místo předpony `v` jménem přechodu. Například třída aplikovaná pro výše uvedený přechod bude `fade-enter-active` místo `v-enter-active`. CSS pro přechod `fade` by měl vypadat takto:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### CSS přechody {#css-transitions}

`<Transition>` se nejčastěji používá v kombinaci s [nativními CSS přechody](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions), jako v&nbsp;jednoduchém příkladu výše. CSS vlastnost `transition` je zkratka, která nám umožňuje specifikovat více různých aspektů přechodu, včetně vlastností, které by měly být animovány, trvání přechodu a [easing funkce](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function).

Zde je více pokročilý příklad, který přechází mezi více vlastnostmi s různou dobou trvání a křivkami pro vstup a výstup:

```vue-html
<Transition name="slide-fade">
  <p v-if="show">Ahoj</p>
</Transition>
```

```css
/*
  Animace pro vstup a výstup mohou mít různou
  dobu trvání a časování.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<SlideFade />

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFkc9uwjAMxl/F6wXQKIVNk1AX0HbZC4zDDr2E4EK0NIkStxtDvPviFQ0OSFzyx/m+n+34kL16P+lazMpMRBW0J4hIrV9WVjfeBYIDBKzhCHVwDQySdFDZyipnY5Lu3BcsWDCk0OKosqLoKcmfLoSNN5KQbyTWLZGz8KKMVp+LKju573ivsuXKbbcG4d3oDcI9vMkNiqL3JD+AWAVpoyadGFY2yATW5nVSJj9rkspDl+v6hE/hHRrjRMEdpdfiDEkBUVxWaEWkveHj5AzO0RKGXCrSHcKBIfSPKEEaA9PJYwSUEXPX0nNlj8y6RBiUHd5AzCOodq1VvsYfjWE4G6fgEy/zMcxG17B9ZTyX8bV85C5y1S40ZX/kdj+GD1P/zVQA56XStC9h2idJI/z7huz4CxoVvE4=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFkc1uwjAMgF/F6wk0SmHTJNQFtF32AuOwQy+hdSFamkSJ08EQ776EbMAkJKTIf7I/O/Y+ezVm3HvMyoy52gpDi0rh1mhL0GDLvSTYVwqg4cQHw2QDWCRv1Z8H4Db6qwSyHlPkEFUQ4bHixA0OYWckJ4wesZUn0gpeainqz3mVRQzM4S7qKlss9XotEd6laBDu4Y03yIpUE+oB2NJy5QSJwFC8w0iIuXkbMkN9moUZ6HPR/uJDeINSalaYxCjOkBBgxeWEijnayWiOz+AcFaHNeU2ix7QCOiFK4FLCZPzoALnDXHt6Pq7hP0Ii7/EGYuag9itR5yv8FmgH01EIPkUxG8F0eA2bJmut7kbX+pG+6NVq28WTBTN+92PwMDHbSAXQhteCdiVMUpNwwuMassMP8kfAJQ==)

</div>

### CSS Animace {#css-animations}

[Nativní CSS animace](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) se používají stejným způsobem jako CSS přechody, s tím rozdílem, že třída `*-enter-from` není odstraněna okamžitě po vložení elementu, ale až po události `animationend`.

Většinu CSS animací stačí deklarovat pod třídami `*-enter-active` a `*-leave-active`. Zde je příklad:

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Ahoj, já jsem poskakující text!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<CssAnimation />

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNksGOgjAQhl9lJNmoBwRNvCAa97YP4JFLbQZsLG3TDqzG+O47BaOezCYkpfB9/0wHbsm3c4u+w6RIyiC9cgQBqXO7yqjWWU9wA4813KH2toUpo9PKVEZaExg92V/YRmBGvsN5ZcpsTGGfN4St04Iw7qg8dkTWwF5qJc/bKnnYk7hWye5gm0ZjmY0YKwDlwQsTFCnWjGiRpaPtjETG43smHPSpqh9pVQKBrjpyrfCNMilZV8Aqd5cNEF4oFVo1pgCJhtBvnjEAP6i1hRN6BBUg2BZhKHUdvMmjWhYHE9dXY/ygzN4PasqhB75djM2mQ7FUSFI9wi0GCJ6uiHYxVsFUGcgX67CpzP0lahQ9/k/kj9CjDzgG7M94rT1PLLxhQ0D+Na4AFI9QW98WEKTQOMvnLAOwDrD+wC0Xq/Ubusw/sU+QL/45hskk9z8Bddbn)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNUs2OwiAQfpWxySZ66I8mXioa97YP4LEXrNNKpEBg2tUY330pqOvJmBBgyPczP1yTb2OyocekTJirrTC0qRSejbYEB2x4LwmulQI4cOLTWbwDWKTeqkcE4I76twSyPcaX23j4zS+WP3V9QNgZyQnHiNi+J9IKtrUU9WldJaMMrGEynlWy2em2lcjyCPMUALazXDlBwtMU79CT9rpXNXp4tGYGhlQ0d7UqAUcXOeI6bluhUtKmhEVhzisgPFPKpWhVCTUqQrt6ygD8oJQajmgRhAOnO4RgdQm8yd0tNzGv/D8x/8Dy10IVCzn4axaTTYNZymsSA8YuciU6PrLL6IKpUFBkS7cKXXwQJfIBPyP6IQ1oHUaB7QkvjfUdcy+wIFB8PeZIYwmNtl0JruYSp8XMk+/TXL7BzbPF8gU6L95hn8D4OUJnktsfM1vavg==)

</div>

### Vlastní třídy přechodu {#custom-transition-classes}

Můžete specifikovat i své vlastní třídy přechodu pomocí předání následujících vlastností (props) do komponenty `<Transition>`:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

Tyto třídy budou použity místo tříd s výchozími názvy. Obzvlášť užitečné to je, pokud chcete kombinovat přechodový systém Vue s existující knihovnou CSS animací, jako je [Animate.css](https://daneden.github.io/animate.css/):

```vue-html
<!-- předpokládá, že je Animate.css zahrnuto na stránce -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">Ahoj</p>
</Transition>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNUctuwjAQ/BXXF9oDsZB6ogbRL6hUcbSEjLMhpn7JXtNWiH/vhqS0R3zxPmbWM+szf02pOVXgSy6LyTYhK4A1rVWwPsWM7MwydOzCuhw9mxF0poIKJoZC0D5+stUAeMRc4UkFKcYpxKcEwSenEYYM5b4ixsA2xlnzsVJ8Yj8Mt+LrbTwcHEgxwojCmNxmHYpFG2kaoxO0B2KaWjD6uXG6FCiKj00ICHmuDdoTjD2CavJBCna7KWjZrYK61b9cB5pI93P3sQYDbxXf7aHHccpVMolO7DS33WSQjPXgXJRi2Cl1xZ8nKkjxf0dBFvx2Q7iZtq94j5jKUgjThmNpjIu17ZzO0JjohT7qL+HsvohJWWNKEc/NolncKt6Goar4y/V7rg/wyw9zrLOy)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)

</div>

### Použití přechodů a animací společně {#using-transitions-and-animations-together}

Vue potřebuje připojit event listenery, aby vědělo, kdy přechod skončil. V závislosti na typu použitých CSS pravidel to může být buď `transitionend` nebo `animationend`. Pokud používáte pouze jeden z nich, Vue automaticky detekuje správný typ.

Nicméně někdy můžete chtít mít na stejném elementu oba, například mít CSS animaci spouštěnou Vue spolu s efektem CSS přechodu při najetí myší. V těchto případech musíte explicitně deklarovat typ, o který se Vue stará, předáním vlastnosti `type` s&nbsp;hodnotou buď `animation` nebo `transition`:

```vue-html
<Transition type="animation">...</Transition>
```

### Vnořené přechody a explicitní délky přechodů {#nested-transitions-and-explicit-transition-durations}

Přestože jsou přechodové třídy použity pouze na přímém potomkovi uvnitř `<Transition>`, můžeme přecházet na vnořené elementy pomocí vnořených CSS selektorů:

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Ahoj
    </div>
  </div>
</Transition>
```

```css
/* pravidla aplikovaná na vnořené prvky */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... další potřebné CSS vynecháno */
```

Můžeme dokonce přidat zpoždění přechodu na vnořený prvek při vstupu, což vytvoří posunutou (staggered) animaci vstupu:

```css{3}
/* zpoždění vstupu vnořeného prvku pro "staggered" efekt */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

To však vytváří malý problém. Výchozím chováním komponenty `<Transition>` je automaticky zjistit, kdy přechod skončil, posloucháním **první** události `transitionend` nebo `animationend` na root elementu přechodu. S vnořeným přechodem by však požadovaným chováním mělo být čekání, dokud neskončí i přechody všech vnitřních prvků.

V takových případech můžete specifikovat explicitní dobu přechodu (v milisekundách) pomocí vlastnosti `duration` na komponentě `<Transition>`. Celková doba by měla odpovídat zpoždění plus době přechodu vnitřního prvku:

```vue-html
<Transition :duration="550">...</Transition>
```

<NestedTransitions />

[Vyzkoušejte si to](https://play.vuejs.org/#eNqVVd9v0zAQ/leO8LAfrE3HNKSFbgKmSYMHQNAHkPLiOtfEm2NHttN2mvq/c7bTNi1jgFop9t13d9995ziPyfumGc5bTLJkbLkRjQOLrm2uciXqRhsHj2BwBiuYGV3DAUEPcpUrrpUlaKUXcOkBh860eJSrcRqzUDxtHNaNZA5pBzCets5pBe+4FPz+Mk+66Bf+mSdXE12WEsdphMWQiWHKCicoLCtaw/yKIs/PR3kCitVIG4XWYUEJfATFFGIO84GYdRUIyCWzlra6dWg2wA66dgqlts7c+d8tSqk34JTQ6xqb9TjdUiTDOO21TFvrHqRfDkPpExiGKvBITjdl/L40ulVFBi8R8a3P17CiEKrM4GzULIOlFmpQoSgrl8HpKFpX3kFZu2y0BNhJxznvwaJCA1TEYcC4E3MkKp1VIptjZ43E3KajDJiUMBqeWUBmcUBUqJGYOT2GAiV7gJAA9Iy4GyoBKLH2z+N0W3q/CMC2yCCkyajM63Mbc+9z9mfvZD+b071MM23qLC69+j8PvX5HQUDdMC6cL7BOTtQXCJwpas/qHhWIBdYtWGgtDWNttWTmThu701pf1W6+v1Hd8Xbz+k+VQxmv8i7Fv1HZn+g/iv2nRkjzbd6npf/Rkz49DifQ3dLZBBYOJzC4rqgCwsUbmLYlCAUVU4XsCd1NrCeRHcYXb1IJC/RX2hEYCwJTvHYVMZoavbBI09FmU+LiFSzIh0AIXy1mqZiFKaKCmVhiEVJ7GftHZTganUZ56EYLL3FykjhL195MlMM7qxXdmEGDPOG6boRE86UJVPMki+p4H01WLz4Fm78hSdBo5xXy+yfsd3bpbXny1SA1M8c82fgcMyW66L75/hmXtN44a120ktDPOL+h1bL1HCPsA42DaPdwge3HcO/TOCb2ZumQJtA15Yl65Crg84S+BdfPtL6lezY8C3GkZ7L6Bc1zNR0=)

Pokud je to nutné, můžete specifikovat i samostatné hodnoty pro dobu trvání při vstupu a odchodu pomocí objektu:

```vue-html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### Úvaha o výkonu {#performance-considerations}

Můžete si všimnout, že animace zobrazené výše využívají převážně vlastnosti jako `transform` a `opacity`. Tyto vlastnosti jsou efektivní pro animaci, protože:

1. Neovlivňují layout dokumentu během animace, takže nevyvolávají nákladné výpočty CSS layoutu při každém snímku animace.

2. Většina moderních prohlížečů může využít hardwarovou akceleraci GPU během `transform` animace.

Naopak vlastnosti jako `height` nebo `margin` vyvolají změnu CSS layoutu, takže jsou na animaci mnohem dražší a měly by se používat opatrně. Pro zjištění, které všechny CSS vlastnosti změnu layoutu při animaci vyvolají, můžeme použít zdroje jako [CSS Triggers](https://csstriggers.com/).

## JavaScript události {#javascript-hooks}

Pomocí JavaScriptu se můžete k procesu přechodu připojit pomocí naslouchání událostem na komponentě `<Transition>`:

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

<div class="composition-api">

```js
// voláno před vložením elementu do DOM
// použijte k nastavení počátečního ("enter-from") stavu
function onBeforeEnter(el) {}

// voláno jeden snímek po vložení elementu
// použijte k zahájení animace přechodu
function onEnter(el, done) {
  // volání funkce `done` signalizuje konec přechodu
  // volitelné, pokud se používá ve spojení s CSS
  done()
}

// voláno po dokončení vstupního přechodu
function onAfterEnter(el) {}

// voláno, když je vstupní přechod zrušen před dokončením
function onEnterCancelled(el) {}

// voláno před odchodem
// většinou byste měli použít pouze metodu leave
function onBeforeLeave(el) {}

// voláno při začátku odchodového přechodu
// použijte k zahájení animace odchodu
function onLeave(el, done) {
  // volání funkce `done` signalizuje konec přechodu
  // volitelné, pokud se používá ve spojení s CSS
  done()
}

// voláno po dokončení odchodového přechodu 
// a odebrání elementu z DOM
function onAfterLeave(el) {}

// dostupné pouze pro přechody v rámci v-show
function onLeaveCancelled(el) {}
```

</div>
<div class="options-api">

```js
export default {
  // ...
  methods: {
    // voláno před vložením elementu do DOM
    // použijte k nastavení počátečního ("enter-from") stavu
    onBeforeEnter(el) {},

    // voláno jeden snímek po vložení elementu
    // použijte k zahájení animace přechodu
    onEnter(el, done) {
      // volání funkce `done` signalizuje konec přechodu
      // volitelné, pokud se používá ve spojení s CSS
      done()
    },

    // voláno po dokončení vstupního přechodu
    onAfterEnter(el) {},

    // voláno, pokud je vstupní přechod zrušen (cancelled) před dokončením
    onEnterCancelled(el) {},

    // voláno před odchodem
    // většinou byste měli použít pouze metodu leave
    onBeforeLeave(el) {},

    // voláno při začátku odchodového přechodu
    // použijte k zahájení animace odchodu
    onLeave(el, done) {
      // volání funkce `done` signalizuje konec přechodu
      // volitelné, pokud se používá ve spojení s CSS
      done()
    },

    // voláno po dokončení odchodového přechodu 
    // a odebrání elementu z DOM
    onAfterLeave(el) {},

    // dostupné pouze pro přechody v rámci v-show
    onLeaveCancelled(el) {}
  }
}
```

</div>

Tyto metody (hooks) lze použít ve spojení s CSS přechody / animacemi nebo samostatně.

Při použití čistě JavaScriptových přechodů je obvykle vhodné přidat vlastnost (prop) `:css="false"`. Tímto Vue explicitně říkáme, aby se přeskočilo automatické detekování CSS přechodů. Kromě toho, že je to trochu výkonnější, to dále zabrání tomu, aby se CSS pravidla do přechodu  náhodou vmísila:

```vue-html{3}
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

S `:css="false"` jsme také plně zodpovědní za řízení konce přechodu. V tomto případě jsou pro metody (hooks) `@enter` a `@leave` vyžadovány callbacky `done`. Jinak budou metody volány synchronně a přechod okamžitě skončí.

Zde je ukázka použití knihovny [GSAP](https://gsap.com/) k provedení animací. Samozřejmě můžete použít libovolnou jinou animační knihovnu, například [Anime.js](https://animejs.com/) nebo [Motion One](https://motion.dev/).

<JsHooks />

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNVMtu2zAQ/JUti8I2YD3i1GigKmnaorcCveTQArpQFCWzlkiCpBwHhv+9Sz1qKYckJ3FnlzvD2YVO5KvW4aHlJCGpZUZoB5a7Vt9lUjRaGQcnMLyEM5RGNbDA0sX/VGWpHnB/xEQmmZIWe+zUI9z6m0tnWr7ymbKVzAklQclvvFSG/5COmyWvV3DKJHTdQiRHZN0jAJbRmv9OIA432/UE+jODlKZMuKcErnx8RrazP8woR7I1FEryKaVTU8aiNdRfwWZTQtQwi1HAGF/YB4BTyxNY8JpaJ1go5K/WLTfhdg1Xq8V4SX5Xja65w0ovaCJ8Jvsnpwc+l525F2XH4ac3Cj8mcB3HbxE9qnvFMRzJ0K3APuhIjPefmTTyvWBAGvWbiDuIgeNYRh3HCCDNW+fQmHtWC7a/zciwaO/8NyN3D6qqap5GfVnXAC89GCqt8Bp77vu827+A+53AJrOFzMhQdMnO8dqPpMO74Yx4wqxFtKS1HbBOMdIX4gAMffVp71+Qq2NG4BCIcngBKk8jLOvfGF30IpBGEwcwtO6p9sdwbNXPIadsXxnVyiKB9x83+c3N9WePN9RUQgZO6QQ2sT524KMo3M5Pf4h3XFQ7NwFyZQpuAkML0doEtvEHhPvRDPRkTfq/QNDgRvy1SuIvpFOSDQmbkWTckf7hHsjIzjltkyhqpd5XIVNN5HNfGlW09eAcMp3J+R+pEn7L)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNVFFvmzAQ/is3pimNlABNF61iaddt2tukvfRhk/xiwIAXsJF9pKmq/PedDTSwh7ZSFLjvzvd9/nz4KfjatuGhE0ES7GxmZIu3TMmm1QahtLyFwugGFu51wRQAU+Lok7koeFcjPDk058gvlv07gBHYGTVGALbSDwmg6USPnNzjtHL/jcBK5zZxxQwZavVNFNqIHwqF8RUAWs2jn4IffCfqQz+mik5lKLWi3GT1hagHRU58aAUSshpV2YzX4ncCcbjZDp099GcG6ZZnEh8TuPR8S0/oTJhQjmQryLUSU0rUU8a8M9wtoWZTQtIwi0nAGJ/ZB0BwKxJYiJpblFko1a8OLzbhdgWXy8WzP99109YCqdIJmgifyfYuzmUzfFF2HH56o/BjAldx/BbRo7pXHKMjGbrl1IcciWn9fyaNfC8YsIueR5wCFFTGUVAEsEs7pOmDu6yW2f6GBW5o4QbeuScLbu91WdZiF/VlvgEtujdcWek09tx3qZ+/tXAzQU1mA8mCoeicneO1OxKP9yM+4ElmLaEFr+2AecVEn8sDZOSrSzv/1qk+sgAOa1kMOyDlu4jK+j1GZ70E7KKJAxRafKzdazi26s8h5dm+NLpTeQLvP27S6+urz/7T5aaUao26TWATt0cPPsgcK3f6Q1wJWVY4AVJtcmHWhueyo89+G38guD+agT5YBf39s25oIv5arehu8krYkLAs8BeG86DfuANYUCG2NomiTrX7Msx0E7ncl0bnXT04566M4PQPykWaWw==)

</div>

## Znovupoužitelné přechody {#reusable-transitions}

Přechody mohou být znovupoužity pomocí systému Vue komponent. Pro vytvoření znovupoužiteného přechodu můžeme vytvořit komponentu, která obaluje komponentu `<Transition>` a předává obsah slotu:

```vue{5}
<!-- MyTransition.vue -->
<script>
// Logika JavaScriptových metod...
</script>

<template>
  <!-- obalit vestavěnou komponentu `Transition` -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- předat obsah slotu -->
  </Transition>
</template>

<style>
/*
  Nutné CSS...
  Poznámka: zde se vyhněte se použití `<style scoped>`,
  protože se nevztahuje na obsah slotu.
*/
</style>
```

Nyní může být `MyTransition` importována a používána stejně jako vestavěná verze:

```vue-html
<MyTransition>
  <div v-if="show">Ahoj</div>
</MyTransition>
```

## Přechod ihned při zobrazení {#transition-on-appear}

Pokud chcete přechod aplikovat také ihned při počátečním vykreslení prvku, můžete přidat vlastnost `appear`:

```vue-html
<Transition appear>
  ...
</Transition>
```

## Přechod mezi elementy {#transition-between-elements}

Kromě přepínání pomocí `v-if` / `v-show` můžeme mezi dvěma elementy také přecházet s využitím `v-if` / `v-else` / `v-else-if`, pokud se ujistíme, že je v každém okamžiku zobrazen pouze jeden prvek:

```vue-html
<Transition>
  <button v-if="docState === 'saved'">Editovat</button>
  <button v-else-if="docState === 'edited'">Uložit</button>
  <button v-else-if="docState === 'editing'">Zrušit</button>
</Transition>
```

<BetweenElements />

[Vyzkoušejte si to](https://play.vuejs.org/#eNqdk8tu2zAQRX9loI0SoLLcFN2ostEi6BekmwLa0NTYJkKRBDkSYhj+9wxJO3ZegBGu+Lhz7syQ3Bd/nJtNIxZN0QbplSMISKNbdkYNznqCPXhcwwHW3g5QsrTsTGekNYGgt/KBBCEsouimDGLCvrztTFtnGGN4QTg4zbK4ojY4YSDQTuOiKwbhN8pUXm221MDd3D11xfJeK/kIZEHupEagrbfjZssxzAgNs5nALIC2VxNILUJg1IpMxWmRUAY9U6IZ2/3zwgRFyhowYoieQaseq9ElDaTRrkYiVkyVWrPiXNdiAcequuIkPo3fMub5Sg4l9oqSevmXZ22dwR8YoQ74kdsL4Go7ZTbR74HT/KJfJlxleGrG8l4YifqNYVuf251vqOYr4llbXz4C06b75+ns1a3BPsb0KrBy14Aymnerlbby8Vc8cTajG35uzFITpu0t5ufzHQdeH6LBsezEO0eJVbB6pBiVVLPTU6jQEPpKyMj8dnmgkQs+HmQcvVTIQK1hPrv7GQAFt9eO9Bk6fZ8Ub52Qiri8eUo+4dbWD02exh79v/nBP+H2PStnwz/jelJ1geKvk/peHJ4BoRZYow==)

## Režimy přechodu {#transition-modes}

V předchozím příkladu byly vstupující a odcházející prvky animovány současně a museli jsme je nastavit na `position: absolute`, abychom se vyhnuli problému s layoutem, když jsou v DOM přítomny oba prvky.

To však v některých případech není možné nebo to jednoduše není požadované chování. Můžeme chtít, aby odcházející prvek byl nejprve animován pryč a vstupující prvek byl vložen až **po** dokončení animace odcházejícího prvku. Manuální orchestrace takových animací by byla velmi složitá - naštěstí můžeme toto chování povolit předáním vlastnosti (prop) `mode` do `<Transition>`:

```vue-html
<Transition mode="out-in">
  ...
</Transition>
```

Zde je předchozí demo s `mode="out-in"`:

<BetweenElements mode="out-in" />

`<Transition>` také podporuje `mode="in-out"`, i když se používá mnohem méně často.

## Přechod mezi komponentami {#transition-between-components}

`<Transition>` může být také použita nad [dynamickou komponentou](/guide/essentials/component-basics#dynamic-components):

```vue-html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

<BetweenComponents />

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqtksFugzAMhl/F4tJNKtDLLoxWKnuDacdcUnC3SCGJiMmEqr77EkgLbXfYYZyI8/v77dinZG9M5npMiqS0dScMgUXqzY4p0RrdEZzAfnEp9fc7HuEMx063sPIZq6viTbdmHy+yfDwF5K2guhFUUcBUnkNvcelBGrjTooHaC7VCRXBAoT6hQTRyAH2w2DlsmKq1sgS8JuEwUCfxdgF7Gqt5ZqrMp+58X/5A2BrJCcOJSskPKP0v+K8UyvQENBjcsqTjjdAsAZe2ukHpI3dm/q5wXPZBPFqxZAf7gCrzGfufDlVwqB4cPjqurCChFSjeBvGRN+iTA9afdE+pUD43FjG/bSHsb667Mr9qJot89vCBMl8+oiotDTL8ZsE39UnYpRN0fQlK5A5jEE6BSVdiAdrwWtAAm+zFAnKLr0ydA3pJDDt0x/PrMrJifgGbKdFPfCwpWU+TuWz5omzfVCNcfJJ5geL8pqtFn5E07u7fSHFOj6TzDyUDNEM=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqtks9ugzAMxl/F4tJNamGXXVhWqewVduSSgStFCkkUDFpV9d0XJyn9t8MOkxBg5/Pvi+Mci51z5TxhURdi7LxytG2NGpz1BB92cDvYezvAqqxixNLVjaC5ETRZ0Br8jpIe93LSBMfWAHRBYQ0aGms4Jvw6Q05rFvSS5NNzEgN4pMmbcwQgO1Izsj5CalhFRLDj1RN/wis8olpaCQHh4LQk5IiEll+owy+XCGXcREAHh+9t4WWvbFvAvBlsjzpk7gx5TeqJtdG4LbawY5KoLtR/NGjYoHkw+PTSjIqUNWDkwOK97DHUMjVEdqKNMqE272E5dajV+JvpVlSLJllUF4+QENX1ERox0kHzb8m+m1CEfpOgYYgpqVHOmJNpgLQQa7BOdooO8FK+joByxLc4tlsiX6s7HtnEyvU1vKTCMO+4pWKdBnO+0FfbDk31as5HsvR+Hl9auuozk+J1/hspz+mRdPoBYtonzg==)

</div>

## Dynamické přechody {#dynamic-transitions}

Vlastnosti `<Transition>` jako `name` mohou být také dynamické! To nám umožňuje používat různé přechody operativně na základě změny stavu:

```vue-html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

Může to být užitečné, pokud jste definovali přechody / animace pomocí konvenčních tříd Vue přechodů a chcete mezi nimi přepínat.

Můžete také aplikovat různé chování v JavaScriptových metodách pro přechod na základě aktuálního stavu vaší komponenty. V neposlední řadě, nejlepší způsob vytváření dynamických přechodů je pomocí [znovupoužitelných přechodů](#reusable-transitions), komponent, které přijímají vlastnosti (props) pro změnu povahy použitých přechodů. Možná to zní trochu kýčovitě, ale opravdu jediným omezením je vaše představivost.

## Přechody s atributem `key` {#transitions-with-the-key-attribute}

Někdy si potřebujete vynutit nové vykreslení DOM elementu, aby se přechod spustil.

Například si vezměte tuto komponentu počítadla:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);

setInterval(() => count.value++, 1000);
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 1,
      interval: null 
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.count++;
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>
<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>

Pokud bychom atribut `key` vynechali, aktualizoval by se pouze textový uzel, a proto by nedošlo k žádnému přechodu. Ovšem s nadefinovaným unikátném `key` Vue umí vytvořit nový element `span`, kdykoliv se změní hodnota `count`, a tak má komponenta `Transition` dva různé elementy, mezi kterými lze přechod provést.

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9UsFu2zAM/RVCl6Zo4nhYd/GcAtvQQ3fYhq1HXTSFydTKkiDJbjLD/z5KMrKgLXoTHx/5+CiO7JNz1dAja1gbpFcuQsDYuxtuVOesjzCCxx1MsPO2gwuiXnzkhhtpTYggbW8ibBJlUV/mBJXfmYh+EHqxuITNDYzcQGFWBPZ4dUXEaQnv6jrXtOuiTJoUROycFhEpAmi3agCpRQgbzp68cA49ZyV174UJKiprckxIcMJA84hHImc9oo7jPOQ0kQ4RSvH6WXW7JiV6teszfQpDPGqEIK3DLSGpQbazsyaugvqLDVx77JIhbqp5wsxwtrRvPFI7NWDhEGtYYVrQSsgELzOiUQw4I2Vh8TRgA9YJqeIR6upDABQh9TpTAPE7WN3HlxLp084Foi3N54YN1KWEVpOMkkO2ZJHsmp3aVw/BGjqMXJE22jml0X93STRw1pReKSe0tk9fMxZ9nzwVXP5B+fgK/hAOCePsh8dAt4KcnXJR+D3S16X07a9veKD3KdnZba+J/UbyJ+Zl0IyF9rk3Wxr7jJenvcvnrcz+PtweItKuZ1Np0MScMp8zOvkvb1j/P+776jrX0UbZ9A+fYSTP)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9U8tu2zAQ/JUFTwkSyw6aXlQ7QB85pIe2aHPUhZHWDhOKJMiVYtfwv3dJSpbbBgEMWJydndkdUXvx0bmi71CUYhlqrxzdVAa3znqCBtey0wT7ygA0kuTZeX4G8EidN+MJoLadoRKuLkdAGULfS12C6bSGDB/i3yFx2tiAzaRIjyoUYxesICDdDaczZq1uJrNETY4XFx8G5Uu4WiwW55PBA66txy8YyNvdZFNrlP4o/Jdpbq4M/5bzYxZ8IGydloR8Alg2qmcVGcKqEi9eOoe+EqnExXsvTVCkrBkQxoKTBspn3HFDmprp+32ODA4H9mLCKDD/R2E5Zz9+Ws5PpuBjoJ1GCLV12DASJdKGa2toFtRvLOHaY8vx8DrFMGdiOJvlS48sp3rMHGb1M4xRzGQdYU6REY6rxwHJGdJxwBKsk7WiHSyK9wFQhqh14gDyIVjd0f8Wa2/bUwOyWXwQLGGRWzicuChvKC4F8bpmrTbFU7CGL2zqiJm2Tmn03100DZUox5ddCam1ffmaMPJd3Cnj9SPWz6/gT2EbsUr88Bj4VmAljjWSfoP88mL59tc33PLzsdjaptPMfqP4E1MYPGOmfepMw2Of8NK0d238+JTZ3IfbLSFnPSwVB53udyX4q/38xurTuO+K6/Fqi8MffqhR/A==)

</div>

---

**Související**

- [API reference pro `<Transition>`](/api/built-in-components#transition)
