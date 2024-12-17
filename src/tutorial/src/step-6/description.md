# Podmíněné vykreslování {#conditional-rendering}

Direktivu `v-if` můžeme použít pro podmíněné vykreslení elementu:

```vue-html
<h1 v-if="awesome">Vue je super!</h1>
```

Tento nadpis `<h1>` bude vykreslen pouze tehdy, pokud má `awesome` [pravdivou (truthy)](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) hodnotu. Pokud se hodnota `awesome` změní na [nepravdivou (falsy)](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), bude nadpis odstraněn z DOM.

Můžeme použít i `v-else` a `v-else-if` k odlišení dalších větví podmínky:

```vue-html
<h1 v-if="awesome">Vue je super!</h1>
<h1 v-else>Ale ne 😢</h1>
```

V současné době demo příklad zobrazuje obě `<h1>` současně a&nbsp;tlačítko nedělá nic. Zkuste k nim přidat direktivy `v-if` a `v-else` a&nbsp;implementujte funkci `toggle()`, abychom mezi nimi mohli pomocí tlačítka přepínat.

Více detailů o `v-if`: <a target="_blank" href="/guide/essentials/conditional.html">Průvodce – Podmíněné vykreslování</a>
