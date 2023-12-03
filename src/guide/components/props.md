# Vlastnosti (Props) {#props}

> Tato stránka předpokládá, že už jste četli [Základy komponent](/guide/essentials/component-basics). Pokud jsou pro vás komponenty nové, přečtěte si je jako první.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-3-reusable-components-with-props" title="Lekce o props ve Vue.js zdarma"/>
</div>

## Deklarace vlastností {#props-declaration}

Vue komponenty vyžadují explicitní deklaraci vlastností, aby Vue vědělo, které externí hodnoty předávané komponentě mají být považovány za "fallthrough" atributy (což bude probráno v [příslušné sekci](/guide/components/attrs)).

<div class="composition-api">

V Single-file komponentách (SFC) s využitím `<script setup>`, je možné vlastnosti deklarovat pomocí makra `defineProps()`:

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

Ve komponentách bez `<script setup>`, se vlastnosti deklarují v sekci [`props`](/api/options-state#props):

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() obdrží `props` jako první parametr
    console.log(props.foo)
  }
}
```

Všimněte si, že parametr předávaný do `defineProps()` je stejný jako hodnota předávaná ze sekce `props`: pro deklaraci vlastností je mezi oběma styly deklarace sdíleno stejné API.

</div>

<div class="options-api">

Vlastnosti se deklarují v sekci [`props`](/api/options-state#props):

```js
export default {
  props: ['foo'],
  created() {
    // props jsou vystaveny přes `this`
    console.log(this.foo)
  }
}
```

</div>

Kromě deklarace vlastností pomocí pole řetězců můžeme použít také objektovou syntaxi:

<div class="options-api">

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>
<div class="composition-api">

```js
// v rámci `<script setup>`
defineProps({
  title: String,
  likes: Number
})
```

```js
// pokud není použito `<script setup>`
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>

Pro každou vlastnost deklarovanou objektovou syntaxí je klíčem jméno vlastnosti, zatímco hodnotou by měla být funkce konstruktoru očekávaného typu.

Nejen, že to vaší komponentu popisuje, ale také budou prostřednictvím výpisu do konzole prohlížeče varováni ostatní vývojáři, kteří vaši komponetu použjí, pokud budou předávat špatný datový typ. O [validaci vlastností](#prop-validation) budeme více mluvit později níže na této stránce.

<div class="options-api">

Viz také: [Typování vlastností komponent](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

Pokud používáte TypeScript a `<script setup>`, je také možné deklarovat vlastnosti s použitím "pure" typových anotací:

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

Více informací: [Typování vlastností komponent](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

</div>

## Detaily předávání vlastností {#prop-passing-details}

### Velká a malá písmena v názvech vlastností {#prop-name-casing}

Dlouhé názvy vlastností deklarujeme pomocí camelCase, protože se tak vyhneme nutnosti doplňovat uvozovky při jejich použití jako klíčů vlastností a umožní nám to odkazovat přímo na ně ve výrazech šablon, protože se jedná o platné JavaScript identifikátory:

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```

Technicky lze camelCase použít i při předávání vlastností do komponenty potomka (kromě [in-DOM šablon](/guide/essentials/component-basics#in-dom-template-parsing-caveats)). Konvence však ve všech případech používá kebab-case, aby se sladila s HTML atributy:

```vue-html
<MyComponent greeting-message="hello" />
```

Kdykoliv je to možné, používáme [pro tagy komponent PascalCase](/guide/components/registration#component-name-casing), protože to zlepšuje čitelnost šablony tím, že odlišuje Vue komponenty od nativních elementů. Použití camelCase při předávání vlastností však takový praktický přínos nemá, proto jsme se rozhodli dodržovat konvence jednotlivých jazyků.

### Statické vs. dynamické vlastnosti {#static-vs-dynamic-props}

Zatím jste viděli vlastnosti předávané jako statické hodnoty, jako např.:

```vue-html
<BlogPost title="Moje cesta s Vue" />
```

Viděli jste také dynamické přiřazování vlastností pomocí `v-bind` nebo jeho zkratky `:`, jako třeba v:

```vue-html
<!-- Dynamicky přiřazená hodnota z jiné proměnné -->
<BlogPost :title="post.title" />

<!-- Dynamicky přiřazená hodnota komplexního výrazu -->
<BlogPost :title="post.title + ' od ' + post.author.name" />
```

### Předávání různých datových typů {#passing-different-value-types}

Ve dvou výše uvedených příkladech jsme předávali hodnoty typu string, ale jako vlastnost lze předat _jakýkoli_ datový typ.

#### Číslo {#number}

```vue-html
<!-- I když je `42` statická hodnota, potřebujeme v-bind, abychom řekli Vue, -->
<!-- že toto je JavaScript výraz a nikoliv prostý string. -->
<BlogPost :likes="42" />

<!-- Dynamicky přiřazená hodnota z jiné proměnné -->
<BlogPost :likes="post.likes" />
```

#### Boolean {#boolean}

```vue-html
<!-- Vlastnost bez hodnoty bude mít implicitně hodnotu `true`. -->
<BlogPost is-published />

<!-- I když je `false` statická hodnota, potřebujeme v-bind, abychom řekli Vue, -->
<!-- že toto je JavaScript výraz a nikoliv prostý string. -->
<BlogPost :is-published="false" />

<!-- Dynamicky přiřazená hodnota z jiné proměnné -->
<BlogPost :is-published="post.isPublished" />
```

#### Pole {#array}

```vue-html
<!-- I když je hodnota pole statická, potřebujeme v-bind, abychom řekli Vue, -->
<!-- že toto je JavaScript výraz a nikoliv prostý string. -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- Dynamicky přiřazená hodnota z jiné proměnné -->
<BlogPost :comment-ids="post.commentIds" />
```

#### Objekt {#object}

```vue-html
<!-- I když je hodnota objektu statická, potřebujeme v-bind, abychom řekli Vue, -->
<!-- že toto je JavaScript výraz a nikoliv prostý string. -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- Dynamicky přiřazená hodnota z jiné proměnné -->
<BlogPost :author="post.author" />
```

### Binding více vlastností s využitím objektu {#binding-multiple-properties-using-an-object}

Pokud chcete předat všechny vlastnosti objektu najednou, můžete použít [`v-bind` bez argumentu](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) (`v-bind` místo `:prop-name`). Například pokud máte objekt `post`:

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'Moje cesta s Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'Moje cesta s Vue'
}
```

</div>

Následující šablona:

```vue-html
<BlogPost v-bind="post" />
```

Bude stejná jako:

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## Jednosměrný datový tok {#one-way-data-flow}

Všechny vlastnosti tvoří **jednosměrný binding směrem dolů** mezí podřízenou a nadřízenou vlastností: když se aktualizuje vlastnost v rodiči, přenese se to dolů na vlastnost potomka, ale nikoliv naopak. To zabraňuje tomu, aby komponenty potomků omylem měnily stav vlastností rodiče, což by mohlo způsobit, že bude těžší pochopit tok dat ve vaší aplikaci.

Kromě toho se při každé aktualizaci komponenty rodiče obnoví všechny vlastnosti v komponentě potomka o nejnovější hodnotu. To znamená, že byste se **neměli** pokoušet měnit vlastnost uvnitř komponenty potomka. Pokud to uděláte, Vue vás na to upozorní v konzoli:

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ warning, props are readonly!
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ warning, props are readonly!
    this.foo = 'bar'
  }
}
```

</div>

Obvykle jsou dva případy, kdy vypadá lákavě vlastnost měnit:

1. **Vlastnost slouží k předání počáteční hodnoty; komponenta potomka ji chce následně použít jako lokální datovou hodnotu.** V tomto případě je nejlepší definovat lokální datovou proměnnou, která používá předanou vlastnost jako svou výchozí hodnotu:

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // counter použije `props.initialCounter` pouze jako výchozí hodnotu;
   // od budoucích aktualizací je odpojen
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // counter použije `props.initialCounter` pouze jako výchozí hodnotu;
         // od budoucích aktualizací je odpojen
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **Vlastnost je předána jako surová (raw) hodnota, kterou je třeba transformovat.** V tomto případě je nejlepší pomocí hodnoty vlastnosti definovat computed proměnnou:

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // computed proměnná, která se automaticky aktualizuje, pokud se vlastnost změní
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // computed proměnná, která se automaticky aktualizuje, pokud se vlastnost změní
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>

### Změny vlastností typu objekt / pole {#mutating-object-array-props}

Pokud jsou objekty a pole předávány jako vlastnosti, komponenta potomka sice nemůže mutovat binding na vlastnosti, ale **bude moci** měnit vnořené prvky objektu nebo pole. Je to proto, že v jazyce JavaScript se objekty a pole předávají pomocí odkazů (pass by reference) a pro Vue je nepřiměřeně nákladné takovým změnám zabránit.

Hlavní nevýhodou takových změn je, že umožňují komponentám potomka ovlivňovat stav rodičů způsobem, který není pro komponentu rodiče zřejmý, což může v budoucnu ztížit uvažování o toku dat. V rámci osvědčených postupů byste se měli takovým změnám vyhnout, pokud nejsou komponenty rodiče a potomka už z definice úzce propojeny. Ve většině případů by měl potomek [vyvolat událost](/guide/components/events), aby nechal změnu provést rodiče.

## Validace vlastností {#prop-validation}

Komponenty mohou specifikovat požadavky na své vlastnosti, například datové typy, které jste již viděli. Pokud některý požadavek není splněn, Vue vás na to upozorní v JavaScript konzoli prohlížeče. To je užitečné zejména při vývoji komponenty, která má být používána jinými uživateli.

Chcete-li zadat ověřování vlastností, můžete <span class="composition-api">makru `defineProps()`</span><span class="options-api">v sekci `props`</span> místo pole řetězců zadat objekt s požadavky na ověření. Například:

<div class="composition-api">

```js
defineProps({
  // základní kontrola typu
  //  (hodnoty `null` a `undefined` umožní jakýkoliv typ)
  propA: Number,
  // více možných typů
  propB: [String, Number],
  // povinný string
  propC: {
    type: String,
    required: true
  },
  // číslo s výchozí hodnotou
  propD: {
    type: Number,
    default: 100
  },
  // objekt s výchozí hodnotou
  propE: {
    type: Object,
    // výchozí hodnota objektu či pole musí být
    // vrácena z tovární (factory) metody
    // argumentem funkce budou surové (raw) vlastnosti,
    // které jsou předány do komponenty
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // vlastní validační funkce
  propF: {
    validator(value) {
      // hodnota musí odpovídat jednomu z těchto tří řetězců
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // funkce s výchozí hodnotou
  propG: {
    type: Function,
    // na rozdíl od výchozí hodnoty objektu či pole, toto není tovární (factory) metoda
    // toto je funkce, která bude nabídnuta jako výchozí hodnota
    default() {
      return 'Default function'
    }
  }
})
```

:::tip
Kód uvnitř makra `defineProps()` **nemůže přistupovat k jiným proměnným deklarovaným v `<script setup>`**, protože celý výraz je při kompilaci přesunut do vnějšího function scope.
:::

</div>
<div class="options-api">

```js
export default {
  props: {
    // základní kontrola typu
    //  (hodnoty `null` a `undefined` umožní jakýkoliv typ)
    propA: Number,
    // více možných typů
    propB: [String, Number],
    // povinný string
    propC: {
      type: String,
      required: true
    },
    // číslo s výchozí hodnotou
    propD: {
      type: Number,
      default: 100
    },
    // objekt s výchozí hodnotou
    propE: {
      type: Object,
      // výchozí hodnota objektu či pole musí být
      // vrácena z tovární (factory) metody
      // argumentem funkce budou surové (raw) vlastnosti,
      // které jsou předány do komponenty
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // vlastní validační funkce
    propF: {
      validator(value) {
        // hodnota musí odpovídat jednomu z těchto tří řetězců
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // funkce s výchozí hodnotou
    propG: {
      type: Function,
      // na rozdíl od výchozí hodnoty objektu či pole, toto není tovární (factory) metoda
      // toto je funkce, která bude nabídnuta jako výchozí hodnota
      default() {
        return 'Default function'
      }
    }
  }
}
```

</div>

Další podrobnosti:

- Všechny vlastnosti jsou ve výchozím nastavení nepovinné, pokud není zadáno `required: true`.

- Neuvedená nepovinná vlastnost kromě `Boolean` bude mít hodnotu `undefined`.

- Neuvedená `Boolean` vlastnost bude převedena na hodnotu `false`. To můžete změnit nastavením `default` - tj.: `default: undefined`, aby se chovala jako ne-Boolean vlastnost.

- Pokud je zadána `default` hodnota, bude použita, pokud je předáváná hodnota vlastnosti `undefined` - to se týká jak případů, kdy vlastnost chybí, tak těch, kdy je předána explicitní hodnota `undefined`.

Pokud validace vlastnosti selže, zobrazí Vue varování do konzole (pokud je aplikace sestavena v development módu).

<div class="composition-api">

Pokud používáte [Type-based deklarace vlastností](/api/sfc-script-setup#type-only-props-emit-declarations) <sup class="vt-badge ts" />, Vue se pokusí kompilovat typové anotace na odpovídající runtime deklarace vlastností jak nejlépe dovede. Například, `defineProps<{ msg: string }>` bude při kompilaci převedeno na`{ msg: { type: String, required: true }}`.

</div>
<div class="options-api">

::: tip Poznámka
Zapamatujte si, že vlastnosti jsou validovány **dříve** než je vytvořena instance komponenty, takže proměnné instance (např. `data`, `computed`, atd.) nebudou uvnitř `default` či `validator` funkcí dostupné.
:::

</div>

### Kontrola typů za běhu {#runtime-type-checks}

Hodnota `type` může být jeden z následujících nativních konstruktorů:

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

Kromě toho může být `type` také vlastní třída nebo funkce konstruktoru a ověření bude provedeno pomocí kontroly `instanceof`. Například následující třídu:

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

Můžete použít jako typ vlastnosti:

<div class="composition-api">

```js
defineProps({
  author: Person
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    author: Person
  }
}
```

</div>

Vue použije `instanceof Person` k ověření, zda hodnota vlastnosti `author` skutečně je instancí třídy `Person`.

## Přetypování Boolean {#boolean-casting}

Vlastnosti typu `Boolean` mají speciální pravidla přetypování k napodobení chování nativních boolean atributů. Pokud máme `<MyComponent>` s následující definicí:

<div class="composition-api">

```js
defineProps({
  disabled: Boolean
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: Boolean
  }
}
```

</div>

Lze komponentu použít i tímto způsobem:

```vue-html
<!-- stejé jako předání :disabled="true" -->
<MyComponent disabled />

<!-- stejé jako předání :disabled="false" -->
<MyComponent />
```

Když je vlastnost deklarována, aby umožnila více typů, např.:
Když je vlastnost deklarována, aby umožnila více typů, budou uplatněna rovněž pravidla přetypování pro `Boolean`. Ovšem je tu krajní případ, kdy jsou povoleny jak `String`, tak `Boolean` - pravidlo přetypování na Boolean bude uplatněno pouze pokud se Boolean objeví před String:

<div class="composition-api">

```js
// disabled bude přetypováno na true
defineProps({
  disabled: [Boolean, Number]
})
  
// disabled bude přetypováno na true
defineProps({
  disabled: [Boolean, String]
})
  
// disabled bude přetypováno na true
defineProps({
  disabled: [Number, Boolean]
})
  
// disabled bude chápáno jako prázdný string (disabled="")
defineProps({
  disabled: [String, Boolean]
})
```

</div>
<div class="options-api">

```js
// disabled bude přetypováno na true
export default {
  props: {
    disabled: [Boolean, Number]
  }
}
  
// disabled bude přetypováno na true
export default {
  props: {
    disabled: [Boolean, String]
  }
}
  
// disabled bude přetypováno na true
export default {
  props: {
    disabled: [Number, Boolean]
  }
}
  
// disabled bude chápáno jako prázdný string (disabled="")
export default {
  props: {
    disabled: [String, Boolean]
  }
}
```

</div>
