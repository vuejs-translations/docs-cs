---
outline: deep
---

<script setup>
import { ref } from 'vue'
const message = ref('')
const multilineText = ref('')
const checked = ref(false)
const checkedNames = ref([])
const picked = ref('')
const selected = ref('')
const multiSelected = ref([])
</script>

# Binding dat z formulářů {#form-input-bindings}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-inputs-vue-devtools-in-vue-3" title="Lekce o uživatelských vstupech ve Vue.js zdarma"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-inputs-in-vue" title="Lekce o uživatelských vstupech ve Vue.js zdarma"/>
</div>

Při práci s formuláři na frontendu často potřebujeme synchronizovat stav vstupních polí formuláře s odpovídajícím stavem v JavaScriptu. Ruční binding hodnot a změny event listenerů mohou být těžkopádné:

```vue-html
<input
  :value="text"
  @input="event => text = event.target.value">
```

Direktiva `v-model` nám pomáhá výše uvedené zjednodušit na:

```vue-html
<input v-model="text">
```

Navíc může být `v-model` použita i na další druhy vstupů, elementy `<textarea>` a&nbsp;`<select>`. Automaticky se navazuje na různé DOM atributy a páry událostí podle toho, na jakém elementu je použita:

- Element `<input>` s textovými typy a `<textarea>` používá atribut `value` a událost `input`;
- `<input type="checkbox">` a `<input type="radio">` používá atribut `checked` a událost `change`;
- `<select>` používá atribut `value` a událost `change`.

::: tip Poznámka
`v-model` bude ignorovat výchozí atributy `value`, `checked` či `selected` nalezené na jakýchkoli prvcích formuláře. Vždy bude za zdroj pravdy považovat aktuální binding JavaScript stavu. Počáteční hodnotu byste měli deklarovat na straně JavaScriptu pomocí <span class="options-api">proměnné [`data`](/api/options-state.html#data)</span><span class="composition-api">[Reactivity API](/api/reactivity-core.html#reactivity-api-core)</span>.
:::

## Základní použití {#basic-usage}

### Text {#text}

```vue-html
<p>Zpráva je: {{ message }}</p>
<input v-model="message" placeholder="editovat" />
```

<div class="demo">
  <p>Zpráva je: {{ message }}</p>
  <input v-model="message" placeholder="editovat" />
</div>

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9jUEOgyAQRa8yYUO7aNkbNOkBegM2RseWRGACoxvC3TumxuX/+f+9ql5Ez31D1SlbpuyJoSBvNLjoA6XMUCHjAg2WnAJomWoXXZxSLAwBSxk/CP2xuWl9d9GaP0YAEhgDrSOjJABLw/s8+NJBrde/NWsOpWPrI20M+yOkGdfeqXPiFAhowm9aZ8zS4+wPv/RGjtZcJtV+YpNK1g==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9jdEKwjAMRX8l9EV90L2POvAD/IO+lDVqoetCmw6h9N/NmBuEJPeSc1PVg+i2FFS90nlMnngwEb80JwaHL1sCQzURwFm258u2AyTkkuKuACbM2b6xh9Nps9o6pEnp7ggWwThRsIyiADQNz40En3uodQ+C1nRHK8HaRyoMy3WaHYa7Uf8To0CCRvzMwWESH51n4cXvBNTd8Um1H0FuTq0=)

</div>

<span id="vmodel-ime-tip"></span>
::: tip Poznámka
U jazyků, které vyžadují [IME](https://en.wikipedia.org/wiki/Input_method) (čínština, japonština, korejština atd.), si všimnete, že `v-model` se během IME kompozice neaktualizuje. Chcete-li na tyto aktualizace také reagovat, použijte svůj vlastní `input` event listener a binding na `value` namísto použití `v-model`.
:::

### Víceřádkový text {#multiline-text}

```vue-html
<span>Víceřádkový text je:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="napište více řádek"></textarea>
```

<div class="demo">
  <span>Víceřádkový text je:</span>
  <p style="white-space: pre-line;">{{ multilineText }}</p>
  <textarea v-model="multilineText" placeholder="napište více řádek"></textarea>
</div>

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9jktuwzAMRK9CaON24XrvKgZ6gN5AG8FmGgH6ECKdJjB891D5LYec9zCb+SH6Oq9oRmN5roEEGGWlyeWQqFSBDSoeYYdjLQk6rXYuuzyXzAIJmf0fwqF1Prru02U7PDQq0CCYKHrBlsQy+Tz9rlFCDBnfdOBRqfa7twhYrhEPzvyfgmCvnxlHoIp9w76dmbbtDe+7HdpaBQUv4it6OPepLBjV8Gw5AzpjxlOJC1a9+2WB1IZQRGhWVqsdXgb1tfDcbvYbJDRqLQ==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNo9jk2OwyAMha9isenMIpN9hok0B+gN2FjBbZEIscDpj6LcvaZpKiHg2X6f32L+mX+uM5nO2DLkwNK7RHeesoCnE85RYHEJwKPg1/f2B8gkc067AhipFDxTB4fDVlrro5ce237AKoRGjihUldjCmPqjLgkxJNoxEEqnrtp7TTEUeUT6c+Z2CUKNdgbdxZmaavt1pl+Wj3ldbcubUegumAnh2oyTp6iE95QzoDEGukzRU9Y6eg9jDcKRoFKLUm27E5RXxTu7WZ89/G4E)

</div>

Pozor na to, že uvnitř `<textarea>` nefunguje interpolace. Použitje místo toho `v-model`.

```vue-html
<!-- špatně -->
<textarea>{{ text }}</textarea>

<!-- dobře -->
<textarea v-model="text"></textarea>
```

### Checkbox {#checkbox}

Jednoduchý checkbox s proměnnou typu boolean:

```vue-html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

<div class="demo">
  <input type="checkbox" id="checkbox-demo" v-model="checked" />
  <label for="checkbox-demo">{{ checked }}</label>
</div>

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpVjssKgzAURH/lko3tonVfotD/yEaTKw3Ni3gjLSH/3qhUcDnDnMNk9gzhviRkD8ZnGXUgmJFS6IXTNvhIkCHiBAWm6C00ddoIJ5z0biaQL5RvVNCtmwvFhFfheLuLqqIGQhvMQLgm4tqFREDfgJ1gGz36j2Cg1TkvN+sVmn+JqnbtrjDDiAYmH09En/PxphTebqsK8PY4wMoPslBUxQ==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpVjtEKgzAMRX8l9Gl72Po+OmH/0ZdqI5PVNnSpOEr/fVVREEKSc0kuN4sX0X1KKB5Cfbs4EDfa40whMljsTXIMWXsAa9hcrtsOEJFT9DsBdG/sPmgfwDHhJpZl1FZLycO6AuNIzjAuxGrwlBj4R/jUYrVpw6wFDPbM020MFt0uoq2a3CycadFBH+Lpo8l5jwWlKLle1QcljwCi/AH7gFic)

</div>

Můžeme také provést binding více checkboxů na stejné pole resp. [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set):

<div class="composition-api">

```js
const checkedNames = ref([])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      checkedNames: []
    }
  }
}
```

</div>

```vue-html
<div>Zaškrtnutá jména: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
```

<div class="demo">
  <div>Zaškrtnutá jména: {{ checkedNames }}</div>

  <input type="checkbox" id="demo-jack" value="Jack" v-model="checkedNames">
  <label for="demo-jack">Jack</label>

  <input type="checkbox" id="demo-john" value="John" v-model="checkedNames">
  <label for="demo-john">John</label>

  <input type="checkbox" id="demo-mike" value="Mike" v-model="checkedNames">
  <label for="demo-mike">Mike</label>
</div>

V tomto případě bude pole `checkedNames` vždy obsahovat hodnoty z aktuálně zaškrtnutých políček.

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqVkUtqwzAURbfy0CTtoNU8KILSWaHdQNWBIj8T1fohyybBeO+RbOc3i2e+vHvuMWggHyG89x2SLWGtijokaDF1gQunbfAxwQARaxihjt7CJlc3wgmnvGsTqAOqBqsfabGFXSm+/P69CsfovJVXckhog5EJcwJgle7558yBK+AWhuFxaRwZLbVCZ0K70CVIp4A7Qabi3h8FAV3l/C9Vk797abpy/lrim/UVmkt/Gc4HOv+EkXs0UPt4XeCFZHQ6lM4TZn9w9+YlrjFPCC/kKrPVDd6Zv5e4wjwv8ELezIxeX4qMZwHduAs=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqVUc1qxCAQfpXBU3tovS9WKL0V2hdoenDjLGtjVNwxbAl592rMpru3DYjO5/cnOLLXEJ6HhGzHxKmNJpBsHJ6DjwQaDypZgrFxAFqRenisM0BEStFdEEB7xLZD/al6PO3g67veT+XIW16Cr+kZEPbBKsKMAIQ2g3yrAeBqwjjeRMI0CV5kxZ0dxoVEQL8BXxo2C/f+3DAwOuMf1XZ5HpRNhX5f4FPvNdqLfgnOBK+PsGqPFg4+rgmyOAWfiaK5o9kf3XXzArc0zxZZnJuae9PhVfPHAjc01wRZnP/Ngq8/xaY/yMW74g==)

</div>

### Radio {#radio}

```vue-html
<div>Vybráno: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">Jedna</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Dva</label>
```

<div class="demo">
  <div>Vybráno: {{ picked }}</div>

  <input type="radio" id="one" value="One" v-model="picked" />
  <label for="one">Jedna</label>

  <input type="radio" id="two" value="Two" v-model="picked" />
  <label for="two">Dva</label>
</div>

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFkDFuwzAMRa9CaHE7tNoDxUBP0A4dtTgWDQiRJUKmHQSG7x7KhpMMAbLxk3z/g5zVD9H3NKI6KDO02RPDgDxSbaPvKWWGGTJ2sECXUw+VrFY22timODCQb8/o4FhWPqrfiNWnjUZvRmIhgrGn0DCKAjDOT/XfCh1gnnd+WYwukwJYNj7SyMBXwqNVuXE+WQXeiUgRpZyaMJaR5BX11SeHQfTmJi1dnNiE5oQBupR3shbC6LX9Posvpdyz/jf1OksOe85ayVqIR5bR9z+o5Qbc6oCk)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNkEEOAiEMRa/SsFEXyt7gJJ5AFy5ng1ITIgLBMmomc3eLOONSEwJ9Lf//pL3YxrjqMoq1ULdTspGa1uMjhkRg8KyzI+hbD2A06fmi1gAJKSc/EkC0pwuaNcx2Hme1OZSHLz5KTtYMhNfoNGEhUsZ2zf6j7vuPEQyDkmVSBPzJ+pgJ6Blx04qkjQ2tAGsYgkcuO+1yGXF6oeU1GHTM1Y1bsoY5fUQH55BGZcMKJd/t31l0L+WYdaj0V9Zb2bDim6XktAcxvADR+YWb)

</div>

### Select {#select}

Jednoduchý výběr:

```vue-html
<div>Vybráno: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Prosím, vyberte jednu možnost</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Vybráno: {{ selected }}</div>
  <select v-model="selected">
    <option disabled value="">Prosím, vyberte jednu možnost</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1j7EOgyAQhl/lwmI7tO4Nmti+QJOuLFTPxASBALoQ3r2H2jYOjvff939wkTXWXucJ2Y1x37rBBvAYJlsLPYzWuAARHPaQoHdmhILQQmihW6N9RhW2ATuoMnQqirPQvFw9ZKAh4GiVDEgTAPdW6hpeW+sGMf4VKVEz73Mvs8sC5stoOlSVYF9SsEVGiLFhMBq6wcu3IsUs1YREEvFUKD1udjAaebnS+27dHOT3g/yxy+nHywM08PJ3KksfXwJ2dA==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1j1ELgyAUhf/KxZe2h633cEHbHxjstReXdxCYSt5iEP333XIJPQSinuN3jjqJyvvrOKAohAxN33oqa4tf73oCjR81GIKptgBakTqd4x6gRxp6uymAgAYbQl1AlkVvXhaeeMg8NbMg7LxRhKwAZPDKlvBK8WlKXTDPnFzOI7naMF46p9HcarFxtVgBRpyn1lnQbVBvwwWjMgMyycTToAr47wZnUeaR3mfL6sC/H/iPnc/vXS9gIfP0UTH/ACgWeYE=)

</div>

:::tip Poznámka
Pokud počáteční hodnota `v-model` výrazu neodpovídá žádné z možností, element `<select>` se vykreslí ve stavu „unselected“. Na iOS to způsobí, že uživatel nebude moci vybrat první položku, protože iOS v tomto případě nevyvolá událost změny. Doporučuje se proto poskytnout „disabled“ volbu s prázdnou hodnotou, jak je ukázáno v příkladu výše.
:::

Vícenásobný výběr (binding na pole):

```vue-html
<div>Vybráno: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Vybráno: {{ multiSelected }}</div>

  <select v-model="multiSelected" multiple>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1kL2OwjAQhF9l5Ya74i7QBhMJeARKTIESIyz5Z5VsAsjyu7NOQEBB5xl/M7vaKNaI/0OvRSlkV7cGCTpNPVbKG4ehJYjQ6hMkOLXBwYzRmfLK18F3GbW6Jt3AKkM/+8Ov8rKYeriBBWmH9kiaFYBszFDtHpkSYnwVpCSL/JtDDE4+DH8uNNqulHiCSoDrLRm0UyWzAckEX61l8Xh9+psv/vbD563HCSxk8bY0y45u47AJ2D/HHyDm4MU0dC5hMZ/jdal8Gg8wJkS6A3nRew4=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1UEEOgjAQ/MqmJz0oeMVKgj7BI3AgdI1NCjSwIIbwdxcqRA4mTbsznd2Z7CAia49diyIQsslrbSlMSuxtVRMofGStIRiSEkBllO32rgaokdq6XBBAgwZzQhVAnDpunB6++EhvncyAsLAmI2QEIJXuwvvaPAzrJBhH6U2/UxMLHQ/doagUmksiFmEioOCU2ho3krWVJV2VYSS9b7Xlr3/424bn1LMDA+n9hGbY0Hs2c4J4sU/dPl5a0TOAk+/b/rwsYO4Q4wdtRX7l)

</div>

Volby pro `<select>` mohou být vykresleny dynamicky pomocí `v-for`:

<div class="composition-api">

```js
const selected = ref('A')

const options = ref([
  { text: 'Jedna', value: 'A' },
  { text: 'Dva', value: 'B' },
  { text: 'Tři', value: 'C' }
])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'Jedna', value: 'A' },
        { text: 'Dva', value: 'B' },
        { text: 'Tři', value: 'C' }
      ]
    }
  }
}
```

</div>

```vue-html
<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>

<div>Selected: {{ selected }}</div>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNplkMFugzAQRH9l5YtbKYU7IpFoP6CH9lb3EMGiWgLbMguthPzvXduEJMqNYUazb7yKxrlimVFUop5arx3BhDS7kzJ6dNYTrOCxhwC9tyNIjkpllGmtmWJ0wJawg2MMPclGPl9N60jzx+Z9KQPcRfhHFch3g/IAy3mYkVUjIRzu/M9fe+O/Pvo/Hm8b3jihzDdfr8s8gwewIBzdcCZkBVBnXFheRtvhcFTiwq9ECnAkQ3Okt54Dm9TmskYJqNLR3SyS3BsYct3CRYSFwGCpusx/M0qZTydKRXWnl9PHBlPFhv1lQ6jL6MZl+xoR/gFjPZTD)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1kMFqxCAQhl9l8JIWtsk92IVtH6CH9lZ7COssDbgqZpJdCHn3nWiUXBZE/Mdvxv93Fifv62lE0Qo5nEPv6ags3r0LBBov3WgIZmUBdEfdy2s6AwSkMdisAAY0eCbULVSn6pCrzlPv7NDCb64AzEB4J+a+LFYHmDozYuyCpfTtqJ+b21Efz6j/gPtpn8xl7C8douaNl2xKUhaEV286QlYAMgWB6e3qNJp3JXIyJSLASErFyMUFBjbZ2xxXCWijkXJZR1kmsPF5g+s1ACybWdmkarLSpKejS0VS99Pxu3wzT8jOuF026+2arKQRywOBGJfE)

</div>

## Binding hodnot {#value-bindings}

Pro volby elementů `<radio>`, `<checkbox>` a `<select>` jsou hodnoty vázané přes `v-model` binding většinou statický string (nebo v případě checkboxu boolean):

```vue-html
<!-- `picked` je po výběru string "a" -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` je buďto true nebo false -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` je string "abc", pokud je vybrána první volba -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Někdy však můžeme chtít provést binding hodnoty s dynamickou vlastností na právě aktivní instanci. K tomu můžeme použít `v-bind`. Použití direktivy `v-bind` nám navíc umožňuje binding vstupní hodnoty na non-string hodnoty.

### Checkbox {#checkbox-1}

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  true-value="ano"
  false-value="ne" />
```

`true-value` a `false-value` jsou atributy specifické pro Vue, které fungují pouze dohromady s `v-model`. Zde bude hodnota proměnné `toggle` nastavena na `'ano'`, když je checkbox zaškrtnutý, a na `'ne'`, pokud je odškrtnutý. Můžete také provést jejich binding na dynamickou hodnotu s použitím `v-bind`:

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

:::tip Tip
Atributy `true-value` a `false-value` nemají vliv na vstupní atribut `value`, protože prohlížeče nezaškrtnutá políčka při odesílání formulářů nezahrnují. Chcete-li zaručit, že ve formuláři bude odeslána jedna ze dvou hodnot (např. „ano“ nebo „ne“), použijte `<radio>`.
:::

### Radio {#radio-1}

```vue-html
<input type="radio" v-model="pick" :value="prvni" />
<input type="radio" v-model="pick" :value="druha" />
```

Proměnná `pick` bude nastavena na hodnotu `prvni`, když je vybrána první volba, a na `druha` po výběru druhé.

### Select {#select-options}

```vue-html
<select v-model="selected">
  <!-- inline object literal -->
  <option :value="{ number: 123 }">123</option>
</select>
```

`v-model` podporuje binding i na jiné, než řetězcové (string) hodnoty! Ve výše uvedeném příkladu bude po výběru možnosti proměnná `selected` nastavena na objekt s hodnotou `{ number: 123 }`.

## Modifikátory {#modifiers}

### `.lazy` {#lazy}

Ve výchozím nastavení `v-model` synchronizuje vstup s daty po každé události `input` (s&nbsp;výjimkou IME kompozice, jak je [uvedeno výše](#vmodel-ime-tip)). Místo toho můžete přidat modifikátor`lazy` k synchronizaci po události `change`:

```vue-html
<!-- synchronizuje se po „change“ místo „input“ -->
<input v-model.lazy="msg" />
```

### `.number` {#number}

Pokud chcete, aby byl uživatelský vstup automaticky přetypován jako číslo, můžete do vašich vstupů spravovaných přes `v-model` přidat modifikátor `number`:

```vue-html
<input v-model.number="age" />
```

Pokud hodnotu nelze přetypovat pomocí `parseFloat()`, bude použita původní hodnota.

Modifikátor `number` se aplikuje automaticky, pokud má vstupní pole atribut `type="number"`.

### `.trim` {#trim}

Pokud chcete z uživatelského vstupu automaticky odstranit bílé znaky (whitespace), můžete do vašich vstupů spravovaných přes `v-model` přidat modifikátor `trim`:

```vue-html
<input v-model.trim="msg" />
```

## `v-model` a komponenty {#v-model-with-components}

> Pokud ještě nejste seznámeni s Vue komponentami, můžete toto prozatím přeskočit.

Vestavěné typy HTML vstupů nebudou vždy vyhovovat vašim potřebám. Naštěstí vám Vue komponenty umožňují vytvářet znovupoužitelné vstupy se zcela přizpůsobitelným chováním. Tyto vstupy dokonce také fungují s `v-model`! Chcete-li se dozvědět více, přečtěte si o [bindingu přes `v-model`](/guide/components/v-model) v průvodci Komponentami.
