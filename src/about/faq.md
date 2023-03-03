# Frequently Asked Questions {#frequently-asked-questions}

## Who maintains Vue? {#who-maintains-vue}

Vue is an independent, community-driven project. It was created by [Evan You](https://twitter.com/youyuxi) in 2014 as a personal side project. Today, Vue is actively maintained by [a team of both full-time and volunteer members from all around the world](/about/team), where Evan serves as the project lead. You can learn more about the story of Vue in this [documentary](https://www.youtube.com/watch?v=OrxmtDw4pVI).

Vue's development is primarily funded through sponsorships and we have been financially sustainable since 2016. If you or your business benefit from Vue, consider [sponsoring us](/sponsor/) to support Vue's development!

## What's the difference between Vue 2 and Vue 3? {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 is the current, latest major version of Vue. It contains new features that are not present in Vue 2, such as Teleport, Suspense, and multiple root elements per template. It also contains breaking changes that make it incompatible with Vue 2. Full details are documented in the [Vue 3 Migration Guide](https://v3-migration.vuejs.org/).

Despite the differences, the majority of Vue APIs are shared between the two major versions, so most of your Vue 2 knowledge will continue to work in Vue 3. Notably, Composition API was originally a Vue-3-only feature, but has now been backported to Vue 2 and is available in [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01).

In general, Vue 3 provides smaller bundle sizes, better performance, better scalability, and better TypeScript / IDE support. If you are starting a new project today, Vue 3 is the recommended choice. There are only a few reasons for you to consider Vue 2 as of now:

- You need to support IE11. Vue 3 leverages modern JavaScript features and does not support IE11.

- You are still waiting for major ecosystem projects like Nuxt or Vuetify to release stable versions for Vue 3. This is reasonable if you do not wish to use beta-stage software. However, do note there are other already stable Vue 3 component libraries such as [Quasar](https://quasar.dev/), [Naive UI](https://www.naiveui.com/) and [Element Plus](https://element-plus.org/).

If you intend to migrate an existing Vue 2 app to Vue 3, consult the [migration guide](https://v3-migration.vuejs.org/).

## Je stále podporováno Vue 2? {#is-vue-2-still-supported}

Vue 2.7, která byla vydána v červenci 2022, je poslední minor release Vue 2. Vue 2 nyní vstoupilo do režimu údržby: již nebude získávat nové funkce, ale bude i nadále dostávat opravy kritických chyb a bezpečnostní aktualizace po dobu 18 měsíců od data vydání 2.7. To znamená, že **Vue 2 dosáhne konce životnosti 31. prosince 2023**.

Věříme, že to poskytne dostatek času k migraci na Vue 3 většině ekosystému. Chápeme však také, že mohou existovat týmy nebo projekty, které v tomto časovém rámci upgradovat nemohou, a přitom stále potřebují plnit požadavky na zabezpečení a potřeby svých klientů. Spolupracujeme s odborníky v oboru, abychom pro takové týmy poskytli rozšířenou podporu pro Vue 2 – pokud váš tým očekává, že bude Vue 2 používat i po konci roku 2023, plánujte dopředu a zjistěte si více o [Vue 2 Extended LTS]( https://v2.vuejs.org/lts/).

## Jakou používá Vue licenci? {#what-license-does-vue-use}

Vue je bezplatný open source projekt vydaný pod [MIT licencí](https://opensource.org/licenses/MIT).

## Které prohlížeče Vue podporuje? {#what-browsers-does-vue-support}

Nejnovější verze Vue (3.x) podporuje pouze [prohlížeče s nativní podporou ES2015](https://caniuse.com/es6). To vylučuje IE11. Vue 3.x používá ES2015 funkce, které nelze ve starších prohlížečích nahradit pomocí polyfill technologií. Pokud starší prohlížeče podporovat potřebujete, budete muset použít Vue 2.x.

## Je Vue spolehlivé? {#is-vue-reliable}

Vue je vyzrálý a praxí ověřený framework. V současníé produkci je to jeden z nejrozšířenějších JavaScript frameworků, s více než 1,5 milionu uživatelů po celém světě a téměř 10 miliony stažení za měsíc na npm.

Vue používají v různých kapacitách v produkci renomované organizace po celém světě, včetně Wikimedia Foundation, NASA, Apple, Google, Microsoft, GitLab, Zoom, Tencent, Weibo, Bilibili, Kuaishou a mnoha dalších.

## Je Vue rychlé? {#is-vue-fast}

Vue 3 je jedním z nejvýkonnějších mainstreamových frontend frameworků a snano zvládá většinu případů užití webových aplikací, bez nutnosti ručních optimalizací.

V zátěžových testech podle [js-framework-benchmark](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html) Vue překonává React a Angular se slušným náskokem. S některými z nejrychlejších produkčních non-virtual-DOM frameworků drží v tomto benchmarku krok.

Je třeba si uvědomit, že syntetické benchmarky, jako je výše uvedený, se zaměřují na čistý výkon vykreslování s dedikovanými optimalizacemi a nemusí plně reprezentovat výsledky výkonu v reálné aplikaci. Pokud vám více záleží na výkonu načítání stránek, můžete zkontrolovat třeba právě tento web pomocí [WebPageTest](https://www.webpagetest.org/lighthouse) nebo [PageSpeed Insights](https://pagespeed.web.dev/). Tato webová stránka je sama o sobě poháněna Vue, s SSG pre-renderingem, full-page hydratací a SPA navigací na straně klienta. Výkon na emulovaném Moto G4 se 4x CPU throttlingem přes pomalé 4G sítě dosahuje 100 bodů.

Další informace, jak Vue automaticky optimalizuje svůj výkon za běhu, se můžete dozvědět v sekci [Mechanismus vykreslování](/guide/extras/rendering-mechanism). Jak optimalizovat Vue aplikaci ve zvláště náročných případech najdete v [Průvodci optimalizací výkonu]( /guide/best-practices/performance).

## Je Vue lightweight? {#is-vue-lightweight}

Když používáte build tool, mnoho API rozhraní Vue je ["tree-shakable"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking). Pokud například nepoužijete vestavěnou komponentu `<Transition>`, nebude do výsledného produkčního balíčku zahrnuta.

Vue aplikace `Hello world`, která používá pouze absolutně minimální API, má s minifikací a brotli kompresí základní velikost pouze kolem **16 kb**. Skutečná velikost aplikace bude záviset na tom, kolik volitelných funkcí z frameworku použijete. V nepravděpodobném případě, kdy aplikace využívá každou jednotlivou funkci, kterou Vue poskytuje, je celková velikost runtime přibližně **27 kb**.

Při používání Vue bez build toolu nejenže ztrácíme tree-shaking, ale také musíme prohlížeče přibalit kompilátor šablon. Tím se zvětší velikost na přibližně **41 kb**. Pokud tedy používáte Vue primárně pro progresivní vylepšení bez build fáze, zvažte použití [petite-vue](https://github.com/vuejs/petite-vue) (pouze **6kb**).

Některé frameworky, jako je Svelte, používají kompilační strategii, která produkuje extrémně lightweight výstup v situaci s jednou komponentou. [Náš výzkum](https://github.com/yyx990803/vue-svelte-size-analysis) však ukazuje, že rozdíl ve velikosti silně závisí na počtu komponent v aplikaci. Zatímco Vue má větší základní velikost, generuje méně kódu na jednu komponentu. Ve scénářích z reálného světa může tak být Vue aplikace velmi snadno menší.

## Škáluje se Vue? {#does-vue-scale}

Ano. Navzdory běžné mylné představě, že Vue je vhodné pouze pro jednoduché případy užití, je Vue dokonale schopno zvládnout rozsáhlé aplikace:

- [SFC komponenty](/guide/scaling-up/sfc) poskytují modulární development model, který umožňuje vyvíjet různé části aplikace izolovaně.

- [Composition API](/guide/reusability/composables) poskytuje prvotřídní integraci TypeScriptu a umožňuje čisté vzory pro organizování, extrahování a opětovné použití složité logiky.

- [Rozsáhlá tooling podpora](/guide/scaling-up/tooling) zajišťuje hladký vývoj, zatímco aplikace roste.

- Strmá křivka učení a vynikající dokumentace se promítají do nižších vstupních nákladů na zapojení a školení nových vývojářů.

## Jak mohu Vue přispět? {#how-do-i-contribute-to-vue}

Vážíme si vašeho zájmu. Podívejte se prosím na našeho [Průvodce komunitou](/about/community-guide).

## Mám používat Options API nebo Composition API? {#should-i-use-options-api-or-composition-api}

Pokud jste ve Vue nováčci, nabízíme high-level srovnání těchto dvou stylů [zde](/guide/introduction#which-to-choose).

Pokud jste již dříve používali Options API a právě teď přemýšlíte o Composition API, podívejte se na [tyto FAQ](/guide/extras/composition-api-faq).

## Mám s Vue používat JavaScript nebo TypeScript? {#should-i-use-javascript-or-typescript-with-vue}

I když je samotné Vue implementováno v TypeScriptu a poskytuje pro TypeScript prvotřídní podporu, nevynucuje si názor, že byste jako uživatel museli TypeScript používat.

Podpora TypeScriptu je důležitým faktorem při přidávání nových funkcí do Vue. API, která jsou navržena s ohledem na TypeScript, jsou obvykle pro IDE a lintery srozumitelnější, i když vy sami TypeScript nepoužíváte. Win-win. Vue API jsou také navržena tak, aby fungovala co nejvíc stejným způsobem v JavaScriptu i TypeScriptu.

Přijetí TypeScriptu zahrnuje kompromis mezi složitostí úvodní adaptace a dlouhodobými zisky z udržovatelnosti. Zda lze takový kompromis ospravedlnit, se může lišit v závislosti na zázemí vašeho týmu a rozsahu projektu, ale samotné Vue není faktorem ovlivňujícím toto rozhodnutí.

## Jak je na tom Vue ve srovnání s Web Components? {#how-does-vue-compare-to-web-components}

Vue bylo vytvořeno dříve, než byly Web Components nativně dostupné, a některé aspekty Vue designu (např. sloty) byly inspirovány modelem Web Components.

Specifikace Web Components jsou relativně nízké úrovně, protože jsou soustředěny kolem definování vlastních elementů. Jako framework řeší Vue další problémy vyšší úrovně, jako je efektivní vykreslování DOM, reaktivní state management, tooling, routing na straně klienta a vykreslování na straně serveru (SSR).

Vue také plně podporuje zpracování nebo export do nativních custom elementů – další podrobnosti najdete v [Průvodci Vue a Web Components] (/guide/extras/web-components).

<!-- ## TODO Jak je na tom Vue ve srovnání s Reactem? -->

<!-- ## TODO Jak je na tom Vue ve srovnání s Angularem? -->
