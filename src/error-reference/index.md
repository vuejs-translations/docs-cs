<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# Reference chybových kódů v produkci {#error-reference}

## Runtime chyby {#runtime-errors}

V produkčním prostředí bude třetí parametr (`info`) zkrácený kód místo kompletního řetězce s informací: 

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (Composition API)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (Options API)

Následující tabulka mapuje kódy na jejich původní plné informační texty. Oproti [orignálu](https://vuejs.org/error-reference/#runtime-errors) přidáváme navíc sloupec s orientačním českým překladem.

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## Chyby překladače {#compiler-errors}

Následující tabulka poskytuje mapování kódů chyb překladače v produkci na jejich původní texty. Oproti [orignálu](https://vuejs.org/error-reference/#compiler-errors) přidáváme navíc sloupec s orientačním českým překladem.

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
