# FAQ - často kladené dotazy {#frequently-asked-questions}

## Kdo spravuje Vue? {#who-maintains-vue}

Vue je nezávislý projekt řízený komunitou. Byl vytvořen [Evanem You](https://twitter.com/youyuxi) v roce 2014 jako osobní vedlejší projekt. Dnes je Vue aktivně spravován [týmem jak zaměstnanců, tak dobrovolníků z celého světa](/about/team), kde Evan působí jako vedoucí projektu. Více informací o&nbsp;příběhu Vue najdete v tomto [dokumentárním filmu](https://www.youtube.com/watch?v=OrxmtDw4pVI).

Vývoj Vue je převážně financován ze sponzorských darů a od roku 2016 jsme finančně udržitelní. Pokud vy nebo váš podnik z Vue těžíte, zvažte [sponzorství](/sponsor/) pro podporu dalšího vývoje Vue!

## Jaký je rozdíl mezi Vue 2 a Vue 3? {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 je aktuální, nejnovější major verze Vue. Obsahuje nové funkce, které nejsou ve Vue 2 přítomny, jako je Teleport, Suspense a více root elementů v jedné šabloně. Obsahuje také zásadní změny, které jsou s Vue 2 nekompatibilní. Podrobnosti jsou zdokumentovány v [Průvodci migrací na Vue 3](https://v3-migration.vuejs.org/).

Navzdory rozdílům je většina Vue API mezi oběma hlavními verzemi sdílena, takže většina vašich znalostí Vue 2 bude nadále fungovat i ve Vue 3. Zejména Composition API byla původně funkcí pouze pro Vue 3, ale nyní bylo zpětně přeneseno do Vue 2 a je k&nbsp;dispozici od [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01).

Obecně řečeno, Vue 3 poskytuje menší velikost balíčku, lepší výkon, lepší škálovatelnost a lepší podporu TypeScriptu / IDE. Pokud začínáte nový projekt dnes, je Vue 3 doporučená volba. Existuje už jen málo důvodů, proč byste měli zvážit Vue 2:

- Potřebujete podporu pro IE11. Vue 3 využívá moderní funkce JavaScriptu a&nbsp;IE11 nepodporuje.

Pokud plánujete migrovat existující Vue 2 aplikaci na Vue 3, využijte [průvodce migrací](https://v3-migration.vuejs.org/).

## Je stále podporováno Vue 2? {#is-vue-2-still-supported}

Vue 2.7, která byla vydána v červenci 2022, je poslední minor release Vue 2. Vue 2 tím vstoupilo do režimu údržby: již nezískávalo nové funkce, ale opravy kritických chyb a&nbsp;bezpečnostní aktualizace vycházely ještě po dobu 18 měsíců od data vydání 2.7. To&nbsp;znamená, že **Vue 2 dosáhlo konce životnosti (EOL) 31. prosince 2023**.

Věříme, že to poskytlo dostatek času k migraci na Vue 3 většině ekosystému. Chápeme však také, že mohou existovat týmy nebo projekty, které v tomto časovém rámci upgradovat nemohly, a přitom stále potřebují plnit požadavky na zabezpečení a potřeby svých klientů. Spolupracujeme s odborníky v oboru, abychom pro takové týmy poskytli rozšířenou podporu pro Vue 2 – pokud váš tým používá Vue 2 i po konci roku 2023, plánujte dopředu a zjistěte si více o [Vue 2 Extended LTS]( https://v2.vuejs.org/lts/).

## Jakou používá Vue licenci? {#what-license-does-vue-use}

Vue je bezplatný open source projekt vydaný pod [MIT licencí](https://opensource.org/licenses/MIT).

## Které prohlížeče Vue podporuje? {#what-browsers-does-vue-support}

Nejnovější verze Vue (3.x) podporuje pouze [prohlížeče s nativní podporou ES2016](https://caniuse.com/es2016). To&nbsp;vylučuje IE11. Vue 3.x používá ES2016 funkce, které nelze ve starších prohlížečích nahradit pomocí polyfill technologií. Pokud starší prohlížeče podporovat potřebujete, budete muset použít Vue 2.x.

## Je Vue spolehlivé? {#is-vue-reliable}

Vue je vyzrálý a praxí ověřený framework. V současnosti je to jeden z nejrozšířenějších JavaScript frameworků, s více než 1,5 milionu uživatelů po celém světě a téměř 10 miliony stažení za měsíc na npm.

Vue používají v různých kapacitách v produkci renomované organizace po celém světě, včetně Wikimedia Foundation, NASA, Apple, Google, Microsoft, GitLab, Zoom, Tencent, Weibo, Bilibili, Kuaishou a mnoha dalších.

## Je Vue rychlé? {#is-vue-fast}

Vue 3 je jedním z nejvýkonnějších mainstreamových frontend frameworků a snadno zvládá většinu případů užití webových aplikací, bez nutnosti ručních optimalizací.

V zátěžových testech podle [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html) Vue překonává React a Angular se slušným náskokem. Krok v tomto benchmarku drží i s některými z nejrychlejších produkčních non-virtual-DOM frameworků.

Je třeba si uvědomit, že syntetické benchmarky, jako je výše uvedený, se zaměřují na čistý výkon vykreslování s dedikovanými optimalizacemi a nemusí plně reprezentovat výsledky výkonu v reálné aplikaci. Pokud vám více záleží na výkonu načítání stránek, můžete zkontrolovat třeba právě tento web pomocí [WebPageTest](https://www.webpagetest.org/lighthouse) nebo [PageSpeed Insights](https://pagespeed.web.dev/). Tato webová stránka je sama o sobě poháněna Vue, s SSG pre-renderingem, full-page hydratací a SPA navigací na straně klienta. Výkon na emulovaném Moto G4 se&nbsp;4x CPU throttlingem přes pomalé 4G sítě dosahuje 100 bodů.

Další informace, jak Vue automaticky optimalizuje svůj výkon za běhu, se můžete dozvědět v sekci [Mechanismus vykreslování](/guide/extras/rendering-mechanism). Jak optimalizovat Vue aplikaci ve zvláště náročných případech najdete v [průvodci optimalizací výkonu]( /guide/best-practices/performance).

## Je Vue lightweight? {#is-vue-lightweight}

Když používáte build tool, mnoho API rozhraní Vue je [„tree-shakable“](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking). Pokud například nepoužijete vestavěnou komponentu `<Transition>`, nebude do výsledného produkčního balíčku zahrnuta.

Vue aplikace `Hello world`, která používá pouze absolutně minimální API, má s minifikací a brotli kompresí základní velikost pouze kolem **16 kb**. Skutečná velikost aplikace bude záviset na tom, kolik volitelných funkcí z frameworku použijete. V nepravděpodobném případě, kdy aplikace využívá každou jednotlivou funkci, kterou Vue poskytuje, je celková velikost runtime přibližně **27 kb**.

Při používání Vue bez build toolu nejenže ztrácíme tree-shaking, ale také musíme prohlížeče přibalit kompilátor šablon. Tím se zvětší velikost na přibližně **41 kb**. Pokud tedy používáte Vue primárně pro progresivní vylepšení bez build fáze, zvažte použití [petite-vue](https://github.com/vuejs/petite-vue) (pouze **6 kb**).

Některé frameworky, jako je Svelte, používají kompilační strategii, která produkuje extrémně lightweight výstup v situaci s jednou komponentou. [Náš výzkum](https://github.com/yyx990803/vue-svelte-size-analysis) však ukazuje, že rozdíl ve velikosti silně závisí na počtu komponent v aplikaci. Zatímco Vue má větší základní velikost, generuje méně kódu na jednu komponentu. Ve scénářích z reálného světa může tak být Vue aplikace velmi snadno menší.

## Škáluje se Vue? {#does-vue-scale}

Ano. Navzdory běžné mylné představě, že Vue je vhodné pouze pro jednoduché případy užití, je Vue dokonale schopno zvládnout rozsáhlé aplikace:

- [Single-File komponenty (SFC)](/guide/scaling-up/sfc) poskytují modulární model vývoje, který umožňuje tvořit různé části aplikace izolovaně.

- [Composition API](/guide/reusability/composables) poskytuje prvotřídní integraci TypeScriptu a umožňuje čisté vzory pro organizaci, extrakci a znovupoužití složité logiky.

- [Rozsáhlá nástrojová podpora](/guide/scaling-up/tooling) zajišťuje hladký vývoj, zatímco aplikace roste.

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

Specifikace Web Components jsou relativně nízké úrovně, protože jsou soustředěny kolem definování custom elementů. Jako framework řeší Vue další problémy vyšší úrovně, jako je efektivní vykreslování DOM, reaktivní state management, tooling, routing na straně klienta a vykreslování na straně serveru (SSR).

Vue také plně podporuje zpracování nebo export do nativních custom elementů – další podrobnosti najdete v [průvodci Vue a Web Components](/guide/extras/web-components).

<!-- ## TODO Jak je na tom Vue ve srovnání s Reactem? -->

<!-- ## TODO Jak je na tom Vue ve srovnání s Angularem? -->
