<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive {#keepalive}

`<KeepAlive>` je vestavěná komponenta, která nám umožňuje podmíněně ukládat instance komponent do cache při dynamickém přepínání mezi více komponentami.

## Základní použití {#basic-usage}

V kapitole Základy komponent jsme představili syntaxi pro [Dynamické komponenty](/guide/essentials/component-basics#dynamic-components) s použitím speciálního elementu `<component>`:

```vue-html
<component :is="activeComponent" />
```

Ve výchozím nastavení bude instance aktivní komponenty odpojena (unmounted), když se z ní přesunete jinam. To způsobí ztrátu jakýchkoli změn stavu, které si drží. Když se tato komponenta znovu zobrazí, vytvoří se nová instance pouze ve výchozím stavu.

V příkladu níže máme dvě stavové komponenty – A obsahuje počítadlo, zatímco B obsahuje zprávu synchronizovanou s uživatelským vstupem přes `v-model`. Zkuste aktualizovat stav jedné z nich, přepněte na druhou a poté se do ni přepněte zpátky:

<SwitchComponent />

Uvidíte, že po přepnutí zpět byl předchozí změněný stav resetován.

Vytváření nové instance komponenty po přepnutí je normálně užitečné chování, ale v tomto případě bychom opravdu rádi, aby byly tyto dvě instance komponent zachovány, i když jsou neaktivní. Abychom tento problém vyřešili, můžeme naši dynamickou komponentu zabalit  do vestavěné komponenty `<KeepAlive>`:

```vue-html
<!-- neaktivní komponenty budou umístěny do cache -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Nyní bude mezi přepínámím komponent stav zachován:

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip
Při použití v [in-DOM šablonách](/guide/essentials/component-basics#in-dom-template-parsing-caveats), měla by být používána jako `<keep-alive>`.
:::

## Include / Exclude {#include-exclude}

Ve výchozím nastavení `<KeepAlive>` bude do cache umisťovat každou komponentu uvnitř. Můžeme toto chování upravit pomocí vlastností (props) `include` a `exclude`. Obě vlastnosti mohou být řetězce oddělený čárkami, regulární výraz nebo pole obsahující libovolné hodnoty obou typů:

```vue-html
<!-- řetězce oddělené čárkami -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- regex (použijete `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- pole (použijete `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

Shoda je porovnávána s atributem [`name`] (/api/options-misc#name) komponenty, takže ty, které je třeba podmíněně uložit do cache pomocí `KeepAlive`, musí explicitně deklarovat atribut `name`.

:::tip
Od verze 3.2.34 odvodí Single-File komponenta (SFC) používající `<script setup>` svou vlastnost `name` automaticky na základě názvu souboru, čímž nutnost deklarovat jméno ručně odpadá.
:::

## Maximální počet cached instancí {#max-cached-instances}

Můžeme omezit maximální počet instancí komponent, které lze uložit do cache pomocí vlastnosti `max`. Když je zadáno `max`, `<KeepAlive>` se chová jako [LRU cache](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>): pokud by měl počet instancí uložených v cache překročit zadaný maximální počet, bude nejdéle nepoužívaná instance v cache zničena, aby se pro novou uvolnilo místo.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Životní cyklus cached instance {#lifecycle-of-cached-instance}

Když je instance komponenty odstraněna z DOM, ale je součástí stromu komponent uloženého v cache prostřednictvím `<KeepAlive>`, přejde místo **unmounted** do stavu **deactivated**. Když je instance komponenty vložena do DOM jako součást stromu komponent uloženého v cache, stane se **activated**.

<div class="composition-api">

"Kept-alive" komponenta může registrovat lifecycle hooks pro tyto dva stavy pomocí [`onActivated()`](/api/composition-api-lifecycle#onactivated) a [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated):

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // zavolá se při úvodním připojení (mounted)
  // a pokaždé, když je komponenta znvou vložena z cache
})

onDeactivated(() => {
  // zavolá se při odebrání z DOM a uložení do cache
  // a také při odpojení (unmounted)
})
</script>
```

</div>
<div class="options-api">

"Kept-alive" komponenta může registrovat lifecycle hooks pro tyto dva stavy pomocí sekcí [`activated`](/api/options-lifecycle#activated) a [`deactivated`](/api/options-lifecycle#deactivated):

```js
export default {
  activated() {
    // zavolá se při úvodním připojení (mounted)
    // a pokaždé, když je komponenta znvou vložena z cache
  },
  deactivated() {
    // zavolá se při odebrání z DOM a uložení do cache
    // a také při odpojení (unmounted)
  }
}
```

</div>

Pamatujte, že:

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> se také volá při úvodním připojení (mounted), a <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> při závěrečném odpojení (unmounted).

- Oba lifecycle hooks fungují nejen pro root komponentu uloženou v cache `<KeepAlive>`, ale také pro komponenty potomků v uloženém stromu komponent.

---

**Související**

- [`<KeepAlive>` API reference](/api/built-in-components#keepalive)
