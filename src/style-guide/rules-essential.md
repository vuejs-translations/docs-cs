# Pravidla priority A: Zásadní (prevence chyb) {#priority-a-rules-essential}

Tato pravidla pomáhají předcházet chybám, proto se je za každou cenu naučte a dodržujte je. Výjimky mohou existovat, ale měly by být velmi vzácné a měly by být dělány pouze osobami s odbornými znalostmi jak JavaScriptu, tak Vue.

## Používejte víceslovné názvy komponent {#use-multi-word-component-names}

Názvy vašich vlastních komponent by měly být vždy víceslovné, s výjimkou kořenových komponent `App`. To [předchází konfliktům](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) se stávajícími a potenciálními budoucími HTML elementy, protože všechny HTML elementy jsou jednoslovné.

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<!-- pre-kompilovaná šablona -->
<Item />

<!-- DOM šablona -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<!-- pre-kompilovaná šablona -->
<TodoItem />

<!-- DOM šablona -->
<todo-item></todo-item>
```

</div>

## Používejte detailní definice vlastností {#use-detailed-prop-definitions}

V hotovém kódu by definice vlastností (props) měly být vždy co nejpodrobnější, přinejmenším by měly specifikovat typ(y).

::: details Podrobné vysvětlení
Podrobná [definice vlastností](/guide/components/props#prop-validation) má dvě výhody:

- Dokumentují API komponenty, takže je snadněji vidět, jak má být komponenta používána.
- Během vývoje vás Vue upozorní, pokud budou komponentě předávané vlastnosti v chybném formátu, což vám pomůže zachytit potenciální zdroje chyb.
  :::

<div class="options-api">
<div class="style-example style-example-bad">
<h3>Špatně</h3>

```js
// toto je OK pouze během prototypování
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```js
props: {
  status: String
}
```

```js
// ještě lepší
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>
</div>

<div class="composition-api">
<div class="style-example style-example-bad">
<h3>Špatně</h3>

```js
// toto je OK pouze během prototypování
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// ještě lepší

const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>
</div>

## Používejte `v-for` spolu s klíčem {#use-keyed-v-for}

`key` společně s `v-for` je _vždy_ vyžadován v komponentách, za účelem udržení interního stavu komponent v podstromu. Ovšem i u elementů je dobrým zvykem udržovat předvídatelné chování, jako je [stálost objektu](https://bost.ocks.org/mike/constancy/) při animacích.

::: details Podrobné vysvětlení
Řekněme že máte seznam TODO prvků:

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Naucit se pouzivat v-for'
      },
      {
        id: 2,
        text: 'Naucit se pouzivat key'
      }
    ]
  }
}
```

Pak je seřadíte podle abecedy. Při aktualizaci DOM Vue optimalizuje vykreslování tak, aby se provedly co nejmenší změny DOM. To může znamenat odstranění prvního TODO prvku a jeho opětovné přidání na konec seznamu.

Problém je, že existují případy, kdy je důležité nesmazat prvky, které zůstanou v DOM. Například můžete chtít použít `<transition-group>` k animaci řazení seznamu nebo zachovat focus, pokud je vykreslený prvek `<input>`. V těchto případech přidání jedinečného klíče pro každou položku (např. `:key="todo.id"`) řekne Vue, jak se chovat předvídatelněji.

Podle našich zkušeností je lepší _vždy_ přidat jedinečný klíč, abyste se vy a váš tým jednoduše nikdy nemuseli starat o tyto okrajové případy. Pak ve vzácných, výkonově kritických scénářích, kde není stálost objektu nutná, můžete udělat vědomou výjimku.
:::

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## Vyvarujte se `v-if` dohromady s `v-for` {#avoid-v-if-with-v-for}

**Nikdy nepoužívejte `v-if` ma stejný element jako `v-for`.**

Existují dva běžné případy, kdy to může být lákavé:

- Při filtrování položek v seznamu (např. `v-for="user in users" v-if="user.isActive"`). V těchto případech nahraďte `users` novou computed proměnnou, která vrátí filtrovaný seznam (např. `activeUsers`).

- Aby se zabránilo vykreslování seznamu, který by měl být skrytý (např. `v-for="user in users" v-if="shouldShowUsers"`). V těchto případech přesuňte `v-if` na mateřeský element (např. `ul`, `ol`).

::: details Podrobné vysvětlení
Když Vue zpracovává direktivy, `v-if` má vyšší priorotu než `v-for`. V této šabloně tedy:

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

vyvolá výjimku, protože `v-if` direktiva bude vyhodnocena první a proměnná `user`, přes kterou se iteruje nebude v tom okamžiku existovat.

To se dá napravit iterací přes computed proměnnou, například takto:

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Nebo můžete použít tag `<template>` s `v-for`, kterým obalíte `<li>` element:

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## Používejte omezené stylování komponent {#use-component-scoped-styling}

V aplikacích mohou být styly na nejvyšší úrovni komponenty `App` a v layout komponentách globální, ale všechy ostatní komponenty by měly mít styly vždy omezené (scoped).

To platí pouze pro [Single-File komponenty (SFC)](/guide/scaling-up/sfc). _Není_ nezbytné používat [atribut `scoped`](https://vue-loader.vuejs.org/en/features/scoped-css.html). Omezení lze zajistit pomocí [CSS modulů](https://vue-loader.vuejs.org/en/features/css-modules.html), a class-based strategie jako je [BEM](http://getbem.com/), či jiné knihovny/konvence.

**Komponenty knihoven by nicméně měly class-based strategii místo používání atributu `scoped` upřednostňovat.**

Díky tomu je přepisování interních stylů snazší, s lidsky-čitelnými názvy tříd, které nejsou příliš specifické, ale přesto je velmi nepravděpodobné, že by vedly ke konfliktu.

::: details Podrobné vysvětlení
Pokud vyvíjíte velký projekt, spolupracujete s dalšími vývojáři nebo někdy využijete HTML/CSS třetí strany (např. od Auth0), konzistentní omezení zajistí, že se vaše styly budou vztahovat pouze na komponenty, pro které jsou určeny.

Kromě atributu `scoped` může použití jedinečných názvů tříd pomoci zajistit, že se CSS třetí strany nebude aplikovat na vaše vlastní HTML. Mnoho projektů například používá názvy tříd `button`, `btn` nebo `icon`, takže i když nepoužíváte strategii jako je BEM, přidání předpony specifické pro aplikaci a/nebo komponentu (např. `ButtonClose-icon`) může poskytnout určitou ochranu před nežádoucími efekty.
:::

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- Using the `scoped` attribute -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- Using CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- Using the BEM convention -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>
