# Lifecycle hooks {#lifecycle-hooks}

Každá instance Vue komponenty prochází při svém vytvoření řadou inicializačních kroků – například potřebuje nastavit pozorování dat, zkompilovat šablonu, připojit instanci k&nbsp;DOM a aktualizovat DOM, když se změní data. Zároveň také spouští funkce zvané **lifecycle hooks**, které uživatelům umožňují přidávat v určených fázích vlastní kód.

## Registrace lifecycle hooks {#registering-lifecycle-hooks}

Například <span class="composition-api">`onMounted`</span><span class="options-api">`mounted`</span> hook lze použít ke spuštění kódu poté, co komponenta dokončí počáteční vykreslení a vytvoření DOM elementů:

<div class="composition-api">

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`komponenta je nyní připojena`)
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  mounted() {
    console.log(`komponenta je nyní připojena`)
  }
}
```

</div>

Existují další hooks, které budu volány v různých fázích životního cyklu instance komponenty. Nejčastěji používané jsou <span class="composition-api">[`onMounted`](/api/composition-api-lifecycle#onmounted), [`onUpdated`](/api/composition-api-lifecycle#onupdated) a [`onUnmounted`](/api/composition-api-lifecycle#onunmounted).</span><span class="options-api">[`mounted`](/api/options-lifecycle#mounted), [`updated`](/api/options-lifecycle#updated) a [`unmounted`](/api/options-lifecycle#unmounted).</span>

<div class="options-api">

Všechny lifecycle hooks jsou volány s jejich kontextem `this` odkazujícím na momentálně aktivní instanci, která je vyvolala. Vemte na vědomí, že to znamená, že byste se při deklaraci lifecycle hooks měli vyvarovat arrow funkcí, protože pokud to uděláte, nebude moci pomocí `this` přístoupit k instanci komponenty.

</div>

<div class="composition-api">

Když se volá `onMounted`, Vue automaticky asociuje registrované callback funkce s právě aktivní instancí komponenty. Kvůli tomu je během setup fáze třeba registrovat lifecycle hooks **synchronně**. Například nedělejte toto:

```js
setTimeout(() => {
  onMounted(() => {
    // toto nebude fungovat.
  })
}, 100)
```

Pamatujte, že to neznamená, že volání musí být umístěno lexikálně uvnitř `setup()` nebo `<script setup>`. Hook `onMounted()` lze volat i v externí funkci za předpokladu, že je zásobník volání synchronní a pochází z `setup()`.

</div>

## Diagram životního cyklu {#lifecycle-diagram}

Níže je schéma životního cyklu instance komponenty. Nemusíte ještě plně rozumět všemu, co se v něm děje, ale jak se budete více učit a tvořit, bude to užitečná reference.

![Diagram životního cyklu komponenty](./images/lifecycle.png)

<!-- https://www.figma.com/file/Xw3UeNMOralY6NV7gSjWdS/Vue-Lifecycle -->

Podívejte se na <span class="composition-api">[API referenci pro Lifecycle Hooks](/api/composition-api-lifecycle)</span><span class="options-api">[API referenci pro Lifecycle Hooks](/api/options-lifecycle)</span> ohledně detailů všech lifecycle hooks a jejich případů užití.
