# Vestavěné direktivy {#built-in-directives}

## v-text {#v-text}

Aktualizuje textový obsah elementu.

- **Očekává:** `string`

- **Podrobnosti**

  `v-text` funguje tak, že elementu nastavuje vlastnost [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent), takže přepíše jakýkoli existující obsah uvnitř elementu. Pokud potřebujete aktualizovat část `textContent`, měli byste místo toho použít ["mustache" interpolaci](/guide/essentials/template-syntax#text-interpolation).

- **Příklad**

  ```vue-html
  <span v-text="msg"></span>
  <!-- stejné jako -->
  <span>{{msg}}</span>
  ```

- **Viz také:** [Syntaxe šablo - Interpolace textu](/guide/essentials/template-syntax#text-interpolation)

## v-html {#v-html}

Aktualizuje [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) elementu.

- **Očekává:** `string`

- **Podrobnosti**

  Obsah `v-html` je vložen jako prosté HTML - syntaxe Vue šablony nebude zpracována. Pokud se snažíte sestavit šablony pomocí `v-html`, zkuste raději řešení přehodnotit a použít komponenty.

  ::: warning Bezpečnostní poznámka
  Dynamické vykreslování libovolného HTML na vašem webu může být velmi nebezpečné, protože může snadno vést k [XSS útokům](https://en.wikipedia.org/wiki/Cross-site_scripting). Používejte `v-html` pouze na důvěryhodný obsah a **nikdy** na obsah poskytovaný uživatelem.
  :::

  V [Single-file komponentách (SFC)](/guide/scaling-up/sfc) se `scoped` styly nebudou aplikovat na obsah uvnitř `v-html`, protože toto HTML není zpracováváno kompilátorem Vue šablony. Pokud chcete cílit na obsah `v-html` pomocí CSS scénářů, můžete místo toho použít [CSS moduly](./sfc-css-features#css-modules) nebo další, globální `<style>` element s manuální strategií omezování rozsahu, jako je BEM.

- **Příklad**

  ```vue-html
  <div v-html="html"></div>
  ```

- **Viz také:** [Syntaxe šablon - HTML kód](/guide/essentials/template-syntax#raw-html)

## v-show {#v-show}

Přepíná viditelnost elementu na základě pravdivostní hodnoty výrazu.

- **Očekává:** `any`

- **Podrobnosti**

  `v-show` funguje tak, že nastavuje vlastnost `display` v CSS pomocí inline stylů a snaží se respektovat původní hodnotu `display`, když je prvek viditelný. Také spouští přechody, když se změní jeho podmínka.

- **Viz také:** [Podmíněné vykreslování - v-show](/guide/essentials/conditional#v-show)

## v-if {#v-if}

Podmíněné vykreslování elementu nebo fragmentu šablony na základě pravdivostní hodnoty výrazu.

- **Očekává:** `any`

- **Podrobnosti**

  Když je element s `v-if` přepnut, element a jeho obsažené direktivy / komponenty jsou zničeny a znovu vytvořeny. Pokud je počáteční podmínka nepravdivá, vnitřní obsah nebude vůbec vykreslen.

  Lze použít na `<template>` pro označení podmíněného bloku obsahujícího pouze text nebo více elementů.

  Tato direktiva spouští přechody, když se změní její podmínka.

  Pokud jsou použity společně, `v-if` má vyšší prioritu než `v-for`. Nedoporučujeme používat tyto dvě direktivy společně na jednom elementu - pro podrobnosti se podívejte na [průvodce vykreslováním seznamu](/guide/essentials/list#v-for-with-v-if).

- **Viz také:** [Podmíněné vykreslování - v-if](/guide/essentials/conditional#v-if)

## v-else {#v-else}

Označuje "else blok" pro `v-if` nebo řetězec `v-if` / `v-else-if`.

- **Nepředpokládá výraz**

- **Podrobnosti**

  - Omezení: předchozí element (sibling) musí mít `v-if` nebo `v-else-if`.

  - Lze použít na `<template>` pro označení podmíněného bloku obsahujícího pouze text nebo více prvků.

- **Příklad**

  ```vue-html
  <div v-if="Math.random() > 0.5">
    Teď mě vidíš
  </div>
  <div v-else>
    Teď mě nevidíš
  </div>
  ```

- **Viz také:** [Podmíněné vykreslování - v-else](/guide/essentials/conditional#v-else)

## v-else-if {#v-else-if}

Označuje "else if blok" pro `v-if`. Může být řetězený (více "else if" větví).

- **Očekává:** `any`

- **Podrobnosti**

  - Omezení: předchozí element (sibling) musí mít `v-if` nebo `v-else-if`.

  - Lze použít na `<template>` pro označení podmíněného bloku obsahujícího pouze text nebo více prvků.

- **Příklad**

  ```vue-html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Není A/B/C
  </div>
  ```

- **Viz také:** [Podmíněné vykreslování - v-else-if](/guide/essentials/conditional#v-else-if)

## v-for {#v-for}

Vykreslí element nebo blok šablony vícekrát na základě zdrojových dat.

- **Očekává:** `Array | Object | number | string | Iterable`

- **Podrobnosti**

  Hodnota direktivy musí používat speciální syntaxi `alias in expression` pro poskytnutí aliasu na aktuální element, který je iterován:

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternativně můžete také specifikovat alias pro index (nebo klíč, pokud se používá na objektu):

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  Výchozí chování `v-for` je pokusit se opravit elementy na místě, aniž by byly přesouvány. Pokud chcete, aby byly přeuspořádány, měli byste poskytnout nápovědu pro řazení pomocí speciálního atributu `key`:

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` může také pracovat s hodnotami, které implementují [Iterable Protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol), včetně nativních `Map` a `Set`.

- **Viz také:**
  - [Vykreslování seznamu](/guide/essentials/list)

## v-on {#v-on}

Připojí k elementu event listener.

- **Zkratka:** `@`

- **Očekává:** `Function | Inline Statement | Object (bez parametru)`

- **Parametr:** `event` (volitelné při použití objektové syntaxe)

- **Modifikátory**

  - `.stop` - zavolá `event.stopPropagation()`.
  - `.prevent` - zavolá `event.preventDefault()`.
  - `.capture` - přidá event listener v režimu zachycení (capture mode).
  - `.self` - spustí handler pouze tehdy, pokud byla událost vyvolána z tohoto elementu.
  - `.{keyAlias}` - spustí handler pouze pro určité klávesy.
  - `.once` - spustí handler maximálně jednou.
  - `.left` - spustí handler pouze pro události levého tlačítka myši.
  - `.right` - spustí handler pouze pro události pravého tlačítka myši.
  - `.middle` - spustí handler pouze pro události středního tlačítka myši.
  - `.passive` - připojí DOM událost s `{ passive: true }`.

- **Podrobnosti**

  Typ události je určen parametrem. Výraz může být název metody, vložený příkaz nebo může být vynechán, pokud jsou přítomny modifikátory.

  Pokud je použito na běžném elementu, naslouchá pouze [**nativním DOM událostem**](https://developer.mozilla.org/en-US/docs/Web/Events). Pokud je použito na elementu vlastní komponenty, naslouchá **vlastním událostem** emitovaným na tomto potomkovi.

  Při naslouchání nativním DOM událostem metoda přijímá jako jediný argument nativní událost. Pokud je použit vložený příkaz, příkaz má přístup k speciální vlastnosti `$event`: `v-on:click="handle('ok', $event)"`.

  `v-on` také podporuje binding na objekt párů událost / listener bez argumentu. Pozor, při použití objektové syntaxe nepodporuje žádné modifikátory.

- **Příklad**

  ```vue-html
  <!-- handler metody -->
  <button v-on:click="doThis"></button>

  <!-- dynamická událost -->
  <button v-on:[event]="doThis"></button>

  <!-- inline příkaz -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- zkratka -->
  <button @click="doThis"></button>

  <!-- zkratka pro dynamickou událost -->
  <button @[event]="doThis"></button>

  <!-- zastavení propagace -->
  <button @click.stop="doThis"></button>

  <!-- zamezení výchozího chování -->
  <button @click.prevent="doThis"></button>

  <!-- zamezení výchozího chování bez výrazu -->
  <form @submit.prevent></form>

  <!-- řetězení modifikátorů -->
  <button @click.stop.prevent="doThis"></button>

  <!-- modifikátor klávesy pomocí keyAlias -->
  <input @keyup.enter="onEnter" />

  <!-- událost click bude spuštěna nejvýše jednou -->
  <button v-on:click.once="doThis"></button>

  <!-- objektová syntaxe -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Naslouchání vlastním událostem na komponentě potomka (handler je volán při emitování "my-event" z potomka):

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- inline příkaz -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **Viz také:**
  - [Obsluha událostí](/guide/essentials/event-handling)
  - [Základy komponent - Naslouchání událostem](/guide/essentials/component-basics#listening-to-events)

## v-bind {#v-bind}

Dynamicky váže jeden nebo více atributů nebo vlastností (props) komponenty na výraz.

- **Zkratka:** 
  - `:` nebo `.` (pokud se používá modifikátor `.prop`)
  - Vynechání hodnoty (pokud mají atribut vázaná hodnota stejný název) <sup class="vt-badge">3.4+</sup>

- **Očekává:** `libovolný (s parametrem) | Objekt (bez parametru)`

- **Parametr:** `attrOrProp (volitelné)`

- **Modifikátory**

  - `.camel` - převede název atributu z kebab-case na camelCase.
  - `.prop` - vynutí binding jako vlastnost DOM. <sup class="vt-badge">3.2+</sup>
  - `.attr` - vynutí binding jako atribut DOM. <sup class="vt-badge">3.2+</sup>

- **Použití**

  Pokud se používá pro binding atributu `class` nebo `style`, `v-bind` podporuje další typy hodnot, jako jsou pole nebo objekty. Podrobnosti naleznete v příslušné části průvodce níže.

  Při nastavování bindingu na element Vue ve výchozím nastavení kontroluje, zda má element klíč definovaný jako vlastnost pomocí operátoru `in`. Pokud je vlastnost definována, Vue nastaví hodnotu jako vlastnost DOM místo atributu. To by mělo fungovat ve většině případů, ale toto chování můžete přepsat explicitním použitím modifikátorů `.prop` nebo `.attr`. To je někdy nutné, zejména při [práci s custom elementy](/guide/extras/web-components#passing-dom-properties).

  Při použití pro binding vlastností (props) komponenty musí být vlastnost v komponentě potomka správně deklarována.

  Pokud se používá bez parametru, může být použito pro binding objektu obsahujícího páry název-hodnota atributu.

- **Příklad**

  ```vue-html
  <!-- binding atributu -->
  <img v-bind:src="imageSrc" />

  <!-- dynamický název atributu -->
  <button v-bind:[key]="value"></button>

  <!-- zkratka -->
  <img :src="imageSrc" />

  <!-- zkratka stejného názvu (3.4+), bude rozšířeno na :src="src" -->
  <img :src />

  <!-- zkratka s dynamickým názvem atributu -->
  <button :[key]="value"></button>

  <!-- se spojením řetězců -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- binding třídy -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

<!-- binding stylů -->
<div :style="{ fontSize: size + 'px' }"></div>
<div :style="[styleObjectA, styleObjectB]"></div>

<!-- binding objektu attributů -->
<div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

<!-- binding vlastnost (prop), "prop" musí být v komponentě potmka deklarována -->
<MyComponent :prop="someThing" />

<!-- předání props z rodiče, které jsou společné  s komponentnou potomka -->
<MyComponent v-bind="$props" />

<!-- XLink -->
<svg><a :xlink:special="foo"></a></svg>
```

Modifikátor `.prop` má také zkrácenou formu, `.`:

```vue-html
<div :someProperty.prop="someObject"></div>

<!-- ekvivalentní zápis -->
<div .someProperty="someObject"></div>
```

Modifikátor `.camel` umožňuje převést jméno atributu `v-bind` na camelCase, například atribut `viewBox` ve SVG:

```vue-html
<svg :view-box.camel="viewBox"></svg>
```

`.camel` není potřeba, pokud používáte řetězcové šablony nebo předkompilujete šablonu pomocí build fáze.

- **Viz také:**
  - [Binding tříd a stylů](/guide/essentials/class-and-style)
  - [Vlastnosti (Props) - Detaily předávání vlastností](/guide/components/props#prop-passing-details)

## v-model {#v-model}

Vytvoří oboustranný binding na input element formuláře nebo komponenty.

- **Očekává:** hodnota závisí na hodnotě input elementu formuláře nebo výstupu komponenty

- **Omezeno na:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - komponenty

- **Modifikátory**

  - [`.lazy`](/guide/essentials/forms#lazy) - naslouchá událostem `change` místo `input`
  - [`.number`](/guide/essentials/forms#number) - převede platný řetězcový vstup na čísla
  - [`.trim`](/guide/essentials/forms#trim) - odstraní přebytečné mezery

- **Viz také:**

  - [Vazby input elementů formuláře](/guide/essentials/forms)
  - [Binding přes v-model](/guide/components/v-model)

## v-slot {#v-slot}

Určuje pojmenované sloty nebo scoped sloty, které očekávají předání vlastností (props).

- **Zkrácený zápis:** `#`

- **Očekává:** JavaScriptový výraz, který je platný v pozici argumentu funkce, včetně podpory dekonstrukce. Volitelné - je potřeba pouze pokud očekáváte, že budou do slotu předány vlastnosti.

- **Parametr:** název slotu (volitelné, výchozí hodnota je `default`)

- **Omezeno na:**

  - `<template>`
  - [komponenty](/guide/components/slots#scoped-slots) (pro samostatný default slot s props)

- **Příklad**

  ```vue-html
  <!-- Jmenované sloty -->
  <BaseLayout>
    <template v-slot:header>
      Obsah záhlaví
    </template>

    <template v-slot:default>
      Obsah default slotu
    </template>

    <template v-slot:footer>
      Obsah zápatí
    </template>
  </BaseLayout>

  <!-- Pojmenovaný slot, který přijímá props -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- Default slot, který přijímá props s dekonstrukcí -->
  <Mouse v-slot="{ x, y }">
    Pozice myši: {{ x }}, {{ y }}
  </Mouse>
  ```

- **Viz také:**
  - [Komponenty - Sloty (Slots)](/guide/components/slots)

## v-pre {#v-pre}

Přeskočit kompilaci tohoto elementu a všech jeho potomků.

- **Nepředpokládá výraz** 

- **Podrobnosti**

  Uvnitř elementu s `v-pre` budou všechny syntaxe Vue šablony zachovány a vykresleny tak, jak jsou. Nejběžnějším použitím je zobrazení nezpracovaných "mustache" tagů.

- **Příklad**

  ```vue-html
  <span v-pre>{{ toto nebude zkompilováno }}</span>
  ```

## v-once {#v-once}

Vykreslit element nebo komponentu pouze jednou a přeskočit budoucí aktualizace.

- **Nepředpokládá výraz** 

- **Podrobnosti**

  Při dalších překreslováních budou element/komponenta a všichni potomci považováni za statický obsah a přeskočeni. To lze použít k optimalizaci výkonu aktualizace.

  ```vue-html
  <!-- jediný prvek -->
  <span v-once>Toto se nikdy nezmění: {{msg}}</span>
  <!-- element s potomky -->
  <div v-once>
    <h1>komentář</h1>
    <p>{{msg}}</p>
  </div>
  <!-- komponenta -->
  <MyComponent v-once :comment="msg"></MyComponent>
  <!-- direktiva `v-for` -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  Od verze 3.2 si můžete také část šablony "zapamatovat" (memoize) s podmínkami neplatnosti pomocí [`v-memo`](#v-memo).

- **Viz také:**
  - [Syntaxe šablon - Interpolace textu](/guide/essentials/template-syntax#text-interpolation)
  - [v-memo](#v-memo)

## v-memo <sup class="vt-badge" data-text="3.2+" /> {#v-memo}

- **Očekává:** `any[]`

- **Podrobnosti**

  Uloží si (memoize) podstrom šablony. Může být použito jak na elementech, tak na komponentách. Direktiva očekává pole hodnot závislostí pevné délky, které se porovnávají pro memoizaci. Pokud každá hodnota v poli byla stejná jako při posledním vykreslení, aktualizace pro celý podstrom bude přeskočena. Například:

  ```vue-html
  <div v-memo="[hodnotaA, hodnotaB]">
    ...
  </div>
  ```

  Při opětovném vykreslení komponenty, pokud zůstanou jak `hodnotaA`, tak `hodnotaB` stejné, všechny aktualizace pro tento `<div>` a jeho potomky budou přeskočeny. Ve skutečnosti bude přeskočeno i vytváření Virtual DOM VNode, protože memoizovaná kopie podstromu může být znovu použita.

  Je důležité správně specifikovat pole pro memoizaci, jinak můžeme přeskočit aktualizace, které by aplikovány být měly. `v-memo` s prázdným polem závislostí (`v-memo="[]"`) by bylo funkčně ekvivalentní `v-once`.

  **Použití s `v-for`**

  `v-memo` je poskytováno výhradně pro mikrooptimalizace výkonu a je potřeba jen zřídka. Nejběžnější případ, kdy se to může hodit, je při vykreslování velkých seznamů `v-for` (kde `length > 1000`):

  ```vue-html
  <div v-for="polozka in seznam" :key="polozka.id" v-memo="[polozka.id === vybrano]">
    <p>ID: {{ polozka.id }} - vybráno: {{ polozka.id === vybrano }}</p>
    <p>...další potomci</p>
  </div>
  ```

  Při změně stavu `vybrano` komponenty bude vytvořeno velké množství VNodes, i když většina položek zůstala přesně stejná. Použití `v-memo` zde znamená "aktualizujte tuto položku pouze tehdy, pokud se změnila z nevybrané na vybranou nebo naopak". To umožňuje každé neovlivněné položce znovu použít její předchozí VNode a úplně přeskočit porovnávání rozdílů. Poznamenejme, že zde do pole závislostí memoizace nemusíme zahrnout `polozka.id`, protože Vue ji automaticky odvodí z `:key` položky.

  :::warning
  Při použití `v-memo` s `v-for` se ujistěte, že jsou použity na stejném elementu. **`v-memo` nefunguje uvnitř `v-for`.**
  :::

  `v-memo` lze také použít na komponentách k manuálnímu zabránění nechtěným aktualizacím v určitých okrajových případech, kdy byla kontrola aktualizace potomka de-optimalizována. Ale opět je zodpovědností vývojáře specifikovat správné pole závislostí, aby se zabránilo vynechání nutných aktualizací.

- **Viz také:**
  - [v-once](#v-once)

## v-cloak {#v-cloak}

Používá se k skrytí nezkompilované šablony, dokud není připravena.

- **Nepředpokládá výraz**

- **Podrobnosti**

  **Tato direktiva je potřeba pouze při použití bez build fáze.**

  Při použití in-DOM šablon může dojít k "blikání (flashing) nezkompilovaných šablon": uživatel může vidět nezpracované "mustache" značky, dokud je připojená (mounted) komponenta nenahradí vykresleným obsahem.

  `v-cloak` zůstane na elementu, dokud není připojena příslušná instance komponenty. Spolu s CSS pravidly jako `[v-cloak] { display: none }` lze použít k skrytí nezpracovaných šablon, dokud není komponenta připravena.

- **Příklad**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```vue-html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  `<div>` nebude viditelný, dokud nebude dokončena kompilace.
