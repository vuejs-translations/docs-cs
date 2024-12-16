<script lang="ts">
const shuffleMembers = (
  members: Member[],
  pinTheFirstMember = false
): void => {
  let offset = pinTheFirstMember ? 1 : 0
  // `i` is between `1` and `length - offset`
  // `j` is between `0` and `length - offset - 1`
  // `offset + i - 1` is between `offset` and `length - 1`
  // `offset + j` is between `offset` and `length - 1`
  let i = members.length - offset
  while (i > 0) {
    const j = Math.floor(Math.random() * i);
    [
      members[offset + i - 1],
      members[offset + j]
    ] = [
      members[offset + j],
      members[offset + i - 1]
    ]
    i--
  }
}
</script>

<script setup lang="ts">
import { VTLink } from '@vue/theme'
import membersCoreData from './members-core.json'
import membersEmeritiData from './members-emeriti.json'
import membersPartnerData from './members-partner.json'
import TeamHero from './TeamHero.vue'
import TeamList from './TeamList.vue'
import type { Member } from './Member'
shuffleMembers(membersCoreData as Member[], true)
shuffleMembers(membersEmeritiData as Member[])
shuffleMembers(membersPartnerData as Member[])
</script>

<template>
  <div class="TeamPage">
    <TeamHero>
      <template #title>Poznejte náš Tým</template>
      <template #lead>
        Vývoj Vue a jeho ekosystému je veden mezinárodním týmem, 
        jehož část si vybrala být 
        <span class="nowrap">uvedena níže.</span>
      </template>

      <template #action>
        <VTLink
          href="https://github.com/vuejs/governance/blob/master/Team-Charter.md"
          >Zjistit více o týmech</VTLink
        >
      </template>
    </TeamHero>

    <TeamList :members="(membersCoreData as Member[])">
      <template #title>Core Team Members</template>
      <template #lead>
        Členové Core týmu jsou aktivně zapojeni v&nbsp;údržbě 
        jednoho či více core projektů. Výrazně přispěli do Vue ekosystému 
        s&nbsp;dlouhodobým zaměřením na úspěch projektu a&nbsp;jeho uživatelů.
      </template>
    </TeamList>

    <TeamList :members="(membersEmeritiData as Member[])">
      <template #title>Core Team Emeriti</template>
      <template #lead>
        Zde vzdáváme hold některým již neaktivním členům Core týmu,
        kteří výrazně přispěli v&nbsp;minulosti.
      </template>
    </TeamList>

    <TeamList :members="(membersPartnerData as Member[])">
      <template #title>Komunitní partneři</template>
      <template #lead>
        Někteří členové Vue komunity ji obohatili natolik,
        že si zaslouží speciální zmínku. Rozvinuli jsme více osobní vztah
        s&nbsp;těmito klíčovými partnery a&nbsp;často s&nbsp;nimi koordinujeme chystanou
        funkcionalitu a&nbsp;novinky.
      </template>
    </TeamList>
  </div>
</template>

<style scoped>
.TeamPage {
  padding-bottom: 16px;
}

@media (min-width: 768px) {
  .TeamPage {
    padding-bottom: 96px;
  }
}

.TeamList + .TeamList {
  padding-top: 64px;
}
</style>
