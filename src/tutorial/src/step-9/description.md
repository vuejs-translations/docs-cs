# Životní cyklus a Template Refs {#lifecycle-and-template-refs}

Zatím za nás Vue vyřizovalo všechny aktualizace DOM díky reaktivitě a&nbsp;deklarativnímu vykreslování. Nevyhnutelně však nastanou případy, kdy potřebujeme s DOM pracovat manuálně.

Můžeme si vyžádat **template ref** - tj. referenci na element v šabloně - pomocí <a target="_blank" href="/api/built-in-special-attributes.html#ref">speciálního atributu `ref`</a>:

```vue-html
<p ref="pElementRef">Ahoj</p>
```

<div class="composition-api">

Abychom k _template ref_ získali přístup, musíme deklarovat<span class="html"> a vystavit</span> ref s&nbsp;odpovídajícím názvem:

<div class="sfc">

```js
const pElementRef = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const pElementRef = ref(null)

  return {
    pElementRef
  }
}
```

</div>

Pamatujte, že ref je inicializován hodnotou `null`. Je to proto, že element při spuštění <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> ještě neexistuje. Template ref je přístupný až poté, co je hotová komponenta připojena (**mounted**).

Pro spuštění kódu až po připojení komponenty, můžeme použít funkci `onMounted()`:

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  //  komponenta je nyní připojena
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // komponenta je nyní připojena
    })
  }
})
```

</div>
</div>

<div class="options-api">

Element bude vystaven v `this.$refs` jako `this.$refs.pElementRef`. Můžete k němu nicméně přistoupit až poté, co je komponenta připojena (**mounted**).

Pro spuštění kódu až po připojení komponenty, můžeme použít možnost `mounted`:

<div class="sfc">

```js
export default {
  mounted() {
    // komponenta je nyní připojena
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // komponenta je nyní připojena
  }
})
```

</div>
</div>

Tomuto se říká **lifecycle hook** - umožňuje zaregistrovat callback funkce, které budou zavolány v určitých okamžicích životního cyklu komponenty. Existují i další jako jsou <span class="options-api">`created` a `updated`</span><span class="composition-api">`onUpdated` a `onUnmounted`</span>. Podívejte se&nbsp;na <a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">Diagram životního cyklu</a> pro další podrobnosti.

Nyní zkuste přidat <span class="options-api"> `mounted`</span><span class="composition-api"> `onMounted`</span> hook, přistoupit k `<p>` pomocí <span class="options-api">`this.$refs.pElementRef`</span><span class="composition-api">`pElementRef.value`</span> a provést nad ním nějakou operaci přímo v&nbsp;rámci DOM (např. změnit jeho `textContent`).
