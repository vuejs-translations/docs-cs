---
outline: deep
---

# Výkon {#performance}

## Přehled {#overview}

Vue je navrženo tak, aby bylo dostatečně výkonný pro většinu běžných použití bez potřeby manuálních optimalizací. Nicméně vždy existují náročné scénáře, kde je potřeba dodatečné doladění. V této sekci se budeme zabývat tím, na co byste měli dávat pozor, pokud jde o výkon ve Vue aplikaci.

Nejprve se podívejme na dva hlavní aspekty webového výkonu:

- **Výkon načítání stránky** (Page Load): jak rychle aplikace zobrazí obsah a stane se interaktivní při první návštěvě. To se obvykle měří pomocí web vital metrik jako [Largest Contentful Paint (LCP)](https://web.dev/lcp/) a [First Input Delay (FID)](https://web.dev/fid/).

- **Výkon aktualizace** (Update): jak rychle se aplikace aktualizuje v reakci na uživatelský vstup. Například jak rychle se aktualizuje seznam, když uživatel píše do vyhledávacího pole, nebo jak rychle se stránka přepíná, když uživatel klikne na odkaz v navigaci v Single-Page aplikaci (SPA).

Ačkoliv by bylo ideální maximalizovat obojí, různé frontendové architektury mají tendenci ovlivňovat, jak snadno je možné dosáhnout požadovaného výkonu v těchto aspektech. Navíc i typ aplikace, kterou stavíte, výrazně ovlivňuje to, na co byste se měli z hlediska výkonu zaměřit. Proto je prvním krokem k zajištění optimálního výkonu vybrat správnou architekturu pro typ aplikace, kterou tvoříte:

- Prozkoumejte [Způsoby použití Vue](/guide/extras/ways-of-using-vue), abyste viděli, jak můžete Vue využít různými způsoby.

- Jason Miller diskutuje o typech webových aplikací a jejich ideální implementaci / distribuci v článku [Application Holotypes](https://jasonformat.com/application-holotypes/).

## Možnosti profilování {#profiling-options}

Pro zlepšení výkonu musíme nejprve vědět, jak ho měřit. Existuje několik skvělých nástrojů, které vám mohou v tomto ohledu pomoci:

Pro profilování výkonu načítání produkčních nasazení:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

Pro profilování výkonu během lokálního vývoje:

- [Chrome DevTools Performance Panel](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance) umožňuje zobrazovat Vue-specifické metriky výkonu v časové ose v Chrome DevTools.
- [Vue DevTools Extension](/guide/scaling-up/tooling#browser-devtools) také poskytuje funkci pro profilování výkonu.

## Optimalizace načítání stránky {#page-load-optimizations}

Existuje mnoho faktorů nezávislých na frameworku pro optimalizaci výkonu načítání stránky - podívejte se do [tohoto průvodce web.dev](https://web.dev/fast/) pro komplexní přehled. Zde se budeme především zaměřovat na techniky specifické pro Vue.

### Výběr správné architektury {#choosing-the-right-architecture}

Pokud je váš případ užití citlivý na výkon načítání stránky, vyhněte se jejímu odesílání jako čistého client-side SPA. Chcete, aby váš server přímo odesílal HTML s obsahem, který uživatelé chtějí vidět. Čisté vykreslování na klientovi trpí pomalým time-to-content. To lze zmírnit pomocí [Server-Side Rendering (SSR)](/guide/extras/ways-of-using-vue#fullstack-ssr) nebo [Static Site Generation (SSG)](/guide/extras/ways-of-using-vue#jamstack-ssg). Podívejte se na [průvodce SSR](/guide/scaling-up/ssr), abyste se naučili, jak provádět SSR ve Vue. Pokud vaše aplikace nemá požadavky na bohatou interaktivitu, můžete k vykreslení HTML použít i tradiční backendový server a rozšířit jej pomocí Vue na klientovi.

Pokud vaše hlavní aplikace musí být SPA, ale má marketingové stránky (úvod, o nás, blog), odesílejte je samostatně! Vaše marketingové stránky by měly být ideálně nasazeny jako statické HTML s minimálním JS pomocí SSG.

### Velikost balíčku a tree-shaking {#bundle-size-and-tree-shaking}

Jedním z nejefektivnějších způsobů, jak zlepšit výkon načítání stránky, je odesílání menších JavaScriptových balíčků. Zde je několik způsobů, jak snížit velikost balíčku při použití Vue:

- Pokud je to možné, použijte build fázi.

  - Mnoho z Vue API je ["tree-shakable"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking), pokud je balíček vytvořen pomocí moderního nástroje pro sestavení. Například, pokud nepoužíváte vestavěnou komponentu `<Transition>`, nebude v konečném produkčním balíčku zahrnuta. Tree-shaking může odstranit i další nepoužívané moduly ve vašem zdrojovém kódu.

- Při použití build fáze jsou šablony předkompilovány, takže není nutné do prohlížeče odesílat Vue kompilátor. To ušetří **14kb** min+gzipped JavaScript a zabrání nákladům na runtime kompilaci.

- Buďte opatrní na velikost při zavádění nových závislostí! V reálných aplikacích jsou zbytečně velké balíčky nejčastěji výsledkem zavedení těžkých závislostí, aniž by si to vývojář uvědomil.

  - Pokud používáte build fázi, upřednostňujte závislosti, které nabízejí formáty ES modulů a podporují tree-shaking. Například upřednostňujte `lodash-es` před `lodash`.

  - Zkontrolujte velikost závislosti a posuďte, zda stojí za to poskytovanou funkcionalitu. Když je závislost přátelská k tree-shakingu, skutečný nárůst velikosti bude záviset na API, které z ní skutečně importujete. Nástroje jako [bundlejs.com](https://bundlejs.com/) lze použít pro rychlé kontroly, ale měření s vaším skutečným sestavením bude vždy nejpřesnější.

- Pokud používáte Vue především pro postupné vylepšování a chcete se vyhnout build dázi, zvažte použití [petite-vue](https://github.com/vuejs/petite-vue) (pouze **6kb**).

### Dělení kódu {#code-splitting}

Dělení kódu je proces, kdy sestavovací nástroj rozdělí balíček aplikace na více menších částí, které lze poté načítat na vyžádání nebo paralelně. S pomocí správného dělení kódu lze požadované funkce načíst okamžitě při načítání stránky a další části lze načítat, až když jsou potřeba, čímž se zlepšuje výkon.

Build nástroje jako Rollup (na kterém je založené Vite) nebo webpack mohou automaticky vytvářet rozdělené části (chunks) detekováním syntaxe dynamického importu ESM:

```js
// lazy.js a jeho závislosti budou rozděleny do samostatného chunku
// a budou načteny pouze při volání `loadLazy()`.
function loadLazy() {
  return import('./lazy.js')
}
```

"Lazy" načítání je nejlepší použít na funkce, které nejsou potřebné okamžitě po úvodním načtení stránky. Ve Vue aplikacích je lze použít ve spojení s Vue funkcí [Async Component](/guide/components/async) pro vytváření rozdělených částí pro stromy komponent:

```js
import { defineAsyncComponent } from 'vue'

// Pro Foo.vue a jeho závislosti je vytvořen samostatný chunk.
// Je načítán pouze na vyžádání, když je asynchronní komponenta
// vykreslena na stránce.
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

Pro aplikace používající Vue Router se silně doporučuje používat "lazy" načítání pro komponenty cest (route). Vue Router má pro "lazy" načítání explicitní podporu, oddělenou od `defineAsyncComponent`. Pro více informací se podívejte na [Lazy Loading Routes](https://router.vuejs.org/guide/advanced/lazy-loading.html).

## Optimalizace aktualizací {#update-optimizations}

### Stabilita props {#props-stability}

V Vue se komponentna potomka aktualizuje pouze tehdy, když se změní alespoň jedna z jeho přijatých vlastností (props). Uvažte následující příklad:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

Uvnitř komponenty `<ListItem>` se používají props `id` a `activeId` k určení, zda je položka právě aktivní. Toto funguje, ale problém je v tom, že kdykoliv se změní `activeId`, **každý** `<ListItem>` v seznamu se musí aktualizovat!

Ideálně by se měly aktualizovat pouze položky, jejichž stav aktivace se změnil. Toho můžeme dosáhnout tím, že výpočet stavu aktivity přesuneme do rodiče a `<ListItem>` obdrží přímo vlastnosti `active`:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

Nyní se pro většinu komponent při změně `activeId` vlastnost `active` nemění, takže již nemusí být aktualizovány. Obecně platí, že je dobré udržovat props předávané komponentám potomka co nejstabilnější.

### `v-once` {#v-once}

`v-once` je vestavěná direktiva, která se používá k vykreslení obsahu, který závisí na runtime datech, ale nikdy se nemusí aktualizovat. Celý podstrom, na kterém je použita, bude při všech budoucích aktualizacích přeskočen. Pro více informací se podívejte na [API referenci](/api/built-in-directives#v-once).

### `v-memo` {#v-memo}

`v-memo` je vestavěná direktiva, která se používá k podmíněnému přeskočení aktualizace velkých podstromů nebo seznamů `v-for`. Pro více informací se podívejte na [API referenci](/api/built-in-directives#v-memo).

### Stabilita computed proměnných <sup class="vt-badge" data-text="3.4+" /> {#computed-stability}

Od verze 3.4 computed proměnná spustí watch efekty pouze tehdy, když se její vypočítaná hodnota oproti předchozí hodnotě změní. Například následující computed proměnná  `isEven` spustí efekty, jen pokud se vrácená hodnota změní z `true` na `false` nebo naopak:

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// nezpůsobí nové záznamy v konzoli, protože vypočítaná hodnota zůstává `true`
count.value = 2
count.value = 4
```

Tím se snižuje zbytečné spouštění efektů, ale bohužel to nefunguje, pokud computed proměnná při každém výpočtu vytváří nový objekt:

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

Protože se vždy vytvoří nový objekt, je nová hodnota technicky vždy odlišná od staré hodnoty. I když vlastnost `isEven` zůstává stejná, Vue nebude schopno to zjistit, pokud neprovede hloubkové porovnání staré a nové hodnoty. Takové porovnání by mohlo být náročné a pravděpodobně by to nestálo za to.

Místo toho můžeme optimalizovat tím, že manuálně porovnáme novou hodnotu se starou a podmíněně vrátíme starou hodnotu, pokud víme, že se nic nezměnilo:

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnzSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtK2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz+MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

Pamatujte, že byste měli před porovnáním a vrácením staré hodnoty vždy provést plný výpočet, aby bylo možné při každém spuštění shromáždit stejné závislosti.

## Obecné optimalizace {#general-optimizations}

> Následující tipy ovlivňují jak načítání stránky, tak výkon při aktualizaci.

### Virtualizace velkých seznamů {#virtualize-large-lists}

Jedním z nejčastějších problémů s výkonem ve všech frontendových aplikacích je vykreslování velkých seznamů. Bez ohledu na to, jak výkonný je framework, vykreslování seznamu s tisíci položkami **bude** pomalé kvůli obrovskému počtu DOM elementů, které musí prohlížeč zpracovat.

Nemusíme však nutně vykreslovat všechny tyto uzly najednou. Ve většině případů se na obrazovku uživatele vejde pouze malá podmnožina našeho velkého seznamu. Výkon můžeme výrazně zlepšit pomocí **virtuálního seznamu**, což je technika, při které se vykreslují pouze položky, které jsou aktuálně ve viewportu nebo blízko něj.

Implementace virtuálního seznamu není jednoduchá, naštěstí existují knihovny od komunity, které můžete přímo použít:

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### Snížení reaktivního zatížení pro velké neměnné struktury {#reduce-reactivity-overhead-for-large-immutable-structures}

Reaktivní systém Vue je defaultně "hluboký" (deep). To umožňuje intuitivní správu stavu, ale zároveň vytváří určitou úroveň zatížení, pokud jsou data velká, protože každý přístup k vlastnosti spouští proxy funkce (proxy traps), které sledování závislostí provádějí. To se obvykle projevuje při práci s velkými poli hluboce vnořených objektů, kde jedno vykreslení musí přistupovat k více než 100 000 vlastnostem, takže by to mělo ovlivnit pouze velmi specifické případy použití.

Vue poskytuje možnost vypnout deep reaktivitu pomocí funkcí [`shallowRef()`](/api/reactivity-advanced#shallowref) a [`shallowReactive()`](/api/reactivity-advanced#shallowreactive). Mělké (shallow) API vytváří stav, který je reaktivní pouze na root úrovni a všechny vnořené objekty vystavuje nedotčené. To udržuje rychlý přístup k vnořeným vlastnostem, ovšem s tím, že musíme považovat všechny vnořené objekty za neměnné a aktualizace mohou být spouštěny pouze nahrazením root stavu:

```js
const shallowArray = shallowRef([
  /* velký seznam vnořených objektů */
])

// toto nezpůsobí aktualizace...
shallowArray.value.push(newObject)
// toto ano:
shallowArray.value = [...shallowArray.value, newObject]

// toto nezpůsobí aktualizace...
shallowArray.value[0].foo = 1
// toto ano:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### Vyhněte se zbytečným abstrakcím komponent {#avoid-unnecessary-component-abstractions}

Někdy můžeme pro lepší abstrakci nebo organizaci kódu vytvářet [komponenty bez vykreslování](/guide/components/slots#renderless-components) nebo higher-order komponenty (tj. komponenty, které vykreslují jiné komponenty s dodatečnými vlastnostmi (props)). Ačkoli to není nic špatného, mějte na paměti, že instance komponent jsou mnohem dražší než běžné DOM elementy a vytváření příliš mnoha kvůli abstrakčním vzorům bude mít na výkon negativní dopad.

Je třeba si uvědomit, že redukce pouze několika instancí výrazný efekt mít nebude, takže se tím nemusíte příliš trápit, pokud je komponenta v aplikaci vykreslena jen párkrát. Nejlepší scénář pro zvážení této optimalizace je opět u velkých seznamů. Představte si seznam s 100 položkami, kde každá položka obsahuje mnoho komponent potomků. Odstranění jedné zbytečné abstrakce zde může vést k redukci stovek instancí komponent.
