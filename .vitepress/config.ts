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
      { text: 'Tutorial', link: '/tutorial/' },
      { text: 'Příklady', link: '/examples/' },
      { text: 'Jak začít', link: '/guide/quick-start' },
      // { text: 'Style Guide', link: '/style-guide/' },
      { text: 'Glossary', link: '/glossary/' },
      { text: 'Error Reference', link: '/error-reference/' },
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
            link: 'https://certification.vuejs.org/?ref=vuejs-nav'
          },
          { text: 'Nabídka práce', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'Trička e-shop', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: 'Oficiální knihovny',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' },
          { text: 'Tooling Guide', link: '/guide/scaling-up/tooling.html' }
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
        text: 'Komunita',
        link: '/about/community-guide'
      },
      { text: 'Kodex chování', link: '/about/coc' },
      {
        text: 'The Documentary (Video)',
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
        { text: 'Představení', link: '/guide/introduction' },
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
          text: 'Vytvoření aplikace',
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
          text: 'Lifecycle Hooks',
          link: '/guide/essentials/lifecycle'
        },
        { text: 'Watchers', link: '/guide/essentials/watchers' },
        { text: 'Template Refs', link: '/guide/essentials/template-refs' },
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
          text: 'Registace',
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
        { text: 'SFC komponenty', link: '/guide/scaling-up/sfc' },
        { text: 'Tooling', link: '/guide/scaling-up/tooling' },
        { text: 'Routing', link: '/guide/scaling-up/routing' },
        {
          text: 'State management',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Testování', link: '/guide/scaling-up/testing' },
        {
          text: 'Server-Side vykreslování (SSR)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Osvědčené postupy',
      items: [
        {
          text: 'Produkční release',
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
        { text: 'Přehled', link: '/guide/typescript/overview' },
        {
          text: 'TS s Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TS s Options API',
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
          text: 'Composition API FAQ',
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
          text: 'Vykreslovací funkce & JSX',
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
          text: 'Reactivita: Jádro',
          link: '/api/reactivity-core'
        },
        {
          text: 'Reactivita: Utility',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Reactivita: Pokročilé',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Lifecycle Hooks',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Dependency Injection',
          link: '/api/composition-api-dependency-injection'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Options: Stav', link: '/api/options-state' },
        { text: 'Options: Vykreslování', link: '/api/options-rendering' },
        {
          text: 'Options: Životní cyklus',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Options: Kompozice',
          link: '/api/options-composition'
        },
        { text: 'Options: Ostatní', link: '/api/options-misc' },
        {
          text: 'Instance komponent',
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
        { text: 'Specifikace syntaxe', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'CSS vlastnosti', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'Pokročilá APIs',
      items: [
        { text: 'Vykreslovací funkce', link: '/api/render-function' },
        { text: 'Server-Side vykreslování (SSR)', link: '/api/ssr' },
        { text: 'TypeScript utility typy', link: '/api/utility-types' },
        { text: 'Custom vykreslování', link: '/api/custom-renderer' },
        { text: 'Compile-Time Flags', link: '/api/compile-time-flags' }
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
        content: 'Vue.js - The Progressive JavaScript Framework'
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
        link: '/translations/',
        text: 'Pomozte nám překládat!',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: 'f49cbd92a74532cc55cfbffa5e5a7d01',
      searchParameters: {
        facetFilters: ['version:v3']
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/HBherRA' }
    ],

    editLink: {
      repo: 'vuejs/docs',
      text: 'Upravte tuto stránku na GitHubu'
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
