<!-- THIS PAGE SHOULD LATER TRANSFORM INTO SOME -->
<!-- "Notes on Czech transalation" -->
<!-- DOCS PAGE -->
<!-- IT IS INTENDED TO EXPLAIN SOME DECISIONS MADE -->
<!-- DURING THE TRANSLATION PROCESS -->
<!-- WITH LINKS TO GLOSSARY -->
<!-- TO AVOID NEWCOMMERS CONFUSION -->

## Obecné

Proč tato sekce?

Pokud jsme měli pocit, že český překlad může být matoucí či zavádějící, uvádíme v závorce původní anglický termín.

## Poznámky k jednotlivým překladům

### JavaScript

#### Elementy (elements / nodes)

Když se mluví o prvcích DOM, snažili jsme se pojmy důsledně unifikovat a nepřeskaovat náhodně mezi `elementem`, `prvkem`, `tagem` či `uzlem`. Pro překlad jsme zcela arbitrárně upřednostnili slovo `element`.

Malou výjimku jsme udělali v částech věnovaných vykreslování, kde se mluví o "virtuálním DOM". Zde bývá použito nepřeložené `vnode`, což je zkratka pro "virtual node". Zde se jevilo lepší pojem coby _"terminus technicus"_ zachovat.

Občas se objevuje i netransformované slovo `tag`, ale pouze ve chvíli, kdy se mluví o konkrétním HTML markupu (například o `<h1>` pro nadpis).

#### Atributy (attributes)

Vždy je myšlen atribut HTML elementu dle specifikace jazyka HTML. V následujícím příkladu má `div` element atributy `id` a `class`:

```html
<div id="id" class="class" />
```

#### Event listenery / handlery

Zde jsme se rozhodli zachovat raději anglofonní přepis, než zavádět české překlady "posluchače událostí" či "obsluha událostí". Věříme, že programátoři s nezbytným minimem znalostí JavaScriptu budou vědět, o co jde.

### Vue

#### ref

Slovo `ref` patrně rozumně přeložit nelze. Označuje "reaktivní proměnnou" vzniklou použitím built-in funkce `ref()`, což je jeden ze základních stavebních kamenů současného Vue.

[Viz](/glossary/#ref)

#### Možnosti (options)

Slovo `options` je sice nejspíš každému v IT "jasné", ale najít jeho uspokojivý překlad do češtiny je složitější. Zvlášť tak, aby byl konzistentní s jinými. Nakonec vyhrálo slovo "možnost".

[Viz](/glossary/#options-api)

#### Vlastnosti (props)

Pojem `props` **není** totožný s "properties". Označuje "vlastnosti", ale pouze ty, které se předávají dovnitř [SFC komponenty](https://vuejs.org/glossary/#single-file-component), která je speciálním způsobem deklaruje. 

[Viz](/glossary/#prop)

#### Lifecycle hooks

"Lifecycle" sice jako "životní cyklus" přeložíme snadno, ovšem ve spojení s pojmem "hooks" je to horší. Překladače sice nabídly možnost "háčky životního cyklu", nemyslíme si však, že bychom tomu pomohli. Pojem každopádně značí kus kódu (funkci), který se vykoná v určitou chvíli práce s komponentou. To znamená například při připojení vykreslené komponenty do DOM (mount) nebo naopak její odebrání (unmount).

[Viz](/glossary/#lifecycle-hooks)

#### Provide / inject

Další oříšek z cyklu vnitřního fungování Vue. Jde o mechanismus, jak posílat vlastnosti (props) do komponent potomků přes více mezičlánků. Aby se zabránilo negativnímu jevu, který raději ani nepřekládáme ("prop drilling"), kdy každá komponenta v řetězci musí deklrovat vlastnost jenom proto, aby ji mohla přeposlat dát, lze v nadřazené komponentě použít techniku **"poskytutí"** (`provide`) hodnoty, kterou lze v libovolném potomkovi **"implementovat"** (`inject`). 

Chtěli jsme se zejména vyhnout použití spíše nelogického českého slova "injektovat", proto opis pomocí "implementovat". Zároveň tam, kde se hovoří přímo o "Provide / inject" mechanismu jako takovém, překlad nepoužíváme, aby nedocházelo k přílišnému zmatení.

[Viz](/glossary/#provide-inject)

<!-- WIP -->

- root
- scope
- mount

## Reklamace

Nikdo není dokonalý a jelikož alespoň jedna chyba je v každém programu, nepochybně jsou nějaké chyby i v tomto překladu. Cokoliv se vám nebude zdát nebo pokud vám přijde, že něco není z námi použitých formulací pochopitelné, neváhejte se ozvat.

Můžete využít [GitHub issues](https://github.com/vuejs-translations/docs-cs/issues) a založit hlášení přímo tam, nebo kontaktujte jedním z dostupných způsobů [Aloise Sečkára](https://alois-seckar.cz/).
