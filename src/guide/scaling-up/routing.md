# Směrování {#routing}

## Směrování na straně klienta vs. na straně serveru{#client-side-vs-server-side-routing}

Směrování (routing) na straně serveru znamená, že server odesílá odpověď na základě URL cesty, kterou chce uživatel navštívit. Když klikneme na odkaz v tradiční webové aplikaci s vykreslováním na straně serveru (SSR), prohlížeč obdrží od serveru HTML odpověď a znovu načte celou stránku s novým HTML obsahem.

V [Single-page aplikaci](https://developer.mozilla.org/cs/docs/Glossary/SPA) (SPA) však může klientský JavaScript zachytit navigaci, dynamicky načíst nová data a aktualizovat zobrazenou stránku bez plného reloadu. To obvykle vede k rychlejší odezvě a lepšímu uživatelskému zážitku, zejména v případech, které připomínají skutečné „aplikace“, kde se od uživatele očekává provádění mnoha interakcí po delší dobu.

V takových SPA je „směrování“ prováděno na straně klienta, v prohlížeči. Router na klientovi je zodpovědný za správu vykresleného obsahu aplikace pomocí API prohlížeče, jako je [History API](https://developer.mozilla.org/cs/docs/Web/API/History) nebo událost [`hashchange`](https://developer.mozilla.org/cs/docs/Web/API/Window/hashchange_event).

## Oficiální router {#official-router}

<!-- TODO aktualizovat odkazy -->
<div>
  <VueSchoolLink href="https://vueschool.io/courses/vue-router-4-for-everyone" title="Lekce o Vue Router zdarma">
    Podívejte se ukázkovou hodinu od Vue School zdarma
  </VueSchoolLink>
</div>

Vue je na vytváření SPA dobře připraveno. Pro většinu SPA se doporučuje použít oficiálně podporovanou [knihovnu Vue Router](https://github.com/vuejs/router). Další podrobnosti naleznete v&nbsp;[dokumentaci](https://router.vuejs.org/) Vue Routeru.

## Jednoduché směrování od základů {#simple-routing-from-scratch}

Pokud potřebujete pouze velmi jednoduché směrování a nechcete používat plnohodnotnou knihovnu, můžete to udělat pomocí [dynamických komponent](/guide/essentials/component-basics#dynamic-components) a&nbsp;aktualizovat aktuální stav komponenty posloucháním událostí [`hashchange`](https://developer.mozilla.org/cs/docs/Web/API/Window/hashchange_event) v prohlížeči nebo pomocí [History API](https://developer.mozilla.org/cs/docs/Web/API/History).

Zde je příklad základní struktury:

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/">Domů</a> |
  <a href="#/about">O nás</a> |
  <a href="#/non-existent-path">Chybný odkaz</a>
  <component :is="currentView" />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNptUk1vgkAQ/SsTegAThZp4MmhikzY9mKanXkoPWxjLRpgly6JN1P/eWb5Eywlm572ZN2/m5GyKwj9U6CydsIy1LAyUaKpiHZHMC6UNnEDjbgqxyovKYAIX2GmVg8sktwe9qhzbdz+wga15TW++VWX6fB3dAt6UeVEVJT2me2hhEcWKSgOamVjCCk4RAbiBu6xbT5tI2ML8VDeI6HLlxZXWSOZdmJTJPJB3lJSoo5+pWBipyE9FmU4soU2IJHk+MGUrS4OE2nMtIk4F/aA7BW8Cq3WjYlDbP4isQu4wVp0F1Q1uFH1IPDK+c9cb1NW8B03tyJ//uvhlJmP05hM4n60TX/bb2db0CoNmpbxMDgzmRSYMcgQQCkjZhlXkPASRs7YmhoFYw/k+WXvKiNrTcQgpmuFv7ZOZFSyQ4U9a7ZFgK2lvSTXFDqmIQbCUJTMHFkQOBAwKg16kM3W6O7K3eSs+nbeK+eee1V/XKK0dY4Q3vLhR6uJxMUK8/AFKaB6k)

</div>

<div class="options-api">

```vue
<script>
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>

<template>
  <a href="#/">Domů</a> |
  <a href="#/about">O nás</a> |
  <a href="#/non-existent-path">Chybný odkaz</a>
  <component :is="currentView" />
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNptUstO6zAQ/ZVR7iKtVJKLxCpKK3Gli1ggxIoNZmGSKbFoxpEzoUi0/87YeVBKNonHPmfOmcdndN00yXuHURblbeFMwxtFpm6sY7i1NcLW2RriJPWBB8bT8/WL7Xh6D9FPwL3lG9tROWHGiwGmqLDUMjhhYgtr+FQEEKdxFqRXfaR9YrkKAoqOnocfQaDEre523PNKzXqx7M8ADrlzNEYAReccEj9orjLYGyrtPtnZQrOxlFS6rXqgZJdPUC5s3YivMhuTDCkeDe6/dSalvognrkybnIgl7c4UuLhcwuHgS3v2/7EPvzRruRXJ7/SDU12W/98l451pGQndIvaWi0rTK8YrEPx64ymKFQOce5DOzlfs4cdlkA+NzdNpBSRgrJudZpQIINdQOdyuVfQnVdHGzydP9QYO549hXIII45qHkKUL/Ail8EUjBgX+z9k3JLgz9OZJgeInYElAkJlWmCcDUBGkAsrTyWS0isYV9bv803x1OTiWwzlrWtxZ2lDGDO90mWepV3+vZojHL3QQKQE=)

</div>
