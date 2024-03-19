# Komponenty {#components}

Zatím jsme pracovali pouze s jednou komponentou. Skutečné Vue aplikace jsou ale obvykle vytvářeny s vnořenými komponentami.

Komponenta rodiče může vykreslit jinou komponentu ve své šabloně jako komponentu potomka. Chcete-li komponentu potomka použít, musíme ji nejprve importovat:

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

Dále musíme komponentu zaregistrovat s využitím možnosti `components`. Zde používáme zkrácený zápis (object property shorthand) pro registraci komponenty `ChildComp` pod názvem `ChildComp`.

</div>
</div>

<div class="sfc">

Poté můžeme komponentu použít v šabloně jako:

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

Dále musíme komponentu zaregistrovat s využitím možnosti `components`. Zde používáme zkrácený zápis (object property shorthand) pro registraci komponenty `ChildComp` pod názvem `ChildComp`.

Protože šablonu píšeme v DOM, bude podléhat pravidlům analýzy prohlížeče, které u názvů značek nerozlišují malá a velká písmena. Proto musíme k odkazování na komponentu potomka použít kebab-case název:

```vue-html
<child-comp></child-comp>
```

</div>


Nyní to zkuste sami – importujte komponentu potomka a vykreslete ji v&nbsp;šabloně.
