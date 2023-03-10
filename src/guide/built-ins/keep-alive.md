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

Ve výchozím nastavení bude instance aktivní komponenty odpojena (unmounted), když se z ní přesunete jinam. To způsobí ztrátu jakýchkoliv změn stavu, které si drží. Když se tato komponenta znovu zobrazí, vytvoří se nová instance pouze ve výchozím stavu.

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

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHNoYWxsb3dSZWYgfSBmcm9tICd2dWUnXG5pbXBvcnQgQ29tcEEgZnJvbSAnLi9Db21wQS52dWUnXG5pbXBvcnQgQ29tcEIgZnJvbSAnLi9Db21wQi52dWUnXG5cbmNvbnN0IGN1cnJlbnQgPSBzaGFsbG93UmVmKENvbXBBKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImRlbW9cIj5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgOnZhbHVlPVwiQ29tcEFcIiAvPiBBPC9sYWJlbD5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgOnZhbHVlPVwiQ29tcEJcIiAvPiBCPC9sYWJlbD5cbiAgICA8S2VlcEFsaXZlPlxuICAgICAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50XCI+PC9jb21wb25lbnQ+XG4gICAgPC9LZWVwQWxpdmU+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cbiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDb21wQS52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgcmVmIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBjb3VudCA9IHJlZigwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHA+Q3VycmVudCBjb21wb25lbnQ6IEE8L3A+XG4gIDxzcGFuPmNvdW50OiB7eyBjb3VudCB9fTwvc3Bhbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJjb3VudCsrXCI+KzwvYnV0dG9uPlxuPC90ZW1wbGF0ZT5cbiIsIkNvbXBCLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYgfSBmcm9tICd2dWUnXG5jb25zdCBtc2cgPSByZWYoJycpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQjwvcD5cbiAgPHNwYW4+TWVzc2FnZSBpczoge3sgbXNnIH19PC9zcGFuPlxuICA8aW5wdXQgdi1tb2RlbD1cIm1zZ1wiPlxuPC90ZW1wbGF0ZT5cbiJ9)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDb21wQSBmcm9tICcuL0NvbXBBLnZ1ZSdcbmltcG9ydCBDb21wQiBmcm9tICcuL0NvbXBCLnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQ29tcEEsIENvbXBCIH0sXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnQ6ICdDb21wQSdcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJkZW1vXCI+XG4gICAgPGxhYmVsPjxpbnB1dCB0eXBlPVwicmFkaW9cIiB2LW1vZGVsPVwiY3VycmVudFwiIHZhbHVlPVwiQ29tcEFcIiAvPiBBPC9sYWJlbD5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgdmFsdWU9XCJDb21wQlwiIC8+IEI8L2xhYmVsPlxuICAgIDxLZWVwQWxpdmU+XG4gICAgICA8Y29tcG9uZW50IDppcz1cImN1cnJlbnRcIj48L2NvbXBvbmVudD5cbiAgICA8L0tlZXBBbGl2ZT5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuIiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkNvbXBBLnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50OiAwXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQTwvcD5cbiAgPHNwYW4+Y291bnQ6IHt7IGNvdW50IH19PC9zcGFuPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj4rPC9idXR0b24+XG48L3RlbXBsYXRlPlxuIiwiQ29tcEIudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbXNnOiAnJ1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQjwvcD5cbiAgPHNwYW4+TWVzc2FnZSBpczoge3sgbXNnIH19PC9zcGFuPlxuICA8aW5wdXQgdi1tb2RlbD1cIm1zZ1wiPlxuPC90ZW1wbGF0ZT5cbiJ9)

</div>

:::tip
Při použití v [DOM-šablonách](/guide/essentials/component-basics#dom-template-parsing-caveats), měla by být používána jako `<keep-alive>`.
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
