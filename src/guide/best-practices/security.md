# Bezpečnost {#security}

## Hlášení zranitelností {#reporting-vulnerabilities}

Když je nahlášena zranitelnost (vulnerability), okamžitě se stává naším prvořadým zájmem a plnohodnotný člen týmu se na začně věnovat jejímu řešení. Pro nahlášení zranitelnosti nás prosím kontaktujte emailem na [security@vuejs.org](mailto:security@vuejs.org).

I když je objevování nových zranitelností vzácné, doporučujeme vždy používat nejnovější verze Vue a jeho oficiálních doplňkových knihoven, abyste zajistili co nejvyšší úroveň zabezpečení vaší aplikace.

## Pravidlo č. 1: Nikdy nepoužívejte nedůvěryhodné šablony {#rule-no-1-never-use-non-trusted-templates}

Nejdůležitějším bezpečnostním pravidlem při používání Vue je **nikdy nepoužívat nedůvěryhodný obsah jako šablonu vaší komponenty**. Tímto způsobem umožňujete libovolné provádění JavaScriptu ve vaší aplikaci - a co je horší, může to vést i k narušení serveru, pokud je kód spuštěn během vykreslování na serveru (SSR). Příklad takového použití:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` //  TOTO NIKDY NEPOUŽÍVEJTE
}).mount('#app')
```

Vue šablony jsou kompilovány do JavaScriptu a výrazy uvnitř šablon jsou vyhodnocovány jako součást procesu vykreslování. I když jsou výrazy vyhodnocovány vůči konkrétnímu kontextu vykreslování, kvůli složitosti potenciálních globálních prostředí pro vykonávání kódu je nereálné očekávat, že by framework jako Vue dokázal plně chránit před potenciálně škodlivým kódem bez zbytečného zpomalení výkonu. Nejjednodušší způsob, jak se vyhnout tomuto typu problémů, je zajistit, aby obsah vašich Vue šablon byl vždy důvěryhodný a plně ovládaný vámi.

## Co Vue dělá pro vaši ochranu {#what-vue-does-to-protect-you}

### Obsah HTML {#html-content}

Při použití šablon nebo funkcí pro vykreslování je obsah automaticky sanitizován (escaped). To znamená, že v této šabloně:

```vue-html
<h1>{{ userProvidedString }}</h1>
```

pokud by `userProvidedString` obsahoval:

```js
'<script>alert("ahoj")</script>'
```

byl by převeden na následující HTML:

```vue-html
&lt;script&gt;alert(&quot;ahoj&quot;)&lt;/script&gt;
```

tímto se zabrání vložení skriptu. Tato sanitizace se provádí pomocí nativních API prohlížeče, jako je `textContent`, takže zranitelnost může existovat pouze v případě, že&nbsp;je prohlížeč sám zranitelný.

### Vazby atributů {#attribute-bindings}

Podobně jsou také automaticky sanitizovány dynamické vazby atributů. To znamená, že&nbsp;v této šabloně:

```vue-html
<h1 :title="userProvidedString">
  ahoj
</h1>
```

pokud by `userProvidedString` obsahoval:

```js
'" onclick="alert(\'ahoj\')'
```

bylo by upraven na následující HTML:

```vue-html
&quot; onclick=&quot;alert('ahoj')
```

tím se zabrání uzavření atributu `title` a vložení nového, libovolného HTML. Tato sanitizace se provádí pomocí nativních API prohlížeče, jako je `setAttribute`, takže zranitelnost může existovat pouze v případě, že je prohlížeč sám zranitelný.

## Potenciální nebezpečí {#potential-dangers}

V jakékoli webové aplikaci je povolení nesanitizovaného obsahu poskytovaného uživatelem k provedení jako HTML, CSS nebo JavaScript potenciálně nebezpečné, a&nbsp;proto byste se mu měli pokud možno vyvarovat. Existují však situace, kdy je určitá míra rizika přijatelná.

Například služby jako CodePen a JSFiddle umožňují provádění obsahu poskytovaného uživatelem, ale je to v kontextu, kde se to očekává a je částečně izolováno uvnitř iframe. V případech, kdy důležitá funkce nevyhnutelně vyžaduje určitou úroveň zranitelnosti, je na vašem týmu, aby zvážil důležitost funkce v porovnání s nejhoršími scénáři, které zranitelnost umožňuje.

### Vkládání HTML {#html-injection}

Jak jste se již naučili, Vue automaticky sanitizuje obsah HTML, což vám zabrání omylem vkládat spustitelné HTML do vaší aplikace. Nicméně, **v případech, kdy víte, že je HTML bezpečné**, můžete obsah HTML explicitně vykreslit:

- Použitím šablony:

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- Použitím funkce pro vykreslení:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- Použitím funkce pro vykreslení s JSX:

```jsx
<div innerHTML={this.userProvidedHtml}></div>
```

:::warning
Uživatelem poskytnutý HTML kód nemůže být považován za 100% bezpečný, pokud není umístěn v sandboxovaném iframe nebo v části aplikace, která je vystavena pouze uživateli, který tento HTML kód napsal. Kromě toho povolování uživatelům psát vlastní Vue šablony přináší podobná rizika.
:::

### URL Injection {#url-injection}

V URL adrese jako je tato:

```vue-html
<a :href="userProvidedUrl">
  klikni zde
</a>
```

existuje potenciální bezpečnostní problém, pokud URL adresa nebyla „sanitizována“ pro zabránění spuštění JavaScriptu pomocí `javascript:`. Existují knihovny, jako například [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url), které vám s tím mohou pomoci, ale pozor: pokud provádíte sanitizaci URL adres na frontendu, již máte bezpečnostní problém. **Uživatelsky poskytnuté URL adresy by měly být vždy sanitizovány na serverové straně ještě před uložením do databáze.** Poté je problém vyřešen pro _každého_ klienta připojeného k vašemu API, včetně nativních mobilních aplikací. Také si uvědomte, že ani se sanitizovanými URL adresami, vám Vue nemůže garantovat, že vedou na bezpečné cíle.

### Style Injection {#style-injection}

Podívejme se na tento příklad:

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  klikni zde
</a>
```

Předpokládejme, že `sanitizedUrl` byla sanitizována, takže je to určitě platná URL adresa a ne JavaScript. S `userProvidedStyles` by však zákeřní uživatelé stále mohli poskytnout CSS kód pro „click jacking“, například nastavit odkaz jako průhledný box přes tlačítko „Přihlásit se“. Pokud je `https://user-controlled-website.com/` vytvořeno tak, aby připomínalo přihlašovací stránku vaší aplikace, mohli by tím zachytit skutečné přihlašovací údaje uživatele.

Můžete si představit, jak by povolení uživatelem poskytnutého obsahu pro element `<style>` vytvořilo ještě větší zranitelnost, protože by uživatel měl plnou kontrolu nad tím, jak stylovat celou stránku. Proto Vue brání vykreslování style tagů uvnitř šablon, jako například:

```vue-html
<style>{{ userProvidedStyles }}</style>
```

Chcete-li uživatele před clickjackingem plně ochránit, doporučujeme povolit plnou kontrolu pouze nad CSS uvnitř sandboxovaného iframe. Alternativně, pokud poskytujete uživatelskou kontrolu pomocí bindingu stylů, doporučujeme použít [objektovou syntaxi](/guide/essentials/class-and-style#binding-to-objects-1) a&nbsp;povolit uživatelům poskytovat hodnoty pouze pro konkrétní vlastnosti, které je pro ně bezpečné ovládat, například takto:

```vue-html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  klikni na mě
</a>
```

### Vkládání JavaScriptu {#javascript-injection}

Důrazně nedoporučujeme ve Vue kdykoli vykreslovat prvek `<script>`, protože šablony a&nbsp;funkce pro vykreslení by nikdy neměly mít vedlejší účinky. To však není jediný způsob, jak za běhu programu zahrnout řetězce, které by byly vyhodnoceny jako JavaScript.

Každý HTML prvek má atributy s hodnotami přijímajícími JavaScript řetězce, jako například `onclick`, `onfocus` a `onmouseenter`. Binding uživatelem poskytovaného JavaScriptu na kterýkoli z těchto událostních atributů představuje potenciální bezpečnostní riziko, a proto byste se mu měli vyhnout.

:::warning
Uživatelem poskytovaný JavaScript nemůže být nikdy považován za 100% bezpečný, pokud není v sandboxovaném iframe nebo v části aplikace, která je vystavena pouze uživateli, který tento JavaScript napsal.
:::

Někdy dostáváme zprávy o zranitelnostech týkajících se toho, jak je ve Vue šablonách možné provádět cross-site scripting (XSS). Obecně nepovažujeme takové případy za skutečné zranitelnosti, protože neexistuje praktický způsob, jak ochránit vývojáře před dvěma scénáři, které by XSS umožnily:

1. Vývojář explicitně žádá Vue, aby vykreslil uživatelem poskytovaný, nesanitizovaný obsah jako Vue šablony. To je inherentně nebezpečné a Vue nemá způsob, jak zjistit původ.

2. Vývojář připojuje Vue k celé HTML stránce, která obsahuje na serveru vykreslený a&nbsp;uživatelem poskytovaný obsah. Jedná se zásadně o stejný problém jako v případě \#1, ale někdy mohou vývojáři takové připojení provést, aniž by si to uvědomili. To může vést k možným zranitelnostem, kdy útočník poskytuje HTML, které je bezpečné jako prostý HTML, ale nebezpečné jako Vue šablona. Nejlepší praxí je **nikdy nepřipojovat Vue k elementům, které mohou obsahovat na serveru vykreslený a&nbsp;uživatelem poskytovaný obsah**.

## Osvěčené postupy {#best-practices}

Všeobecné pravidlo je, že pokud umožníte provádění neupraveného obsahu poskytnutého uživatelem (buď jako HTML, JavaScript nebo dokonce CSS), můžete se vystavit útokům. Tento návod ve skutečnosti platí bez ohledu na to, zda používáte Vue, jiný framework nebo dokonce žádný framework.

Kromě doporučení uvedených výše pro [Potenciální nebezpečí](#potential-dangers) vám také doporučujeme se seznámit s těmito zdroji:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Poté použijte to, co se naučíte, abyste zkontrolovali i zdrojový kód svých závislostí na potenciálně nebezpečné vzorce, pokud některé z nich zahrnují komponenty třetích stran nebo jinak ovlivňují to, co je vykresleno do DOM.

## Koordinace s backendem {#backend-coordination}

Zranitelnosti zabezpečení HTTP, jako je cross-site request forgery (CSRF/XSRF) a cross-site script inclusion (XSSI), jsou řešeny především na straně backendu, takže se to netýká Vue. Nicméně je stále dobrý nápad komunikovat se svým backendovým týmem, abyste se dozvěděli, jak nejlépe interagovat s jejich API, například posíláním CSRF tokenů při odesílání formulářů.

## Vykreslování na serveru (SSR) {#server-side-rendering-ssr}

Při použití SSR existují některá další bezpečnostní rizika. Abyste se vyhnuli zranitelnostem, ujistěte se, že dodržujete osvěčené postupy uvedené v naší dokumentaci o [vykreslování na serveru](/guide/scaling-up/ssr).
