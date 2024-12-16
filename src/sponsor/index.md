---
sidebar: false
ads: false
editLink: false
sponsors: false
---

<script setup>
import SponsorsGroup from '@theme/components/SponsorsGroup.vue'
import { load, data } from '@theme/components/sponsors'
import { onMounted } from 'vue'
onMounted(load)
</script>

# Staňte se Vue.js sponzorem {#become-a-vue-js-sponsor}

Vue.js je open source projekt s MIT licenci a je k použití kompletně zdarma.
Nesmírné množství úsilí potřebné k udržování tak velkého ekosystému a vývoji nových funkcí je možné jen díky štědrému financování od našich sponzorů.

## Jak sponzorovat {#how-to-sponsor}

Sponzoring je možný přes [GitHub Sponsors](https://github.com/sponsors/yyx990803) nebo [OpenCollective](https://opencollective.com/vuejs). Faktur mohou být získány přes platební systém GitHubu. Přijímáme jak pravidelné měsíční příspěvky, tak jednorázové dotace. Pravidelní sponzoři mají nárok na umístění loga podle pravidel pro jednotlivé [Stupně sponzoringu](#tier-benefits).

Pokud máte ke dotazy ke stupňům, k logistice plateb nebo k otázkám osobních údajů, prosím napište na [sponsor@vuejs.org](mailto:sponsor@vuejs.org?subject=Vue.js%20sponsorship%20inquiry).

## Sponsoring Vue pro firmy {#sponsoring-vue-as-a-business}

Sponzorování Vue vám dává možnost ukázat se více než  **2 milionům** Vue vývojářů z&nbsp;celého světa skrz naši webovou stránku a README soubory GitHub projektů. Nejen, že vám to přímo generuje potenciální zákazníky, ale také se zlepšuje reputace vaší značky jakožto firmy, která se stará o Open Source. To je sice nehmotné, ale nesmírně důležité aktivum pro společnosti tvořící produkty pro vývojáře, protože zlepšuje váš konverzní poměr.

Pokud používáte Vue pro vývoj ziskových produktů, dává sponzoring vývoje Vue smysl i&nbsp;obchodně: **zajišťuje, že platforma, na kterou váš produkt spoléhá, zůstane zdravá a&nbsp;aktivně udržovaná**. Expozice a pozitivní image značky v komunitě Vue také usnadňuje přilákání a nábor Vue vývojářů.

Pokud vytváříte produkt, kde jsou vašimi cílovými zákazníky vývojáři, získáte díky sponzorské expozici velmi kvalitní návštěvnost, protože všichni naši návštěvníci jsou vývojáři. Sponzoring také buduje povědomí o značce a zlepšuje konverzi.

## Sponsoring Vue pro jednotlivce {#sponsoring-vue-as-an-individual}

Pokud jste individuální uživatel a líbí se vám produktivita při používání Vue, zvažte dar jako projev uznání – jako když nám jednou za čas koupíte kávu. Mnoho členů našeho týmu přijímá sponzorské dary prostřednictvím GitHub Sponsors. Hledejte tlačítko „Sponzorovat“ na profilu každého člena týmu na naší [týmové stránce](/about/team).

Můžete se také zkusit přesvědčit svého zaměstnavatele, aby sponzoroval Vue jako firma. Nemusí to být snadné, ale obchodní sponzoring má obvykle mnohem větší dopad na udržitelnost open-source projektů než individuální dary, takže když uspějete, pomůžete nám mnohem více.

## Stupně sponzoringu a jejich benefity {#tier-benefits}

- **Global Special Sponsor**:
  - Pouze **jeden** celosvětový sponzor<span v-if="!data?.special">. Aktuálně volné. [Spojte se s námi!](mailto:sponsor@vuejs.org?subject=Vue.js%20special%20sponsor%20inquiry)</span><span v-else> (aktuálně obsazeno).</span>
  - (Exkluzivně) **"Above the fold"** umístění loga na úvodní stránce [vuejs.org](/).
  - (Exkluzivně) Mimořádný příspěvek a pravidelná sdílení informací o&nbsp;nově vydaných produktech přes [officiální Vue's účet na síti X](https://twitter.com/vuejs) (320 tisíc sledujících).
  - Nejvýraznější umístění loga ze všech ostatních sponzorů.
- **Platinum (USD $2,000/mo)**:
  - Prominentní umístění loga na úvodní stránce [vuejs.org](/).
  - Prominentní umístění loga na postranním panelu všech všech obsahových stránek.
  - Prominentní umístění loga v README [`vuejs/core`](https://github.com/vuejs/core) a [`vuejs/vue`](https://github.com/vuejs/core).
- **Gold (USD $500/mo)**:
  - Velké logo na úvodní stránce [vuejs.org](/).
  - Velké logo v README `vuejs/core` a `vuejs/vue`.
- **Silver (USD $250/mo)**:
  - Střední logo v `BACKERS.md` souboru `vuejs/core` a `vuejs/vue`.
- **Bronze (USD $100/mo)**:
  - Malé logo v `BACKERS.md` souboru `vuejs/core` a `vuejs/vue`.
- **Generous Backer (USD $50/mo)**:
  - Jméno uvedeno v `BACKERS.md` souboru `vuejs/core` a `vuejs/vue`, nad ostatními individuálními přispěvateli.
- **Individual Backer (USD $5/mo)**:
  - Jméno uvedeno v `BACKERS.md` souboru `vuejs/core` a `vuejs/vue`.

## Současní sponzoři {#current-sponsors}

### Global Special sponzor {#special-global-sponsor}

<SponsorsGroup tier="special" placement="page" />

### Platinum {#platinum}

<SponsorsGroup tier="platinum" placement="page" />

### Platinum (Čína) {#platinum-china}

<SponsorsGroup tier="platinum_china" placement="page" />

### Gold {#gold}

<SponsorsGroup tier="gold" placement="page" />

### Silver {#silver}

<SponsorsGroup tier="silver" placement="page" />
