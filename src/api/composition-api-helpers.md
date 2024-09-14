# Composition API: Helpers {#composition-api-helpers}

## useAttrs() {#useattrs}

Vrací objekt `attrs` ze [Setup Context](/api/composition-api-setup#setup-context), který obsahuje [fallthrough atributy](/guide/components/attrs#fallthrough-attributes) aktuální komponenty. Funkce je určena pro použití uvnitř `<script setup>`, kde není setup context objekt dostupný.

## useSlots() {#useslots}

Vrací objekt `slots` ze [Setup Context](/api/composition-api-setup#setup-context), který obsahuje sloty (slots) předané z komponenty rodiče ve formě spustitelných funkcí vracejících Virtuální DOM uzly. Funkce je určena pro použití uvnitř `<script setup>`, kde není setup context objekt dostupný.

Při použití TypeScriptu je preferovaná varianta využít [`defineSlots()`](/api/sfc-script-setup#defineslots).

## useModel() <sup class="vt-badge" data-text="3.4+" /> {#usemodel}

Toto je pomocná funkce, která uvnitř pohání [`defineModel()`](/api/sfc-script-setup#definemodel). Při použití `<script setup>` je preferovaná varianta využít `defineModel()`.

Funkce `useModel()` může být použita v non-SFC komponentách, např. uvnitř obyčejné `setup()` funkce. Jako první argument očekává `props` objekt a jako druhý název modelu. Volitelný třetí argument může být použit pro deklaraci vlastního getteru a setteru pro výsledný ref objekt modelu. Pamatujte, že na rozdíl od `defineModel()` jste za deklaraci vlastností (props) a událostí (emits) zodpovědní vy.

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

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

`useId()` je API, které je možné použití pro generování unikátních ID v aktuální aplikaci.

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
  
  ID generované pomocí `useId()` je v rámci aplikace unikátní. Může být použito pro generování ID formuálřových prvků a atributů pro přístupnost (accessibility). Více volání na stejné komponentě vygeneruje různá ID, různé instance stejné komponenty volající `useId()` budou mít také různá ID.

  Pro ID generovaná pomocí `useId()` je také garantována stabilita mezi vykreslením na serveru a na klientovi, takže mohou být použita v SSR aplikacích, aniž by docházelo k&nbsp;chybám hydratace (hydration mismatches).

  Pokud máte na jedné stránce více instancí Vue, můžete se vyhnout konfliktům mezi ID přidáním prefixu každé aplikaci pomocí [`app.config.idPrefix`](/api/application#app-config-idprefix).