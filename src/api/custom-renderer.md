# Custom API pro vykreslování {#custom-renderer-api}

## createRenderer() {#createrenderer}

Vytvoří vlastní vykreslovač (custom renderer). Poskytnutím API pro vytváření a&nbsp;manipulaci s elementy specifických pro platformu můžete využít jádra běhového prostředí Vue i pro cílové prostředí mimo DOM.

- **Typ**

  ```ts
  function createRenderer<HostNode, HostElement>(
    options: RendererOptions<HostNode, HostElement>
  ): Renderer<HostElement>

  interface Renderer<HostElement> {
    render: RootRenderFunction<HostElement>
    createApp: CreateAppFunction<HostElement>
  }

  interface RendererOptions<HostNode, HostElement> {
    patchProp(
      el: HostElement,
      key: string,
      prevValue: any,
      nextValue: any,
      namespace?: ElementNamespace,
      parentComponent?: ComponentInternalInstance | null,
    ): void
    insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
    remove(el: HostNode): void
    createElement(
      type: string,
      namespace?: ElementNamespace,
      isCustomizedBuiltIn?: string,
      vnodeProps?: (VNodeProps & { [key: string]: any }) | null,
    ): HostElement
    createText(text: string): HostNode
    createComment(text: string): HostNode
    setText(node: HostNode, text: string): void
    setElementText(node: HostElement, text: string): void
    parentNode(node: HostNode): HostElement | null
    nextSibling(node: HostNode): HostNode | null
    querySelector?(selector: string): HostElement | null
    setScopeId?(el: HostElement, id: string): void
    cloneNode?(node: HostNode): HostNode
    insertStaticContent?(
      content: string,
      parent: HostElement,
      anchor: HostNode | null,
      namespace: ElementNamespace,
      start?: HostNode | null,
      end?: HostNode | null,
    ): [HostNode, HostNode]
  }
  ```

- **Příklad**

  ```js
  import { createRenderer } from '@vue/runtime-core'
    
  const { render, createApp } = createRenderer({
    patchProp,
    insert,
    remove,
    createElement
    // ...
  })

  // `render` je nízkoúrovňové API
  // `createApp` vrací instanci aplikace
  export { render, createApp }

  // re-exportuje základní API Vue
  export * from '@vue/runtime-core'
  ```

  Vlastní `@vue/runtime-dom` od Vue je také [implementován pomocí stejného API](https://github.com/vuejs/core/blob/main/packages/runtime-dom/src/index.ts). Pro jednodušší implementaci se podívejte na [`@vue/runtime-test`](https://github.com/vuejs/core/blob/main/packages/runtime-test/src/index.ts), což je privátní balíček pro vlastní unit testování Vue.
