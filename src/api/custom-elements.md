# Custom elements API {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

Tato metoda přijímá stejný parametr jako [`defineComponent`](#definecomponent), ale místo toho vrací konstruktor nativního [custom elementu](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

- **Typ**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > Typ je pro lepší čitelnost zjednodušen.

- **Podrobnosti**

  Kromě běžných vlastnstí komponenty podporuje `defineCustomElement()` také speciální vlastností `styles`, která by měla být polem vložených CSS řetězců, které poskytují CSS, které by mělo být vloženo do stínového root elementu.

  Návratovou hodnotou je konstruktor custom elementu, který lze zaregistrovat pomocí [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Příklad**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* vlastnosti komponenty */
  })

  // Zaregistruje custom element.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Viz také:**

  - [Průvodce - Vytváření custom elementů s Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Také si všimněte, že `defineCustomElement()` vyžaduje [speciální konfiguraci](/guide/extras/web-components#sfc-as-custom-element), pokud se používá se Single-File komponentami (SFC).

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

Pomocná funkce Composition API, která vrací hostitelský element aktuálního Vue custom elementu.

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

Pomocná funkce Composition API, která vrací shadow root aktuálního Vue custom elementu.

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

Vlastnost Options API, která vystavuje hostitelský element aktuálního Vue custom elementu.