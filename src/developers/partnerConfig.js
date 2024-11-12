import partnerData from '../partners/partners.json'

const partnerName = 'Proxify'
const partner = partnerData.find(partner => partner.name === partnerName)

const websiteLabel = 'proxify.io'
const websiteUrl = 'https://proxify.io/'
const applyUrl = 'https://career.proxify.io/apply'
const hireUrl = 'https://proxify.io/hire-vuejs'
const vueArticleUrl = 'https://proxify.io/hire-vue-developers'
const imageStorageUrl = 'https://res.cloudinary.com/proxify-io/image/upload'

const partnerConfig = {
  // Partner information
  partnerName: partner?.name,
  logo: partner?.logo,
  flipLogo: partner?.flipLogo || false,

  // Partner website
  websiteUrl: websiteUrl,
  hireUsButtonUrl: hireUrl,

  // Image storage URL
  imageStorageUrl: imageStorageUrl,

  // Hero Section
  pageHeroBanner: {
    /// title: 'Vue Developers',
    description: 'Vývojáři Vue jsou certifikovaní freelanceři. Platby, dodržování předpisů a\xa0prověřování spravuje náš partner Proxify. Máte zájem být zařazeni mezi ně?',
    applyButton: {
      url: applyUrl,
      label: 'Přihlaste se zde'
    },

    title: 'Najděte nejlepší Vue.js vývojáře pro svůj tým',
    description1: 'Získejte přístup k certifikovaným Vue.js vývojářům dostupným pro váš příští projekt.',
    description2: 'Proxify zajišťuje proces prověřování, aby byla zajištěna jejich špičková kvalita a spolehlivost.',
    hireButton: {
      url: hireUrl,
      label: 'Najít Vue.js odborníky'
    },
    footer: "Nechte se spojit s elitním Vue.js vývojářem za méně než 48 hodin",
  },

  // Hero Section
  pageJoinSection: {
    title: 'Staňte se registrovaným vývojářem',
    description: 'Získejte dlouhodobou pozici na částečný nebo plný úvazek ve společnosti, která\xa0hledá Vue.js vývojáře.',
    applyButton: {
      url: applyUrl,
      label: 'Požádat o zapojení'
    }
  },

  // Footer Configuration
  pageFooter: {
    text: `Tohoto vysoce prověřeného vývojáře vám přináší Vue partner:`,
    email: 'vue@proxify.io',
    phone: '+44 20 4614 2667',
    websiteVueLink: vueArticleUrl,
    websiteVueLabel: websiteLabel + '/hire-vue-developers'
  },

  // Diagram sections
  profileDiagram: {
    title: 'Profil kandidáta',
    prependText: 'Jak si naši kandidáti vedou v ukazatelích, které nejlépe odpovídají budoucímu úspěchu v dané roli.'
  },

  scoreDiagram: {
    title: 'Engineering excellence score',
    prependText: 'Rozsah praktického skóre je od 0 do 300. Toto je distribuce výsledků všech hodnocených Vue.js vývojářů, a zde je, jak si vedl váš kandidát.',
    appendText: 'Data získána od 3,661 posuzovaných Vue.js vývojářů a 38,008 uchazečů.'
  },

  // Proficiency Section
  proficiencies: {
    skillsPerCard: 5
  }
}

export default partnerConfig
