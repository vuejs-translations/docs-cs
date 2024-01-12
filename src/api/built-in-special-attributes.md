# Vestavěné speciální atributy {#built-in-special-attributes}

## key {#key}

Speciální atribut `key` se používá především jako nápověda pro virtuální DOM algoritmus Vue pro identifikaci elementů (VNodes) při porovnávání nového seznamu s původním seznamem.

- **Očekává:** `number | string | symbol`

- **Podrobnosti**

  Bez `key` atributů Vue používá algoritmus, který minimalizuje pohyb elementů a snaží se co nejvíce upravit/znovupoužít elementy stejného typu na stejném místě. S použitím `key` se elementy přeuspořádávají na základě změny pořadí klíčů a elementy s klíči, které již nejsou přítomny, budou vždy odstraněny / zničeny.

  Potomci stejného společného rodiče musí mít **unikátní klíče**. Duplicitní atributy `key` způsobí chyby při vykreslování.

  Nejběžnější použití je v kombinaci s `v-for`:

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  Mohou být také použity k vynucenému nahrazení elementu/komponenty místo jejího znovupoužití. To může být užitečné, když chcete:

  - Správně spustit lifecycle hooky komponenty
  - Spustit přechody (transitions)

  Například:

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  Když se změní `text`, `<span>` bude vždy nahrazen místo pouhé úpravy, takže se přechod spustí.

- **Viz také:** [Průvodce - Vykreslování seznamu - Udržování stavu pomocí `key`](/guide/essentials/list#udrzovani-stavu-s-key)

## ref {#ref}

Určuje [Template ref](/guide/essentials/template-refs).

- **Očekává:** `string | Function`

- **Podrobnosti**

  `ref` se používá k zaregistrování reference na element nebo komponentu potomka.

  V Options API bude reference zaregistrována v objektu `this.$refs` komponenty:

  ```vue-html
  <!-- uloženo jako this.$refs.p -->
  <p ref="p">ahoj</p>
  ```

  V Composition API bude reference uložena jako `ref` se shodným názvem:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const p = ref()
  </script>

  <template>
    <p ref="p">ahoj</p>
  </template>
  ```

Pokud je použito na obyčejném DOM elementu, reference bude odkazovat na tento element; pokud je použito na komponentě potomka, reference bude odkazovat na příslušnou instanci komponenty.

Alternativně může `ref` přijmout hodnotu funkce, která poskytuje plnou kontrolu, kam referenci uložit:

```vue-html
<ChildComponent :ref="(el) => child = el" />
```

Důležitá poznámka ohledně času registrace ref: protože samotné refs jsou vytvořeny jako výsledek vykreslovací funkce, musíte počkat, až je komponenta připojena (mounted), než k nim lze přistoupit.

`this.$refs` také není reaktivní, proto byste se neměli pokoušet tento objekt použít v šablonách pro data-binding.

- **Viz také:**
  - [Průvodce - Template Refs](/guide/essentials/template-refs)
  - [Průvodce - Typování Template Refs](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Průvodce - Typování Template Refs Komponenty](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## is {#is}

Používá se pro binding [dynamických komponent](/guide/essentials/component-basics#dynamic-components).

- **Očekává:** `string | Komponenta`

- **Použití na nativních elementech** <sup class="vt-badge">3.1+</sup>

  Když je atribut `is` použit na nativním HTML elementu, bude interpretován jako [custom vestavěný element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), což je nativní funkce webové platformy.

  Existuje však případ použití, kdy můžete potřebovat, aby Vue nahradilo nativní element  Vue komponentou, jak je vysvětleno v [upozornění na omezení při anlýze in-DOM šablon](/guide/essentials/component-basics#in-dom-template-parsing-caveats). Můžete atributu `is` přidat předponu `vue:`, aby Vue vykreslilo element jako Vue komponentu:

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **Viz také:**

  - [Vestavěný Speciální Element - `<component>`](/api/built-in-special-elements#component)
  - [Dynamické Komponenty](/guide/essentials/component-basics#dynamic-components)
