---
outline: deep
---

# Fallthrough atributy {#fallthrough-attributes}

> Tato stránka předpokládá, že už jste četli [Základy komponent](/guide/essentials/component-basics). Pokud jsou pro vás komponenty nové, přečtěte si je jako první.

## Dědičnost attributů {#attribute-inheritance}

"Fallthrough" atribut je atribut nebo `v-on` event listener, který je předáván do komponenty, ale není explicitně deklarován ve [vlastnostech (props)](./props) nebo [emitovaných událostech (emits)](./events#declaring-emitted-events) cílové komponenty. Typickými příklady jsou atributy `class`, `style`, a `id`.

Když komponenta vykresluje jediný root element, budou k atributům root elementu automaticky přidány fallthrough atributy. Například pro komponentu `<MyButton>` s následující šablonou:

```vue-html
<!-- template of <MyButton> -->
<button>klikni na mě</button>
```

A s rodičem užívajícím komponentu takto:

```vue-html
<MyButton class="large" />
```

Bude ve výsledku vykreslený DOM vypadat:

```html
<button class="large">klikni na mě</button>
```

V tomto případě `<MyButton>` nedeklarovala `class` jako svou vlastnost. Proto je `class` zpracována jako fallthrough attribut a automaticky přidána do root elementu komponenty `<MyButton>`.

### Spojování `class` a `style` {#class-and-style-merging}

Pokud root element komponenty potomka již obsahuje existující atributy `class` nebo `style`, budou sloučeny s hodnotami `class` a `style`, které jsou předávány z rodiče. Předpokládejme, že změníme šablonu `<MyButton>` z předchozího příkladu na:

```vue-html
<!-- template of <MyButton> -->
<button class="btn">klikni na mě</button>
```

Pak se vykreslený DOM změní na:

```html
<button class="btn large">klikni na mě</button>
```

### Dědičnost `v-on` listenerů {#v-on-listener-inheritance}

Stejné pravidlo se uplatní na `v-on` event listenery:

```vue-html
<MyButton @click="onClick" />
```

Listener `click` bude přidán do root elementu `<MyButton>`, tj. do nativního prvku `<button>`. Když se klikne na nativní `<button>`, vyvolá to metodu `onClick` komponenty rodiče. Pokud nativní `<button>` již listener `click` vázaný přes `v-on` má, pak budou vyvolány oba.

### Dědičnost vnořených komponent {#nested-component-inheritance}

Pokud komponenta ve svém root elementu vykresluje jinou komponentu, například pokud jsme upravili `<MyButton>` tak, aby jako svůj root vykreslovala `<BaseButton>`:

```vue-html
<!-- šalona <MyButton/>, která jednoduše vykreslí jinou komponentu -->
<BaseButton />
```

Tak budou fallthrough atributy obdržené v `<MyButton>` automaticky přesměrovány do `<BaseButton>`.

Zapamatujte si, že:

1. Přesměrované atributy nezahrnují žádné atributy, které jsou v `<MyButton>` deklarovány jako vlastnosti nebo `v-on` listenery deklarovaných událostí - jinými slovy, deklarované vlastnosti a listenery byly "spotřebovány" uvnitř `<MyButton>`.

2. Přesměrované atributy mohou být akceptovány jako vlastnosti `<BaseButton>`, pokud tam jsou deklarovány.

## Zamezení dědičnosti atributů {#disabling-attribute-inheritance}

Pokud **nechcete**, aby komponenta automaticky dědila atributy, můžete v jejím nastavení zadat `inheritAttrs: false`.

<div class="composition-api">

Pokud používáte `<script setup>`, budete muset toto nastavení deklarovat v samostatném, normálním `<script>` bloku:

```vue
<script>
// použijte normální <script> k deklaraci nastavení
export default {
  inheritAttrs: false
}
</script>

<script setup>
// ...`setup` logika
</script>
```

</div>

Běžným důvodem pro zakázání dědičnosti atributů je situace, kdy je třeba atributy použít i na jiné elementy než na root. Nastavením `inheritAttrs` na `false` můžete mít plnou kontrolu nad tím, kde mají být fallthrough atributy použity.

K těmto fallthrough atributům lze přistoupit přímo ve výrazech šablon přes `$attrs`:

```vue-html
<span>Fallthrough attributy: {{ $attrs }}</span>
```

Objekt `$attrs` obsahuje všechny atributy, které nejsou deklarovány jako `props` nebo `emits` komponenty (např., `class`, `style`, `v-on` listenery, atd.).

Pár poznámek:

- Na rozdíl od vlastností zachovávají falltrough atributy i v JavaScriptu původní podobu klíče, takže k atributu `foo-bar` je třeba přistupovat jako `$attrs['foo-bar']` a nikoliv `$attrs['fooBar']`.

- Event listener `v-on` jako `@click` bude v objektu zpřístupněn jako funkce `$attrs.onClick`.

Při použití naši ukázkové `<MyButton>` komponenty z [předchozí sekce](#attribute-inheritance) můžeme někdy potřebovat obalit vlastní element `<button>` do extra `<div>` tagu pro účely stylování:

```vue-html
<div class="btn-wrapper">
  <button class="btn">klikni na mě</button>
</div>
```

Chceme, aby všechny falltrough atributy jako `class` nebo `v-on` listener byly aplikovány na vnitřní `<button>` a nikoliv vnější `<div>`. Toho můžeme dosáhnout s `inheritAttrs: false` a `v-bind="$attrs"`:

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">klikni na mě</button>
</div>
```

Pamatujte, že [`v-bind` bez parametrů](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) naváže na cílový element všechny vlastnosti objektu jako atributy.

## Dědičnost atributů na více root elementech {#attribute-inheritance-on-multiple-root-nodes}

Na rozdíl od komponent s jediným root elementem nemají komponenty s více root elementy automatické chování pro fallthrough atributy. Pokud není proveden explicitní binding `$attrs`, vyvolá to za běhu varování.

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

Pokud má `<CustomLayout>` následující multi-root šablonu, objeví se varování, protože Vue si nemůže být jisté, jak má fallthrough attributy správně aplikovat:

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

Varování bude potlačeno, pokud je proveden explicitní binding `$attrs`:

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## Přistupování k falltrough atributům v JavaScriptu {#accessing-fallthrough-attributes-in-javascript}

<div class="composition-api">

Pokud je třeba, lze k falltrough atributům komponenty přistoupit uvnitř `<script setup>` pomocí `useAttrs()` API:

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

Pokud nepoužíváte `<script setup>`, `attrs` budou vystaveny jako vlastnost kontextu `setup()`:

```js
export default {
  setup(props, ctx) {
    // fallthrough attributy jsou vystaveny jako ctx.attrs
    console.log(ctx.attrs)
  }
}
```

Všimněte si, že ačkoli zde objekt `attrs` vždy odráží nejnovější fallthrough atributy, není reaktivní (z výkonnostních důvodů). Ke sledování jeho změn nelze použít watchers. Pokud potřebujete reaktivitu, použijte vlastnost (prop). Alternativně můžete použít `onUpdated()`, abyste při každé aktualizaci komponenty provedli vedlejší efekty s nejnovějšími `attrs`.

</div>

<div class="options-api">

Pokud je třeba, lze k falltrough atributům komponenty přistoupit přes instanční proměnnou `$attrs`:

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```

</div>
