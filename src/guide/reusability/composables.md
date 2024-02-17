# Composables {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
Tato část předpokládá základní znalost Composition API. Pokud jste se učili Vue pouze s&nbsp;Options API, můžete nastavit předvolbu API na Composition API (pomocí přepínače v&nbsp;horní části levého postranního panelu) a znovu si přečíst kapitoly [Základy reaktivity](/guide/essentials/reactivity-fundamentals) a&nbsp;[Lifecycle Hooks](/guide/essentials/lifecycle).
:::

## Co je to "Composable"? {#what-is-a-composable}

V kontextu Vue aplikací je „composable“ funkce, která maximálně využívá Vue Composition API k obalení a znovupoužití **stavové (stateful) logiky**.

Při vytváření frontendových aplikací často potřebujeme znovupoužívat logiku pro běžné úkoly. Například můžeme potřebovat formátovat data na mnoha místech, takže pro to vytvoříme znovupoužitelnou funkci. Tato formátovací funkce zapouzdřuje **bezstavovou (stateless) logiku**: přijme nějaký vstup a okamžitě vrátí očekávaný výstup. Pro znovupoužití bezstavové logiky existuje mnoho knihoven - například [lodash](https://lodash.com/) a [date-fns](https://date-fns.org/), o kterých jste možná už slyšeli.

Naproti tomu stavová logika zahrnuje management stavu (state), který se v průběhu času mění. Jednoduchým příkladem může být sledování aktuální polohy myši na stránce. V reálných aplikacích by se mohlo jednat i o složitější logiku, jako jsou dotyková gesta nebo stav připojení k databázi.

## Příklad sledování polohy myši {#mouse-tracker-example}

Pokud bychom implementovali funkci sledování myši pomocí Composition API přímo v&nbsp;komponentě, vypadalo by to takto:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Myš je na: {{ x }}, {{ y }}</template>
```

Co když ale chceme stejnou logiku použít opakovaně ve více komponentách? Můžeme ji extrahovat do externího souboru jako composable funkci:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// dle konvence začínají composable funkce na "use"
export function useMouse() {
  // stav obalený a spravovaný v composable
  const x = ref(0)
  const y = ref(0)

  // composable může svůj stav v čase průběžně upravovat
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // composable se také může napojit na životní cyklus
  // komponenty, která ji vlastní, pro vedlejší efekty 
  // při setup a teardown fázi
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // vystavit spravovaný stav jako návratovou hodnotu
  return { x, y }
}
```

A takto ji lze použít v komponentách:

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Myš je na: {{ x }}, {{ y }}</template>
```

<div class="demo">
  Myš je na: {{ x }}, {{ y }}
</div>

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

Jak vidíme, jádro logiky zůstává stejné - stačilo ji přesunout do externí funkce a vrátit stav, který má být vystaven. Stejně jako uvnitř komponenty můžete v composable objektech používat kompletní paletu funkcí [Composition API](/api/#composition-api). Stejnou funkci `useMouse()` lze nyní použít v jakékoli komponentě.

Ještě větší výhodou composables je, že je můžete také vnořovat: jedna composable funkce může volat jednu nebo více dalších composables. To nám umožňuje skládat složitou logiku pomocí malých, izolovaných jednotek, podobně jako skládáme celou aplikaci pomocí komponent. To je vlastně důvod, proč jsme se rozhodli nazvat kolekci rozhraní API, která tento vzor umožňuje, Composition API.

Například logiku přidávání a odebírání DOM event listeneru můžeme vyčlenit do vlastní composable funkce:

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // pokud chcete, můžete tuto funkci upravit
  // aby jako `target` podporovala 'selector strings'
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

A nyní lze naši composable `useMouse()` zjednodušit na:

```js{3,9-12}
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
Každá instance komponenty volající `useMouse()` vytvoří své vlastní kopie stavu `x` a `y`, takže se nebudou vzájemně rušit. Pokud chcete spravovat sdílený stav mezi komponentami, přečtěte si kapitolu [Správa stavu](/guide/scaling-up/state-management).
:::

## Příklad s asynchronním stavem {#async-state-example}

Composable `useMouse()` nepřijímá žádné parametry, proto se podívejme na další příklad, který jeden využívá. Při asynchronním načítání dat často potřebujeme zpracovávat různé stavy: načítání, úspěch a chyba:

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Nastala chyba: {{ error.message }}</div>
  <div v-else-if="data">
    Data byla načtena:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Načítání...</div>
</template>
```

Bylo by otravné opakovat tento vzor v každé komponentě, která potřebuje načíst data. Vytáhněme jej do composable:

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Nyní můžeme v naší komponentě jednoduše psát:

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### Přijímání reaktivního stavu {#accepting-reactive-state}

`useFetch()` přijímá jako vstup statický URL string - načtení tedy provede pouze jednou a poté je hotovo. Co když chceme, aby se načítání opakovalo, kdykoli se změní adresa URL? Toho můžeme dosáhnout tím, že do composable funkce předáme reaktivní stav a&nbsp;necháme composable vytvořit watchery, které budou provádět akce s použitím předaného stavu.

Například `useFetch()` by mělo být schopno akceptovat ref:

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// toto by mělo spustit re-fetch
url.value = '/new-url'
```

Nebo akceptovat getter funkci:

```js
// re-fetch když se změní props.id
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

Můžeme refaktorovat naši existující implemntaci pomocí API funkcí [`watchEffect()`](/api/reactivity-core.html#watcheffect) a&nbsp;[`toValue()`](/api/reactivity-utilities.html#tovalue):

```js{8,13}
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // resetovat stav před načtením hodnot
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

`toValue()` je API přidané ve Vue 3.3. Je určeno k normalizaci refs a getter funkcí na hodnoty. Pokud je vstupním parametrem ref, vrátí jeho `.value`, pokud je parametrem funkce, zavolá funkci a vrátí její návratovou hodnotu. Jinak vrátí parametr tak, jak byl předán. Funguje podobně jako [`unref()`](/api/reactivity-utilities.html#unref), ale se speciálním přístupem k funkcím.

Všimněte si, že `toValue(url)` je voláno **uvnitř** callbacku funkce `watchEffect`. Toto zajišťuje, že všechny reaktivní závislosti navštívené během normalizace v rámci `toValue()` jsou sledovány watcherem.

Tato verze `useFetch()` nyní přijímá statický URL string, refs i gettery, což ji dělá více flexibilní. `watchEffect()` se ihned spustí a bude sledovat jakékoli závislosti navštívené během `toValue(url)`. Pokud nejsou sledovány žádné závislosti (např. URL už je statický string), efekt proběhne pouze jednou; jinak se spustí znovu pokaždé, když se sledovaná závislost změní.

Zde je [aktualizovaná verze `useFetch()`](https://play.vuejs.org/#eNp9Vdtu20YQ/ZUpUUA0qpAOjL4YktCbC7Rom8BN8sSHrMihtfZql9iLZEHgv2dml6SpxMiDIWkuZ+acmR2fs1+7rjgEzG6zlaut7Dw49KHbVFruO2M9nMFiu4Ta7LvgsYEeWmv2sKCkxSwoOPwTfb2b/EU5mopHR5GVro12HrbC4UerYA2Lnfeduy3LR2d0p0SNO6MatIU/dbI2DRZUtPSmMa4kgJQuG8qkjvLF28XVaAwRb2wxz69gvZkK/UQ5xUGogBQ/ZpyhEV4sAa01lnpeTwRyApsFWvT2RO6Eea40THBMgfq6NLwlS1/pVZnUJB3ph8c98fNIvwD+MaKBzkQut2xYbYP3RsPhTWvsusokSA0/Vxn8UitZP7GFSX/+8Sz7z1W2OZ9BQt+vypQXS1R+1cgDQciW4iMrimR0wu8270znfoC7SBaJWdAeLTa3QFgxuNijc+IBIy5PPyYOjU19RDEI954/Z/UptKTy6VvqA5XD1AwLTTl/0Aco4s5lV51F5sG+VJJ+v4qxYbmkfiiKYvSvyknPbJnNtoyW+HJpj4Icd22LtV+CN5/ikC4XuNL4HFPaoGsvie3FIqSJp1WIzabl00HxkoyetEVfufhv1kAu3EnX8z0CKEtKofcGzhMb2CItAELL1SPlFMV1pwVj+GROc/vWPoc26oDgdxhfSArlLnbWaBOcOoEzIP3CgbeifqLXLRyICaDBDnVD+3KC7emCSyQ4sifspOx61Hh4Qy/d8BsaOEdkYb1sZS2FoiJKnIC6FbqhsaTVZfk8gDgK6cHLPZowFGUzAQTNWl/BUSrFbzRYHXmSdeAp28RMsI0fyFDaUJg9Spd0SbERZcvZDBRleCPdQMCPh8ARwdRRnBCTjGz5WkT0i0GlSMqixTR6VKyHmmWEHIfV+naSOETyRx8vEYwMv7pa8dJU+hU9Kz2t86ReqjcgaTzCe3oGpEOeD4uyJOcjTXe+obScHwaAi82lo9dC/q/wuyINjrwbuC5uZrS4WAQeyTN9ftOXIVwy537iecoX92kR4q/F1UvqIMsSbq6vo5XF6ekCeEcTauVDFJpuQESvMv53IBXadx3r4KqMrt0w0kwoZY5/R5u3AZejvd5h/fSK/dE9s63K3vN7tQesssnnhX1An9x3//+Hz/R9cu5NExRFf8d5zyIF7jGF/RZ0Q23P4mK3f8XLRmfhg7t79qjdSIobjXLE+Cqju/b7d6i/tHtT3MQ8VrH/Ahstp5A=) s umělým zpožděním a náhodnými chybami pro demo účely.

## Konvence a osvědčené postupy {#conventions-and-best-practices}

### Naming {#naming}

Composable funkce se podle koncence pojmenovávají camelCase jmény, která začínají na "use".

### Vstupní parametry {#input-arguments}

Composable může přijímat parametry typu ref nebo gettery, i když se na ně při reaktivitě nespoléhá. Pokud píšete composable, který mohou používat i jiní vývojáři, je dobré ošetřit případ, kdy jsou namísto surových (raw) hodnot vstupními parametry ref nebo gettery. K tomuto účelu se bude hodit pomocná funkce [`toValue()`](/api/reactivity-utilities#tovalue):

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // pokud je `maybeRefOrGetter` ref nebo getter
  // bude vrácena jeho normalizovaná hodnota
  // jinak bude `maybeRefOrGetter` vrácen ve své aktuální podobě
  const value = toValue(maybeRefOrGetter)
}
```

Pokud vaše composable vytváří reaktivní efekty a vstupem je ref nebo getter, ujistěte se, že ref / getter buďto explicitně sledujete pomocí `watch()`, nebo uvnitř `watchEffect()` zavolejte `toValue()`, aby byl sledován správně.

Implementace [useFetch() představená dříve](#accepting-reactive-state) poskytuje konkrétní příklad composable, která přijímá refs, gettery i prosté hodnoty jako vstupní parametry.

### Návratové hodnoty {#return-values}

Možná jste si všimli, že v composables používáme výhradně `ref()` namísto `reactive()`. Doporučenou konvencí je, aby composables vždy vracely obyčejný nereaktivní objekt obsahující více refs. To v komponentách umožňuje jeho destrukturování zároveň se zachováním reaktivity:

```js
// x a y jsou refs
const { x, y } = useMouse()
```

Vrácení reaktivního objektu z composable způsobí, že tato destrukturování ztratí reaktivní spojení se stavem uvnitř composable, zatímco refs si toto spojení zachovají.

Pokud dáváte přednost použití stavu vráceného z composables jako vlastností objektu, můžete vrácený objekt obalit metodou `reactive()` tak, aby byly refs rozbaleny. Například:

```js
const mouse = reactive(useMouse())
// mouse.x odkazuje na původní ref
console.log(mouse.x)
```

```vue-html
Myš je na: {{ mouse.x }}, {{ mouse.y }}
```

### Vedlejší efekty {#side-effects}

Je v pořádku provádět vedlejší efekty uvnitř composables (např. přidávat DOM event listenery nebo načítat data), dávejte však pozor na následující pravidla:

- Pokud pracujete na aplikaci, která používá [Vykreslování na serveru](/guide/scaling-up/ssr) (SSR), ujistěte se, že vedlejší efekty specifické pro DOM jsou prováděny v lifecycle hooks po mount fázi, např. `onMounted()`. Tyto hooks jsou volány pouze v prohlížeči, takže si můžete být jisti, že kód uvnitř nich má k DOM přístup.

- Nezapomeňte vedlejší účinky „uklidit“ v `onUnmounted()`. Například pokud composable nastaví DOM event listener, měla by tento listener v `onUnmounted()` zase odstranit, jak jsme viděli v příkladu `useMouse()`. Může být užitečné použít composable, které to automaticky udělá za vás, jako je příklad `useEventListener()`.

### Omezení použití {#usage-restrictions}

Composables by měly být volány v rámci `<script setup>` nebo uvnitř `setup()`. V těchto kontextech by také měly být volány **synchrononně**. V některých případech je můžete volat také v lifecycle hooks jako je `onMounted()`.

Tato omezení jsou důležitá, protože se jedná o kontexty, ve kterých je Vue schopno určit právě aktivní instanci komponenty. Přístup k aktivní instanci komponenty je nutný, aby do ní bylo možné:

1. Registrovat lifecycle hooks.

2. Nalinkovat computed proměnné a watchery, aby je při odstraňování (unmount) instance šlo zlikvidovat pro prevenci úniků paměti (memory leaks).

:::tip
`<script setup>` je jediné místo, kde můžete composables volat **po** použití příkazu `await`. Kompilátor za vás po asynchronní operaci automaticky obnoví kontext aktivní instance.
:::

## Extrakce composables pro organizaci kódu {#extracting-composables-for-code-organization}

Composables lze extrahovat nejen pro opakované použití, ale také pro organizaci kódu. Jak složitost komponent poroste, můžete skončit s takovými, které jsou příliš velké na to, abyste se v nich mohli orientovat a uvažovat o nich. Composition API vám poskytuje plnou flexibilitu při organizaci kódu komponent do menších funkcí na základě logických domén:

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

Do jisté míry si tyto extrahované composables můžete představit jako služby v rozsahu komponent, které spolu mohou komunikovat.

## Použití composables v Options API {#using-composables-in-options-api}

Pokud používáte Options API, musí být composables volány uvnitř `setup()` a návratové hodnoty musí být ze `setup()` vráceny, aby byly vystaveny pro `this` a pro šablonu:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // proměnné, které jsou vystaveny skrz sekci `setup()`
    // jsou dostupné přes `this`
    console.log(this.x)
  }
  // ...další sekce
}
```

## Porovnání s ostatními technikami {#comparisons-with-other-techniques}

### vs. Mixins {#vs-mixins}

Uživatelé, kteří přicházejí od Vue 2, možná znají [mixins](/api/options-composition#mixins), které nám také umožňují extrahovat logiku komponent do opakovaně použitelných jednotek. Mixins mají tři hlavní nevýhody:

1. **Nejasný zdroj vlastností**: při použití mnoha mixins přestává být jasné, která vlastnost instance je implementována (injected) kterým, což ztěžuje sledování implementace a&nbsp;pochopení chování komponenty. To je také důvod, proč doporučujeme pro composables používat vzor refs + destrukturování: díky němu je zdroj vlastností v&nbsp;komponentách konzumentů zřejmý.

2. **Kolize jmenných prostorů**: mixins od různých autorů může potenciálně registrovat stejné klíče vlastností, což způsobuje kolize jmenných prostorů. U composables můžete přejmenovat destrukturované proměnné, pokud z různých composables přijdou konfliktní klíče.

3. **Implicitní cross-mixin komunikace**: mixins, které spolu potřebují komunikovat, se musí spoléhat na sdílené klíče vlastností, čímž se stávají implicitně spřaženými (coupled). V případě composables lze hodnoty vrácené z jedné composable předat do jiné jako parametry, stejně jako u běžných funkcí.

Z výše uvedených důvodů již ve Vue 3 nedoporučujeme mixins používat. Funkce je zachována pouze pro učely migrace a kvůli obecné znalosti.
### vs. renderless komponenty {#vs-renderless-components}

V kapitole o slotech (slots) jsme se bavili o vzoru [komponent bez vykreslení](/guide/components/slots#renderless-components) založeném na scoped slotech. Dokonce jsme s použitím renderless komponenty implementovali stejný příklad sledování pohybu myši.

Hlavní výhodou composables oproti renderless komponentám je, že composables nemají dodatečnou režii v podobě instancí komponent. Při použití v celé aplikaci může množství dalších instancí komponent vytvořených vzorem renderless komponentám představovat znatelnou výkonnostní zátěž.

Doporučení je používat composables při opakovaném použití čisté logiky a komponenty při opakovaném použití logiky i vizuálního vzhledu.

### vs. React hooks {#vs-react-hooks}

Pokud máte zkušenosti s Reactem, možná jste si všimli, že to vypadá velmi podobně jako custom React hooks. Composition API bylo  React hooks částečně inspirováno a Vue composables jsou React hooks skutečně podobné, pokud jde o možnosti logické kompozice. Vue composables jsou však založeny na systému jemné (fine-grained) Vue reaktivity, který se od modelu provádění React hooks zásadně liší. Podrobněji je to popsáno v dokumentu [Composition API FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Další čtení {#further-reading}

- [Reaktivita podrobně](/guide/extras/reactivity-in-depth): pro pochopení fungování systému Vue reaktivity do větší hloubky na nižší úrovni.
- [Správa stavu](/guide/scaling-up/state-management): pro vzory správy stavu sdíleného více komponentami.
- [Testování composables](/guide/scaling-up/testing#testing-composables): tipy na jednotkové testování composables.
- [VueUse](https://vueuse.org/): stále rostoucí kolekce Vue composables. Zdrojový kód je také skvělým zdrojem pro učení.
