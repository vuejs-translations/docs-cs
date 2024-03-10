---
outline: deep
---

# Vykreslování na serveru (SSR) {#server-side-rendering-ssr}

## Přehled {#overview}

### Co je SSR? {#what-is-ssr}

Vue.js je framework pro tvorbu aplikací na straně klienta. Ve výchozím nastavení Vue komponenty jako svůj výstup produkují a manipulují DOM v prohlížeči. Je však také možné vykreslit tytéž komponenty do HTML řetězců už na serveru, poslat je do prohlížeče přímo a nakonec statický markup do plně interaktivní aplikace "hydratovat" na straně klienta.

Aplikace Vue.js vykreslená na serveru se také může považovat za "izomorfní" nebo "univerzální", v tom smyslu, že většina kódu aplikace běží jak na serveru, **tak** na klientovi.

### Proč používat SSR? {#why-ssr}

V porovnání s aplikací typu Single-Page Application (SPA) na straně klienta má SSR především tyto výhody:

- **Rychlejší načítání obsahu**: to je zvláště patrné s pomalým internetem nebo na pomalých zařízeních. Serverem vykreslený markup nemusí čekat, než je stažen a proveden všechen JavaScript, aby byl zobrazen, takže uživatel uvidí plně vykreslenou stránku dříve. Navíc se načítání dat provádí při první návštěvě na straně serveru, který má pravděpodobně rychlejší připojení k databázi než klient. To obecně vede k lepším metrikám [Core Web Vitals](https://web.dev/vitals/), lepšímu uživatelskému zážitku a může být klíčové pro aplikace, kde je rychlost načítání obsahu přímo spojena s konverzní mírou.

- **Jednotný mentální model**: můžete použít stejný jazyk a stejný deklarativní, komponentně orientovaný mentální model pro vývoj celé aplikace, místo aby jste přeskakovali mezi backendovým templating systémem a frontendovým frameworkem.

- **Lepší SEO**: roboty vyhledávačů rovnou uvidí plně vykreslenou stránku.

  :::tip
  V současné době umí Google a Bing bez problémů indexovat synchronní JavaScriptové aplikace. Klíčové slovo je zde "synchronní". Pokud vaše aplikace začíná s loading indikátorem a poté získává obsah pomocí Ajax, robot vyhledávače nebude čekat, než skončíte. To znamená, že pokud máte asynchronně získávaný obsah na stránkách, kde je SEO důležité, může být nutné SSR použít.
  :::


Existují také některé kompromisy (trade-offs), které je třeba při používání SSR zvážit:

- Omezení vývoje. Kód specifický pro prohlížeč může být použit pouze v určitých fázích životního cyklu; některé externí knihovny mohou vyžadovat speciální přístup, aby mohly běžet v aplikaci s vykreslováním na serveru.

- Složitější nastavení buildu a požadavky na nasazení. Na rozdíl od plně statické SPA, která může být nasazena na libovolný statický souborový server, vyžaduje aplikace s vykreslováním na serveru prostředí, ve kterém může běžet server Node.js.

- Větší zátěž na straně serveru. Vykreslování celé aplikace v Node.js bude náročnější na CPU než pouhé poskytování statických souborů, takže pokud očekáváte vysokou návštěvnost, připravte se na odpovídající zátěž serveru a vhodně využívejte strategie pro caching.

Před použitím SSR pro vaši aplikaci byste se měli zeptat, zda ji skutečně potřebujete. Záleží především na tom, jak důležitý je pro aplikaci čas na obsah (time-to-content). Například, pokud stavíte interní přístrojovou desku, kde několik set milisekund navíc při počátečním načítání tolik nevadí, SSR by bylo zbytečné. Nicméně, v případech, kdy je time-to-content naprosto klíčový, vám SSR může pomoci dosáhnout při úvodním načítání nejlepšího možného výkonu.

### SSR vs. SSG {#ssr-vs-ssg}

**Statické generování stránek (SSG)**, také nazývané pre-rendering, je další populární technika pro vytváření rychlých webových stránek. Pokud jsou data nutná pro vykreslení stránky pro každého uživatele stejná, můžeme stránku místo vykreslování pokaždé, když přijde požadavek, vykreslit pouze jednou - předem, během build fáze. Předvykreslené stránky jsou generovány a poskytovány jako statické HTML soubory.

SSG zachovává stejné výkonnostní charakteristiky jako aplikace s vykreslováním na serveru:  při načítání obsahu poskytuje skvělý výkon. Zároveň je levnější a snazší na nasazení než aplikace s vykreslováním na serveru, protože výstupem jsou statické HTML a assety. Klíčovým slovem zde je **statický**: SSG lze použít pouze na stránky, které konzumují statická data, tj. data, která jsou známa při sestavení a mezi nasazeními se nezmění. Při každé změně dat je potřeba nové nasazení.

Pokud zkoumáte SSR pouze kvůli zlepšení SEO několika marketingových stránek (např. `/`, `/about`, `/contact`, atd.), pravděpodobně budete chtít použít SSG místo SSR. SSG je také skvělý pro webové stránky zaměřené na obsah, jako jsou stránky s dokumentací nebo blogy. Vlastně i tato webová stránka, kterou právě čtete, je staticky generována pomocí [VitePress](https://vitepress.dev/), statického generátoru stránek postaveného nad Vue.

## Základní tutoriál {#basic-tutorial}

### Rendrování aplikace {#rendering-an-app}

Podívejme se na nejjednodušší příklad použití Vue SSR.

1. Vytvořte nový adresář a přejděte do něj pomocí `cd`
2. Spusťte `npm init -y`
3. Přidejte do `package.json` řádek `"type": "module"`, aby Node.js běžel v [režimu ES modulů](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
4. Spusťte `npm install vue`
5. Vytvořte soubor `example.js`:

```js
// běží na serveru v Node.js.
import { createSSRApp } from 'vue'
// serverové API pro vykreslování ve Vue je dostupné pod `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

Poté spusťte:

```sh
> node example.js
```

Na příkazové řádce by se mělo objevit následující :

```html
<button>1</button>
```

[`renderToString()`](/api/ssr#rendertostring) přijímá instanci Vue aplikace a vrací Promise, který se vyřeší na vykreslené HTML aplikace. Je také možné provádět stream vykreslování pomocí [Node.js Stream API](https://nodejs.org/api/stream.html) nebo [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Pro další podrobnosti se podívejte na [referenci pro SSR API](/api/ssr).

Nyní můžeme kód Vue SSR přesunout do handleru serverového požadavku, jenž obaluje markup aplikace do celé HTML stránky. Pro další kroky budeme používat [`express`](https://expressjs.com/):

- Spusťte `npm install express`
- Vytvořte následující soubor `server.js`:

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Příklad Vue SSR</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('připraven')
})
```

Nakonec spusťte `node server.js` a navštivte `http://localhost:3000`. Měli byste vidět funkční stránku s tlačítkem.

[Vyzkoušejte si to na StackBlitz](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### Hydratace na klientovi {#client-hydration}

Pokud na tlačítko kliknete, zjistíte, že se číslo nezmění. HTML je na klientovi zcela statické, protože nezavádíme Vue do prohlížeče.

Aby byla aplikace na straně klienta interaktivní, Vue musí provést krok **hydratace** (hydration). Během hydratace vytvoří stejnou Vue aplikaci, která byla spuštěna na serveru, přiřadí každou komponentu k DOM elementů, které by měla ovládat, a připojí listenery DOM událostí.

Pro připojení aplikace v režimu hydratace musíme místo `createApp()` použít [`createSSRApp()`](/api/application#createssrapp):

```js{2}
// běží v prohlížeči
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...stejná aplikace jako na serveru
})

// připojení SSR aplikace na klientovi předpokládá,
// že HTML bylo předem vykresleno,
// a místo připojování nových DOM elementů
// provede hydrataci
app.mount('#app')
```

### Struktura kódu {#code-structure}

Všimněte si, že jsme znovu použili stejnou implementaci aplikace jako na serveru. Teď musíme začít přemýšlet o struktuře kódu v SSR aplikaci - jak sdílet stejný kód aplikace mezi serverem a klientem?

Zde ukážeme nejjednodušší možnou konfiguraci. Nejprve rozdělme logiku vytváření aplikace do samostatného souboru `app.js`:

```js
// app.js (sdílený mezi serverem a klientem)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

Tento soubor a jeho závislosti jsou sdíleny mezi serverem a klientem - nazýváme je **univerzální kód**. Při psaní univerzálního kódu je třeba věnovat pozornost několika věcem, o kterých budeme [diskutovat níže](#writing-ssr-friendly-code).

Náš vstup na klientovi importuje univerzální kód, vytváří aplikaci a provádí připojení:

```js
// client.js
import { createApp } from './app.js'

createApp().mount('#app')
```

A server používá stejnou logiku vytváření aplikaci v handleru požadavku:

```js{2,5}
// server.js (nedůležitý kód je vynechán)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

Kromě načtení souborů pro klienta v prohlížeči musíme dále:

1. Vystavit soubory pro klienty přidáním `server.use(express.static('.'))` do `server.js`.
2. Načíst vstup klienta přidáním `<script type="module" src="/client.js"></script>` do těla HTML.
3. Umožnit použití jako `import * from 'vue'` v prohlížeči přidáním [Import Map](https://github.com/WICG/import-maps) do těla HTML.

[Vyzkoušejte to kompletní příklad na StackBlitz](https://stackblitz.com/fork/vue-ssr-example?file=index.js). Tlačítko je nyní interaktivní!

## Vyšší úrovně řešení {#higher-level-solutions}

Přechod od příkladu k SSR aplikaci připravené pro produkci zahrnuje mnohem více. Budeme muset:

- Podporovat Vue SFC a další požadavky na build. Ve skutečnosti budeme muset koordinovat dvě sestavení pro stejnou aplikaci: jedno pro klienta a jedno pro server.

  :::tip
  Vue komponenty jsou při použití SSR kompilovány odlišně - šablony jsou pro lepší výkon kompilovány do souboru řetěžců místo funkcí pro vykreslování Virtual DOM.
  :::

- V obsluze požadavku na serveru vykreslit HTML s odpovídajícími odkazy na klientovské prostředky a optimálními nápovědami pro zdroje. Může být také nutné přepínat mezi režimem SSR a SSG nebo dokonce kombinovat oba v jedné aplikaci.

- Spravovat směrování, načítání dat a správu stavových úložišť univerzálním způsobem.

Kompletní implementace by byla poměrně složitá a závisela by na souboru build nástrojů, který jste si vybrali. Proto vřele doporučujeme zvolit již připravené řešení vyšší úrovně, které pro vás složitost abstrahuje. Níže představíme několik doporučených SSR variant v ekosystému Vue.

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) je framework vyšší úrovně postavený na ekosystému Vue, který poskytuje jednodušší development experience pro psaní univerzálních Vue aplikací. Navíc ho můžete použít i jako generátor statických stránek! Vřele doporučujeme ho vyzkoušet.

### Quasar {#quasar}

[Quasar](https://quasar.dev) je kompletní řešení založené na Vue, které vám umožňuje cílit na SPA, SSR, PWA, mobilní aplikace, desktopové aplikace a rozšíření pro prohlížeč, vše pomocí jednoho kódu. Nejenže se stará o nastavení buildu, ale také poskytuje plnou sbírku UI komponent, které splňují Material Design.

### Vite SSR {#vite-ssr}

Vite poskytuje vestavěnou [podporu pro Vue server-side rendering](https://vitejs.dev/guide/ssr.html), ale je záměrně nízkoúrovňový. Pokud chcete použít přímo Vite, podívejte se na [vite-plugin-ssr](https://vite-plugin-ssr.com/), komunitní plugin, který pro vás abstrahuje mnoho obtížných detailů.

Můžete také najít [příklad](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue) projektu Vue + Vite SSR s manuálním nastavením, který může sloužit jako základ pro další práci. Vemte však na vědomí, že toto je doporučeno pouze pokud máte zkušenosti se SSR / build nástroji a opravdu chcete mít úplnou kontrolu nad vyšší úrovní architektury.

## Psaní kódu přátelského k SSR {#writing-ssr-friendly-code}

Bez ohledu na nastavení buildu nebo volbu frameworku vyšší úrovně platí některé zásady, které se vztahují na všechny Vue SSR aplikace.

### Reaktivita na serveru {#reactivity-on-the-server}

Během SSR se každá požadovaná URL mapuje na požadovaný stav naší aplikace. Neexistuje žádná interakce uživatele a žádné aktualizace DOM, takže reaktivita na serveru je zbytečná. Ve výchozím nastavení je reaktivita během SSR pro lepší výkon zakázána.

### Lifecycle hooks komponent {#component-lifecycle-hooks}

Protože nejsou žádné dynamické aktualizace, lifecycle hooks jako <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> nebo <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> **NEBUDOU** během SSR volány a budou vykonány pouze na klientovi.<span class="options-api"> Jediné hooks, které jsou při SSR volány, jsou `beforeCreate` a `created`</span>

Měli byste se vyhnout kódu, který produkuje vedlejší efekty, které v <span class="options-api">`beforeCreate` a `created`</span><span class="composition-api">`setup()` nebo v root scope `<script setup>`</span> vyžadují úklid. Příkladem takových vedlejších efektů je nastavení časovačů pomocí `setInterval`. V klientském kódu můžeme nastavit časovač a poté ho zrušit v <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> nebo <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span>. Nicméně, protože unmount hooks během SSR nikdy nebudou volány, časovače zůstanou navždy. Abyste tomu předešli, přesuňte váš kód s vedlejšími efekty do <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

### Přístup k platformně specifickým API {#access-to-platform-specific-apis}

Univerzální kód nemůže předpokládat přístup k platformně specifickým API, takže pokud váš kód přímo používá globální proměnné jako `window` nebo `document` dostupné pouze v prohlížeči, při jejich vykonávání v Node.js dojde k chybám a naopak.

Pro úkoly, které jsou sdílené mezi serverem a klientem, ale s API různých platforem, se doporučuje obalit platformně specifické implementace do univerzálního API nebo použít knihovny, které to za vás udělají. Například můžete použít [`node-fetch`](https://github.com/node-fetch/node-fetch) pro použití stejného fetch API jak na serveru, tak na klientovi.

Pro API pouze pro prohlížeč je běžným přístupem "lazy" přístupování k nim uvnitř lifecycle hooks pouze na klientovi, jako je <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

Vemte na vědomí, že pokud knihovna třetí strany není pro univerzální použití zamýšlena, může být obtížné ji do aplikace s vykreslováním na serveru integrovat. Možná se vám podaří ji rozchodit pomocí mockování některých globálních proměnných, ale bude to "hack" a můžete narušit kód pro detekci prostředí jiných knihoven.

### Cross-Request State Pollution {#cross-request-state-pollution}

V kapitole o správě stavu jsme představili [jednoduchý vzor správy stavu pomocí Reactivity API](state-management#simple-state-management-with-reactivity-api). V kontextu SSR vyžaduje tento vzor některé dodatečné úpravy.

Vzor deklaruje sdílený stav ve hlavním scope JavaScriptového modulu. To z nich dělá **singletony** - tj. existuje pouze jedna instance reaktivního objektu po celou dobu životnosti naší aplikace. V čistě klientovské aplikaci Vue to funguje správně, protože moduly v naší aplikaci jsou pro každou návštěvu stránky v prohlížeči znovu inicializovány.

Ovšem v kontextu SSR jsou moduly aplikace na serveru obvykle inicializovány pouze jednou při spuštění serveru. Stejné instance modulů budou při více požadavcích na server použity znovu, stejně jako naše singleton stavové objekty. Pokud měníme sdílený singleton stav s daty specifickými pro jednoho uživatele, může se nechtěně prosadit do požadavku od jiného uživatele. Toto nazýváme **cross-request state pollution**.

Technicky je možné při každém požadavku znovu inicializovat všechny moduly JavaScriptu, stejně jako v prohlížečích. Jenže inicializace JavaScriptových modulů může být nákladná, takže by to výrazně ovlivnilo výkon serveru.

Doporučeným řešením je při každém požadavku vytvořit novou instanci celé aplikace - včetně routeru a globálních úložišť. Poté místo přímého importu poskytneme sdílený stav pomocí [provide na úrovni aplikace](/guide/components/provide-inject#app-level-provide) a vkládáme jej do komponent, které ho potřebují:

```js
// app.js (sdílený mezi serverem a klientem)
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// voláno při každém požadavku
export function createApp() {
  const app = createSSRApp(/* ... */)
  // vytvoří novou instanci úložiště pro každý požadavek
  const store = createStore(/* ... */)
  // poskytuje úložiště na úrovni aplikace
  app.provide('store', store)
  // také vystavuje úložiště pro účely hydratace
  return { app, store }
}
```

Knihovny pro správu stavu, jako je Pinia, jsou navrženy, aby toto respektovaly. Pro více informací se podívejte na [Pinia průvodce SSR](https://pinia.vuejs.org/ssr/).

### Nesoulad hydratace {#hydration-mismatch}

Pokud struktura DOM předvykresleného HTML neodpovídá očekávanému výstupu aplikace na straně klienta, dojde k chybě nesouladu hydratace (hydration mismatch). Nejčastější příčiny jsou:

1. Šablona obsahuje neplatnou vnořenou strukturu HTML a vykreslené HTML bylo "opraveno" chováním nativního HTML parseru v prohlížeči. Například běžnou chybou je, že [`<div>` nemůže být umístěn uvnitř `<p>`](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it):

   ```html
   <p><div>ahoj</div></p>
   ```

   Pokud toto vygenerujeme v našem serverem vykresleném HTML, prohlížeč ukončí první `<p>` při setkání s `<div>` a přetvoří vstup do následující DOM struktury:

   ```html
   <p></p>
   <div>ahoj</div>
   <p></p>
   ```

2. Data použitá během vykreslování obsahují náhodně generované hodnoty. Protože stejná aplikace poběží dvakrát - jednou na serveru a jednou na klientovi - není zaručeno, že náhodné budou mezi oběma běhy stejné. Existují dvě možnosti, jak se nesouladům způsobeným náhodnými hodnotami vyhnout:

   1. Pro vykreslení části, která závisí na náhodných hodnotách, pouze na klientovi, použijte `v-if` + `onMounted`. Váš framework může mít také vestavěné funkce, které to usnadní, například komponenta `<ClientOnly>` ve VitePress.

   2. Použijte knihovnu generátoru náhodných čísel, která podporuje generování s použitím seeds, a zajistěte, aby běh na serveru a klientovi používal stejný seed (např. zahrnutím seedu do serializovaného stavu a jeho získáním klientovi).

3. Server a klient jsou v různých časových pásmech. Někdy chceme převést timestamp na místní čas uživatele. Nicméně, časová pásma na serveru a na klientovi nejsou vždy stejná a při běhu na serveru nemusíme spolehlivě znát časové pásmo uživatele. V takových případech by měla být konverze na místní čas provedena pouze na klientovi.

Když Vue na nesoulad hydratace narazí, pokusí se automaticky obnovit a upravit předvykreslený DOM tak, aby odpovídal stavu na straně klienta. To povede ke ztrátě výkonu vykreslování kvůli odstranění nesprávných a připojení nových elementů, ale ve většině případů by aplikace měla nadále fungovat správně. Nicméně je stále nejlepší nesoulady hydratace eliminovat během vývoje.

### Vlastní direktivy {#custom-directives}

Vzhledem k tomu, že většina vlastních direktiv zahrnuje přímou manipulaci s DOM, jsou při SSR ignorovány. Pokud však chcete určit, jak by měla být vlastní direktiva vykreslena (tj. jaké atributy by měla přidat k vykreslenému prvku), můžete v direktivě použít příkaz `getSSRProps`:

```js
const myDirective = {
  mounted(el, binding) {
    // implementace na straně klienta:
    // přímo aktualizujte DOM
    el.id = binding.value
  },
  getSSRProps(binding) {
    // implementace na straně serveru:
    // vrátit vlastnosti (props), které mají být vykresleny
    // getSSRProps dostává pouze binding direktivy
    return {
      id: binding.value
    }
  }
}
```

### Teleportace {#teleports}

Teleportace pomocí vestavěné komponenty `<Teleport>` vyžaduje při SSR speciální zpracování. Pokud vykreslená aplikace obsahuje teleporty, teleportovaný obsah nebude součástí vykresleného řetězce. Jednodušším řešením je podmíněné vykreslení teleportace při inicializaci.

Pokud však potřebujete hydratovat teleportovaný obsah, je dostupná vlastnost `teleports` objektu ssr kontextu:

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleportovany obsah' }
```

Značky pro teleportaci musíte vložit na správné místo ve vašem finálním HTML stránky, podobně jako musíte vložit hlavní markup aplikace.

:::tip
Při použití Teleportace a SSR se vyhněte cílení na `body` - obvykle bude `<body>` obsahovat jiný serverem vykreslený obsah, což znemožňuje Teleportům správně určit výchozí umístění pro hydrataci.

Místo toho upřednostněnte samostatný kontejner, např. `<div id="teleported"></div>`, který obsahuje pouze teleportovaný obsah.
:::
