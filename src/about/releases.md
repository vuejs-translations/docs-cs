---
outline: deep
---

<script setup>
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# Verzování {#releases}

<p v-if="version">
Nejnovější stabilní verze Vue.js je <strong>{{ version }}</strong>.
</p>
<p v-else>
Kontrola poslední verze...
</p>

Kompletní seznam úprav minulých verzí je dostupný na [GitHubu](https://github.com/vuejs/core/blob/main/CHANGELOG.md).

## Release cyklus {#release-cycle}

Vue nemá pevně daný release cyklus.

- Patch verze jsou zveřejňovány podle potřeby.

- Minor verze vždy obsahují nové funkce a typicky vychází v časovém odstupu 3-6 měsíců. Vždy prochází beta pre-release fází.

- Major verze budou vždy oznámeny předem a projdou fází předběžné diskuse a alpha / beta pre-release fázemi.

## Speciální případy sémantického verzování {#semantic-versioning-edge-cases}

Vue verzování se řídí pravidly [Sémantického verzování](https://semver.org/) s několika speciálními případy.

### TypeScript definice {#typescript-definitions}

Mezi **minor** verzemi mohou být nekompatibilní změny v TypeScript definicích. Může se to stát, protože:

1. Někdy dodává nekompatibilní změny mezi menšími verzemi sám TypeScript a může být nutné typy upravit, aby podporovaly novější verze TypeScriptu.

2. Občas můžeme potřebovat převzít funkce, které jsou dostupné pouze v novější verzi TypeScriptu, čímž se zvýší minimální požadovaná verze TypeScriptu.

Pokud používáte TypeScript, můžete použít semver rozsah, který uzamkne aktuální minor verze, a upgradovat ručně, až bude vydána nová minor verze Vue.

### Kompatibilita kompilovaného kódu se starším runtime {#compiled-code-compatibility-with-older-runtime}

Novější **minor** verze Vue překladače může generovat kód, který není kompatibilní s Vue runtime ze starší minor verze. Například kód generovaný Vue překladačem 3.2 nemusí být plně kompatibilní, pokud je spouštěn z Vue runtime 3.1.

To se týká pouze autorů knihoven, protože v aplikacích je verze překladače a verze runtime vždy stejná. Nesoulad verzí může nastat pouze v případě, že distribuujete předem zkompilovaný kód Vue komponenty jako package a cílový uživatel jej použije v&nbsp;projektu používajícím starší verzi Vue. V důsledku toho může být nutné, aby váš balíček výslovně deklaroval minimální požadovanou minor verzi Vue.

## Pre-releases {#pre-releases}

Minor a major verze obvykle procházejí sérií pre-release fází: **alpha**, **beta** a **release candidate (RC)**. Počty a typy pre-release verzí závisí na rozsahu změn. Například minor verze s omezenými aktualizacemi může mít pouze beta fázi, zatímco major verze obvykle zahrnuje všechny tři fáze, aby bylo umožněno důkladné testování a zapracování zpětné vazby od komunity.

Nejnovější pre-release verze můžete nainstalovat z npm pomocí `npx install-vue@alpha`, `npx install-vue@beta` nebo `npx install-vue@rc`. Pro testování změn, které ještě nejsou obsaženy v tagem označených pre-release verzích, je každý commit do repozitáře [vuejs/core](https://github.com/vuejs/core) publikován v pracovním CI preview, které můžete nainstalovat jako `npx install-vue@edge`.

Pre-release verze jsou určeny pro testování integrace / stability a pro early adopters, kteří poskytují zpětnou vazbu pro nově vznikající funkce. V produkci pre-release verze nepoužívejte. Všechny pre-release verze jsou považovány za nestabilní a může mezi nimi docházet k přelomovým změnám, proto se při používání pre-release verzí vždy držte konkrétního čísla verze.

## Deprecations {#deprecations}

Periodicky můžeme ukončit podporu funkcí, které mají v minor verzích nové, lepší náhrady. Deprecated funkce budou nadále fungovat, ale budou odstraněny v příští major verzi poté, co vstoupí do stavu deprecated.

## RFCs {#rfcs}

Nové funkce s výrazným dopadem na API a velké změny ve Vue projdou procesem **Request for Comments** (RFC). Proces RFC má za úkol poskytnout konzistentní a řízenou cestu pro zavádění nových funkcí do frameworku a poskytnout uživatelům příležitost zapojit se a nabídnout zpětnou vazbu během designové fáze.

Všechny RFC jsou spravovány ve [vuejs/rfcs](https://github.com/vuejs/rfcs) repozitáři na GitHubu.

## Experimentální funkce {#experimental-features}

Některé funkce jsou dodávány a dokumentovány ve stabilní verzi Vue, ale jsou označeny jako experimentální. Experimentální funkce jsou obvykle ty, které mají přidruženou RFC diskusi s většinou návrhových problémů vyřešených na papíře, ale stále postrádající zpětnou vazbu z reálného použití.

Cílem experimentálních funkcí je umožnit uživatelům poskytnout zpětnou vazbu jejich testováním v produkčním prostředí, aniž by museli používat nestabilní verzi Vue. Samotné experimentální funkce jsou považovány za nestabilní a měly by být používány pouze kontrolovaným způsobem s vědomím, že se způsob použití funkce může s&nbsp;jakoukoli novou verzí vydání změnit.
