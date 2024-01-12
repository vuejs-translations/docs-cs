# Způsoby použití Vue {#ways-of-using-vue}

Věříme, že pro web neexistuje "univerzální řešení". Proto je Vue navrženo tak, aby bylo flexibilní a adoptovatelné postupně. V závislosti na vašich potřebých může být Vueo použit různými způsoby, abyste dosáhli optimální rovnováhy mezi složitostí technologického stacku, zkušenostmi vývojáře a cílovým výkonem aplikace.

## Samostatný skript {#standalone-script}

Vue může být použito jako samostatný skript soubor - není vyžadována žádná build fáze! Pokud již máte backendový framework, který renderuje většinu HTML, nebo pokud vaše frontendová logika není dostatečně složitá na to, aby build fázi opravňovala, je to nejjednodušší způsob, jak integrovat Vue do vašeho stacku. V takových případech můžete Vue považovat za deklarativní náhradu jQuery.

Vue také poskytuje alternativní distribuci nazvanou [petite-vue](https://github.com/vuejs/petite-vue), která je speciálně optimalizována pro postupné vylepšování existujícího HTML. Má menší soubor funkcí, ale je extrémně odlehčená a používá implementaci, která je v případech bez build fáze efektivnější.

## Vložené webové komponenty {#embedded-web-components}

Vue můžete použít k [vytvoření standardních Web Components](/guide/extras/web-components), které lze vložit do libovolné HTML stránky, bez ohledu na to, jak je vykreslována. Tato možnost vám umožňuje využít Vue zcela nezávisle na spotřebiteli: výsledné webové komponenty lze vložit do zastaralých aplikací, statického HTML nebo dokonce do aplikací postavených s jinými frameworky.

## Single-Page aplikace (SPA) {#single-page-application-spa}

Některé aplikace vyžadují bohatou interaktivitu, větší hloubku session a netriviální stavovou logiku na frontendu. Nejlepším způsobem, jak takové aplikace vytvářet, je použití architektury, kde Vue nejen ovládá celou stránku, ale také zajišťuje aktualizace dat a navigaci bez nutnosti stránku znovu načítat. Tento typ aplikace se obvykle označuje jako Single-Page aplikace (SPA).

Vue poskytuje core knihovny a [komplexní podpůrné nástroje](/guide/scaling-up/tooling) se skvělou developer experience pro vytváření moderních SPA, včetně:

- Routeru na straně klienta
- Extrémně rychlého build nástroje
- Podpory v IDE
- Devtools v prohlížeči
- Integrace s TypeScriptem
- Pomůcek pro testování

SPA obvykle vyžadují, aby backend poskytoval API endpointy - ale můžete také spojit Vue s řešeními jako [Inertia.js](https://inertiajs.com), abyste získali výhody SPA a zároveň zachovali model vývoje zaměřený na server (server-centric).

## Fullstack / SSR {#fullstack-ssr}

Čistě klientské SPA jsou problematické, pokud aplikace závisí na SEO a čase do načtení obsahu (time-to-content). To je způsobeno tím, že prohlížeč obdrží převážně prázdnou HTML stránku a musí čekat, dokud se nenačte JavaScript, než se začne cokoli vykreslovat.

Vue poskytuje prvotřídní API pro "vykreslování" Vue aplikace do HTML řetězců na serveru. To umožňuje serveru poslat již vykreslené HTML a koncovým uživatelům okamžitě vidět obsah, zatímco se stahuje JavaScript. Vue pak aplikaci na straně klienta "hydratuje", aby byla interaktivní. Toto se nazývá [Server-Side Rendering (SSR)](/guide/scaling-up/ssr) a výrazně zlepšuje metriky Core Web Vitals, jako je [Largest Contentful Paint (LCP)](https://web.dev/lcp/).

Existují vyšší úrovně frameworků založených na Vue postavených na tomto paradigmatu, jako je [Nuxt](https://nuxt.com/), který vám umožní vyvíjet fullstack aplikaci pomocí Vue a JavaScriptu.

## JAMStack / SSG {#jamstack-ssg}

Server-side rendering lze provést předem, pokud jsou požadovaná data statická. To znamená, že můžeme předem vykreslit celou aplikaci do HTML a poskytovat ji jako statické soubory. To zlepšuje výkon webu a zjednodušuje nasazení, protože již nemusíme při každém požadavku dynamicky vykreslovat stránky. Vue stále může takové aplikace hydratovat a poskytovat na straně klienta bohatou interaktivitu. Tato technika se obvykle nazývá Static-Site Generation (SSG), také známá jako [JAMStack](https://jamstack.org/what-is-jamstack/).

Existují dvě varianty SSG: single-page a multi-page. Oba typy předem vykreslují web do statického HTML, rozdíl spočívá v tom, že:

- Počáteční načtení stránky single-page SSG "hydratuje" stránku do SPA. To vyžaduje vyšší počáteční zatížení JS a náklady na hydrataci, ale následné navigace budou rychlejší, protože je třeba obsah stránky pouze částečně aktualizovat místo načítání celé stránky znovu.

- Multi-page SSG načítá novou stránku při každé navigaci. Výhodou je, že může odeslat minimální množství JS - nebo dokonce žádný JS, pokud stránka žádnou interakci nevyžaduje! Některé vícestránkové SSG frameworky, jako například [Astro](https://astro.build/), také podporují "částečné hydratace" - což vám umožní používat Vue komponenty k vytváření interaktivních "ostrovů" uvnitř statického HTML.

Jednostránkové SSG jsou vhodnější, pokud očekáváte složitou interaktivitu, dlouhotrvající session nebo trvalé prvky/stavy při navigaci. V opačném případě bude lepší volbou vícestránkové SSG.

Tým Vue také spravuje statický generátor webu s názvem [VitePress](https://vitepress.dev/), který pohání i tuto webovou stránku, kterou právě čtete! VitePress podporuje oba druhy SSG. [Nuxt](https://nuxt.com/) SSG také podporuje. Dokonce můžete kombinovat SSR a SSG pro různé cesty ve stejné Nuxt aplikaci.

## Mimo web {#beyond-the-web}

I když je Vue primárně navrženo pro tvorbu webových aplikací, neznamená to, že je omezeno pouze na prohlížeč. Můžete:

- Vytvářet desktopové aplikace s [Electron](https://www.electronjs.org/) nebo [Tauri](https://tauri.app)
- Vytvářet mobilní aplikace s [Ionic Vue](https://ionicframework.com/docs/vue/overview)
- Vytvářet desktopové a mobilní aplikace ze stejného kódu s [Quasar](https://quasar.dev/)
- Vytvářet WebGL 3D animace pomocí [TresJS](https://tresjs.org/)
- Používat Vue [Custom Renderer API](/api/custom-renderer) pro tvorbu vlastních nástrojů pro vykreslování například pro [terminál](https://github.com/vue-terminal/vue-termui)!
