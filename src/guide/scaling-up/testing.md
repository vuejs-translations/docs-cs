<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Testování {#testing}

## Proč testovat? {#why-test}

Automatizované testy vám a vašemu týmu pomáhají rychle a sebejistě stavět složité Vue aplikace tím, že předcházejí regresím a podporují rozdělení vaší aplikace na testovatelné funkce, moduly, třídy a komponenty. Stejně jako u jakéhokoli jiného programu může vaše nová Vue aplikace různými způsoby selhat a je důležité, abyste tyto problémy odhalili a&nbsp;opravili před vydáním.

V této příručce se budeme zabývat základní terminologií a poskytneme naše doporučení ohledně nástrojů, které si pro vaši Vue 3 aplikaci vybrat.

Existuje jedna sekce specifická pro Vue, která se zabývá composable funkcemi. Pro více informací se podívejte na [Testování composables](#testing-composables) níže.

## Kdy testovat? {#when-to-test}

Začněte testovat brzy! Doporučujeme začít psát testy co nejdříve. Čím déle s přidáním testů do vaší aplikace čekáte, tím více závislostí bude mít, a tím těžší bude začít.

## Typy testování {#testing-types}

Při návrhu strategie testování vaší Vue aplikace byste měli využít následující typy testů:

- **Jednotkové**: Kontrolují, zda vstupy do dané funkce, třídy nebo composable funkce produkují očekávaný výstup nebo vedlejší efekty.
- **Komponentové**: Kontrolují, zda se vaše komponenta připojuje (mounts), vykresluje se, lze s ní interagovat a chová se tak, jak se očekává. Tyto testy importují více kódu než jednotkové (unit) testy, jsou složitější a vyžadují více času na vykonání.
- **End-to-end**: Kontrolují funkce, které se rozprostírají přes více stránek a provádí skutečné síťové požadavky na vaši produkční Vue aplikaci. Tyto testy často zahrnují spuštění databáze nebo jiného backendu.

Každý typ hraje ve strategii testování vaší aplikace roli a každý vás ochrání před různými typy problémů.

## Přehled {#overview}

Stručně si popíšeme, co to jsou jednotkové, komponentové a end-to-end testy, jak je lze do Vue aplikací implementovat, a poskytneme nějaká obecná doporučení.

## Jednotkové testování {#unit-testing}

Jednotkové (unit) testy jsou psány k ověření, že malé, izolované části kódu fungují správně. Jednotkový test obvykle pokrývá jednu funkci, třídu, composable nebo modul. Jednotkové testy se zaměřují na logickou správnost a zabývají se pouze malou částí celkové funkcionality aplikace. Mohou simulovat velkou část prostředí vaší aplikace (např. počáteční stav, složité třídy, moduly třetích stran a síťové požadavky).

Obecně platí, že jednotkové testy odhalí problémy s business logikou a logickou správností funkce.

Vezměme si například tuto funkci `increment`:

```js
// helpers.js
export function increment (current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

Protože je velmi samostatná, bude snadné zavolat funkci `increment` a ověřit, že vrátí očekávanou hodnotu, takže napíšeme jednotkový test.

Pokud některé z těchto tvrzení selže, je zřejmé, že problém je obsažen v funkci `increment`.

```js{4-16}
// helpers.spec.js
import { increment } from './helpers'

describe('increment', () => {
  test('zvýší aktuální číslo o 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('nezmění aktuální číslo přes maximum', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('má výchozí maximum 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

Jak již bylo řečeno, jednotkové testování se obvykle používá pro samostatnou business logiku, komponenty, třídy, moduly nebo funkce, které nezahrnují vykreslování uživatelského rozhraní, síťové požadavky nebo jiné záležitosti prostředí.

Obvykle to jsou prosté JavaScript / TypeScript moduly, které nesouvisejí s Vue. Obecně platí, že psaní jednotkových testů pro business logiku ve Vue aplikacích se výrazně neliší od aplikací používajících jiné frameworky.

Existují dvě situace, kdy se testují jednotkové funkce SPECIFICKÉ pro Vue:

1. Composables
2. Komponenty

### Composables {#composables}

Jedna kategorie funkcí specifických pro Vue aplikace jsou [composables](/guide/reusability/composables), které mohou během testů vyžadovat speciální zacházení.
Viz [Testování composables](#testing-composables) níže pro více podrobností.

### Jednotkové testování komponent {#unit-testing-components}

Komponentu lze testovat dvěma způsoby:

1. Whitebox: Jednotkové testování

   Testy označované jako „Whitebox testy“ jsou obeznámené s implementačními detaily a závislostmi komponenty. Zaměřují se na **izolaci** testované komponenty. Tyto testy obvykle zahrnují mockování některých nebo všech potomků komponenty, stejně jako nastavení stavu pluginu a závislostí (např. Pinia).

2. Blackbox: Komponentové testování

   Testy označované jako „Blackbox testy“ nejsou obeznámené s implementačními detaily komponenty. Tyto testy mockují co nejméně, aby otestovaly integraci komponenty a celého systému. Obvykle vykreslují všechny potomky komponenty a&nbsp;jsou považovány za „integrační testy“. Viz [doporučení pro testování komponent](#component-testing) níže.

### Doporučení {#recommendation}

- [Vitest](https://vitest.dev/)

  Jelikož oficiální nastavení vytvořené pomocí `create-vue` je založeno na [Vite](https://vitejs.dev/), doporučujeme použít unit test framework, který může přímo využít stejnou konfiguraci a transformační pipeline z Vite. [Vitest](https://vitest.dev/) je unit test framework navržený speciálně pro tento účel, vytvořený a udržovaný členy týmu Vue / Vite. Snadno se integruje s&nbsp;projekty založenými na Vite a je velmi rychlý.

### Další možnosti {#other-options}

- [Jest](https://jestjs.io/) je populární unit test framework. Nicméně doporučujeme použít Jest pouze v&nbsp;případě, že máte existující sadu Jest testů, kterou je potřeba migrovat do projektu založeného na Vite. Vitest nabízí plynulejší integraci a lepší výkon.

## Testování komponent {#component-testing}

V Vue aplikacích jsou komponenty hlavními stavebními bloky uživatelského rozhraní. Komponenty jsou tedy přirozenou jednotkou izolace při ověřování chování vaší aplikace. Z hlediska granularity lze testování komponent považovat za formu integračního testování, které se nachází někde mezi jednotkovým testováním a testováním aplikace jako celku. Doporučujeme, aby každá Vue komponenta měla vlastní soubor specifikace (spec file).

Komponentové testy by měly odhalovat problémy související s vlastnostmi komponenty, událostmi, sloty, styly, třídami, lifecycle hooky a dalšími.

Komponentové testy by neměly simulovat komponenty potomků, ale spíše testovat interakce mezi vaší komponentou a jejími potomky tím, že s komponentami interagují jako uživatel. Například test komponenty by měl kliknout na prvek tak, jako by to udělal uživatel, namísto programové interakce s komponentou.

Komponentové testy by se měly zaměřit na veřejné rozhraní komponenty spíše než na interní implementační detaily. Pro většinu komponent jsou veřejným rozhraním: emitované události (emits), vlastnosti (props) a sloty (slots). Při testování si pamatujte, že **testujete, co komponenta dělá, ne jak to dělá**.

**DĚLEJTE**

- Pro **vizuální** logiku: ověřte správný výstup vykreslování na základě zadaných vlastností (props) a slotů (slots).
- Pro **behaviorální** logiku: ověřte správné aktualizace vykreslování nebo emitované události v reakci na události uživatelského vstupu.

V následujícím příkladu ukazujeme komponentu Stepper, která obsahuje DOM element označený jako „increment“, na nějž lze kliknut. Předáváme vlastnost s názvem `max`, která zabrání inkrementaci Stepperu nad hodnotu `2`, takže pokud klikneme na tlačítko 3krát, uživatelské rozhraní by mělo stále zobrazovat hodnotu `2`.

Nevíme nic o implementaci komponenty Stepper, pouze že „vstup“ je vlastnosti `max` a&nbsp;„výstup“ je stav DOM, jak ho uvidí uživatel.

<VTCodeGroup>
  <VTCodeGroupTab label="Vue Test Utils">

  ```js
  const valueSelector = '[data-testid=stepper-value]'
  const buttonSelector = '[data-testid=increment]'

  const wrapper = mount(Stepper, {
    props: {
      max: 1
    }
  })

  expect(wrapper.find(valueSelector).text()).toContain('0')

  await wrapper.find(buttonSelector).trigger('click')

  expect(wrapper.find(valueSelector).text()).toContain('1')
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="Cypress">

  ```js
  const valueSelector = '[data-testid=stepper-value]'
  const buttonSelector = '[data-testid=increment]'

  mount(Stepper, {
    props: {
      max: 1
    }
  })

```cs
  cy.get(valueSelector).should('be.visible').and('contain.text', '0')
    .get(buttonSelector).click()
    .get(valueSelector).should('contain.text', '1')
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="Testing Library">

  ```js
  const { getByText } = render(Stepper, {
    props: {
      max: 1
    }
  })

  getByText('0') // implicitní předpoklad, že uvnitř komponenty je "0"

  const button = getByRole('button', { name: /increment/i })

  // provést 'click' event na tlačítko
  await fireEvent.click(button)

  getByText('1')

  await fireEvent.click(button)
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

- **NEDĚLEJTE**

  Neověřujte private stav instance komponenty ani neověřujte private metody komponenty. Testování implementačních detailů dělá testy méně stabilní, protože je pravděpodobnější, že se rozbijí a budou vyžadovat aktualizaci při změně implementace.

  Úkolem komponenty je vykreslovat správný výstup DOM, takže testy zaměřené na výstup DOM poskytují stejnou úroveň zajištění správnosti (ne-li více), zatímco jsou odolnější vůči změnám.

  Nespoléhejte se výhradně na testy snímků obrazovky. Ověřování HTML řetězců nevyjadřuje správnost. Pište testy s úmyslem (intentionality).

  Pokud je třeba metodu důkladně otestovat, zvažte její extrakci do samostatné utility funkce a napište pro ni samostatný jednotkový test. Pokud ji nelze čistě extrahovat, může být testována jako součást komponentového, integračního nebo end-to-end testu, který ji pokrývá.

### Doporučení {#recommendation-1}

- [Vitest](https://vitest.dev/) pro komponenty nebo composables, které se vykreslují bez UI (např. funkce [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) ve VueUse). Komponenty a DOM lze testovat pomocí [`@vue/test-utils`](https://github.com/vuejs/test-utils).

- [Cypress Component Testing](https://on.cypress.io/component) pro komponenty, jejichž očekávané chování závisí na správném vykreslování stylů nebo spouštění nativních událostí DOM. Lze jej použít s&nbsp;Testing Library pomocí [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro).

Hlavní rozdíly mezi nástrojem Vitest a test runnery v prohlížeči jsou rychlost a kontext provedení. Stručně řečeno, runnery v prohlížeči, jako je Cypress, mohou odhalit problémy, které runnery založené na Node.js, jako je Vitest, zjistit nemohou (např. problémy se styly, skutečné nativní události DOMu, cookies, lokální úložiště a selhání sítě), ale jsou _o řády pomalejší než Vitest_, protože otevírají prohlížeč, kompilují vaše styly a další. Cypress je runner v prohlížeči, které podporuje testování komponent. Přečtěte si prosím [stránku porovnání ve Vitest dokumentaci](https://vitest.dev/guide/comparisons.html#cypress) pro nejnovější informace o srovnání nástrojů Vitest a Cypress.

### Knihovny pro připojení komponent {#mounting-libraries}

Testování komponent často zahrnuje připojení (mount) testované komponenty v izolaci, spouštění simulovaných událostí uživatele a ověřování výstupu vykresleného DOMu. Existují specializované utility knihovny, které tyto úkoly zjednodušují.

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) je oficiální knihovna pro testování komponent na nízké úrovni, která byla napsána tak, aby uživatelům poskytla přístup k Vue specifickým API. Je také knihovnou nižší úrovně, na které je postavena knihovna `@testing-library/vue`.

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) je knihovna pro testování Vue zaměřená na testování komponent bez závislosti na implementačních detailech. Její hlavní filosofií je, že čím více se testy podobají skutečnému způsobu používání softwaru, tím více sebevědomí mohou poskytnout.

Pro testování komponent v aplikacích oporučujeme používat `@vue/test-utils`, protože `@testing-library/vue` má problémy s testováním asynchronních komponent s použitím `<Suspense>` a měla by se používat opatrně.

### Další možnosti {#other-options-1}

- [Nightwatch](https://nightwatchjs.org/) je E2E test runner s podporou testování Vue komponent. ([Ukázkový projekt](https://github.com/nightwatchjs-community/todo-vue))

- [WebdriverIO](https://webdriver.io/docs/component-testing/vue) pro testování komponent napříč prohlížeči spoléhající se na nativní interakci uživatele založenou na standardizované automatizaci. Lze jej také použít s&nbsp;Testing Library.

## E2E testování {#e2e-testing}

Ačkoli jednotkové testy poskytují vývojářům určitou míru jistoty, jednotkové a&nbsp;komponentové testy mají svá omezení v zajištění celkového pokrytí aplikace při nasazení do produkce. Výsledkem jsou testy end-to-end (E2E), které pokrývají to, co je pravděpodobně nejdůležitější aspekt aplikace: co se děje, když uživatelé skutečně používají vaše aplikace.

End-to-end testy se zaměřují na chování vícestránkových aplikací, které provádějí síťové požadavky na vaši produkční Vue aplikaci. Často zahrnují spuštění databáze nebo jiného backendu a mohou být dokonce spuštěny proti živému prostředí pro nasazení.

End-to-end testy často odhalují problémy s vaším routerem, knihovnou pro správu stavu, komponentami nejvyšší úrovně (např. App nebo Layout), veřejnými prostředky nebo jakýmkoli zpracováním požadavků. Jak bylo řečeno výše, odhalují kritické problémy, které může být nemožné odhalit pomocí jednotkových nebo komponentových testů.

End-to-end testy neimportují žádný kód vaší Vue aplikace, nýbrž se zcela spoléhají na testování vaší aplikace navigací skrze celé stránky v reálném prohlížeči.

End-to-end testy ověřují mnoho vrstev vaší aplikace. Mohou cílit buď na vaši lokálně vytvořenou aplikaci, nebo dokonce na živé prostředí pro nasazení. Testování proti prostředí pro nasazení nezahrnuje pouze váš frontendový kód a statický server, ale také všechny související backendové služby a infrastrukturu.

> Čím více se vaše testy podobají tomu, jak se váš software používá, tím více jistoty vám mohou dát. - [Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106) - Autor Testing Library

Testováním, jak akce uživatele ovlivňují vaši aplikaci, jsou E2E testy často klíčem k větší jistotě, zda aplikace funguje správně nebo ne.

### Výběr řešení pro E2E testování  {#choosing-an-e2e-testing-solution}

Ačoliv end-to-end (E2E) testování na webu získalo negativní pověst kvůli nespolehlivým (nestabilním) testům a zpomalení vývojových procesů, moderní nástroje pro E2E testování udělaly pokrok směrem k vytváření spolehlivějších, interaktivnějších a užitečnějších testů. Následující sekce dávají pár rad, na co při výběru E2E testovacího frameworku pro vaši aplikaci myslet.

#### Testování napříč prohlížeči {#cross-browser-testing}

Jednou z hlavních výhod E2E testování je jeho schopnost testovat vaši aplikaci napříč různými prohlížeči. I když by se mohlo zdát žádoucí dosáhnout 100% pokrytí prohlížečů, je důležité si uvědomit, že testování napříč prohlížeči má klesající výnos vzhledem k&nbsp;časové náročnosti a výpočetním prostředkům potřebným pro jejich spouštění. Proto je důležité zvážit tento trade-off při volbě rozsahu testování napříč prohlížeči ve vaši aplikaci.

#### Rychlejší zpětná vazba {#faster-feedback-loops}

Jedním z hlavních problémů E2E testování a vývoje je, že spuštění celé sady testů trvá dlouho. Obvykle se to děje pouze v rámci kontinuální integrace a nasazování (CI/CD) pipeline. Moderní E2E testovací frameworky pomohly tento problém řešit přidáním funkcí jako je paralelizace, což často umožňuje spouštění CI/CD pipelines mnohem rychleji než dříve. Kromě toho, při lokálním vývoji mají schopnost selektivně spustit jednotlivý test pro stránku, na které pracujete, a zároveň poskytují automatický hot-reload testů, což umožňuje zvýšit produktivitu a efektivitu vývojáře.

#### Prvotřídní zážitek při debuggování{#first-class-debugging-experience}

Zatímco tradičně vývojáři spoléhali na prohledávání logů v terminálovém okně, aby zjistili, co se při testování pokazilo, moderní E2E testovací frameworky umožňují vývojářům využít nástroje, se kterými již pracují, například nástroje pro vývojáře prohlížeče (devtools).

#### Viditelnost v headless režimu {#visibility-in-headless-mode}

Když jsou E2E testy spouštěny v rámci CI/CD pipeline, často se spouštějí v headless prohlížečích (tj. pro uživatele se neotevírá viditelný prohlížeč). Kritickou funkcí moderních E2E testovacích frameworků je schopnost zobrazovat snímky obrazovky a/nebo videa aplikace během testování, což poskytuje určitý vhled do příčin výskytu chyb. Historicky bylo tyto integrace obtížné udržovat.

### Doporučení {#recommendation-2}

- [Cypress](https://www.cypress.io/)

  Celkově si myslíme, že Cypress poskytuje nejkompletnější řešení pro end-to-end testování s funkcemi jako informativní grafické rozhraní, vynikající laditelnost, vestavěné assertions a stubs, odolnost proti flaky testům, paralelizace a snímky obrazovky. Jak bylo zmíněno výše, podporuje také [testování komponent](https://docs.cypress.io/guides/component-testing/introduction). Podporuje však pouze prohlížeče založené na Chromiumu a Firefox.

### Další možnosti {#other-options-2}

- [Playwright](https://playwright.dev/) je pro end-to-end testování také skvělé řešení, které podporuje všechny moderní vykreslovací enginy vč. Chromium, WebKit a Firefox. Testujte na Windows, Linuxu a macOS, lokálně nebo v CI, v plném či headless módu a s nativním mobilním emulátorem Google Chrome pro Android a Mobile Safari.

s širším spektrem podpory prohlížečů (především WebKit). Pro více informací se podívejte na [Proč použít Playwright](https://playwright.dev/docs/why-playwright).

- [Nightwatch](https://nightwatchjs.org/) je řešení pro end-to-end testování založené na [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver). To mu dává nejširší rozsah podpory prohlížečů.

- [WebdriverIO](https://webdriver.io/) je testovací automatizační framework pro testování webových a&nbsp;mobilních aplikací založený na protokolu WebDriver.

## Návody {#recipes}

### Přidání Vitest do projektu {#adding-vitest-to-a-project}

V projektu založeném na Vite spusťte:

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

Poté aktualizujte konfiguraci Vite a přidejte sekci `test`:

```js{6-12}
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // povolit globální testovací API podobné jako pro Jest
    globals: true,
    // simulovat DOM pomocí happy-dom
    // (vyžaduje nainstalování happy-dom jako peer dependency)
    environment: 'happy-dom'
  }
})
```

:::tip
Pokud používáte TypeScript, přidejte `vitest/globals` do pole `types` ve vašem `tsconfig.json`.

```json
// tsconfig.json

{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

:::

Poté ve vašem projektu vytvořte soubor končící na `*.test.js`. Všechny testovací soubory můžete umístit do složky `test` ve složce projektu nebo do složek `test` vedle vašich zdrojových souborů. Vitest je automaticky vyhledá pomocí konvence pro pojmenování souborů.

```js
// MyComponent.test.js
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('mělo by fungovat', () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    }
  })

  // očekávaný výstup
  getByText('...')
})
```

Nakonec aktualizujte `package.json` přidáním skriptu pro testování a spusťte ho:

```json{4}
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

```sh
> npm test
```

### Testování composables{#testing-composables}

> Tato sekce předpokládá, že jste si přečetli kapitolu [Composables](/guide/reusability/composables).

Pokud jde o testování composables, můžeme je rozdělit do dvou kategorií: composable funkce, které nezávisí na instanci hostitelské komponenty, a ty, které na ní závisí.

Composable závisí na instanci hostitelské komponenty, pokud používá následující API:

- Lifecycle hooks
- Provide / Inject

Pokud composable funkce pouze používá Reactivity API, může být testována přímo voláním a ověřením jejího vráceného stavu / vrácených metod:

```js
// counter.js
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return {
    count,
    increment
  }
}
```

```js
// counter.test.js
import { useCounter } from './counter.js'

test('useCounter', () => {
  const { count, increment } = useCounter()
  expect(count.value).toBe(0)

  increment()
  expect(count.value).toBe(1)
})
```

Composable funkce, která závisí na Lifecycle Hooks nebo Provide / Inject, musí být obalena v hostitelské komponentě, aby byla testovatelná. Můžeme vytvořit pomocnou funkci následujícím způsobem:

```js
// test-utils.js
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // potlačení varování o chybějící šabloně
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // vrátíme výsledek a instanci aplikace
  // pro testování provide/unmount
  return [result, app]
}
```

```js
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // mock provide pro testování implementací
  app.provide(...)
  // vyhodnotit předpoklady
  expect(result.foo.value).toBe(1)
  // vyvolat onUnmounted hook, pokud je třeba
  app.unmount()
})
```

Pro složitější composables může být snazší je testovat tak, že se píší testy proti obalující komponentě pomocí techniky [testování komponent](#component-testing).

<!-- 
TODO v budoucnu mohou být přidány další návody na testování, např.
- Jak nastavit CI pomocí GitHub actions
- Jak provádět mockování při testování komponent
-->
