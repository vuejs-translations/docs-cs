# Binding tříd a stylů {#class-and-style-bindings}

Běžným požadavkem na data binding je manipulace se seznamem tříd elementu a inline styly. Protože `class` i `style` jsou obojí atributy, můžeme podobně jako u jiných atributů použít `v-bind` k dynamickému přiřazení string hodnoty. Pokusy o generování těchto hodnot pomocí spojování textových řetězců však mohou být otravné a náchylné k&nbsp;chybám. Z tohoto důvodu Vue poskytuje speciální vylepšení, když se `v-bind` používá s `class` a `style`. Kromě řetězců lze výrazy vyhodnocovat také jako objekty nebo pole.

## Binding HTML tříd {#binding-html-classes}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Lekce o dynamickém CSS ve Vue.js zdarma"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Lekce o dynamickém CSS ve Vue.js zdarma"/>
</div>

### Binding na objekty {#binding-to-objects}

Do `:class` (zkrácený zápis `v-bind:class`) můžeme pro dynamickou aplikaci tříd přiřadit objekt:

```vue-html
<div :class="{ active: isActive }"></div>
```

Výše uvedený zápis znamená, že přítomnost třídy `active` bude vyhodnocena na základě [pravdivosti](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) datové vlastnosti `isActive`.

 Více tříd můžete přepínat tím, že budete mít v objektu více hodnot. Kromě toho může direktiva `:class` koexistovat s prostým atributem `class`. Tedy za následujícího stavu:

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

A s následující šablonou:

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

Se vykreslí:

```vue-html
<div class="static active"></div>
```

Když se `isActive` nebo `hasError` změní, seznam tříd bude automaticky upraven podle potřeby. Například když se `hasError` stane `true`, seznam tříd se změní na `"static active text-danger"`.

Připojený objekt nemusí být inline:

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

Výše uvedené vykreslí:

```vue-html
<div class="active"></div>
```

Můžeme také provést binding na [computed proměnnou](./computed), která vrací objekt. Toto je běžný a účinný vzorec:

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### Binding na pole {#binding-to-arrays}

Do `:class` můžeme přiřadit pole a aplikovat seznam tříd, které obsahuje:

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

Což vykreslí:

```vue-html
<div class="active text-danger"></div>
```

Pokud byste chtěli třídu v seznamu také přepínat podmíněně, můžete to udělat pomocí ternárního výrazu:

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

S tímto zápisem bude vždy aplikována `errorClass`, ale `activeClass` bude přidána pouze, pokud je `isActive` pravdivé.

To však může být trochu nepřehledné, pokud máte podmíněných tříd více. Proto je kromě toho možné použít uvnitř pole i objektovou syntaxi:

```vue-html
<div :class="[{ [activeClass]: isActive }, errorClass]"></div>
```

### S komponentami {#with-components}

> Tato sekce předpokládá znalost [základů komponent](/guide/essentials/component-basics). Klidně ji teď přeskočte a vraťte se později.

Když použijete atribut `class` na komponentu s jedním root elementem, budou tyto třídy přidány do root elementu v komponentě a sloučeny s jakoukoli existující třídou, která se na něm již nachází.

Například pokud máme komponentu jménem `MyComponent` s následující šablonou:

```vue-html
<!-- šablona komponenty potomka -->
<p class="foo bar">Ahoj!</p>
```

A poté při použití přidáme nějaké třídy:

```vue-html
<!-- při použití komponenty -->
<MyComponent class="baz boo" />
```

Vykreslené HTML bude:

```vue-html
<p class="foo bar baz boo">Ahoj!</p>
```

To samé platí pro binding tříd:

```vue-html
<MyComponent :class="{ active: isActive }" />
```

Pokud je `isActive` pravdivé, vykreslené HTML bude:

```vue-html
<p class="foo bar active">Ahoj!</p>
```

Pokud má vaše komponenta root elementů víc, budete muset definovat, který prvek třídu obdrží. Můžete to udělat pomocí vlastnosti komponenty `$attrs`:

```vue-html
<!-- Šablona MyComponent s použitím $attrs -->
<p :class="$attrs.class">Ahoj!</p>
<span>Toto je potomek</span>
```

```vue-html
<MyComponent class="baz" />
```

Výše uvedené vykreslí:

```html
<p class="baz">Ahoj!</p>
<span>Toto je potomek</span>
```

O dědičnosti atributů v komponentách se můžete dozvědět více v sekci [Fallthrough atributy](/guide/components/attrs).

## Binding inline stylů {#binding-inline-styles}

### Binding na objekty {#binding-to-objects-1}

`:style` podporuje binding na hodnoty JavaScript objektů – v souladu s [atributem HTML elementu `style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style):

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

Ačkoli se doporučuje camelCase, `:style` podporuje i CSS klíče zapsané kebab-case (v&nbsp;souladu s tím, jak jsou používány ve skutečném CSS) - například:

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

Často je dobrý nápad provést binding přímo s objektem stylu, aby byla šablona čistší:

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '30px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

Binding objektovým stylem se opět často používá ve spojení s computed proměnnými, které vracejí objekty.

Stejně jako `:class` koexistuje i dynamická direktiva `:style` s běžným statickým zápisem atributu. Šablona:

```vue-html
<h1 style="color: red" :style="'font-size: 1em'">Ahoj</h1>
```

Se vykreslí jako:

```vue-html
<h1 style="color: red; font-size: 1em;">Ahoj</h1>
```

### Binding na pole {#binding-to-arrays-1}

Můžeme provést binding `:style` na pole více stylových objektů. Tyto objekty budou sloučeny a použity na stejný element:

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Auto-prefixing {#auto-prefixing}

Když použijete CSS vlastnost, která vyžaduje [vendor prefix](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix), v rácmci `:style`, Vue příslušnou předponu automaticky přidá. Dělá to tak, že za běhu zkontroluje, které vlastnosti stylu jsou podporovány v aktuálním prohlížeči. Pokud prohlížeč určitou vlastnost nepodporuje, budou testovány různé varianty s předponou, abychom se pokusili najít tu, která podporována je.

### Více hodnot {#multiple-values}

Vlastnosti stylu můžete poskytnout pole více hodnot s předponou, například:

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Tím se vykreslí pouze poslední hodnota v poli, kterou prohlížeč podporuje. V tomto případě vykreslí `display: flex` pro prohlížeče, které podporují vlastnost flexbox bez předpony.
