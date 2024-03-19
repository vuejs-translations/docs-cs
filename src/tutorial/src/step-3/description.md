# Binding atributů {#attribute-bindings}

Syntaxi „mustache“ lze ve Vue použít pouze pro textové interpolace. Pro binding dynamické hodnoty do atributu musíme použít direktivu  `v-bind`:

```vue-html
<div v-bind:id="dynamickeId"></div>
```

**Direktiva** je speciální atribut, který začíná předponou `v-`. Jsou to součásti syntaxe Vue šablon. Podobně jako u textových interpolací jsou hodnoty direktivy JavaScript výrazy, které mají přístup ke stavu komponenty. Podrobnosti o `v-bind` a použití direktiv jsou popsány v&nbsp;<a target="_blank" href="/guide/essentials/template-syntax.html">průvodci Syntaxe šablon</a>.

Část za dvojtečkou (`:id`) je „parametr“ direktivy. Zde bude atribut `id` na elementu `<div>` synchronizován s proměnnou  `dynamickeId` ze&nbsp;stavu komponenty.

Protože je `v-bind` používáno velmi často, má určený svůj zkrácený zápis:

```vue-html
<div :id="dynamickeId"></div>
```

Nyní zkuste přidat dynamický binding atributu `class` na element `<h1>` s použitím <span class="options-api">proměnné</span><span class="composition-api">ref</span> `h1Class` jako jeho hodnoty. Pokud bude provedený správně, text by měl zčervenat.
