# Vykreslování seznamu {#list-rendering}

Direktivu `v-for` můžeme použít k vykreslení seznamu prvků založeném na zdrojovém poli:

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

`todo` je lokální proměnná, která reprezentuje prvek pole, nad kterým se právě iteruje. Je přístupná pouze uvnitř elementu `v-for`, podobně jako funguje scope uvnitř funkce.

Všimněte si, jak také každému `todo` objektu dáváme jedinečné `id` a provádíme jeho binding na <a target="_blank" href="/api/built-in-special-attributes.html#key">speciální atribut `key`</a> pro každý element `<li>`. Atribut `key` umožňuje Vue přesně pohybovat každým `<li>` tak, aby odpovídalo pozici jemu odpovídajícímu objektu v poli.

Existují dva způsoby, jak list aktualizovat:

1. Zavolat na zdrojové pole [změnové funkce](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating):

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. Nahradit pole novou instancí:

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

Zde máme jednoduchý seznam úkolů – zkuste implementovat logiku funkcí `addTodo()` a `removeTodo()` tak, aby to fungovalo!

Více detailů o `v-for`: <a target="_blank" href="/guide/essentials/list.html">Průvodce - Vykreslování seznamu</a>
