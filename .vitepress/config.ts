import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'

const nav: ThemeConfig['nav'] = [
  {
    text: 'Dokumentace',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: 'Průvodce', link: '/guide/introduction' },
      { text: 'Tutoriál', link: '/tutorial/' },
      { text: 'Příklady', link: '/examples/' },
      { text: 'Jak začít', link: '/guide/quick-start' },
      // { text: 'Style Guide', link: '/style-guide/' },
      { text: 'Slovník', link: '/glossary/' },
      { text: 'Chybové kódy', link: '/error-reference/' },
      {
        text: 'Dokumentace pro Vue 2',
        link: 'https://v2.vuejs.org'
      },
      {
        text: 'Migrace z Vue 2',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'Hřiště (Vue SFC Playground)',
    link: 'https://play.vuejs.org'
  },
  {
    text: 'Ekosystém',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'Zdroje',
        items: [
          { text: 'Partneři', link: '/partners/' },
          { text: 'Šablony', link: '/ecosystem/themes' },
          { text: 'UI komponenty', link: 'https://ui-libs.vercel.app/' },
          {
            text: 'Certifikace',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
          },
          { text: 'Nabídka práce', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'E-shop', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: 'Oficiální knihovny',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' },
          { text: 'Nástroje', link: '/guide/scaling-up/tooling.html' }
        ]
      },
      {
        text: 'Video kurzy',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: 'Nápověda',
        items: [
          {
            text: 'Discord Chat',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'GitHub diskuze',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'DEV komunita', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'Novinky',
        items: [
          { text: 'Blog', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: 'Události', link: 'https://events.vuejs.org/' },
          { text: 'Newslettery', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: 'O Vue',
    activeMatch: `^/about/`,
    items: [
      { text: 'FAQ', link: '/about/faq' },
      { text: 'Tým', link: '/about/team' },
      { text: 'Verzování', link: '/about/releases' },
      {
        text: 'Průvodce komunitou',
        link: '/about/community-guide'
      },
      { text: 'Kodex chování', link: '/about/coc' },
      { text: 'Zásady ochrany osobních údajů', link: '/about/privacy' },
      { text: 'Poznámky k českému překladu', link: '/about/cs' },
      {
        text: 'Vue.js: The Documentary (Video)',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'Sponzoring',
    link: '/sponsor/'
  },
  {
    text: 'Partneři',
    link: '/partners/',
    activeMatch: `^/partners/`
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: 'Začínáme s Vue',
      items: [
        { text: 'Úvod', link: '/guide/introduction' },
        {
          text: 'Jak začít',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'Základní principy',
      items: [
        {
          text: 'Vytvoření Vue aplikace',
          link: '/guide/essentials/application'
        },
        {
          text: 'Syntaxe šablon',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'Základy reaktivity',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: 'Computed proměnné',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Binding tříd a stylů',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: 'Podmíněné vykreslování',
          link: '/guide/essentials/conditional'
        },
        { text: 'Vykreslování seznamu', link: '/guide/essentials/list' },
        {
          text: 'Obsluha událostí',
          link: '/guide/essentials/event-handling'
        },
        { text: 'Binding dat z formulářů', link: '/guide/essentials/forms' },
        {
          text: 'Lifecycle hooks',
          link: '/guide/essentials/lifecycle'
        },
        { text: 'Watchers', link: '/guide/essentials/watchers' },
        { text: 'Template refs', link: '/guide/essentials/template-refs' },
        {
          text: 'Základy komponent',
          link: '/guide/essentials/component-basics'
        }
      ]
    },
    {
      text: 'Komponenty podrobněji',
      items: [
        {
          text: 'Registace komponent',
          link: '/guide/components/registration'
        },
        { text: 'Vlastnosti (Props)', link: '/guide/components/props' },
        { text: 'Události (Events)', link: '/guide/components/events' },
        { text: 'Binding přes v-model', link: '/guide/components/v-model' },
        {
          text: 'Fallthrough atributy',
          link: '/guide/components/attrs'
        },
        { text: 'Sloty (Slots)', link: '/guide/components/slots' },
        {
          text: 'Provide / Inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Asynchronní komponenty',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Znovupoužitelnost',
      items: [
        {
          text: 'Composables',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Vlastní direktivy',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Pluginy', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: 'Vestavěné komponenty',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: 'Rozšiřování',
      items: [
        { text: 'Single-File komponenty (SFC)', link: '/guide/scaling-up/sfc' },
        { text: 'Nástroje', link: '/guide/scaling-up/tooling' },
        { text: 'Směrování', link: '/guide/scaling-up/routing' },
        {
          text: 'Správa stavu',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Testování', link: '/guide/scaling-up/testing' },
        {
          text: 'Vykreslování na serveru (SSR)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Osvědčené postupy',
      items: [
        {
          text: 'Nasazení do produkce',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Výkon',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Přístupnost',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Bezpečnost',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: 'Používání Vue s TypeScriptem', link: '/guide/typescript/overview' },
        {
          text: 'TypeScript s Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TypeScript s Options API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Extra témata',
      items: [
        {
          text: 'Způsoby použití Vue',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'FAQ o Composition API ',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'Reaktivita podrobně',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Mechanismus vykreslování',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Funkce pro vykreslení & JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue a Web Components',
          link: '/guide/extras/web-components'
        },
        {
          text: 'Techniky animace',
          link: '/guide/extras/animation'
        }
        // {
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'Globální API',
      items: [
        { text: 'Aplikace', link: '/api/application' },
        {
          text: 'Obecné',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'Reactivity API: Core',
          link: '/api/reactivity-core'
        },
        {
          text: 'Reactivity API: Utility',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Reactivity API: Pokročilé',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Lifecycle hooks',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Dependency injection',
          link: '/api/composition-api-dependency-injection'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Options API: Stav', link: '/api/options-state' },
        { text: 'Options API: Vykreslování', link: '/api/options-rendering' },
        {
          text: 'Options API: Lifecycle hooks',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Options API: Kompozice',
          link: '/api/options-composition'
        },
        { text: 'Options API: Ostatní', link: '/api/options-misc' },
        {
          text: 'Instance komponenty',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Vestavěné',
      items: [
        { text: 'Direktivy', link: '/api/built-in-directives' },
        { text: 'Komponenty', link: '/api/built-in-components' },
        {
          text: 'Speciální prvky',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Speciální atributy',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'SFC komponenta',
      items: [
        { text: 'Specifikace syntaxe SFC', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'CSS funkce pro SFC', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'Pokročilá API',
      items: [
        { text: 'API funkce pro vykreslení', link: '/api/render-function' },
        { text: 'API pro vykreslování na serveru', link: '/api/ssr' },
        { text: 'TypeScript utility typy', link: '/api/utility-types' },
        { text: 'Custom API pro vykreslování', link: '/api/custom-renderer' },
        { text: 'Compile-Time flags', link: '/api/compile-time-flags' }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Základní',
      items: [
        {
          text: 'Hello World',
          link: '/examples/#hello-world'
        },
        {
          text: 'Obsluha uživatelského vstupu',
          link: '/examples/#handling-input'
        },
        {
          text: 'Binding atributů',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Podmínky a cykly',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Binding dat z formulářů',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Jednoduchá komponenta',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Praktické',
      items: [
        {
          text: 'Markdown editor',
          link: '/examples/#markdown'
        },
        {
          text: 'Načítání dat',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Tabulka s tříděním a filtrováním',
          link: '/examples/#grid'
        },
        {
          text: 'Stromové zobrazení',
          link: '/examples/#tree'
        },
        {
          text: 'SVG graf',
          link: '/examples/#svg'
        },
        {
          text: 'Modální okno s přechody',
          link: '/examples/#modal'
        },
        {
          text: 'Seznam s přechody',
          link: '/examples/#list-transition'
        },
        {
          text: 'TodoMVC',
          link: '/examples/#todomvc'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: 'Počítadlo',
          link: '/examples/#counter'
        },
        {
          text: 'Převodník teploty',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Rezervace letenek',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Časovač',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Kreslení kruhu',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Buňky',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Průvodce stylováním',
      items: [
        {
          text: 'Přehled',
          link: '/style-guide/'
        },
        {
          text: 'A - Zásadní',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Silně doporučené',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Doporučené',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Používejte s rozvahou',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

// i18n config for @vuejs-translations
const i18n: ThemeConfig['i18n'] = {
  search: 'Hledat',
  toc: 'Obsah stránky',
  previous: 'Předchozí',
  next: 'Následující',
  pageNotFound: 'Stránka nenalezena',
  deadLink: {
    before: 'Narazili jste na nefunkční odkaz: ',
    after: ''
  },
  deadLinkReport: {
    before: '',
    link: 'Dejte nám prosím vědět',
    after: ', abychom to mohli napravit.'
  },
  footerLicense: {
    before: 'Vydáno pod ',
    after: ''
  }
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: 'en-US',
  title: 'Vue.js',
  description: 'Vue.js - Progresivní JavaScript Framework',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - Progresivní JavaScript Framework'
      }
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://sponsors.vuejs.org'
      }
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/uwu.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://vueschool.io/banner.js?affiliate=vuejs&type=top',
        async: 'true'
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,
    i18n,

    localeLinks: [
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },      
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/translation-gang/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },      
      {
        link: 'https://zh-hk.vuejs.org',
        text: '繁體中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-hk'
      },
      {
        link: '/translations/',
        text: 'Pomozte nám překládat!',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'cs-vuejs',
      appId: '6KIZ4U5VZN',
      apiKey: 'ad30ee2802d2fd959b35222006f8ba58',
      placeholder: "Najít ve Vue.js dokumentaci",
      translations: {
        button: {
          buttonText: 'Hledat'
        },
        modal: {
          searchBox: {
            resetButtonTitle: 'Vymazat',
            resetButtonAriaLabel: 'Vymazat hledaný výraz',
            cancelButtonText: 'Zrušit',
            cancelButtonAriaLabel: 'Zrušit hledání'
          },
          startScreen: {
            recentSearchesTitle: 'Předchozí výsledky vyhledávání',
            noRecentSearchesText: 'Žádné předchozí výsledky vyhledávání',
            saveRecentSearchButtonTitle: 'Uložit výsledek vyhledávání',
            removeRecentSearchButtonTitle: 'Odstranit záznam z uložených',
            favoriteSearchesTitle: 'Oblíbené výsledky vyhledávání',
            removeFavoriteSearchButtonTitle: 'Odstranit záznam z oblíbených'
          },
          errorScreen: {
            titleText: 'Chyba',
            helpText: 'Vyhledávání selhalo'
          },
          footer: {
            selectText: 'Vybrat',
            navigateText: 'Přejít na',
            closeText: 'Zavřít',
            searchByText: 'Vyhledávání pomocí'
          },
          noResultsScreen: {
            noResultsText: 'Žádné výsledky na dotaz',
            suggestedQueryText: 'Možná hledáte',
            reportMissingResultsText: 'Chybí text?\xa0\xa0',
            reportMissingResultsLinkText: 'Dejte nám vědět'
          }
        }
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs-translations/docs-cs' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs-translations/docs-cs',
      text: 'Navrhněte úpravu této stránky na GitHubu'
    },

    footer: {
      license: {
        text: 'MIT licence',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin)
      // .use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  }
})
