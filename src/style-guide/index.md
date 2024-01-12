---
outline: deep
---

# Průvodce stylováním {#style-guide}

Toto je oficiální průvodce pravidly pro psaní kódu ve Vue. Pokud používáte Vue v projektu, je to skvělá reference, abyste se vyhnuli chybám, ztrátě času trivialitami (bikesheddingu) a anti-patternům. Nemyslíme si však, že jakýkoli průvodce stylováním je ideální pro všechny týmy nebo projekty, a proto doporučujeme rozumné odchylky založené na minulých zkušenostech, ostatních použivaných technologiích a osobních hodnotách.

Z velké části se také vyhýbáme návrhům ohledně JavaScriptu nebo HTML obecně. Nezáleží nám na tom, zda použijete středníky nebo koncové čárky. Nezáleží nám na tom, zda váš kód HTML používá pro hodnoty atributů jednoduché nebo dvojité uvozovky. Budou ovšem existovat určité výjimky, u kterých jsme zjistili, že konkrétní vzor je v kontextu Vue užitečný.

Nakonec jsme pravidla rozdělili do čtyř kategorií:

## Kategorie pravidel {#rule-categories}

### Priorita A: Zásadní (prevence chyb) {#priority-a-essential-error-prevention}

Tato pravidla pomáhají předcházet chybám, proto se je za každou cenu naučte a dodržujte je. Výjimky mohou existovat, ale měly by být velmi vzácné a měly by být dělány pouze osobami s odbornými znalostmi jak JavaScriptu, tak Vue.

- [Zobrazit všechna pravidla priorty A](./rules-essential)

### Priorita B: Silně doporučené {#priority-b-strongly-recommended}

Tato pravidla byla zavedena pro zlepšení čitelnosti a/nebo komfortu pro vývojáře na většině projektů. Pokud je porušíte, váš kód bude stále fungovat, ale porušení by měla být vzácná a dobře odůvodněná.

- [Zobrazit všechna pravidla priorty B](./rules-strongly-recommended)

### Priorita C: Doporučené {#priority-c-recommended}

Tam, kde existuje více stejně dobrých možností, lze pro zajištění konzistence vybrat libovolnou z nich. V těchto pravidlech popisujeme každou přijatelnou možnost a navrhujeme výchozí variantu. To znamená, že se můžete ve své vlastní kódové bázi volně rozhodnout, pokud budete konzistentní a máte pro to dobrý důvod. Ale mějte prosím dobrý důvod! Přizpůsobením se standardu komunity budete:

1. trénovat svůj mozek, aby snadněji analyzoval většinu kódu v rámci Vue komunity, se kterým se setkáte
2. umět zkopírovat a vložit většinu příkladů kódu v rámci Vue komunity bez dalších úprav
3. častěji nacházet nové zaměstnance, kteří jsou již zvyklí na váš styl kódování, alespoň pokud jde o Vue

- [Zobrazit všechna pravidla priorty C](./rules-recommended)

### Priorita D: Používejte s rozvahou {#priority-d-use-with-caution}

Některé funkce Vue existují pro přizpůsobení se vzácným okrajovým případům nebo kvůli hladší migraci z legacy kódu. Při nadměrném používání však mohou ztížit údržbu vašeho kódu nebo se dokonce stát zdrojem chyb. Tato pravidla upozorňují na potenciálně rizikové funkce a popisují, kdy a proč je třeba se jim vyhnout.

- [Zobrazit všechna pravidla priorty D](./rules-use-with-caution)
