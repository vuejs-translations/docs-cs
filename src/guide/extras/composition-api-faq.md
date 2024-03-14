---
outline: deep
---

# FAQ o Composition API {#composition-api-faq}

:::tip
Tato část FAQ předpokládá předchozí zkušenosti s Vue - zejména s Vue 2 a převážným používáním Options API.
:::

## Co je Composition API? {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="Lekce o Composition API zdarma"/>

Composition API je sada API, která nám umožňuje vytvářet Vue komponenty pomocí importovaných funkcí místo deklarování možností (options) Jedná se o obecný termín, který zahrnuje následující API:

- [Reactivity API](/api/reactivity-core), např. `ref()` a `reactive()`, které nám umožňuje přímo vytvářet reaktivní stav, computed proměnné a watchery.

- [Lifecycle Hooks](/api/composition-api-lifecycle), např. `onMounted()` a `onUnmounted()`, které nám umožňují programově se připojit k životnímu cyklu komponenty.

- [Dependency Injection](/api/composition-api-dependency-injection), tj. `provide()` a `inject()`, které nám umožňují využívat systém závislostí Vue při používání Reactivity API.

Composition API je vestavěnou funkcí Vue 3 a [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html). Pro starší verze Vue 2 použijte oficiálně udržovaný plugin [`@vue/composition-api`](https://github.com/vuejs/composition-api). V Vue 3 se primárně používá společně se syntaxí [`<script setup>`](/api/sfc-script-setup) v Single-File komponentách (SFC). Zde je základní příklad komponenty používající Composition API:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// reaktivní stav
const count = ref(0)

// funkce, které mění stav a spouští aktualizace
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`Počáteční hodnota je ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Počet je: {{ count }}</button>
</template>
```

Navzdory API stylu založenému na funkční kompozici **Composition API NENÍ funkcionální programování**. Composition API ve Vue je založeno na paradigmatu reaktivní změny, zatímco funkcionální programování klade důraz na neměnnost.

Pokud máte zájem naučit se používat Vue s Composition API, můžete nastavit preferenci API pro celý web na Composition API pomocí přepínače API preference nahoře ve sloupci levého menu a poté projít průvodcem od začátku.

## Proč Composition API? {#why-composition-api}

### Lepší opakování logiky {#better-logic-reuse}

Hlavní výhodou Composition API je, že umožňuje čisté a efektivní opakování logiky ve formě [composable funkcí](/guide/reusability/composables). Řeší [všechny nevýhody mixins](/guide/reusability/composables#vs-mixins), primárního mechanismu znovupoužitelné logiky pro Options API.

Schopnost Composition API opakovat logiku vedla k vzniku působobivých komunitních projektů, jako je [VueUse](https://vueuse.org/), neustále se rozšiřující sbírka composable utilit. Taktéž slouží jako čistý mechanismus pro snadné integrování stavových služeb nebo knihoven třetích stran do reaktivního systému Vue, například [neměnitelná data](/guide/extras/reactivity-in-depth#immutable-data), [stavové automaty](/guide/extras/reactivity-in-depth#state-machines) a&nbsp;[RxJS](/guide/extras/reactivity-in-depth#rxjs).

### Flexibilnější organizace kódu {#more-flexible-code-organization}

Mnoho uživatelů miluje, že s Options API píšeme z definice organizovaný kód: každá část má své místo na základě volby, pod kterou spadá. Nicméně Options API představuje vážné omezení, když logika jedné komponenty přesáhne určitou úroveň složitosti. Toto omezení je zvláště patrné u komponent, které potřebují řešit více **logických záležitostí**, což jsme viděli na vlastní oči v mnoha produkčních Vue 2 aplikacích.

Vezměme si například komponentu prohlížeče složek z grafického rozhraní Vue CLI: tato komponenta je zodpovědná za následující logické zájmy:

- Sledování aktuálního stavu složky a zobrazení jejího obsahu
- Manipulace s navigací ve složkách (otevírání, zavírání, obnovování...)
- Vytváření nových složek
- Přepínání zobrazení pouze oblíbených složek
- Přepínání zobrazení skrytých složek
- Manipulace s aktuálním pracovním adresářem

[Původní verze](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404) komponenty byla napsána v Options API. Pokud každému řádku kódu přiřadíme barvu na základě logického problému, se kterým se zabývá, vypadá to takto:

<img alt="Komponenta prohlížeče složek dříve" src="./images/options-api.png" width="129" height="500" style="margin: 1.2em auto">

Všimněte si, jak je kód zabývající se stejným logickým problémem nucen být rozdělen do různých sekcí, umístěných na různých částech souboru. V komponentě, která má několik set řádků, vyžaduje pochopení a navigace v jednom logickém problému neustálé posouvání nahoru a dolů souborem, což je mnohem obtížnější, než by mělo být. Navíc, pokud bychom někdy chtěli extrahovat logický problém do znovupoužitelné utility, bude potřeba celkem hodně práce najít a extrahovat správné části kódu z různých částí souboru.

Zde je stejná komponenta, před a po [refaktoringu do Composition API](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e):

![Komponenta prohlížeče složek nyní](./images/composition-api-after.png)

Všimněte si, že kód související se stejným logickým problémem může být nyní seskupen spolu: již nemusíme při práci na konkrétním logickém problému přeskakovat mezi různými bloky možností. Navíc teď můžeme s minimálním úsilím přesunout skupinu kódu do externího souboru, protože již kód nemusíme přeskupovat. Tato menší náročnost při refaktoringu je pro dlouhodobou udržitelnost ve velkých projektech klíčová.

### Lepší odvozování typů {#better-type-inference}

V posledních letech stále více frontendových vývojářů přechází na [TypeScript](https://www.typescriptlang.org/), protože nám pomáhá psát robustnější kód, provádět změny s větší jistotou a poskytuje lepší development experience (DX) s podporou v IDE. Přitom Options API, které byla původně vytvořeno v roce 2013, bylo navrženo bez zohlednění odvozování typů. Museli jsme implementovat různé [absurdně složité gymnastiky](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165), abychom zajistili, že odvozování typů bude s Options API fungovat. I přes veškeré úsilí může odvozování typů pro Options API stále selhávat u mixins a dependency injections.

Tohle vedlo mnoho vývojářů, kteří chtěli Vue používat s TS, k tomu, aby se obrátili ke Class API, které je postaveno na `vue-class-component`. Jenže API založené na třídách se silně spoléhá na ES dekorátory, což je funkce jazyka, která byla v době vývoje Vue 3 v&nbsp;roce 2019 pouze návrhem ve fázi 2. Považovali jsme za příliš riskantní založit oficiální API na nestabilním návrhu. Od té doby prošel návrh dekorátorů dalším kompletním přepracováním a fáze 3 konečně dosáhl až v roce 2022. Kromě toho API založené na třídách trpí podobnými omezeními pro znovupoužití logiky a organizaci kódu jako Options API .

Naproti tomu Composition API využívá převážně běžné proměnné a funkce, které jsou k&nbsp;typům přirozeně přátelské. Kód napsaný v Composition API může plně využívat odvozování typů s minimální potřebou ručních nápověd. Většinou bude kód v&nbsp;Composition API vypadat téměř identicky v TypeScriptu i v běžném JavaScriptu. To také umožňuje uživatelům běžného JavaScriptu těžit z částečného odvozování typů.

### Menší produkční balíček a nižší režie {#smaller-production-bundle-and-less-overhead}

Kód napsaný v Composition API a `<script setup>` je také efektivnější a lépe se minimalizuje než ekvivalentní kód Options API. To je způsobeno tím, že šablona v&nbsp;komponentě `<script setup>` je zkompilována jako funkce vložená do stejného rozsahu (scope) jako kód `<script setup>`. Na rozdíl od přístupu k vlastnostem pomocí `this` může zkompilovaný kód šablony přímo přistupovat k proměnným deklarovaným uvnitř `<script setup>` bez prostředníka v podobě instance proxy. To také vede k lepší minimalizaci, protože všechna jména proměnných lze bezpečně zkrátit.

## Vztah k Options API {#relationship-with-options-api}

### Kompromisy {#trade-offs}

Někteří uživatelé, kteří přešli z Options API, zjistili, že jejich kód v Composition API je méně organizovaný a dospěli k závěru, že Composition API je z hlediska organizace kódu „horší“. Doporučujeme uživatelům s tímto názorem, aby se na tento problém podívali z jiné perspektivy.

Je pravda, že Composition API již neposkytuje „ochranné zábradlí“, které vás vede k&nbsp;umístění kódu do příslušných kategorií. Na oplátku můžete psát kód komponenty tak, jak byste psali běžný JavaScript. To znamená, že **můžete a měli byste aplikovat jakékoli osvědčené postupy pro organizaci kódu na svůj kód v Composition API tak, jak byste to dělali při psaní běžného JavaScriptu**. Pokud dokážete psát dobře organizovaný JavaScript, měli byste být schopni psát dobře organizovaný kód v Composition API.

Options API vám umožňuje při psaní kódu komponent „méně přemýšlet“, a proto jej mnoho uživatelů miluje. Nicméně, snižováním mentální zátěže vás také zavazuje předepsaným vzorem organizace kódu bez možnosti úniku, což může ztížit refaktoring nebo zlepšování kvality kódu ve větších projektech. V tomto ohledu poskytuje Composition API lepší škálovatelnost do budoucna.

### Pokrývá Composition API všechny použití? {#does-composition-api-cover-all-use-cases}

Ano, pokud jde o stavovou logiku. Při použití Composition API je zde pouze několik vlastností (options), které mohou být stále potřebné: `props`, `emits`, `name` a&nbsp;`inheritAttrs`.

:::tip

Od verze 3.3 můžete přímo v `<script setup>` použít `defineOptions` pro nastavení názvu komponenty nebo vlastnosti `inheritAttrs`.

:::

Pokud plánujete používat výhradně Composition API (spolu s výše uvedenými vlastnostmi), můžete zmenšit velikost produkčního balíčku o několik kilobytů pomocí [přepínače při kompilaci](/api/compile-time-flags), který z Vue odstraní kód související s Options API. Upozorňujeme, že to ovlivní i Vue komponenty ve vašich závislostech.

### Můžu použít obě API ve stejné komponentě? {#can-i-use-both-apis-in-the-same-component}

Ano. V Options API komponentě můžete použít Composition API prostřednictvím volby [`setup()`](/api/composition-api-setup).

Doporučujeme to ovšem udělat pouze v případě, že máte existující projekt v Options API, který potřebuje integrovat nové funkce / externí knihovny napsané v Composition API.

### Bude Options API zastaralé (deprecated)? {#will-options-api-be-deprecated}

Ne, nemáme v plánu to udělat. Options API je nedílnou součástí Vue a důvodem, proč ho mnoho vývojářů miluje. Zároveň si uvědomujeme, že mnoho výhod Composition API se projevuje pouze ve větších projektech a Options API zůstává solidní volbou pro mnoho málo až středně složitých scénářů.

## Vztah s Class API {#relationship-with-class-api}

Už nedoporučujeme používání Class API ve Vue 3, protože Composition API poskytuje skvělou integraci s TypeScriptem a další výhody znovupoužití logiky a organizace kódu.

## Porovnání s React Hooks {#comparison-with-react-hooks}

Composition API poskytuje stejnou škálu možností pro kompozici logiky jako React Hooks, ale s některými důležitými rozdíly.

React Hooks jsou opakovaně volány pokaždé, když se komponenta aktualizuje. To vytváří několik problémů, které mohou zmást i zkušené React vývojáře. Také to vede k&nbsp;problémům s optimalizací výkonu, které mohou vážně ovlivnit DX. Zde jsou některé příklady:

- Hooks jsou citlivé na pořadí volání a nemohou být podmíněné.

- Proměnné deklarované v React komponentě mohou být zachyceny uzávěrem hooku a&nbsp;stát se „zastaralými“ (stale), pokud vývojář nepředá správné pole závislostí. To vede k tomu, že se vývojáři Reactu spoléhají na ESLint pravidla, která správné předávání závislostí zajišťují. Pravidlo však často není dostatečně chytré a přespříliš kompenzuje správnost, což vede k zbytečné invalidaci a problémům u okrajových případů.

- Náročné výpočty vyžadují použití `useMemo`, což opět vyžaduje manuální předání správného pole závislostí.

- Událostní obslužné rutiny předané komponentám potomků způsobují zbytečné aktualizace potomků ve výchozím nastavení a vyžadují explicitní `useCallback` jako optimalizaci. Je to téměř vždy potřeba a opět to vyžaduje správné pole závislostí. Pokud se to zanedbá, aplikace se nativně zbytečně často překresluje a může to způsobit problémy s výkonem, aniž bychom si toho byli vědomi.

- Tzv. „stale closure“ problém spolu s funkcemi pro souběžnost (Concurrent features), ztěžuje určení, kdy se kód hooku spustí, a ztěžuje práci s proměnným stavem, který by měl přetrvávat mezi vykreslením (pomocí `useRef`).

Na rozdíl od toho Vue Composition API:

- Volá kód `setup()` nebo `<script setup>` pouze jednou. To způsobuje, že kód lépe odpovídá intuitivnímu používání idiomatického JavaScriptu, protože se nemusíte starat o „stale closures“. Volání Composition API také není citlivé na pořadí volání a&nbsp;může být podmíněné.

- Reaktivní systém Vue automaticky sbírá reaktivní závislosti používané v computed proměnných a watcherech, takže není potřeba závislosti ručně deklarovat.

- Není potřeba ručně ukládat callback funkce pro zabránění zbytečných aktualizací potomků. Obecně platí, že fine-grained reaktivní systém Vue zajišťuje, že se potomci aktualizují pouze tehdy, když je to potřeba. Ruční optimalizace aktualizací potomků jsou pro vývojáře Vue téma jen zřídka.

Uznáváme kreativitu React Hooks a jsou hlavním zdrojem inspirace pro Composition API. Nicméně, výše zmíněné problémy existují v jeho návrhu a zjistili jsme, že reaktivní model Vue poskytuje způsob, jak se jim vyhnout.
