# Deklarativní vykreslování {#declarative-rendering}

<div class="sfc">

To, co vidíte v editoru je Vue Single-File komponenta (SFC). SFC je znovupoužitelná nezávislý blok kódu, který obaluje HTML, CSS a JavaScript prvky, které patří dohromady, zapsané uvnitř `.vue` souboru.

</div>

Klíčová vlastnost Vue je **deklarativní vykreslování**: použitím šablonové (template) syntaxe, která rozšřiuje HTML, můžeme popsat, jak má HTML vypadat v závislosti na stavu JavaScript objektů. Když se stav změní, HTML se automaticky aktualizuje.

<div class="composition-api">

Stav, který může vyvolat aktualizace se nazývá **reaktivní**. Můžeme deklarovat reaktivní stav použitím Vue `reactive()` API. Objekty vytvoření pomocí `reactive()` jsou JavaScript [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) které fungují stejně jako běžné objekty:

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

`reactive()` funguje pouze na objekty (vč. polí a built-in typů jako `Map` a `Set`). Naproti tomu `ref()` umí vzít jakýkoliv datový typ a vytvořit objekt, který vystaví vnitřní hodnotu pod vlastností `.value`:

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```

Detaily fungování `reactive()` a `ref()` jsou popsány v <a target="_blank" href="/guide/essentials/reactivity-fundamentals.html">příručce Základy reaktivity</a>.

<div class="sfc">

Reaktivní stav deklarovaný v komponentě v bloku `<script setup>` může být použit přímo v šabloně. Tímto způsobem můžeme vykreslovat dynamický text na základě hodnoty objektů `counter` a `message` s použitím tzv. 'mustaches' syntaxe:

</div>

<div class="html">

Objekt posílaný do `createApp()` je Vue komponenta. Stav komponenty by měl být deklarován uvnitř její `setup()` funkce a použitý jako objekt:

```js{2,5}
setup() {
  const counter = reactive({ count: 0 })
  const message = ref('Hello World!')
  return {
    counter,
    message
  }
}
```

Vlastnosti ve vráceném objektu budou zpřístupněny v šabloně. Tímto způsobem můžeme 
Properties in the returned object will be made available in the template. Tímto způsobem můžeme vykreslovat dynamický text na základě hodnoty `message` s použitím tzv. 'mustaches' syntaxe:

</div>

```vue-html
<h1>{{ message }}</h1>
<p>count is: {{ counter.count }}</p>
```

Všimněte si, že nepotřebujeme `.value` když přistupujeme k `message` ref objektu v šabloně: hotnota je automaticky rozbalena pro stručnější použití.

</div>

<div class="options-api">

Stav, který může vyvolat aktualizace se nazývá **reaktivní**. Ve Vue, reaktivní stav je udržován uvnitř komponent. <span class="html">V ukázkovém kódu je objekt posílaný do `createApp()` komponenta. </span>

V komponentě můžeme deklarovat reaktivní stav pomocí volby `data`, což by měla být funkce, která vrací objekt:

<div class="sfc">

```js{3-5}
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```

</div>
<div class="html">

```js{3-5}
createApp({
  data() {
    return {
      message: 'Hello World!'
    }
  }
})
```

</div>

Vlastnost `message` bude zpřístupněna v šabloně. Tímto způsobem můžeme vykreslit dynamický text v závislosti na hodnotě `message` pomocí 'mustaches' syntaxe:

```vue-html
<h1>{{ message }}</h1>
```

</div>

Obsah uvnitř 'mustaches' není limitován jen na identifikátory nebo cesty - lze použít jakýkoliv platný JavaScript výraz:

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

Nyní zkuste sami vytvořit nějaký reaktivní stav a použít jej k vypsání dynamického textového obsahu pro `<h1>` tag v šabloně.

</div>

<div class="options-api">

Nyní zkuste sami vytvořit nějakou datovou vlastnost a použít ji k vypsání dynamického textového obsahu pro `<h1>` tag v šabloně.

</div>
