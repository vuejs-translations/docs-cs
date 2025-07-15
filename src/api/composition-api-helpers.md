# Composition API: Helpers {#composition-api-helpers}

## useAttrs() {#useattrs}

Vrací objekt `attrs` ze [Setup Context](/api/composition-api-setup#setup-context), který obsahuje [fallthrough atributy](/guide/components/attrs#fallthrough-attributes) aktuální komponenty. Funkce je určena pro použití uvnitř `<script setup>`, kde není setup context objekt dostupný.

- **Typ**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

Vrací objekt `slots` ze [Setup Context](/api/composition-api-setup#setup-context), který obsahuje sloty (slots) předané z komponenty rodiče ve formě spustitelných funkcí vracejících Virtuální DOM uzly. Funkce je určena pro použití uvnitř `<script setup>`, kde není setup context objekt dostupný.

Při použití TypeScriptu je preferovaná varianta využít [`defineSlots()`](/api/sfc-script-setup#defineslots).

- **Typ**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() <sup class="vt-badge" data-text="3.4+" /> {#usemodel}

Toto je pomocná funkce, která uvnitř pohání [`defineModel()`](/api/sfc-script-setup#definemodel). Při použití `<script setup>` je preferovaná varianta využít `defineModel()`.

Funkce `useModel()` může být použita v non-SFC komponentách, např. uvnitř obyčejné `setup()` funkce. Jako první parametr očekává `props` objekt a jako druhý název modelu. Volitelný třetí parametr může být použit pro deklaraci vlastního getteru a setteru pro výsledný ref objekt modelu. Pamatujte, že na rozdíl od `defineModel()` jste za deklaraci vlastností (props) a událostí (emits) zodpovědní vy.

- **Typ**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  ): ModelRef

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }

  type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<G, S> & [
    ModelRef<T, M, G, S>,
    Record<M, true | undefined>
  ]
  ```

- **Příklad**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **Podrobnosti**

Funkce `useModel()` může být použita v non-SFC komponentách, například když používáte obyčejné `setup()`. Jako první argument očekává objekt `props` a jako druhý název modelu. Volitelný třetí argument může být použit pro deklaraci vlastního getteru a&nbsp;setteru pro výsledný ref modelu. Pamatujte, že na rozdíl od `defineModel()` jste za deklaraci vlastností (props) a událostí (emits) zodpovědní vy sami.

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

Vrací `shallowRef`, jehož hodnota bude synchronizovaná s elementem či komponentou uvnitř šablony s odpovídajícím `ref` atributem.

- **Typ**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **Příklad**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **Viz také:**
  - [Průvodce – Template Refs](/guide/essentials/template-refs)
  - [Průvodce – Typování template refs](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Průvodce – Typování template refs komponenty](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

`useId()` je API, které je možné použití pro generování unikátních ID v aktuální aplikaci.

- **Typ**

  ```ts
  function useId(): string
  ```

- **Příklad**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Jméno:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **Podrobnosti**
  
  ID generované pomocí `useId()` je v rámci aplikace unikátní. Může být použito pro generování ID formulářových prvků a atributů pro přístupnost (accessibility). Více volání na stejné komponentě vygeneruje různá ID, různé instance stejné komponenty volající `useId()` budou mít také různá ID.

  Pro ID generovaná pomocí `useId()` je také garantována stabilita mezi vykreslením na serveru a na klientovi, takže mohou být použita v SSR aplikacích, aniž by docházelo k&nbsp;nesouladům hydratace (hydration mismatches).

  Pokud máte na jedné stránce více instancí Vue, můžete se vyhnout konfliktům mezi ID přidáním prefixu každé aplikaci pomocí [`app.config.idPrefix`](/api/application#app-config-idprefix).

  :::warning Pozor
  `useId()` by nemělo být voláno uvnitř `computed()`, protože to může způsobit konflikty mezi instancemi. ID místo toho deklarujte mimo `computed()` a v rámci callbacku na něj pouze odkazujte.
  :::