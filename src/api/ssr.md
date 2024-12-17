# API pro vykreslování na serveru {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **Exportováno z `vue/server-renderer`**

- **Typ**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **Příklad**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'ahoj' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### SSR Kontext {#ssr-context}

  Volitelně můžete předat objekt kontextu, který lze použít k zaznamenání dalších dat během vykreslování, například [přístupu k obsahu Teleports](/guide/scaling-up/ssr#teleports):

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'obsah teleportu' }
  ```

  Většina dalších SSR API na této stránce volitelný objekt kontextu přijímá také. Objekt kontextu je  v kódu komponenty přístupný přes pomocnou composable [useSSRContext](#usessrcontext).

- **Viz také:** [Průvodce – Vykreslování na serveru (SSR)](/guide/scaling-up/ssr)

## renderToNodeStream() {#rendertonodestream}

Vykreslí vstup jako [Stream čitelný v Node.js](https://nodejs.org/api/stream.html#stream_class_stream_readable).

- **Exportováno z `vue/server-renderer`**

- **Typ**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **Příklad**

  ```js
  // uvnitř Node.js http handleru
  renderToNodeStream(app).pipe(res)
  ```

  :::tip Poznámka
  Tato metoda není podporována v ESM buildu balíčku `vue/server-renderer`, který je od prostředí Node.js oddělený. Použijte místo toho [`pipeToNodeWritable`](#pipetonodewritable).
  :::

## pipeToNodeWritable() {#pipetonodewritable}

Vykreslí vstup a připojí ho k existující instanci [Streamu zapisovatelného v Node.js](https://nodejs.org/api/stream.html#stream_writable_streams).

- **Exportováno z `vue/server-renderer`**

- **Typ**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **Příklad**

  ```js
  // uvnitř Node.js http handleru
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

Vykreslí vstup jako [Web ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

- **Exportováno z `vue/server-renderer`**

- **Typ**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **Příklad**

  ```js
  // v prostředí s podporou ReadableStream
  return new Response(renderToWebStream(app))
  ```

  :::tip Poznámka
  V prostředích, která nevystavují konstruktor `ReadableStream` ve globálním rozsahu, by měla být místo toho použita funkce [`pipeToWebWritable()`](#pipetowebwritable).
  :::

## pipeToWebWritable() {#pipetowebwritable}

Vykreslí vstup a přesune ho do existující instance [Web WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream).

- **Exportováno z `vue/server-renderer`**

- **Typ**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **Příklad**

  Toto se obvykle používá ve spojení s [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream):

  ```js
  // TransformStream je dostupný v prostředích jako jsou CloudFlare workers.
  // v Node.js je potřeba TransformStream explicitně importovat ze 'stream/web'
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

Vykreslí vstup v režimu streamování pomocí jednoduše čitelného rozhraní.

- **Exportováno z `vue/server-renderer`**

- **Typ**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable
  ```

```typescript
  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **Příklad**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // hotovo
          console(`render complete: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // vyskytla se chyba
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

Runtime API používané k získání kontextového objektu předaného do `renderToString()` nebo jiných API pro vykreslování na serveru.

- **Typ**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **Příklad**

  Získaný kontext může být použit k připojení informací, které jsou potřebné pro vykreslení finálního HTML (např. metadata hlavičky).

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // ujistěte se, že funkci voláte pouze během SSR
  // https://vitejs.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...připojit do kontextu vlastnosti
  }
  </script>
  ```

## data-allow-mismatch <sup class="vt-badge" data-text="3.5+" /> {#data-allow-mismatch}

Speciální atribut, který lze použít k potlačení varování o [nesouladu hydratace](/guide/scaling-up/ssr#hydration-mismatch).

- **Příklad**

  ```html
  <div data-allow-mismatch="text">{{ data.toLocaleString() }}</div>
  ```
  
  Hodnota může omezit povolený nesoulad na určitý typ. Povolené hodnoty jsou:

  - `text`
  - `children` (povoluje nesoulad pouze na přímých potomcích)
  - `class`
  - `style`
  - `attribute`

  Pokud není zadána žádná hodnota, jsou povoleny všechny typy nesouladů.