# Vykreslování seznamu {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Lekce o vykreslování seznamu ve Vue.js zdarma"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Lekce o vykreslování seznamu ve Vue.js zdarma"/>
</div>

## `v-for` {#v-for}

Pro vykreslení senzamu založeného na hodnotách pole můžeme použít direktivu `v-for`. Zápis `v-for` vyžaduje speciální syntaxi ve formě `item in items`, kde `items` je zdrojové datové pole a `item` je **alias** pro prvek pole, přes které se iteruje:

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

Uvnitř elementu s `v-for` mají výrazy šablony přístup ke všem vlastnostem nadřazeného scope. Navíc `v-for` podporuje ještě volitelný druhý alias pro index aktuální položky:

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

</div>

Scope proměnné z `v-for` je obdobný jako v následujícímu JavaScript kódu:

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // má přístup do vnejšího scope`parentMessage`
  // ale `item` a `index` jsou dostupné pouze zde
  console.log(parentMessage, item.message, index)
})
```

Všimněte si, že se hodnota `v-for` shoduje s definicí callback funkce `forEach`. Dokonce můžete použít destrukturování na alias položky `v-for` podobně jako na argumenty funkce:

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- with index alias -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

Pro vnořené `v-for` funguje scope také stejně jako ve vnořených funkcích. Každý scope `v-for` má přístup do rodičovského scope:

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

Aby byl zápis bližší JavaScript syntaxi pro iterátory, můžete také místo `in` použít `of`:

```vue-html
<div v-for="item of items"></div>
```

## `v-for` nad objektem {#v-for-with-an-object}

Direktivu `v-for` můžete také použít pro iteraci nad vlastnostmi objektu. Pořadí iterace bude záviset na výsledku volání funkce `Object.keys()` na daný objekt:

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

Můžete také úvést druhý alias (klíč) pro název vlastnosti:

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

A ještě další pro její pořadí:

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## `v-for` nad rozsahem hodnot {#v-for-with-a-range}

`v-for` akceptuje jako parametr i číslo. V tomto případě se bude šablona opakovat n-krát, na základě rozsahu `1...n`.

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

Dejte pozor, že `n` začíná s úvodníh hodnotou `1` místo obvyklé `0`.

## `v-for` nad `<template>` {#v-for-on-template}

Podobně jako u `v-if`, je možné tag `<template>` použití i s `v-for` pro vícenásobné vykreslení bloku. Například:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` s `v-if` {#v-for-with-v-if}

::: warning Poznámka
**Nedoporučuje se** používat `v-if` a `v-for` na stejném prvku kvůli jejich implicitní prioritě. Podrobnosti naleznete v [Průvodci stylováním](/style-guide/rules-essential#avoid-v-if-with-v-for).
:::

Když existují na stejném elementu, `v-if` má vyšší prioritu než `v-for`. To znamená, že podmínka `v-if` nebude mít přístup k proměnným z `v-for` scope:

```vue-html
<!--
Toto vyvolá výjimku, protože "toto"
není definovaná jako proměnná instance
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Toto lze napravit přesunutím `v-for` do obalujícího `<template>` tagu (což je také přehlednější):

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## Udržování stavu pomocí `key` {#maintaining-state-with-key}

Když Vue aktualizuje seznam prvků vykreslených pomocí `v-for`, ve výchozím nastavení používá strategii „opravy na místě“. Pokud se pořadí datových položek změnilo, namísto přesování prvků DOM tak, aby odpovídaly pořadí položek, Vue každý prvek opraví na jeho místě a zajistí, aby odrážel to, co by se na daném místě mělo vykreslit.

Tento výchozí režim je efektivní, ale **vhodný pouze tehdy, když výsledek vykreslení vašeho seznamu nezávisí na stavu podřízené komponenty nebo dočasném stavu DOM (např. vstupní hodnoty formulářů)**.

Chcete-li Vue poskytnout nápovědu, aby mohlo sledovat identitu každého uzlu, a tedy znovupoužít a změnit pořadí existujících prvků, musíte pro každou položku poskytnout jedinečný atribut `key`:

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

Při použití `<template v-for>`, by měl být `key` umístěn do `<template>` tagu:

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip Poznámka
Zde uvedený `key` je speciální atribut propojený s `v-bind`. Nemělo by se zaměňovat s&nbsp;klíčem pro vlastnosti při [použití `v-for` nad objektem](#v-for-with-an-object).
:::

[Je doporučeno](/style-guide/rules-essential#use-keyed-v-for) použití atributu `key` s `v-for`, kdykoli je to možné. Výjimkou mohou být situace, kdy je iterovaný obsah DOM velmi jednoduchý (tj. neobsahuje žádné komponenty nebo stavové elementy DOM), nebo se záměrně spoléháte na výchozí chování pro zvýšení výkonu.

Direktiva `key` očekává vazbu na primitivní hodnoty – tedy string a number. Nepoužívejte jako klíče `v-for` objekty. Podrobné použití atributu `key` naleznete v [API dokumentaci pro `key`](/api/built-in-special-attributes#key).

## `v-for` nad komponentou {#v-for-with-a-component}

> Tato sekce předpokládá znalost [základů komponent](/guide/essentials/component-basics). Klidně ji teď přeskočte a vraťte se později.

Je možné použít `v-for` přímo na komponentu, jako by to byl jiný standardní element (nezapomeňte definovat `key`):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

To však komponentě automaticky nepředá žádná data, protože komponenty mají své vlastní izolované scope. Abychom předali do komponenty iterovaná data, měli bychom použít také vlastnosti (props):

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

Důvodem, proč se `item` do komponenty automaticky nevkládá, je, že díky tomu by byla komponenta pevně spojena s tím, jak funguje `v-for`. Určovat explicitně odkud data pocházejí umožňuje, že je komponenta znovupoužitelná i v jiných situacích.

<div class="composition-api">

Podívejte se na [tento příklad jednoduchého TODO listu](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=), abyste viděli, jak vykreslit list komponent pomocí `v-for` s předáním různých dat do každé instance.

</div>
<div class="options-api">

Podívejte se na [tento příklad jednoduchého TODO listu](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=), abyste viděli, jak vykreslit list komponent pomocí `v-for` s předáním různých dat do každé instance.

</div>

## Detekce změny pole {#array-change-detection}

### Změnové funkce {#mutation-methods}

Vue umí detekovat, když jsou volány změnové funkce reaktivního pole, a vyvolat potřebné aktualizace. Tyto změnové funkce jsou:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Nahrazení pole {#replacing-an-array}

Změnové funkce, jak název napovídá, mění původní pole, na kterém jsou volány. Pro srovnání existují i funkce, které pole nemění, např. `filter()`, `concat()` a `slice()`, které nemění původní pole, ale **vždy vrátí nové pole**. Při práci s těmito funkcemi bychom měli staré pole nahradit novým:

<div class="composition-api">

```js
// `items` je ref obsahující pole
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

Možná  byste si mysleli, že to způsobí, že Vue zahodí stávající DOM a vykreslí celý seznam znovu – naštěstí tomu tak není. Vue implementuje některé chytré heuristiky pro maximalizaci znovupoužití DOM elementů, takže nahrazení jednoho pole jiným polem obsahujícím překrývající se objekty je velmi efektivní operace.

## Zobrazení filtrovaných/seřazených výsledků {#displaying-filtered-sorted-results}

Někdy chceme zobrazit filtrovanou nebo seřazenou verzi pole, aniž bychom skutečně měnili nebo resetovali původní data. V tomto případě můžete vytvořit computed proměnnou, která vrátí pole filtrované nebo seřazené.

Například:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

V situacích, kdy computed proměnné nejsou proveditelné (např. uvnitř vnořených `v-for` cyklů), můžete použít funkci:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

U computed proměnných buďte opatrní s `reverse()` a `sort()`! Tyto dvě funkce mění původní pole, čemuž je u computed getterů třeba se vyhnout. Před voláním těchto funkcí vytvořte kopii původního pole:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```
