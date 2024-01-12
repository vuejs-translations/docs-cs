# Options API: Ostatní {#options-misc}

## name {#name}

Explicitně deklaruje zobrazované jméno komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Detaily**

  Jméno komponenty se používá v následujících situacích:

  - Rekurzivní odkaz na sebe sama v šabloně komponenty
  - Zobrazení v inspekčním stromu komponent v nástroji Vue DevTools
  - Zobrazení v traces ve varováních komponent

  Pokud používáte Single-File komponenty (SFC), komponenta již automaticky odvozuje své jméno z názvu souboru. Například soubor pojmenovaný `MyComponent.vue` bude mít odvozené zobrazované jméno "MyComponent".

  Další případ je, když je komponenta globálně registrována pomocí [`app.component`](/api/application#app-component), globální ID je automaticky nastaveno jako její jméno.

  Možnost `name` vám umožňuje přepsat odvozené jméno nebo jméno explicitně poskytnout, pokud nelze žádné odvodit (například když nejsou použity build nástroje nebo ve vložené komponentě, která není ve formátu SFC).

  Existuje jedna situace, kdy je `name` explicitně nutné: při porovnávání s cachovatelnými komponentami v [`<KeepAlive>`](/guide/built-ins/keep-alive) prostřednictvím jeho vlastností `include / exclude`.

  :::tip
  Od verze 3.2.34 si komponenta ve formátu SFC s použitím `<script setup>` automaticky odvodí vlastnost `name` na základě názvu souboru, což odstraňuje potřebu ručně deklarovat jméno i při použití s `<KeepAlive>`.
  :::

## inheritAttrs {#inheritattrs}

Ovládá, zda má být povoleno výchozí chování pro předávání atributů komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // výchozí: true
  }
  ```

- **Detaily**

  Ve výchozím nastavení se vazby na atributy z rodičovského scope, které nejsou rozpoznány jako vlastnosti (props), "propadnou" ("fallthrough"). To znamená, že pokud máme komponentu s jediným root elementem, tyto vazby budou aplikovány na root elemente potomka jako běžné HTML atributy. Při tvorbě komponenty, která obaluje cílový prvek nebo jinou komponentu, to nemusí být vždy žádoucí chování. Nastavením `inheritAttrs` na `false` lze toto výchozí chování zakázat. Atributy jsou dostupné pomocí vlastnosti instance `$attrs` a lze je explicitně vázat na non-root element pomocí `v-bind`.

- **Příklad**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  Při deklarování této možnosti v komponentě, která používá `<script setup>`, můžete použít makro [`defineOptions`](/api/sfc-script-setup#defineoptions):

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **Viz také:** [Fallthrough atributy](/guide/components/attrs)

## components {#components}

Objekt, který registruje komponenty, které budou dostupné na instanci komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Příklad**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // zkrácený zápis
      Foo,
      // registrovat pod jiným jménem
      RenamedBar: Bar
    }
  }
  ```

- **Viz také:** [Registrace komponent](/guide/components/registration)

## directives {#directives}

Objekt, který registruje direktivy, které budou dostupné na instanci komponenty.

- **Typ**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Příklad**

  ```js
  export default {
    directives: {
      // umožňuje použití v-focus v šabloně
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

- **See also** [Custom Directives](/guide/reusability/custom-directives)
