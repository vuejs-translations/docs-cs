# Composition API: Helpers {#composition-api-helpers}

## useAttrs() {#useattrs}

## useSlots() {#useslots}

## useModel() <sup class="vt-badge" data-text="3.4+" /> {#usemodel}

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

`useId()` je API, které je možné použití pro generování unikátních ID v aktuální aplikaci.

- **Dostupné pouze v Composition API.**

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