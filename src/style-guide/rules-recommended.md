# Pravidla priority C: Doporučené {#priority-c-rules-recommended}

Tam, kde existuje více stejně dobrých možností, lze pro zajištění konzistence vybrat libovolnou z nich. V těchto pravidlech popisujeme každou přijatelnou možnost a navrhujeme výchozí variantu. To znamená, že se můžete ve své vlastní kódové bázi volně rozhodnout, pokud budete konzistentní a máte pro to dobrý důvod. Ale mějte prosím dobrý důvod! Přizpůsobením se standardu komunity budete:

1. trénovat svůj mozek, aby snadněji analyzoval většinu kódu v rámci Vue komunity, se kterým se setkáte
2. umět zkopírovat a vložit většinu příkladů kódu v rámci Vue komunity bez dalších úprav
3. častěji nacházet nové zaměstnance, kteří jsou již zvyklí na váš styl kódování, alespoň pokud jde o Vue

## Pořadí možností nastavení komponent/instancí {#component-instance-options-order}

**Možnosti nastavení komponent/instancí by měly být řazeny konzistentně.**

Toto je výchozí pořadí, které doporučujeme pro možnosti nastavení komponent. Jsou rozděleny do kategorií, takže budete vědět, kam přidat nová nastavení z pluginů.

1. **Globální povědomí** (vyžaduje znalost mimo komponentu)

   - `name`

2. **Nastavení kompilátoru šablony** (mění způsob kompilace šablon)

   - `compilerOptions`

3. **Závislosti šablon** (prvky (assets) použité v šabloně)

   - `components`
   - `directives`

4. **Kompozice** (slučují do možností nastavení další vlastnosti)

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **Interface** (rozhranní komponenty)

   - `inheritAttrs`
   - `props`
   - `emits`

6. **Composition API** (vstupní bod pro použití Composition API)

   - `setup`

7. **Lokální stav (state)** (lokální reaktivní proměnné)

   - `data`
   - `computed`

8. **Události (events)** (callbacky vyvolávané reaktivními prvky)

   - `watch`
   - Události životního cyklu (v pořadí, v jakém jsou volány)
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`

9. **Nereaktivní vlastnosti** (vlastnosti instance nezávislé na systému reaktivity)

   - `methods`

10. **Vykreslování (rendering)** (deklarativní popis výstupu komponenty)
    - `template`/`render`

## Pořadí atributů elementů {#element-attribute-order}

**Atributy elementů (včetně komponent) by měly být řazeny konzistentně.**

Toto je výchozí pořadí, které doporučujeme pro atributy komponent. Jsou rozděleny do kategorií, takže budete vědět, kam přidat vlastní atributy a příkazy.

1. **Definice** (poskytuje možnosti komponent)

   - `is`

2. **Vykreslování seznamu** (vytváří více variant stejného prvku)

   - `v-for`

3. **Podmínky** (zda má být element vykreslen/ukázán)

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **Modifikátory vykreslení** (mění způsob vykreslování elementu)

   - `v-pre`
   - `v-once`

5. **Globální povědomí** (vyžaduje znalost mimo komponentu)

   - `id`

6. **Unikátní atributy** (attributy, které vyžadují unikátní hodnoty)

   - `ref`
   - `key`

7. **Two-Way Binding** (kombinace přiřazení hodnoty (binding) a událostí (events))

   - `v-model`

8. **Jiné atributy** (všechny nespecifikované vázané i nevázané atributy)

9. **Události** (event-listenery komponenty)

   - `v-on`

10. **Obsah** (přepisují obsah elementu)
    - `v-html`
    - `v-text`

## Prázdné řádky v možnostech nastavení komponenty/instance {#empty-lines-in-component-instance-options}

**Možná budete chtít přidat jeden prázdný řádek mezi víceřádkové vlastnosti, zejména pokud se možnosti již nevejdou na vaši obrazovku bez posouvání.**

Když komponenty začnou vypadat stísněně nebo obtížně čitelné, přidání mezer mezi víceřádkové vlastnosti může usnadnit jejich opětovné procházení. V některých editorech jako Vim, mohou tyto varianty formátování také usnadnit navigaci pomocí klávesnice.

<div class="style-example style-example-good">
<h3>Dobře</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

```js
// je v pořádku nemít žádné mezery, dokud je komponenta
// stále dobře čitelná a lze v ní snadno navigovat
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

## Pořadí hlavních sekcí Single-file komponenty (SFC) {#single-file-component-top-level-element-order}

**[Single-File komponenty (SFC)](/guide/scaling-up/sfc) by měly vždy řadit tagy sekcí `<script>`, `<template>` a `<style>` konzistentně, přičemž `<style>` by měl být poslední, protože je vždy nezbytný jeden ze dvou zbylých.**

<div class="style-example style-example-bad">
<h3>Špatně</h3>

```vue-html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>Dobře</h3>

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>
