<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>Šablony</template>
      <template #lead>Prohlédněte si šablony, UI kity a pluginy. Můžete se podívat, jak&nbsp;naši partneři vytvářejí reálné Vue aplikace.</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      Chcete zde představit i vaše šablony? <a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">Kontaktujte nás!</a>
    </ThemeContact>
  </div>
</template>
