# Základy komponent {#components-basics}

Komponenty nám umožňují rozdělit UI na nezávislé a znovupoužitelné části a přemýšlet o každé části samostatně. Je běžné, že je aplikace organizována do stromu vnořených komponent:

![Strom komponent](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

Je to velmi podobné tomu, jak vnořujeme nativní HTML elementy, ale Vue implementuje svůj vlastní model komponent, který nám umožňuje zapouzdřit do každé komponenty její vlastní obsah a logiku. Vue také dobře funguje s nativními Web Components. Pokud vás zajímá vztah mezi Vue komponentami a Web Components, [přečtěte si více zde](/guide/extras/web-components).

## Definice komponenty {#defining-a-component}

Při použití build fáze obvykle definujeme každou Vue komponentu ve vyhrazeném souboru pomocí přípony `.vue` – známém jako [Single-File komponenta](/guide/scaling-up/sfc) (zkráceně SFC):

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
  <button @click="count++">Klikli jste na mě {{ count }} krát.</button>
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
  <button @click="count++">Klikli jste na mě {{ count }} krát.</button>
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
      Klikli jste na mě {{ count }} krát.
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
      Klikli jste na mě {{ count }} krát.
    </button>`
  // může také adresovat in-DOM šablonu
  // template: '#my-template-element'
}
```

</div>

Šablona je zde vložena inline jako JavaScript string, který Vue za běhu zkompiluje. Můžete také použít ID selektor ukazující na element (obvykle nativní `<template>` elementy) – Vue použije jeho obsah jako zdroj pro šablonu.

Výše uvedený příklad definuje jednu komponentu a exportuje ji jako default export souboru `.js`. Můžete však použít pojmenované exporty (named exports) k exportu více komponent ze stejného souboru.

## Použití komponenty {#using-a-component}

:::tip
Ve zbytku tohoto průvodce budeme používat SFC syntaxi – koncepty týkající se komponent jsou stejné bez ohledu na to, zda build fázi používáte nebo ne.<br>Sekce [Příklady](/examples/) ukazuje použití komponent v obou scénářích.
:::

Abychom mohli použít komponentu potomka, musíme ji do komponenty rodiče importovat. Za předpokladu, že jsme naši komponentu „counter“ tlačítka umístili do souboru s názvem `ButtonCounter.vue`, bude tato komponenta vystavena jako default export souboru:

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
  <h1>Zde je komponenta potomka!</h1>
  <ButtonCounter />
</template>
```

Abychom mohli importovanou komponentu vystavit pro naší šablonu, musíme ji [zaregistrovat](/guide/components/registration) prostřednictvím možnosti `components`. Komponenta pak bude dostupná jako tag s názvem klíče, pod kterým je registrována.

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Zde je komponenta potomka!</h1>
  <ButtonCounter />
</template>
```

S využitím `<script setup>` budou importované komponenty v šabloně dostupné automaticky.

</div>

Je také možné zaregistrovat komponentu globálně a zpřístupnit ji všem komponentám v&nbsp;dané aplikaci, aniž byste ji museli importovat. Klady a zápory globální vs. lokální registrace jsou rozebírány ve vyhrazené části [Registrace komponent](/guide/components/registration).

Komponenty lze použít opakovaně, kolikrát budete chtít:

```vue-html
<h1>Zde jsou komponenty potomků!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

</div>

Všimněte si, že při kliknutí na tlačítka si každé z nich zachovává svůj vlastní, samostatný `count`. Je to proto, že pokaždé, když komponentu použijete, vytvoří se nová **instance**.

V SFC se pro názvy tagů podřízených komponent doporučuje používat `PascalCase`, aby se odlišily od nativních HTML elementů. Přestože nativní názvy HTML elementů malá a&nbsp;velká písmena nerozlišují, Vue SFC je kompilovaný formát, takže v něm názvy rozlišující malá a velká písmena používat můžete. K uzavření tagu můžeme také použít `/>`.

Pokud vaše šablony vytváříte přímo v DOM (např. jako obsah nativního elementu `<template>`), bude šablona při analýze HTML podléhat nativnímu chování prohlížeče. V&nbsp;takových případech budete muset pro názvy komponent použít `kebab-case` a&nbsp;explicitní uzavírací tagy:

```vue-html
<!-- pokud je šablona napsaná v DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Pro více detailů se podívejte na [upozornění na omezení při analýze in-DOM šablon](#in-dom-template-parsing-caveats).

## Předávání vlastností (props) {#passing-props}

Pokud vytváříme blog, budeme pravděpodobně potřebovat komponentu představující příspěvek na blogu. Chceme, aby všechny příspěvky sdílely stejné vizuální rozvržení, ale s jiným obsahem. Taková komponenta nebude užitečná, pokud jí nebudete moci předat data, jako je název a obsah konkrétního příspěvku, který chceme zobrazit. Zde přicházejí na řadu vlastnosti (props).

Props jsou vlastní atributy, které můžete na komponentě zaregistrovat. Abychom naší komponentě předali název blogového příspěvku, musíme jej deklarovat v seznamu vlastností, které tato komponenta přijímá, pomocí <span class="options-api">možnosti [`props`](/api/options-state#props)</span><span class="composition-api">makra [`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue
<!-- BlogPost.vue -->
<script>
export default {
  props: ['titulek']
}
</script>

<template>
  <h4>{{ titulek }}</h4>
</template>
```

Když je hodnota předána pomocí prop atributu, stane se vlastností této instance komponenty. Hodnota této vlastnosti je přístupná v rámci šablony a v kontextu `this` komponenty, stejně jako jakákoli jiná její vlastnost.

</div>
<div class="composition-api">

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['titulek'])
</script>

<template>
  <h4>{{ titulek }}</h4>
</template>
```

`defineProps` je makro překladače, které je dostupné pouze ve `<script setup>` a nemusí být explicitně importováno. Deklarované vlastnosti jsou automaticky zpřístupněny šabloně. `defineProps` také vrátí objekt, který obsahuje všechny vlastnosti předané komponentě, takže k nim můžeme v případě potřeby přistupovat v JavaScriptu:

```js
const props = defineProps(['titulek'])
console.log(props.titulek)
```

Viz také: [Typování vlastností komponenty](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

Pokud nepoužíváte `<script setup>`, props by měly být deklarovány pomocí možnosti `props` a props objekt předán funkci `setup()` jako první parametr:

```js
export default {
  props: ['titulek'],
  setup(props) {
    console.log(props.titulek)
  }
}
```

</div>

Komponenta může mít tolik props, kolik chcete, a ve výchozím nastavení lze libovolné z&nbsp;nich předat libovolnou hodnotu.

Jakmile je vlastnost zaregistrována, můžete jí předávat data skrz vlastní atribut, například takto:

```vue-html
<BlogPost titulek="Moje cesta k Vue" />
<BlogPost titulek="Blogování s Vue" />
<BlogPost titulek="Proč je Vue tak zábavné" />
```

V typické aplikaci však pravděpodobně budete mít v komponentě rodiče pole příspěvků:

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, titulek: 'Moje cesta k Vue' },
        { id: 2, titulek: 'Blogování s Vue' },
        { id: 3, titulek: 'Proč je Vue tak zábavné' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, titulek: 'Moje cesta k Vue' },
  { id: 2, titulek: 'Blogování s Vue' },
  { id: 3, titulek: 'Proč je Vue tak zábavné' }
])
```

</div>

A potom pro každý z nich vykreslit jeho vlastní komponentu pomocí `v-for`:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :titulek="post.titulek"
 />
```

<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

Všimněte si, jak je k předávání dynamických prop hodnot použitá zkrácená [`v-bind` syntaxe](/api/built-in-directives.html#v-bind) (`:titulek="post.titulek"`). To je užitečné zejména tehdy, když předem přesně nevíte, jaký obsah se chystáte vykreslit.

To je zatím vše, co o vlastnostech (props) potřebujete vědět. Poté, co si přečtete tuto stránku a budete se s jejím obsahem cítit seznámeni, však doporučujeme později se vrátit a přečíst si úplného [průvodce pro Vlastnosti (Props)](/guide/components/props).

## Naslouchání událostem (events) {#listening-to-events}

Jak vyvíjíme naši komponentu `<BlogPost>`, některé funkce mohou vyžadovat zpětnou komunikaci do komponenty rodiče. Můžeme se například rozhodnout zahrnout funkci usnadnění pro zvětšení textu blogových příspěvků, zatímco zbytek stránky ponecháme ve výchozí velikosti.

V komponentě rodiče můžeme tuto funkci podporovat přidáním <span class="options-api">proměnné `postFontSize` v možnosti `data`</span><span class="composition-api">ref hodnoty `postFontSize`</span>:

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
    :titulek="post.titulek"
   />
</div>
```

Nyní pojďme přidat tlačítko do šablony `<BlogPost>` komponenty:

```vue{5}
<!-- BlogPost.vue, s vynecháním <script> -->
<template>
  <div class="blog-post">
    <h4>{{ titulek }}</h4>
    <button>Zvětšit text</button>
  </div>
</template>
```

Tlačítko zatím nic nedělá – chceme kliknutím na tlačítko sdělit komponentě rodiče, že má zvětšit text všech příspěvků. K vyřešení tohoto problému poskytují komponenty vlastní systém událostí (events). Rodič se může rozhodnout poslouchat libovolnou událost na instanci komponenty potomka pomocí `v-on` nebo `@`, stejně jako bychom to dělali s nativní událostí DOM:

```vue-html{3}
<BlogPost
  ...
  @zvetsit-text="postFontSize += 0.1"
 />
```

Potom může komponenta potomka vyvolat událost sama na sobě voláním vestavěné metody [**`$emit`**](/api/component-instance#emit) a předáním názvu události:

```vue{5}
<!-- BlogPost.vue, s vynecháním <script> -->
<template>
  <div class="blog-post">
    <h4>{{ titulek }}</h4>
    <button @click="$emit('zvetsit-text')">Zvětšit text</button>
  </div>
</template>
```

Díky event listeneru `@zvetsit-text="postFontSize += 0.1"` obdrží komponenta rodiče volání a provede aktualizaci hodnoty `postFontSize`.

<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

</div>
<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

Vysílané (emit) události můžeme nepovinně deklarovat s pomocí <span class="options-api">možnosti [`emits`](/api/options-state#emits)</span><span class="composition-api">makra [`defineEmits`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue{5}
<!-- BlogPost.vue -->
<script>
export default {
  props: ['titulek'],
  emits: ['zvetsit-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{4}
<!-- BlogPost.vue -->
<script setup>
defineProps(['titulek'])
defineEmits(['zvetsit-text'])
</script>
```

</div>

To dokumentuje všechny události, které komponenta vysílá, a volitelně [je validuje](/guide/components/events#events-validation). Také to Vue umožňuje vyhnout se jejich implicitnímu použití jako nativních event listenerů na kořenovém prvku komponenty potomka.

<div class="composition-api">

Stejně jako `defineProps`, je i `defineEmits` použitelné pouze ve `<script setup>` a není třeba ho importovat. Vrací funkci `emit`, která je ekvivalentní metodě `$emit`. Může být použita k vyvolání událostí uvnitř `<script setup>` v komponentě, kde není `$emit` přímo dostupné:

```vue
<script setup>
const emit = defineEmits(['zvetsit-text'])

emit('zvetsit-text')
</script>
```

Viz také: [Typování emitovaných událostí komponenty](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

Pokud nepoužíváte `<script setup>`, můžete deklarovat emitované události prostřednictvím možnosti `emits`. K funkci `emit` můžete přistupit jako k vlastnosti setup kontextu (předávaný do `setup()` jako druhý parametr):

```js
export default {
  emits: ['zvetsit-text'],
  setup(props, ctx) {
    ctx.emit('zvetsit-text')
  }
}
```

</div>

To je zatím vše, co potřebujete vědět o vlastních událostech komponenty. Poté, co si přečtete tuto stránku a budete se s jejím obsahem cítit seznámeni, však doporučujeme později se vrátit a přečíst si úplného [průvodce pro Události komponent (Events)](/guide/components/events).

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
<!-- AlertBox.vue -->
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

Jak vidíte výše, používáme `<slot>` jako zástupný symbol v místě, kde chceme umístit obsah – a to je vše. Máme hotovo!

<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBBbGVydEJveCBmcm9tICcuL0FsZXJ0Qm94LnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxBbGVydEJveD5cbiAgXHRTb21ldGhpbmcgYmFkIGhhcHBlbmVkLlxuXHQ8L0FsZXJ0Qm94PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQWxlcnRCb3gudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiYWxlcnQtYm94XCI+XG4gICAgPHN0cm9uZz5FcnJvciE8L3N0cm9uZz5cbiAgICA8YnIvPlxuICAgIDxzbG90IC8+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlIHNjb3BlZD5cbi5hbGVydC1ib3gge1xuICBjb2xvcjogIzY2NjtcbiAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOGY4Zjg7XG59XG4gIFxuc3Ryb25nIHtcblx0Y29sb3I6IHJlZDsgICAgXG59XG48L3N0eWxlPiJ9)

</div>

To je zatím vše, co potřebujete vědět o slotech. Poté, co si přečtete tuto stránku a&nbsp;budete se s jejím obsahem cítit seznámeni, však doporučujeme později se vrátit a&nbsp;přečíst si úplného [průvodce pro Sloty (Slots)](/guide/components/slots).

## Dynamické komponenty {#dynamic-components}

Někdy je užitečné mezi komponentami dynamicky přepínat, například v rozhraní s více taby:

<div class="options-api">

[Otevřít příklad (Vue SFC Playground)](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[Otevřít příklad (Vue SFC Playground)](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

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

Při přepínání mezi více komponentami pomocí `<component :is="...">` bude komponenta odpojena (unmounted), když je z ní přepnuto jinam. Neaktivní komponenty můžete donutit, aby zůstaly „naživu“ pomocí vestavěné [komponenty `<KeepAlive>`](/guide/built-ins/keep-alive).

## Omezení při parsování in-DOM šablon {#in-dom-template-parsing-caveats}

Pokud píšete své Vue šablony přímo v DOM, Vue bude muset definici šablony (string template) z DOM načíst. To vede k určitým omezením kvůli chování prohlížečů při nativní analýze HTML.

:::tip
Je třeba poznamenat, že níže popsaná omezení platí pouze v případě, že své šablony píšete přímo v DOM. NEPLATÍ, pokud používáte string templates z následujících zdrojů:

- Single-File komponenty (SFC)
- Inlined template strings (např. `template: '...'`)
- `<script type="text/x-template">`
  :::

### Necitlivost na malá a velká písmena {#case-insensitivity}

HTML tagy a názvy atributů nerozlišují velká a malá písmena, takže prohlížeče budou všechna velká písmena interpretovat jako malá. To znamená, že když používáte in-DOM šablony, PascalCase názvy komponent a camelCased názvy vlastností (props) nebo názvy `v-on` událostí (events), musí všechny používat jejich ekvivalenty ve formátu kebab-case (oddělené pomlčkou):

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
<blog-post post-title="Ahoj!" @update-post="onUpdatePost"></blog-post>
```

### Samouzavírací tagy {#self-closing-tags}

V předchozích ukázkách kódu jsme pro komponenty používali samouzavírací tagy:

```vue-html
<MyComponent />
```

Je to proto, že parser Vue šablon respektuje `/>` jako indikaci ukončení jakéhokoli tagu, bez ohledu na jeho typ.

V in-DOM šablonách však musíme vždy zahrnout explicitní uzavírací tagy:

```vue-html
<my-component></my-component>
```

Je to proto, že specifikace HTML umožňuje pouze [několika konkrétním prvkům](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) vynechat uzavírací tag, nejběžnější jsou `<input> ` a `<img>`. Pokud u všech ostatních prvků uzavírací tag vynecháte, nativní HTML parser si bude myslet, že jste úvodní tag nikdy neukončili. Například následující kus kódu:

```vue-html
<my-component /> <!-- zde chceme tag ukončit... -->
<span>ahoj</span>
```

Bude vyhodnocen jako:

```vue-html
<my-component>
  <span>ahoj</span>
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

Naše komponenta `<blog-post-row>` bude vytažena (hoisted) jako neplatný obsah, což v&nbsp;případném vykresleném výstupu způsobí chyby. Toto můžeme obejít s použitím speciálního [atributu `is`](/api/built-in-special-attributes#is):

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
Při použití na nativní HTML elementy musí být hodnota `is` uvedena předponou `vue:`, aby mohla být interpretována jako Vue komponenta. Je to nutné, aby nedošlo k záměně s&nbsp;nativními [custom built-in elementy](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example).
:::

To je vše, co zatím potřebujete vědět o omezeních při parsování in-DOM šablon &#8209;&nbsp;a&nbsp;vlastně konec _Základů_ Vue. Gratulujeme! Je stále co se učit, ale nejprve doporučujeme, abyste si udělali přestávku a sami si s Vue hráli – vytvořit něco zábavného, nebo se podívat na některé [Příklady](/examples/), pokud jste tak ještě neučinili.

Jakmile si budete jisti znalostmi, které jste právě nabrali, pokračujte v průvodci, abyste se o komponentách dozvěděli více do hloubky.
