<script setup>
import ListBasic from './transition-demos/ListBasic.vue'
import ListMove from './transition-demos/ListMove.vue'
import ListStagger from './transition-demos/ListStagger.vue'
</script>

# TransitionGroup {#transitiongroup}

`<TransitionGroup>` je vestavěná komponenta určená pro animaci vkládání, odstraňování a změny pořadí prvků nebo komponent, které jsou vykreslovány v seznamu.

## Rozdíly oproti `<Transition>` {#differences-from-transition}

`<TransitionGroup>` podporuje stejné vlastnosti, CSS třídy přechodu a listenery JavaScriptových událostí jako `<Transition>`, s následujícími rozdíly:

- Výchozí nastavení nevykresluje obalující element. Můžete však specifikovat element, který bude vykreslen, pomocí vlastnosti `tag`.

- [Režimy přechodu](./transition#transition-modes) nejsou k dispozici, protože již nepřepínáme mezi navzájem exkluzivními elementy.

- Prvky uvnitř **musí vždy** mít unikátní atribut `key`.

- CSS třídy přechodu jsou aplikovány na jednotlivé prvky v seznamu, **nikoli** na skupinu / kontejner samotný.

:::tip
Při použití v [in-DOM šablonách](/guide/essentials/component-basics#in-dom-template-parsing-caveats) by měl být použit zápis `<transition-group>`.
:::

## Přechody při vstupu / odchodu {#enter-leave-transitions}

Zde je příklad použití přechodů při vstupu na / odchodu ze seznamu vytvořeného pomocí `v-for` s využitím `<TransitionGroup>`:

```vue-html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

<ListBasic />

## Přechody při pohybu {#move-transitions}

Výše uvedený příklad má několik zjevných nedostatků: když je prvek vložen nebo odstraněn, okolní prvky místo plynulého pohybu okamžitě „skočí“ na své místo. To můžeme opravit přidáním několika dalších CSS pravidel:

```css{1,13-17}
.list-move, /* aplikuj přechod na pohybující se prvky */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* zajistí, že odcházející prvky jsou vyjmuty z layout flow, 
aby bylo možné správně vypočítat pohybové animace */
.list-leave-active {
  position: absolute;
}
```

Teď to vypadá mnohem lépe. Dokonce se plynule animuje, když je celý seznam zamíchán:

<ListMove />

[Celý příklad](/examples/#list-transition)

### Vlastní třídy přechodu {#custom-transition-classes}

Předáním vlastnosti `moveClass` do `<TransitionGroup>` můžete definovat vlastní třídy přechodu (transition classes) pro přesun elementu, podobně jako u [komponenty `<Transition>`](/guide/built-ins/transition.html#custom-transition-classes).

## Posunuté přechody seznamu {#staggering-list-transitions}

Komunikací s třídami přechodu pomocí datových atributů je také možné přechody v&nbsp;seznamu posunout (stagger). Nejprve vykreslíme index položky jako datový atribut DOM elementu:

```vue-html{11}
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    v-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
```

Poté pomocí JavaScript událostí animujeme prvek s prodlevou založenou na datovém atributu. Tento příklad používá pro provedení animace knihovnu [GSAP](https://gsap.com/):

```js{5}
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```

<ListStagger />

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqlVMuu0zAQ/ZVRNklRm7QLWETtBW4FSFCxYkdYmGSSmjp28KNQVfl3xk7SFyvEponPGc+cOTPNOXrbdenRYZRHa1Nq3lkwaF33VEjedkpbOIPGeg6lajtnsYIeaq1aiOlSfAlqDOtG3L8SUchSSWNBcPrZwNdCAqVqTZND/KxdibBDjKGf3xIfWXngCNs9k4/Udu/KA3xWWnPz1zW0sOOP6CcnG3jv9ImIQn67SvrpUJ9IE/WVxPHsSkw97gbN0zFJZrB5grNPrskcLUNXac2FRZ0k3GIbIvxLSsVTq3bqF+otM5jMUi5L4So0SSicHplwOKOyfShdO1lariQo+Yy10vhO+qwoZkNFFKmxJ4Gp6ljJrRe+vMP3yJu910swNXqXcco1h0pJHDP6CZHEAAcAYMydwypYCDAkJRdX6Sts4xGtUDAKotIVs9Scpd4q/A0vYJmuXo5BSm7JOIEW81DVo77VR207ZEf8F23LB23T+X9VrbNh82nn6UAz7ASzSCeANZe0AnBctIqqbIoojLCIIBvoL5pJw31DH7Ry3VDKsoYinSii4ZyXxhBQM2Fwwt58D7NeoB8QkXfDvwRd2XtceOsCHkwc8KCINAk+vADJppQUFjZ0DsGVGT3uFn1KSjoPeKLoaYtvCO/rIlz3vH9O5FiU/nXny/pDT6YGKZngg0/Zg1GErrMbp6N5NHxJFi3N/4dRkj5IYf5ULxCmiPJpI4rIr4kHimhvbWfyLHOyOzQpNZZ57jXNy4nRGFLTR/0fWBqe7w==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqtVE2P0zAQ/SujXNqgNmkPcIjaBbYCJKg4cSMcTDJNTB07+KNsVfW/M3aabNpyQltViT1vPPP8Zian6H3bJgeHURatTKF5ax9yyZtWaQuVYS3stGpg4peTXOayUNJYEJwea/ieS4ATNKbKYPKoXYGwRZzAeTYGPrNizxE2NZO30KZ2xR6+Kq25uTuGFrb81vrFyQo+On0kIJc/PCV8CmxL3DEnLJy8e8ksm8bdGkCjdVr2O4DfDvWRgtGN/JYC0SOkKVTTOotl1jv3hi3d+DngENILkey4sKinU26xiWH9AH6REN/Eqq36g3rDDE7jhMtCuBLN1NbcJIFEHN9RaNDWqjQDAyUfcac0fpA+CYoRCRSJsUeBiWpZwe2RSrK4w2rkVe2rdYG6LD5uH3EGpZI4iuurTdwDNBjpRJclg+UlhP914UnMZfIGm8kIKVEwciYivhoGLQlQ4hO8gkWyfD1yVHJDKgu0mAUmPXLuxRkYb5Ed8H8YL/7BeGx7Oa6hkLmk/yodBoo21BKtYBZpB7DikroKDvNGUeZ1HoVmyCNIO/ibZtJwy5X8pJVru9CWVeTpRB51+6wwhgw7Jgz2tnc/Q6/M0ZeWwKvmGZye0Wu78PIGexC6swdGxEnw/q6HOYUkt9DwMwhKxfS6GpY+KPHc45G8+6EYAV7reTjucf/uwUtSmvvTME1wDuISlVTwTqf0RiiyrtKR0tEs6r5l84b645dRkr5zoT8oXwBMHg2Tlke+jbwhj2prW5OlqZPtvkroYqnH3lK9nLgI46scnf8Cn22kBA==)

</div>

---

**Související**

- [API reference pro `<TransitionGroup>`](/api/built-in-components#transitiongroup)
