# Přístupnost {#accessibility}

Přístupnost (accessibility) webu (také známá jako a11y) označuje praxi vytváření webových stránek, které mohou být používány kýmkoli - ať už se jedná o osobu s&nbsp;postižením, pomalým připojením, zastaralým nebo nefunkčním hardwarem nebo jednoduše o někoho v nevhodném prostředí. Například přidání titulků k videu pomůže jak uživatelům se sluchovým postižením, tak uživatelům, kteří se nacházejí v hlučném prostředí a nemohou svůj telefon slyšet. Stejně tak ujištění se, že váš text nemá příliš nízký kontrast, pomůže jak uživatelům se zrakovým postižením, tak uživatelům, kteří se snaží svůj telefon používat na přímém slunci.

Jste připraveni začít, ale nevíte přesně jak?

Podívejte se na [Průvodce plánováním a správou přístupnosti webu](https://www.w3.org/WAI/planning-and-managing/) poskytovaného [World Wide Web Consortium (W3C)](https://www.w3.org/)

## Přeskočit odkaz {#skip-link}

 Na začátek každé stránky byste měli přidat odkaz, který vede přímo do hlavního obsahového prostoru, aby uživatelé mohli přeskočit struktury, které se opakují na více webových stránkách.

Obvykle se to dělá na začátku souboru `App.vue`, protože to bude první focusable prvek na všech vašich stránkách:

```vue-html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink" class="skip-link">Přejít na hlavní obsah</a>
  </li>
</ul>
```

Chcete-li odkaz skrýt, pokud na něm není focus, můžete přidat následující styl:

```css
.skip-link {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
```

Jakmile uživatel změní cestu, vraťte focus zpět na odkaz pro přeskočení na obsah. Toho lze dosáhnout voláním funkce `focus()` na prvku v rámci template ref (pokud používáte `vue-router`):

<div class="options-api">

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus()
    }
  }
}
</script>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const skipLink = ref()

watch(
  () => route.path,
  () => {
    skipLink.value.focus()
  }
)
</script>
```

</div>

[Přečtěte si dokumentaci pro odkaz na přeskočení na hlavní obsah](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## Struktura obsahu {#content-structure}

Jedním z nejdůležitějších prvků přístupnosti je zajistit, aby design podporoval přístupnou implementaci. Design by měl zohledňovat nejen kontrast barev, výběr písma, velikost textu a jazyk, ale také způsob, jak je obsah v aplikaci strukturován.

### Nadpisy {#headings}

Uživatelé mohou v aplikaci navigovat pomocí nadpisů. Mít popisné nadpisy pro každou část vaší aplikace uživatelům usnadňuje předvídat obsah každé sekce. Pokud jde o&nbsp;nadpisy, pro přístupnost existuje několik doporučených postupů:

- Vnořujte nadpisy podle jejich pořadí: `<h1>` - `<h6>`
- Nepřeskakujte nadpisy uvnitř sekce
- Používejte skutečné tagy pro nadpisy místo stylování textu, aby vypadal jako nadpisy

[Více informací o nadpisech](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```vue-html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Hlavní nadpis</h1>
  <section aria-labelledby="section-title-1">
    <h2 id="section-title-1">Nadpis sekce</h2>
    <h3>Nadpis podsekce</h3>
    <!-- Obsah -->
  </section>
  <section aria-labelledby="section-title-2">
    <h2 id="section-title-2">Nadpis sekce</h2>
    <h3>Nadpis podsekce</h3>
    <!-- Obsah -->
    <h3>Nadpis podsekce</h3>
    <!-- Obsah -->
  </section>
</main>
```

### Orientační body {#landmarks}

[Orientační body (landmarks)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) poskytují programový přístup k sekcím v rámci aplikace. Uživatelé, kteří se spoléhají na asistenční technologie, mohou přejít na každou sekci aplikace a přeskočit obsah. Abyste tohoto dosáhli, můžete použít [ARIA role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles).

| HTML            | ARIA Role            | Účel orientačního bodu                                                                                           |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| header          | role="banner"        | Hlavní nadpis: název stránky                                                                                     |
| nav             | role="navigation"    | Sbírka odkazů vhodných pro navigaci v&nbsp;dokumentu nebo souvisejících dokumentech                                  |
| main            | role="main"          | Hlavní nebo centrální obsah dokumentu                                                                             |
| footer          | role="contentinfo"   | Informace o nadřazeném dokumentu: poznámky/kopie práv/odkazy na prohlášení o&nbsp;ochraně soukromí                     |
| aside           | role="complementary" | Podporuje hlavní obsah, ale je oddělený a má vlastní význam                                             |
| search          | role="search"        | Tato sekce obsahuje funkce pro vyhledávání v&nbsp;aplikaci                                                               |
| form            | role="form"          | Sbírka prvků spojených s formulářem                                                                              |
| section         | role="region"        | Obsah, který je relevantní a který uživatelé pravděpodobně budou chtít procházet. Pro tento prvek musí být poskytnut label |

[Více informací o orientačních bodech](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## Sémantické formuláře {#semantic-forms}

Při vytváření formuláře můžete použít následující elementy: `<form>`, `<label>`, `<input>`, `<textarea>` a `<button>`

Popisky (labels) jsou obvykle umístěny nad nebo vlevo od polí formuláře:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Odeslat</button>
</form>
```

Všimněte si, že na element formuláře můžete přidat `autocomplete='on'` a bude se aplikovat na všechny vstupy ve formuláři. Pro každý vstup můžete také nastavit různé [hodnoty atributu autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete).

### Popisky {#labels}

Poskytujte popisky (labels), které popisují účel všech ovládacích prvků formuláře; propojte `for` a `id`:

```vue-html
<label for="name">Jméno:</label>
<input type="text" name="name" id="name" v-model="name" />
```

Pokud zkontrolujete tento element v nástrojích pro vývojáře v Chrome DevTools a otevřete záložku Přístupnost (Accessibility) v rámci záložky Elements, uvidíte, jak vstup získává své jméno z popisku:

![Chrome Developer Tools zobrazující přístupné jméno vstupu z popisku](./images/AccessibleLabelChromeDevTools.png)

:::warning Varování
Možná jste viděli vstupní pole takto obalená popisky:

```vue-html
<label>
  Jméno:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

Explicitní nastavení popisků s odpovídajícím id je v asistenčních technologiích podporováno lépe.
:::

#### `aria-label` {#aria-label}

Také můžete  vstupu přidat přístupné jméno (accessible name) pomocí [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label).

```vue-html
<label for="name">Jméno:</label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

Můžete si tento element prohlédnout v Chrome DevTools, abyste viděli, jak se přístupné jméno změnilo:

![Chrome Developer Tools zobrazující přístupné jméno vstupu z aria-label](./images/AccessibleARIAlabelDevTools.png)

#### `aria-labelledby` {#aria-labelledby}

Použití [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) je podobné jako `aria-label`, s tím rozdílem, že se používá, pokud je text štítku viditelný na obrazovce. Je propojen s dalšími prvky pomocí jejich `id` a můžete propojit více `id`:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Fakturace</h1>
  <div class="form-item">
    <label for="name">Jméno:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Odeslat</button>
</form>
```

![Chrome Developer Tools zobrazující přístupné jméno vstupu z aria-labelledby](./images/AccessibleARIAlabelledbyDevTools.png)

#### `aria-describedby` {#aria-describedby}

[aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) se používá stejným způsobem jako `aria-labelledby`, ale poskytuje popis s dodatečnými informacemi, které by uživatel mohl potřebovat. Lze to použít k&nbsp;popisu kritérií pro jakýkoli vstup:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Fakturace</h1>
  <div class="form-item">
    <label for="name">Celé jméno:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Prosím, zadejte křestní jméno a příjmení.</p>
  </div>
  <button type="submit">Odeslat</button>
</form>
```

Popis můžete vidět v Chrome DevTools:

![Chrome Developer Tools zobrazující přístupné jméno vstupu z aria-labelledby a popis z aria-describedby](./images/AccessibleARIAdescribedby.png)

### Placeholder {#placeholder}

Vyhněte se používání placeholderů, protože mohou řadu uživatelů zmást.

Jedním z problémů s placeholdery je, že výchozí stav nesplňuje kritéria [barevného kontrastu](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html); oprava barevného kontrastu způsobí, že placeholder vypadá jako předvyplněná data ve vstupních polích. Podívejte se na následující příklad, kde můžete vidět, že placeholder pro příjmení, který splňuje kritéria barevného kontrastu, vypadá jako předvyplněná data:

![Přístupný placeholder](./images/AccessiblePlaceholder.png)

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      type="text"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
      :placeholder="item.placeholder"
    />
  </div>
  <button type="submit">Odeslat</button>
</form>
```

```css
/* https://www.w3schools.com/howto/howto_css_placeholder.asp */

#lastName::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

#lastName:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

#lastName::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
```

Nejlepší je poskytnout všechny informace, které uživatel k vyplnění formuláře potřebuje, mimo jakékoli vstupy.

### Instrukce {#instructions}

Při přidávání instrukcí pro vaše vstupní pole se ujistěte, že je správně propojíte s&nbsp;vstupem.
Můžete poskytnout dodatečné instrukce a propojit více ID uvnitř [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby). To umožňuje flexibilnější design.

```vue-html
<fieldset>
  <legend>Použití aria-labelledby</legend>
  <label id="date-label" for="date">Aktuální datum:</label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">DD.MM.YYYY</p>
</fieldset>
```

Alternativně můžete instrukce k vstupu připojit pomocí [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby):

```vue-html
<fieldset>
  <legend>Použití aria-describedby</legend>
  <label id="dob" for="dob">Datum narození:</label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">DD.MM.YYYY</p>
</fieldset>
```

### Skrývání obsahu {#hiding-content}

Obvykle se nedoporučuje vizuálně skrývat popisky, i když má vstup přístupné jméno. Pokud však funkčnost vstupu lze z okolního kontextu pochopit, můžeme popisek skrýt.

Podívejme se na toto vyhledávací pole:

```vue-html
<form role="search">
  <label for="search" class="hidden-visually">Hledat:</label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Hledat</button>
</form>
```

Můžeme to udělat, protože tlačítko pro vyhledávání pomůže vizuálním uživatelům účel vstupního pole identifikovat.

Můžeme použít CSS k vizuálnímu skrytí prvků, ale přitom je ponechat dostupné pro asistenční technologie:

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

#### `aria-hidden="true"` {#aria-hidden-true}

Přidáním `aria-hidden="true"` se prvek skryje před asistenční technologií, ale zůstane vizuálně dostupný pro ostatní uživatele. Nepoužívejte jej na ovladatelných prvcích, pouze na dekorativním, duplikovaném nebo mimo obrazovku umístěném obsahu.

```vue-html
<p>Toto není před čtečkami obrazovky skryto.</p>
<p aria-hidden="true">Toto je před čtečkami obrazovky skryto.</p>
```

### Tlačítka {#buttons}

Při použití tlačítek uvnitř formuláře musíte nastavit typ, aby nedošlo k odeslání formuláře.
Pro vytvoření tlačítek můžete také použít element `input`:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- Tlačítka -->
  <button type="button">Zrušit</button>
  <button type="submit">Odeslat</button>

  <!-- Input tlačítka -->
  <input type="button" value="Zrušit" />
  <input type="submit" value="Odeslat" />
</form>
```

### Funkční obrázky {#functional-images}

Můžete použít tuto techniku k vytvoření funkčních obrázků (functional images).

- Vstupní pole

  - Tyto obrázky budou ve formulářích sloužit jako tlačítko typu `submit`
  ```vue-html
  <form role="search">
    <label for="search" class="hidden-visually">Hledat:</label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Hledat"
    />
  </form>
  ```

- Ikony

```vue-html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Hledat:</label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Hledat</span>
  </button>
</form>
```

## Standardy {#standards}

World Wide Web Consortium (W3C) Web Accessibility Initiative (WAI) vyvíjí standardy pro přístupnost webu pro různé komponenty:

- [Pokyny pro přístupnost uživatelských agentů (UAAG)](https://www.w3.org/WAI/standards-guidelines/uaag/)
  - webové prohlížeče a přehrávače médií, včetně některých aspektů asistenčních technologií
- [Pokyny pro přístupnost nástrojů pro tvorbu (ATAG)](https://www.w3.org/WAI/standards-guidelines/atag/)
  - nástroje pro tvorbu
- [Pokyny pro přístupnost webového obsahu (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - webový obsah - používáno vývojáři, nástroji pro tvorbu a nástroji pro hodnocení přístupnosti

### Směrnice pro přístupnost webového obsahu (WCAG) {#web-content-accessibility-guidelines-wcag}

[WCAG 2.1](https://www.w3.org/TR/WCAG21/) rozšiřuje [WCAG 2.0](https://www.w3.org/TR/WCAG20/) a umožňuje implementaci nových technologií tím, že se zabývá změnami na webu. W3C doporučuje při vývoji nebo aktualizaci politiky přístupnosti webu používat nejnovější verzi WCAG.

#### Čtyři hlavní zásady WCAG 2.1 (zkráceně POUR): {#wcag-2-1-four-main-guiding-principles-abbreviated-as-pour}

- [Pozorovatelné (Percivable)](https://www.w3.org/TR/WCAG21/#perceivable)
  - Uživatelé musí být schopni vnímat prezentované informace
- [Ovladatelné (Operable)](https://www.w3.org/TR/WCAG21/#operable)
  - Rozhraní, formuláře, ovládací prvky a navigace jsou ovladatelné
- [Srozumitelné (Understandable)](https://www.w3.org/TR/WCAG21/#understandable)
  - Informace a provoz uživatelského rozhraní musí být srozumitelné pro všechny uživatele
- [Robustní (Robust)](https://www.w3.org/TR/WCAG21/#robust)
  - Uživatelé musí být s rozvojem technologií stále schopni přistupovat k obsahu

#### Web Accessibility Initiative – Accessible Rich Internet Applications (WAI-ARIA) {#web-accessibility-initiative-–-accessible-rich-internet-applications-wai-aria}

WAI-ARIA od W3C poskytuje pokyny, jak vytvářet dynamický obsah a pokročilé ovládací prvky uživatelského rozhraní.

- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

## Zdroje {#resources}

### Dokumentace {#documentation}

- [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

### Pomůcky pro asistenční technologie {#assistive-technologies}

- Čtečky obrazovky
  - [NVDA](https://www.nvaccess.org/download/)
  - [VoiceOver](https://www.apple.com/accessibility/mac/vision/)
  - [JAWS](https://www.freedomscientific.com/products/software/jaws/?utm_term=jaws%20screen%20reader&utm_source=adwords&utm_campaign=All+Products&utm_medium=ppc&hsa_tgt=kwd-394361346638&hsa_cam=200218713&hsa_ad=296201131673&hsa_kw=jaws%20screen%20reader&hsa_grp=52663682111&hsa_net=adwords&hsa_mt=e&hsa_src=g&hsa_acc=1684996396&hsa_ver=3&gclid=Cj0KCQjwnv71BRCOARIsAIkxW9HXKQ6kKNQD0q8a_1TXSJXnIuUyb65KJeTWmtS6BH96-5he9dsNq6oaAh6UEALw_wcB)
  - [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)
- Nástroje pro zvětšování
  - [MAGic](https://www.freedomscientific.com/products/software/magic/)
  - [ZoomText](https://www.freedomscientific.com/products/software/zoomtext/)
  - [Magnifier](https://support.microsoft.com/en-us/help/11542/windows-use-magnifier-to-make-things-easier-to-see)

### Testování {#testing}

- Automatické nástroje
  - [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
  - [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
  - [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?hl=en-US)
- Nástroje pro barvy
  - [WebAim Color Contrast](https://webaim.org/resources/contrastchecker/)
  - [WebAim Link Color Contrast](https://webaim.org/resources/linkcontrastchecker)
- Ostatní užitečné nástroje
  - [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en…)
  - [Color Oracle](https://colororacle.org)
  - [NerdeFocus](https://chrome.google.com/webstore/detail/nerdefocus/lpfiljldhgjecfepfljnbjnbjfhennpd?hl=en-US…)
  - [Visual Aria](https://chrome.google.com/webstore/detail/visual-aria/lhbmajchkkmakajkjenkchhnhbadmhmk?hl=en-US)
  - [Silktide Website Accessibility Simulator](https://chrome.google.com/webstore/detail/silktide-website-accessib/okcpiimdfkpkjcbihbmhppldhiebhhaf?hl=en-US)

### Uživatelé {#users}

Světová zdravotnická organizace odhaduje, že 15 % světové populace má nějakou formu postižení, z toho 2-4 % závažnou formu. To je přibližně 1 miliarda lidí po celém světě, což ze zdravotně postižených činí největší menšinovou skupinu na světě.

Existuje široká škála postižení, která lze hrubě rozdělit do čtyř kategorií:

- _[Vizuální](https://webaim.org/articles/visual/)_ - Tito uživatelé mohou využít čteček obrazovky, zvětšování obrazovky, ovládání kontrastu obrazovky nebo braillova displeje.
- _[Sluchová](https://webaim.org/articles/auditory/)_ - Tito uživatelé mohou využít titulky, přepisy nebo videa ve znakové řeči.
- _[Motorická](https://webaim.org/articles/motor/)_ - Tito uživatelé mohou využít řadu [asistenčních technologií pro motorické postižení](https://webaim.org/articles/motor/assistive): softwaru pro rozpoznávání hlasu, sledování očí, přístupu pomocí jednoho tlačítka, hlavového ovladače, přepínacího ovladače _‚sip and puff‘_, přizpůsobeného trackballu, adaptivní klávesnice nebo jiných asistenčních technologií.
- _[Kognitivní](https://webaim.org/articles/cognitive/)_ - Tito uživatelé mohou využít doplňková média, strukturální organizaci obsahu, jasné a jednoduché psaní.

Podívejte se na následující odkazy od WebAim, abyste uživatelům lépe porozuměli:

- [Perspektivy přístupnosti webu: Prozkoumejte dopad a výhody pro všechny](https://www.w3.org/WAI/perspective-videos/)
- [Příběhy uživatelů webu](https://www.w3.org/WAI/people-use-web/user-stories/)
