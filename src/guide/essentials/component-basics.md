# Základy komponent {#components-basics}

Komponenty nám umožňují rozdělit UI na nezávislé a znovupoužitelné části a přemýšlet o každé části samostatně. Je běžné, že je aplikace organizována do stromu vnořených komponent:

![Strom komponent](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

Je to velmi podobné tomu, jak vnořujeme nativní HTML elementy, ale Vue implementuje svůj vlastní model komponent, který nám umožňuje zapouzdřit do každé komponenty její vlastní obsah a logiku. Vue také funguje dobře s nativními Web Components. Pokud vás zajímá vztah mezi Vue komponentami a nativními Web Components, [přečtěte si více zde](/guide/extras/web-components).

## Definice komponenty {#defining-a-component}

Při použití build fáze obvykle definujeme každou Vue komponentu ve vyhrazeném souboru pomocí přípony `.vue` - známém jako [Single-File komponenta](/guide/scaling-up/sfc) (zkráceně SFC):

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>

Když nepoužíváte build fázi, lze Vue komponentu definovat jako prostý JavaScript objekt obsahující vlastnosti specifické pro Vue:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // nebo `template: '#my-template-element'`
}
```

</div>

Šablona je zde vložena inline jako JavaScript string, který Vue za běhu zkompiluje. Můžete také použít ID selektor ukazující na element (obvykle nativní `<template>` elementy) – Vue použije jeho obsah jako zdroj pro šablonu.

Výše uvedený příklad definuje jednu komponentu a exportuje ji jako default export souboru `.js`. Můžete však použít pojmenované exporty (named exports) k exportu více komponent ze stejného souboru.

## Použití komponenty {#using-a-component}

:::tip
Ve zbytku tohoto průvodce budeme používat SFC syntaxi – koncepty týkající se komponent jsou stejné bez ohledu na to, zda build fázi používáte nebo ne. Sekce [Příklady](/examples/) ukazuje použití komponent v obou scénářích.
:::

Abychom mohli použít komponentu potomka, musíme ji do komponenty rodiče importovat. Za předpokladu, že jsme naši komponentu "counter" tlačítka umístili do souboru s názvem `ButtonCounter.vue`, bude tato komponenta vystavena jako default export souboru:

<div class="options-api">

```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

Abychom mohli importovanou komponentu vystavit pro naší šablonu, musíme ji [zaregistrovat](/guide/components/registration) prostřednictvím oddílu `components`. Komponenta pak bude dostupná jako tag s názvem klíče, pod kterým je registrována.

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

S využitím `<script setup>` budou importované komponenty v šabloně dostupné automaticky.

</div>

Je také možné zaregistrovat komponentu globálně a zpřístupnit ji všem komponentám v dané aplikaci, aniž byste ji museli importovat. Klady a zápory globální vs. lokální registrace jsou rozebírány ve vyhrazené části [Registrace komponent](/guide/components/registration).

Komponenty lze použít opakovaně kolikrát budete chtít:

```vue-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCdXR0b25Db3VudGVyIGZyb20gJy4vQnV0dG9uQ291bnRlci52dWUnXG4gIFxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7XG4gICAgQnV0dG9uQ291bnRlclxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8aDE+SGVyZSBhcmUgbWFueSBjaGlsZCBjb21wb25lbnRzITwvaDE+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJCdXR0b25Db3VudGVyLnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50OiAwXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj5cbiAgICBZb3UgY2xpY2tlZCBtZSB7eyBjb3VudCB9fSB0aW1lcy5cbiAgPC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBCdXR0b25Db3VudGVyIGZyb20gJy4vQnV0dG9uQ291bnRlci52dWUnXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8aDE+SGVyZSBhcmUgbWFueSBjaGlsZCBjb21wb25lbnRzITwvaDE+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJCdXR0b25Db3VudGVyLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGNvdW50ID0gcmVmKDApXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj5cbiAgICBZb3UgY2xpY2tlZCBtZSB7eyBjb3VudCB9fSB0aW1lcy5cbiAgPC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

</div>

Všimněte si, že při kliknutí na tlačítka si každé z nich zachovává svůj vlastní, samostatný `count`. Je to proto, že pokaždé, když komponentu použijete, vytvoří se její nová **instance**.

V SFC se doporučuje používat `PascalCase` pro názvy tagů podřízených komponent, aby se odlišily od nativních HTML elementů. Přestože nativní názvy HTML elementů nerozlišují malá a velká písmena, Vue SFC je kompilovaný formát, takže v něm názvy rozlišující malá a velká písmena používat můžete. K uzavření tagu můžeme také použít `/>`.

Pokud vaše šablony vytváříte přímo v DOM (např. jako obsah nativního elementu `<template>`), bude šablona při analýze HTML podléhat nativnímu chování prohlížeče. V takových případech budete muset pro názvy komponent použít `kebab-case` a explicitní uzavírací tagy:

```vue-html
<!-- pokud je šablona napsaná v DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Pro více detailů se podívejte na [upozornění na omezení při anlýze DOM-šablon](#dom-template-parsing-caveats).

## Předávání vlastností (props) {#passing-props}

Pokud vytváříme blog, budeme pravděpodobně potřebovat komponentu představující příspěvek na blogu. Chceme, aby všechny příspěvky sdílely stejné vizuální rozvržení, ale s jiným obsahem. Taková komponenta nebude užitečná, pokud jí nebudete moci předat data, jako je název a obsah konkrétního příspěvku, který chceme zobrazit. Zde přicházejí na řadu vlastnosti (props).

Props jsou vlastní atributy, které můžete na komponentě zaregistrovat. Abychom naší komponentě předali název blogového příspěvku, musíme jej deklarovat v seznamu vlastností, které tato komponenta přijímá, pomocí <span class="options-api">[`props`](/api/options-state.html# možnost props)</span><span class="composition-api">makra [`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

Když je hodnota předána prop atributu, stane se vlastností této instance komponenty. Hodnota této vlastnosti je přístupná v rámci šablony a v kontextu `this` komponenty, stejně jako jakákoli jiná její vlastnost.

</div>
<div class="composition-api">

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` je compile-time makro, které je dostupné pouze ve `<script setup>` a nemusí být explicitně importováno. Deklarované vlastnosti jsou automaticky zpřístupněny šabloně. `defineProps` také vrátí objekt, který obsahuje všechny vlastnosti předané komponentě, takže k nim můžeme v případě potřeby přistupovat v JavaScriptu:

```js
const props = defineProps(['title'])
console.log(props.title)
```

Viz také: [Typování Component Props](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

Pokud nepoužíváte `<script setup>`, props by měly být deklarovány pomocí sekce `props` a props objekt předán funkci `setup()` jako první parametr:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

Komponenta může mít tolik props, kolik chcete, a ve výchozím nastavení lze libovolné z nich předat libovolnou hodnotu.

Jakmile je prop zaregistrována, můžete jí předávat data skrz vlastní atribut, například takto:

```vue-html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

V typické aplikaci však pravděpodobně budete mít v komponentě rodiče pole příspěvků:

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
```

</div>

A potom pro každý z nich vykreslit jeho vlastní kompomentu pomocí `v-for`:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHtcbiAgICBCbG9nUG9zdFxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3N0czogW1xuICAgICAgICB7IGlkOiAxLCB0aXRsZTogJ015IGpvdXJuZXkgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIHRpdGxlOiAnQmxvZ2dpbmcgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIHRpdGxlOiAnV2h5IFZ1ZSBpcyBzbyBmdW4nIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxCbG9nUG9zdFxuICBcdHYtZm9yPVwicG9zdCBpbiBwb3N0c1wiXG5cdCAgOmtleT1cInBvc3QuaWRcIlxuICBcdDp0aXRsZT1cInBvc3QudGl0bGVcIlxuXHQ+PC9CbG9nUG9zdD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BzOiBbJ3RpdGxlJ11cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxoND57eyB0aXRsZSB9fTwvaDQ+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5jb25zdCBwb3N0cyA9IHJlZihbXG4gIHsgaWQ6IDEsIHRpdGxlOiAnTXkgam91cm5leSB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMiwgdGl0bGU6ICdCbG9nZ2luZyB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMywgdGl0bGU6ICdXaHkgVnVlIGlzIHNvIGZ1bicgfVxuXSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxCbG9nUG9zdFxuICBcdHYtZm9yPVwicG9zdCBpbiBwb3N0c1wiXG5cdCAgOmtleT1cInBvc3QuaWRcIlxuICBcdDp0aXRsZT1cInBvc3QudGl0bGVcIlxuXHQ+PC9CbG9nUG9zdD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5kZWZpbmVQcm9wcyhbJ3RpdGxlJ10pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8aDQ+e3sgdGl0bGUgfX08L2g0PlxuPC90ZW1wbGF0ZT4ifQ==)

</div>

Všimněte si, jak je k předávání dynamických prop hodnot použitá direktiva `v-bind`. To je užitečné zejména tehdy, když předem přesně nevíte, jaký obsah se chystáte vykreslit.

To je zatím vše, co o props potřebujete vědět. Poté, co si přečtete tuto stránku a budete se s jejím obsahem cítit seznámeni, však doporučujeme později se vrátit a přečíst si úplného [Props průvodce](/guide/components/props).

## Naslouchání událostem (events) {#listening-to-events}

Jak vyvíjíme naši komponentu `<BlogPost>`, některé funkce mohou vyžadovat zpětnou komunikaci do komponenty rodiče. Můžeme se například rozhodnout zahrnout funkci usnadnění pro zvětšení textu blogových příspěvků, zatímco zbytek stránky ponecháme ve výchozí velikosti.

V komponentně rodiče můžeme tuto funkci podporovat přidáním <span class="options-api">proměnné v secki data</span><span class="composition-api">ref hodnoty</span> `postFontSize`:

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

Která může být použita v šabloně k ovládání velikosti písma všech blogových příspěvků:

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Nyní pojďme přidat tlačítko do šablony `<BlogPost>` komponenty:

```vue{5}
<!-- BlogPost.vue, s vynecháním <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Enlarge text</button>
  </div>
</template>
```

Tlačítko zatím nic nedělá – chceme kliknutím na tlačítko sdělit komponentně rodiče, že má zvětšit text všech příspěvků. K vyřešení tohoto problému poskytují komponenty vlastní systém událostí (events). Rodič se může rozhodnout poslouchat libovolnou událost na instanci komponenty potomka pomocí `v-on` nebo `@`, stejně jako bychom to dělali s nativní událostí DOM:

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

Potom může komponenta potomka vyvolat událost sama na sobě voláním vestavěné metody [**`$emit`**](/api/component-instance#emit) a předáním názvu události:

```vue{5}
<!-- BlogPost.vue, s vynecháním <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

Díky event listeneru `@enlarge-text="postFontSize += 0.1"` obdrží rodičovská komponenta volání a provede aktualizaci hodnoty `postFontSize`.

<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHtcbiAgICBCbG9nUG9zdFxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3N0czogW1xuICAgICAgICB7IGlkOiAxLCB0aXRsZTogJ015IGpvdXJuZXkgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIHRpdGxlOiAnQmxvZ2dpbmcgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIHRpdGxlOiAnV2h5IFZ1ZSBpcyBzbyBmdW4nIH1cbiAgICAgIF0sXG4gICAgICBwb3N0Rm9udFNpemU6IDFcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgOnN0eWxlPVwieyBmb250U2l6ZTogcG9zdEZvbnRTaXplICsgJ2VtJyB9XCI+XG4gICAgPEJsb2dQb3N0XG4gICAgICB2LWZvcj1cInBvc3QgaW4gcG9zdHNcIlxuICAgICAgOmtleT1cInBvc3QuaWRcIlxuICAgICAgOnRpdGxlPVwicG9zdC50aXRsZVwiXG4gICAgICBAZW5sYXJnZS10ZXh0PVwicG9zdEZvbnRTaXplICs9IDAuMVwiXG4gICAgPjwvQmxvZ1Bvc3Q+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQmxvZ1Bvc3QudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcHM6IFsndGl0bGUnXSxcbiAgZW1pdHM6IFsnZW5sYXJnZS10ZXh0J11cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJibG9nLXBvc3RcIj5cblx0ICA8aDQ+e3sgdGl0bGUgfX08L2g0PlxuXHQgIDxidXR0b24gQGNsaWNrPVwiJGVtaXQoJ2VubGFyZ2UtdGV4dCcpXCI+RW5sYXJnZSB0ZXh0PC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4ifQ==)

</div>
<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5jb25zdCBwb3N0cyA9IHJlZihbXG4gIHsgaWQ6IDEsIHRpdGxlOiAnTXkgam91cm5leSB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMiwgdGl0bGU6ICdCbG9nZ2luZyB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMywgdGl0bGU6ICdXaHkgVnVlIGlzIHNvIGZ1bicgfVxuXSlcblxuY29uc3QgcG9zdEZvbnRTaXplID0gcmVmKDEpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8ZGl2IDpzdHlsZT1cInsgZm9udFNpemU6IHBvc3RGb250U2l6ZSArICdlbScgfVwiPlxuICAgIDxCbG9nUG9zdFxuICAgICAgdi1mb3I9XCJwb3N0IGluIHBvc3RzXCJcbiAgICAgIDprZXk9XCJwb3N0LmlkXCJcbiAgICAgIDp0aXRsZT1cInBvc3QudGl0bGVcIlxuICAgICAgQGVubGFyZ2UtdGV4dD1cInBvc3RGb250U2l6ZSArPSAwLjFcIlxuICAgID48L0Jsb2dQb3N0PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5kZWZpbmVQcm9wcyhbJ3RpdGxlJ10pXG5kZWZpbmVFbWl0cyhbJ2VubGFyZ2UtdGV4dCddKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImJsb2ctcG9zdFwiPlxuICAgIDxoND57eyB0aXRsZSB9fTwvaDQ+XG4gICAgPGJ1dHRvbiBAY2xpY2s9XCIkZW1pdCgnZW5sYXJnZS10ZXh0JylcIj5FbmxhcmdlIHRleHQ8L2J1dHRvbj5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPiJ9)

</div>

Vysílané (emit) události můžeme nepovinně deklarovat s pomocí <span class="options-api">oddílu [`emits`](/api/options-state#emits)</span><span class="composition-api">makra [`defineEmits`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue{5}
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{4}
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

To dokumentuje všechny události, které komponenta vysílá, a volitelně [je ověřuje](/guide/components/events#events-validation). Také to Vue umožňuje vyhnout se jejich implicitnímu použití jako nativních event listenerů na kořenovém prvku komponenty potomka.

<div class="composition-api">

Stejně jako `defineProps`, je i `defineEmits` použitelné pouze ve `<script setup>` a není třeba ho importovat. Vrací funkci `emit`, která je ekvivalentní metodě `$emit`. Může být použita k vyvolání událostí uvnitř sekce `<script setup>` v komponentě, kde není `$emit` přímo dostupné:

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

Viz také: [Typování Component Emits](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

Pokud nepoužíváte `<script setup>`, můžete deklarovat emitované události prostřectvím oddílu `emits`. K funkci `emit` můžete přistuput jako k vlastnosti setup kontextu (předávaný do `setup()` jako druhý parametr):

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

To je zatím vše, co potřebujete vědět o vlastních událostech komponenty. Poté, co si přečtete tuto stránku a budete se s jejím obsahem cítit seznámeni, však doporučujeme později se vrátit a přečíst si úplného [Custom Events průvodce](/guide/components/events).

## Distribuce obsahu pomocí slotů (slots) {#content-distribution-with-slots}

Stejně jako u HTML elementů je často užitečné mít možnost předat obsah komponentě, jako je tato:

```vue-html
<AlertBox>
  Stala se chyba.
</AlertBox>
```

Což by mohlo vykreslit něco jako:

:::danger Toto je chyba pro testovací účely
Stala se chyba.
:::

Toho lze dosáhnout použitím speciálního Vue elementu `<slot>`:

```vue{4}
<template>
  <div class="alert-box">
    <strong>Toto je chyba pro testovací účely</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

Jak vidíte výše, používáme `<slot>` jako zástupný symbol v místě, kde chceme umístit obsah - a to je vše. Máme hotovo!

<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBBbGVydEJveCBmcm9tICcuL0FsZXJ0Qm94LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQWxlcnRCb3ggfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PEFsZXJ0Qm94PlxuICBcdFNvbWV0aGluZyBiYWQgaGFwcGVuZWQuXG5cdDwvQWxlcnRCb3g+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJBbGVydEJveC52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJhbGVydC1ib3hcIj5cbiAgICA8c3Ryb25nPkVycm9yITwvc3Ryb25nPlxuICAgIDxici8+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c3R5bGUgc2NvcGVkPlxuLmFsZXJ0LWJveCB7XG4gIGNvbG9yOiAjNjY2O1xuICBib3JkZXI6IDFweCBzb2xpZCByZWQ7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgcGFkZGluZzogMjBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjhmODtcbn1cbiAgXG5zdHJvbmcge1xuXHRjb2xvcjogcmVkOyAgICBcbn1cbjwvc3R5bGU+In0=)

</div>
<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBBbGVydEJveCBmcm9tICcuL0FsZXJ0Qm94LnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxBbGVydEJveD5cbiAgXHRTb21ldGhpbmcgYmFkIGhhcHBlbmVkLlxuXHQ8L0FsZXJ0Qm94PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQWxlcnRCb3gudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiYWxlcnQtYm94XCI+XG4gICAgPHN0cm9uZz5FcnJvciE8L3N0cm9uZz5cbiAgICA8YnIvPlxuICAgIDxzbG90IC8+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlIHNjb3BlZD5cbi5hbGVydC1ib3gge1xuICBjb2xvcjogIzY2NjtcbiAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOGY4Zjg7XG59XG4gIFxuc3Ryb25nIHtcblx0Y29sb3I6IHJlZDsgICAgXG59XG48L3N0eWxlPiJ9)

</div>

To je zatím vše, co potřebujete vědět o slotech. Poté, co si přečtete tuto stránku a budete se s jejím obsahem cítit seznámeni, však doporučujeme později se vrátit a přečíst si úplného [Slots průvodce](/guide/components/slots).

## Dynamické komponenty {#dynamic-components}

Někdy je užitečné mezi komponentami dynamicky přepínat, například v rozhraní s více taby:

<div class="options-api">

[Otevřít příklad (Vue SFC Playground)](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgUG9zdHMgZnJvbSAnLi9Qb3N0cy52dWUnXG5pbXBvcnQgQXJjaGl2ZSBmcm9tICcuL0FyY2hpdmUudnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIEhvbWUsXG4gICAgUG9zdHMsXG4gICAgQXJjaGl2ZVxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50VGFiOiAnSG9tZScsXG4gICAgICB0YWJzOiBbJ0hvbWUnLCAnUG9zdHMnLCAnQXJjaGl2ZSddXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGVtb1wiPlxuICAgIDxidXR0b25cbiAgICAgICB2LWZvcj1cInRhYiBpbiB0YWJzXCJcbiAgICAgICA6a2V5PVwidGFiXCJcbiAgICAgICA6Y2xhc3M9XCJbJ3RhYi1idXR0b24nLCB7IGFjdGl2ZTogY3VycmVudFRhYiA9PT0gdGFiIH1dXCJcbiAgICAgICBAY2xpY2s9XCJjdXJyZW50VGFiID0gdGFiXCJcbiAgICAgPlxuICAgICAge3sgdGFiIH19XG4gICAgPC9idXR0b24+XG5cdCAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50VGFiXCIgY2xhc3M9XCJ0YWJcIj48L2NvbXBvbmVudD5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c3R5bGU+XG4uZGVtbyB7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZWVlO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIHBhZGRpbmc6IDIwcHggMzBweDtcbiAgbWFyZ2luLXRvcDogMWVtO1xuICBtYXJnaW4tYm90dG9tOiA0MHB4O1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgb3ZlcmZsb3cteDogYXV0bztcbn1cblxuLnRhYi1idXR0b24ge1xuICBwYWRkaW5nOiA2cHggMTBweDtcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogM3B4O1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogM3B4O1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQ6ICNmMGYwZjA7XG4gIG1hcmdpbi1ib3R0b206IC0xcHg7XG4gIG1hcmdpbi1yaWdodDogLTFweDtcbn1cbi50YWItYnV0dG9uOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogI2UwZTBlMDtcbn1cbi50YWItYnV0dG9uLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQ6ICNlMGUwZTA7XG59XG4udGFiIHtcbiAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgcGFkZGluZzogMTBweDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkhvbWUudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwidGFiXCI+XG4gICAgSG9tZSBjb21wb25lbnRcbiAgPC9kaXY+XG48L3RlbXBsYXRlPiIsIlBvc3RzLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInRhYlwiPlxuICAgIFBvc3RzIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiQXJjaGl2ZS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJ0YWJcIj5cbiAgICBBcmNoaXZlIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+In0=)

</div>
<div class="composition-api">

[Otevřít příklad (Vue SFC Playground)](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgUG9zdHMgZnJvbSAnLi9Qb3N0cy52dWUnXG5pbXBvcnQgQXJjaGl2ZSBmcm9tICcuL0FyY2hpdmUudnVlJ1xuaW1wb3J0IHsgcmVmIH0gZnJvbSAndnVlJ1xuIFxuY29uc3QgY3VycmVudFRhYiA9IHJlZignSG9tZScpXG5cbmNvbnN0IHRhYnMgPSB7XG4gIEhvbWUsXG4gIFBvc3RzLFxuICBBcmNoaXZlXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGVtb1wiPlxuICAgIDxidXR0b25cbiAgICAgICB2LWZvcj1cIihfLCB0YWIpIGluIHRhYnNcIlxuICAgICAgIDprZXk9XCJ0YWJcIlxuICAgICAgIDpjbGFzcz1cIlsndGFiLWJ1dHRvbicsIHsgYWN0aXZlOiBjdXJyZW50VGFiID09PSB0YWIgfV1cIlxuICAgICAgIEBjbGljaz1cImN1cnJlbnRUYWIgPSB0YWJcIlxuICAgICA+XG4gICAgICB7eyB0YWIgfX1cbiAgICA8L2J1dHRvbj5cblx0ICA8Y29tcG9uZW50IDppcz1cInRhYnNbY3VycmVudFRhYl1cIiBjbGFzcz1cInRhYlwiPjwvY29tcG9uZW50PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbi5kZW1vIHtcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgcGFkZGluZzogMjBweCAzMHB4O1xuICBtYXJnaW4tdG9wOiAxZW07XG4gIG1hcmdpbi1ib3R0b206IDQwcHg7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBvdmVyZmxvdy14OiBhdXRvO1xufVxuXG4udGFiLWJ1dHRvbiB7XG4gIHBhZGRpbmc6IDZweCAxMHB4O1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAzcHg7XG4gIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAzcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZDogI2YwZjBmMDtcbiAgbWFyZ2luLWJvdHRvbTogLTFweDtcbiAgbWFyZ2luLXJpZ2h0OiAtMXB4O1xufVxuLnRhYi1idXR0b246aG92ZXIge1xuICBiYWNrZ3JvdW5kOiAjZTBlMGUwO1xufVxuLnRhYi1idXR0b24uYWN0aXZlIHtcbiAgYmFja2dyb3VuZDogI2UwZTBlMDtcbn1cbi50YWIge1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBwYWRkaW5nOiAxMHB4O1xufVxuPC9zdHlsZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiSG9tZS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJ0YWJcIj5cbiAgICBIb21lIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiUG9zdHMudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwidGFiXCI+XG4gICAgUG9zdHMgY29tcG9uZW50XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJBcmNoaXZlLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInRhYlwiPlxuICAgIEFyY2hpdmUgY29tcG9uZW50XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4ifQ==)

</div>

Výše uvedené je možné s použitím Vue elementu `<component>` a jeho speciálního atributu `is`:

<div class="options-api">

```vue-html
<!-- Komponenta se změní, když se změní `currentTab` -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- Komponenta se změní, když se změní `currentTab` -->
<component :is="tabs[currentTab]"></component>
```

</div>

V předchozím příkladu může hodnota předávaná do `:is` obsahovat:

- string se jménem registrované komponenty, NEBO
- vlastní importovaný objekt komponenty

Atribut `is` můžete také použít pro vytváření běžných HTML elementů.

Při přepínání mezi více komponentami pomocí `<component :is="...">` bude komponenta odpojena (unmounted), když je z ní přepnuto jinam. Neaktivní komponenty můžete donutit, aby zůstaly "naživu" pomocí vestavěné [komponenty `<KeepAlive>`](/guide/built-ins/keep-alive).

## Omezení při anlýze DOM-šablon {#dom-template-parsing-caveats}

Pokud píšete své Vue šablony přímo v DOM, Vue bude muset definici šablony (string template) z DOM načíst. To vede k určitým omezením kvůli chování prohlížečů při nativní analýze HTML.

:::tip
Je třeba poznamenat, že níže popsaná omezení platí pouze v případě, že své šablony píšete přímo v DOM. NEPLATÍ, pokud používáte string templates z následujících zdrojů:

- Single-File komponenty (SFC)
- Inlined template strings (např. `template: '...'`)
- `<script type="text/x-template">`
  :::

### Necitlivost na malá a velká písmena {#case-insensitivity}

HTML tagy a názvy atributů nerozlišují velká a malá písmena, takže prohlížeče budou všechna velká písmena interpretovat jako malá. To znamená, že když používáte DOM-šablony, PascalCase názvy komponent a camelCased názvy vlastností (pros) nebo názvy `v-on` událostí (events), musí všechny používat jejich ekvivalenty ve formátu kebab-case (oddělené pomlčkou):

```js
// camelCase in JavaScript
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- kebab-case in HTML -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### Samouzavírací tagy {#self-closing-tags}

V předchozích ukázkách kódu jsme pro komponenty používali samouzavírací tagy:

```vue-html
<MyComponent />
```

Je to proto, že parser Vue šablon respektuje `/>` jako indikaci ukončení jakéhokoliv tagu, bez ohledu na jeho typ.

V DOM-šablonách však musíme vždy zahrnout explicitní uzavírací tagy:

```vue-html
<my-component></my-component>
```

Je to proto, že specifikace HTML umožňuje pouze [několika konkrétním prvkům](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) vynechat uzavírací tag, nejběžnější jsou `<input> ` a `<img>`. Pokud u všech ostatních prvků uzavírací tag vynecháte, nativní HTML parser si bude myslet, že jste úvodní tag nikdy neukončili. Například následující kus kódu:

```vue-html
<my-component /> <!-- zde chceme tag ukončit... -->
<span>hello</span>
```

Bude vyhodnocen jako:

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- prohlížeč ho však ukončí až tady -->
```

### Omezení umístění elementů {#element-placement-restrictions}

Některé HTML elementy, jako jsou `<ul>`, `<ol>`, `<table>` a `<select>` mají omezení ohledně toho, jaké prvky se v nich mohou objevit, a některé elementy jako `<li>`, `<tr>` a `<option>` se mohou objevit pouze uvnitř určitých jiných elementů.

To povede k problémům při používání komponent s elementy, které mají taková omezení. Například:

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

Naše komponenta `<blog-post-row>` bude vytažena (hoisted) jako neplatný obsah, což v případném vykresleném výstupu způsobí chyby. Toto můžeme obejít s použitím speciálního [atributu `is`](/api/built-in-special-attributes#is):

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
Při použití na nativní HTML elementy musí být hodnota `is` uvedena předponou `vue:`, aby mohla být interpretována jako Vue komponenta. Je to nutné, aby nedošlo k záměně s nativními [přizpůsobenými vestavěnými elementy](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example).
:::

To je vše, co zatím potřebujete vědět o omezeních při analýze DOM-šablon – a vlastně konec _Základů_ Vue. Gratulujeme! Je stále co se učit, ale nejprve doporučujeme, abyste si udělali přestávku a sami si s Vue hráli – vytvořit něco zábavného, nebo se podívat na některé [Příklady](/examples/), pokud jste tak ještě neučinili.

Jakmile si budete jisti znalostmi, které jste právě nabrali, pokračujte v průvodci, abyste se o komponentách dozvěděli více do hloubky.
