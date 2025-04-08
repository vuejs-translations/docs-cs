<script setup lang="ts">
import { translatedRuntimeErrors, translatedCompilerErrors } from './errors.translations'

defineProps<{
  kind: string
  errors: Record<any, string>
  highlight?: any
}>()

function getTranslation(kind: string, code: string) {
  if (kind === 'runtime') {
    return translatedRuntimeErrors.find(e => e.code === code)?.translation || ''
  } else {
    return  translatedCompilerErrors.find(e => e.code === code)?.translation || ''
  }
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Kód</th>
        <th>Text</th>
        <th><em>Překlad</em></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(msg, code) of errors"
        :class="{ highlight: highlight === `${kind}-${code}` }"
      >
        <td :id="`${kind}-${code}`" v-text="code" />
        <td v-text="msg" />
        <td v-text="getTranslation(kind, code)" style="font-style: italic;" />
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.highlight {
  color: var(--vt-c-yellow-darker);
  font-weight: bold;
}
</style>
