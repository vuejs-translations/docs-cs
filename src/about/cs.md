# Poznámky k českému překladu

## Obecné poznámky

Tuto stránku, která je specifická pro českou verzi dokumentace, jsme se rozhodli založit proto, abychom vytvořili podklad pro udržení konzistence překladu do budoucna. Původní překlad dokončený na jaře 2024 je dílem jednoho člověka, ale je možné, že se v&nbsp;průběhu času přidají další přispěvatelé. Bylo by dobré držet nějakou jednotnou linii a&nbsp;stejné výrazy překládat stále stejně.

Níže naleznete komentáře k původu vybraných překladů a důvody, které k nim vedly. Může to být jak reference, tak podklad pro případnou diskusi, že by se ten či onen termín měl napříč dokumentací změnit. Pokud budete takové návrhy mít, neváhejte [založit issue](https://github.com/vuejs-translations/docs-cs/issues) a začít diskusi.

Pokud jsme měli pocit, že český překlad může být matoucí či zavádějící, uvádíme v&nbsp;závorce i původní anglický termín.

## Poznámky ke konkrétním překladům

### JavaScript

#### Elementy (elements / nodes)

Když se mluví o prvcích DOM, snažili jsme se pojmy důsledně unifikovat a nepřeskakovat náhodně mezi `elementem`, `prvkem`, `tagem` či `uzlem`. Pro překlad jsme zcela arbitrárně upřednostnili slovo `element`.

Malou výjimku jsme udělali v částech věnovaných vykreslování, kde se mluví o&nbsp;_„virtuálním DOM“_. Zde bývá použito nepřeložené `vnode`, což je zkratka pro _„virtual node“_. Zde se jevilo lepší pojem coby _terminus technicus_ zachovat.

Občas se objevuje i netransformované slovo `tag`, ale pouze ve chvíli, kdy se mluví o&nbsp;konkrétním HTML markupu (například o `<h1>` pro nadpis).

#### Atributy (attributes)

Vždy je myšlen atribut HTML elementu dle specifikace jazyka HTML. V následujícím příkladu má `div` element atributy `id` a `class`:

```html
<div id="id" class="class" />
```

#### Event listenery / handlery

Zde jsme se rozhodli zachovat raději anglofonní přepis, než zavádět české překlady _„posluchače událostí“_ či _„obsluha událostí“_. Věříme, že programátoři s nezbytným minimem znalostí JavaScriptu budou vědět, o co jde.

#### Root

Obvykle se pojem vyskytuje ve spojení jako `root element`. Šlo by přeložit do češtiny jako _„kořenový“_, ale zatím se nám do toho nechtělo. Je to kandidát na změnu, pokud by&nbsp;se našlo dost hlasů, kterým nepřeložená forma nevyhovuje.

#### Scope

Pojem `scope` se sice dá přeložit jako _„rozsah platnosti“_, protože přesně to (nejen) v&nbsp;JavaScriptu znamená, ale podobně jako u jiných nepřeložených slov nám to přišlo nadbytečné.

#### Arrow funkce

Jde o alternativní způsob zápisu funkcí v JavaScriptu ve formátu: `( /* parametry funkce */ ) => { /* tělo funkce */ }`. Označení `arrow` pochází ze symbolu `=>`. Tento částečný překlad je podle nás v češtině častější, než doslovné a&nbsp;přitom matoucí _„šipkové funkce“_.

[Viz](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

### Vue

:::tip Upozornění
Tato stránka se zabývá pouze původem překladů do češtiny. Glosář vysvětlující základní pojmy Vue jako takové naleznete na [této stránce](/glossary/).
:::

#### ref

Slovo `ref` patrně rozumně přeložit nelze. Označuje _„reaktivní proměnnou“_ vzniklou použitím built-in funkce `ref()`, což je jeden ze základních stavebních kamenů současného Vue.

[Viz](/glossary/#ref)

#### Možnosti (options)

Slovo `option` je sice nejspíš každému v IT jasné, ale najít jeho uspokojivý překlad do češtiny je složitější. Zvlášť tak, aby byl konzistentní s jinými. Nakonec vyhrálo slovo `možnost`.

[Viz](/glossary/#options-api)

#### Vlastnosti (props)

Pojem `props` **není** totožný s _„properties“_. Označuje _„vlastnosti“_, ale pouze ty, které se předávají dovnitř [Single-File komponenty (SFC)](https://vuejs.org/glossary/#single-file-component), která je speciálním způsobem deklaruje. 

[Viz](/glossary/#prop)

#### Lifecycle hooks

Slovo _„lifecycle“_ sice jako _„životní cyklus“_ přeložíme snadno, ovšem ve spojení s pojmem „hooks“ je to horší. Překladače sice nabídly možnost _„háčky životního cyklu“_, nemyslíme si však, že bychom tomu pomohli. Pojem každopádně značí mechanismus Vue, který vykoná zadaný kus kódu (callback funkci) v určitou chvíli práce s komponentou. To znamená například při připojení vykreslené komponenty do DOM (`mount`) nebo naopak její odebrání (`unmount`).

[Viz](/glossary/#lifecycle-hooks)

#### Provide / inject

Další oříšek z cyklu vnitřního fungování Vue. Jde o způsob, jak posílat vlastnosti (props) do komponent potomků přes více mezičlánků. Aby se zabránilo negativnímu jevu, který překládáme jako _„drilling vlastností“_, kdy každá komponenta v řetězci musí deklarovat vlastnost jenom proto, aby ji mohla přeposlat dát, lze v nadřazené komponentě použít techniku **„poskytnutí“** (`provide`) hodnoty, kterou lze v libovolném potomkovi **„implementovat“** (`inject`). 

Chtěli jsme se zejména vyhnout použití spíše nelogického českého slova _„injektovat“_, proto opis pomocí _„implementovat“_. Zároveň tam, kde se hovoří přímo o _„Provide / inject“_ mechanismu jako takovém, překlad nepoužíváme, aby nedocházelo k přílišnému zmatení.

[Viz](/glossary/#provide-inject)

#### Binding

Toto je možná nejvíc kontroverzní (ne)překlad v aktuální verzi dokumentace. Myšlena je vždy _„vazba“_ – například proměnné na hodnotu uživatelského vstupu z formuláře nebo vlastnosti komponenty na dynamickou hodnotu. Přišlo nám, že zachováním nepřeloženého pojmu bude zjevnější např. u nadpisů kapitol příručky (_„Binding dat z&nbsp;formulářů“_ vs. _„Vazba dat s formulářů“_), ale pravdou je i to, že v běžném textu slovo „binding“ často působí nepatřičně. O této záležitosti budeme ještě přemýšlet.

## Slovník vybraných přeložených pojmů

Zde sledujeme překlady pro (hlavně) technické pojmy, které se objevují na více místech v dokumentaci, za účelem zachování konzistence překladu. Zde uvedené hodnoty nejsou dogma, ale je to něco, od čeho se lze odrazit. Pokud budete někdy chtít pomoct s&nbsp;překladem, podívejte se prosím na tento seznam, zda už „závazný“ překlad neexistuje. Případně neváhejte doplnit chybějící nebo [navrhnout](https://github.com/vuejs-translations/docs-cs/issues) alternativy.

### Varianty

* 🟩 Plný EN=>CS překlad
* 🟨 Částečný EN=>CS překlad
* 🟥 Ponechání EN výrazu

### Seznam

* 🟩 3rd-party = třetí strana
* 🟩 accessibility feature = funkce usnadnění
* 🟥 API = API
* 🟥 app-level = globální
* 🟩 application instance = instance aplikace
* 🟩 argument = parametr
* 🟨 arrow function = arrow funkce
* 🟩 asset = zdroj
* 🟩 assign = přiřadit
* 🟩 async request = asynchronní volání
* 🟩 attribute = atribut
* 🟩 array = pole
* 🟩 augmentation = obohacení
* 🟥 backend = backend
* 🟩 best practice = osvědčené postupy
* 🟩 bind (v.) = provést binding
* 🟥 binding = binding
* 🟩 bug = chyba ('bug' lze nechat, ale určitě raději „zdroj chyb“ než „zdroj bugů“)
* 🟩 build step = build fáze
* 🟩 build tool = build nástroj
* 🟩 built-in (adj.) = vestavěný
* 🟩 by default = ve výchozím nastavení
* 🟥 cache = cache
* 🟥 callback = callback
* 🟨 callback function = callback funkce
* 🟩 caveats = omezení
* 🟩 check out = podívejte se na
* 🟩 child = potomek
* 🟩 child component = komponenta potomka
* 🟩 Code of Conduct = Kodex chování
* 🟩 codebase = kódová báze
* 🟩 compiler = překladač (celého Vue) / kompilátor (u šablon)
* 🟩 compiler macro = makro překladače
* 🟥 composable = composable
* 🟥 Composition API = Composition API
* 🟨 computed property = computed proměnná
* 🟨 container element = mateřský element
* 🟩 content = obsah
* 🟨 custom = custom / vlastní (dle citu)
* 🟥 custom element = custom element („vlastní element“ se zdá být matoucí)
* 🟩 declarative rendering = deklarativní rendering
* 🟩 declare = deklarovat
* 🟩 deep = vnořený (za předpokladu, že odpovídá kontext, např. „deep reactivity“)
* 🟥 default export = default export
* 🟩 destructure = destrukturovat
* 🟥 developer experience = developer experience (lze užít zkratku „DX“)
* 🟥 development experience = development experience (lze užít zkratku „DX“)
* 🟩 details = podrobnosti
* 🟨 directive = direktiva
* 🟥 DOM = DOM
* 🟩 e.g. = např.
* 🟥 element = element
* 🟥 emits = emits
* 🟥 engine = engine
* 🟨 event = událost (event)
* 🟥 event handler = event handler
* 🟥 event listner = event listner
* 🟩 error = chyba
* 🟩 example = příklad
* 🟩 execution = vykonávání
* 🟩 expose (v.) = vystavit
* 🟩 expression = výraz
* 🟩 extend = rozšířit
* 🟩 factory function = tovární metoda
* 🟥 fallback = fallback
* 🟩 feature = funkce
* 🟩 flaw = nedostatek
* 🟥 focus = focus
* 🟥 framework = framework
* 🟥 frontend = frontend
* 🟩 fundamentals = základy
* 🟨 getter = getter funkce
* 🟩 globals = globální objekty
* 🟩 guide = průvodce
* 🟥 handler = handler
* 🟩 handling = obsluha (error handling = obsluha chyb)
* 🟩 helper = pomocná funkce
* 🟨 hoist (v.) = vytáhnout (hoist)
* 🟩 holding = obsahovat
* 🟥 hook = hook
* 🟨 hydration = hydratace
* 🟥 IDE = IDE
* 🟨 in-DOM template = in-DOM šablona
* 🟩 inference = odvození
* 🟩 inject = implementovat
* 🟥 injection key = injection key
* 🟥 inline = inline
* 🟨 inline styles = inline styly
* 🟩 instance property = instanční proměnná
* 🟩 invoke = zavolat (funkci)
* 🟨 JavaScript state = stav JavaScript objektů
* 🟥 kebab-case = kebab-case
* 🟥 layout = layout
* 🟨 legacy code = legacy kód
* 🟨 lazy (loading) = „lazy“ (načítání)
* 🟥 lifecycle hook = metoda životního cyklu
* 🟩 listen (to event) = naslouchat (události)
* 🟩 loop = cyklus
* 🟩 method = funkce
* 🟥 method handler = method handler
* 🟥 mixin = mixin
* 🟨 mount = připojení (mount)
* 🟨 „mustache“ syntax = „mustache“ syntaxe
* 🟩 mutate (v.) = měnit
* 🟩 mutation = změna
* 🟩 nested = vnořený
* 🟩 node (DOM) = element (není třeba mít „element“ (obecný) a „node“ (konkrétní))
* 🟩 notice (v.) = všimněte si
* 🟩 object types = objektové typy
* 🟥 open source = open source
* 🟩 option = nastavení / proměnná / sekce / vlastnost / volba (dle kontextu)
* 🟥 Options API = Options API
* 🟥 package = package
* 🟩 parent = rodič
* 🟩 parent component = komponenta rodiče
* 🟥 parser = parser
* 🟥 PascalCase = PascalCase
* 🟩 passed to = posílaný do
* 🟩 patch = aktualizace
* 🟥 placeholder = placeholder
* 🟥 plugin = plugin
* 🟥 pull request = pull request
* 🟩 prerequisities = předpoklady
* 🟨 primitive types = primitivní datové typy
* 🟥 Promise = Promise (název JS třídy)
* 🟩 property = vlastnost / proměnná
* 🟨 props = vlastnosti (props)
* 🟩 provide = poskytovat
* 🟥 proxy = proxy
* 🟩 reactive = reaktivní
* 🟩 reactivity = reaktivita
* 🟨 Reactivity API = Reaktivní API
* 🟩 reactivity system = systém reaktivity
* 🟥 read-only = read-only
* 🟥 ref = ref
* 🟨 refactoring = refaktoring
* 🟩 release = verze
* 🟩 rendering = vykreslování
* 🟩 render function = funkce pro vykreslení
* 🟥 renderer = renderer
* 🟩 resource = zdroj („prostředek“ možná ve vztahu k OS)
* 🟩 reusable = znovupoužitelný
* 🟥 root element = root element
* 🟨 root component = root komponenta
* 🟥 routing = routing
* 🟥 runtime = runtime
* 🟥 scope = scope
* 🟥 scheduler = scheduler
* 🟩 see also = viz také
* 🟨 selector = selektor
* 🟨 self-closing = nepárový (self-closing)
* 🟩 server-side rendering = vykreslování na serveru (SSR)
* 🟩 shorthand = zkrácený zápis
* 🟩 side effect = vedlejší efekt
* 🟩 sidebar = postranní panel
* 🟨 Single-File component = Single-File komponenta (SFC)
* 🟥 slot = slot
* 🟩 snippet = kus kódu
* 🟩 specify (v.) = definovat
* 🟩 state = stav
* 🟥 state management = state management
* 🟥 stateful = stateful
* 🟥 store = store
* 🟥 string = string (výjimečně „řetězec“ (obvykle je-li třeba skloňovat))
* 🟨 string template = string-šablona
* 🟩 syntactic sugar = alias pro
* 🟥 tag = tag
* 🟨 technology stack = technologický stack
* 🟩 template = šablona
* 🟥 template ref = template ref
* 🟩 tightly coupled = těsně provázané
* 🟩 theme = šablona
* 🟩 this is how = tímto způsobem můžeme
* 🟩 throw an error = vyvolat výjimku
* 🟩 top level _*sth*_ = _*něco*_ nejvyšší úrovně / globální _*něco*_  (pokud to odpovídá kontextu)
* 🟥 transition = transition
* 🟩 tree = strom
* 🟥 tree-shaking = tree-shaking
* 🟩 trigger (v.) = vyvolat
* 🟨 type = typ
* 🟩 type checking = kontrola typů
* 🟩 type hint = typová nápověda
* 🟩 type inference = odvozování typů
* 🟨 type literal = typový literál
* 🟩 under the hood = interně
* 🟩 use case = případ užití
* 🟩 using the = pomocí
* 🟩 warning = varování
* 🟥 Web Component = Web Component
* 🟩 worst case scenario = krajní případ

## Reklamace

Nikdo není dokonalý a jelikož alespoň jedna chyba je v každém programu, nepochybně jsou nějaké chyby i v tomto překladu. Cokoli se vám nebude zdát nebo pokud vám přijde, že něco není z námi použitých formulací pochopitelné, neváhejte se ozvat.

Můžete využít [GitHub issues](https://github.com/vuejs-translations/docs-cs/issues) a založit hlášení přímo tam, nebo kontaktujte jedním z&nbsp;dostupných způsobů [Aloise Sečkára](https://alois-seckar.cz/).
