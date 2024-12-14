# Sloty (Slots) {#slots}

> Tato stránka předpokládá, že už jste četli [Základy komponent](/guide/essentials/component-basics). Pokud jsou pro vás komponenty nové, přečtěte si je jako první.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-component-slots" title="Lekce o slots ve Vue.js zdarma"/>

## Obsah a výstup slotů {#slot-content-and-outlet}

Naučili jsme se, že komponenty mohou přijímat vlastnosti (props), což mohou být JavaScript hodnoty libovolného typu. Ale jak je to s obsahem šablony? V některých případech můžeme chtít předat fragment šablony komponentě potomka a nechat ji, aby fragment v rámci své vlastní šablony vykreslila.

Například můžeme mít komponentu `<FancyButton>`, která podporuje následující použití:

```vue-html{2}
<FancyButton>
  Klikni na mě! <!-- obsah slotu -->
</FancyButton>
```

Šablona komponenty `<FancyButton>` vypadá takto:

```vue-html{2}
<button class="fancy-btn">
  <slot></slot> <!-- obsah slotu -->
</button>
```

Element `<slot>` je **výstup (outlet) slotu**, který indikuje, kde se má **obsah (content) slotu** poskytnutý komponentou rodiče vykreslit.

![slot diagram](./images/slots.png)

<!-- https://www.figma.com/file/LjKTYVL97Ck6TEmBbstavX/slot -->

Výsledný vykreslený DOM bude:

```html
<button class="fancy-btn">Klikni na mě!</button>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNpdUdtOwzAM/RUThAbSurIbl1ImARJf0ZesSapoqROlKdo07d9x0jF1SHmIT+xzcY7sw7nZTy9Zwcqu9tqFTYW6ddYH+OZYHz77ECyC8raFySwfYXFsUiFAhXKfBoRUvDcBjhGtLbGgxNAVcLziOlVIp8wvelQE2TrDg6QKoBx1JwDgy+h6B62E8ibLoDM2kAAGoocsiz1VKMfmCCrzCymbsn/GY95rze1grja8694rpmJ/tg1YsfRO/FE134wc2D4YeTYQ9QeKa+mUrgsHE6+zC+vfjoz1Bdwqpd5iveX1rvG2R1GA0Si5zxrPhaaY98v5WshmCrerhVi+LmCxvqPiafUslXoYpq0XkuiQ1p4Ax4XQ2BSwdnuYP7p9QlvuG40JHI1lUaenv3o5w3Xvu2jOWU179oQNn5aisNMvLBvDOg==)

</div>

S použitím slotů je `<FancyButton>` zodpovědný za vykreslení vnějšího `<button>` (a jeho „fancy“ stylování), zatímco vnitřní obsah je dodaný komponentou rodiče.

Další způsob, jak pochopit sloty, je porovnat je s JavaScript funkcemi:

```js
// komponenta rodiče předává obsah slotu
FancyButton('Klikni na mě!')

// FancyButton vykresluje obsah slotu uvnitř své vlastní šablony
function FancyButton(slotContent) {
  return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

Obsah slotů není omezen pouze na text. Může to být jakýkoli platný obsah šablony. Můžeme například předat více elementů nebo i jiné komponenty:

```vue-html
<FancyButton>
  <span style="color:red">Klikni na mě!</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1UmtOwkAQvspQYtCEgrx81EqCJibeoX+W7bRZaHc3+1AI4QyewH8ewvN4Aa/gbgtNIfFf5+vMfI/ZXbCQcvBmMYiCWFPFpAGNxsp5wlkphTLwQjjdPlljBIdMiRJ6g2EL88O9pnnxjlqU+EpbzS3s0BwPaypH4gqDpSyIQVcBxK3VFQDwXDC6hhJdlZi4zf3fRKwl4aDNtsDHJKCiECqiW8KTYH5c1gEnwnUdJ9rCh/XeM6Z42AgN+sFZAj6+Ux/LOjFaEK2diMz3h0vjNfj/zokuhPFU3lTdfcpShVOZcJ+DZgHs/HxtCrpZlj34eknoOlfC8jSCgnEkKswVSRlyczkZzVLM+9CdjtPJ/RjGswtX3ExvMcuu6mmhUnTruOBYAZKkKeN5BDO5gdG13FRoSVTOeAW2xkLPY3UEdweYWqW9OCkYN6gctq9uXllx2Z09CJ9dJwzBascI7nBYihWDldUGMqEgdTVIq6TQqCEMfUpNSD+fX7/fH+3b7P8AdGP6wA==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNptUltu2zAQvMpGQZEWsOzGiftQ1QBpgQK9g35oaikwkUiCj9aGkTPkBPnLIXKeXCBXyJKKBdoIoA/tYGd3doa74tqY+b+ARVXUjltp/FWj5GC09fCHKb79FbzXCoTVA5zNFxkWaWdT8/V/dHrAvzxrzrC3ZoBG4SYRWhQs9B52EeWapihU3lWwyxfPDgbfNYq+ejEppcLjYHrmkSqAOqMmAOB3L/ktDEhV4+v8gMR/l1M7wxQ4v+3xZ1Nw3Wtb8S1TTXG1H3cCJIO69oxc5mLUcrSrXkxSi1lxZGT0//CS9Wg875lzJELE/nLto4bko69dr31cFc8auw+3JHvSEfQ7nwbsHY9HwakQ4kes14zfdlYH1VbQS4XMlp1lraRMPl6cr1rsZnB6uWwvvi9hufpAxZfLryjEp5GtbYs0TlGICTCsbaXqKliZDZx/NpuEDsx2UiUwo5VxT6Dkv73BPFgXxRktlUdL2Jh6OoW8O3pX0buTsoTgaCNQcDjoGwk3wXkQ2tJLGzSYYI126KAso0uTSc8Pjy9P93k2d6+NyRKa)

</div>

S použitím slotů je naše komponenta `<FancyButton>` více flexibilní a znovupoužitelná. Nyní ji můžeme použít na různých místech s různým vnitřním obsahem, ale se stejným efektním stylováním.

Mechanismus slotů ve Vue komponentách je inspirován [nativním Web Component elementem `<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot), ovšem s dalšími možnostmi, které uvidíme později.

## Rozsah vykreslování {#render-scope}

Obsah slotu má přístup k datovému scope komponenty rodiče, protože je definován v ní. Například:

```vue-html
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

Zde obě interpolace <span v-pre>`{{ message }}`</span> vykreslí ten samý obsah.

Obsah slotu **nemá** přístup k datům komponenty potomka. Výrazy ve Vue šablonách mohou přistupovat pouze ke scope, ve kterém jsou definovány, v souladu s lexikálním rozsahem jazyka JavaScript. Jinými slovy:

> Výrazy v šabloně rodiče mají přístup pouze ke scope rodiče; výrazy v šabloně potomka mají přístup pouze ke scope potomka.

## Fallback obsah {#fallback-content}

V některých případech je užitečné specifikovat pro slot náhradní (fallback) obsah, tj. výchozí obsah, který se vykreslí pouze v případě, že žádný obsah není shora zadán. Například v komponentě `<SubmitButton>`:

```vue-html
<button type="submit">
  <slot></slot>
</button>
```

Můžeme chtít, aby se uvnitř `<button>` zobrazil text „Odeslat“, pokud rodič žádný obsah slotu neposkytl. Aby byl text „Odeslat“ fallback obsahem, můžeme jej umístit mezi tagy `<slot>`:

```vue-html{3}
<button type="submit">
  <slot>
    Odeslat <!-- fallback obsah -->
  </slot>
</button>
```

Nyní když `<SubmitButton>` použijeme v komponentě rodiče bez poskytnutí obsahu slotu:

```vue-html
<SubmitButton />
```

Bude vykreslen fallback obsah, „Odeslat“:

```html
<button type="submit">Odeslat</button>
```

Pokud však obsah zadáme:

```vue-html
<SubmitButton>Uložit</SubmitButton>
```

Potom bude místo toho vykreslen poskytnutý obsah:

```html
<button type="submit">Uložit</button>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1kMsKwjAQRX9lzMaNbfcSC/oL3WbT1ikU8yKZFEX8d5MGgi2YVeZxZ86dN7taWy8B2ZlxP7rZEnikYFuhZ2WNI+jCoGa6BSKjYXJGwbFufpNJfhSaN1kflTEgVFb2hDEC4IeqguARpl7KoR8fQPgkqKpc3Wxo1lxRWWeW+Y4wBk9x9V9d2/UL8g1XbOJN4WAntodOnrecQ2agl8WLYH7tFyw5olj10iR3EJ+gPCxDFluj0YS6EAqKR8mi9M3Td1ifLxWShcU=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp1UEEOwiAQ/MrKxYu1d4Mm+gWvXChuk0YKpCyNxvh3lxIb28SEA8zuDDPzEucQ9mNCcRAymqELdFKu64MfCK6p6Tu6JCLvoB18D9t9/Qtm4lY5AOXwMVFu2OpkCV4ZNZ51HDqKhwLAQjIjb+X4yHr+mh+EfbCakF8AclNVkCJCq61ttLkD4YOgqsp0YbGesJkVBj92NwSTIrH3v7zTVY8oF8F4SdazD7ET69S5rqXPpnigZ8CjEnHaVyInIp5G63O6XIGiIlZMzrGMd8RVfR0q4lIKKV+L+srW+wNTTZq3)

</div>

## Pojmenované sloty {#named-slots}

Jsou chvíle, kdy je užitečné mít v jedné komponentě více slotů. Například v komponentě `<BaseLayout>` s následující šablonou:

```vue-html
<div class="container">
  <header>
    <!-- Zde chceme mít hlavičku -->
  </header>
  <main>
    <!-- Zde chceme mít hlavní obsah -->
  </main>
  <footer>
    <!-- Zde chceme mít patičku -->
  </footer>
</div>
```

Pro tyto případy má element `<slot>` speciální atribut `name`, který lze použít k přiřazení jedinečného ID různým slotům, aby bylo možné určit, kde se má obsah vykreslit:

```vue-html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Výstup pro `<slot>` bez `name` má implicitně název „default“.

V komponentě rodiče, která `<BaseLayout>` používá potřebujeme způsob, jak předat více fragmentů obsahu slotů, z nichž každý je zaměřen na jiný výstup slotu. K tomu slouží **pojmenované sloty**.

Pro předání pojmenovaného slotu musíme použít prvek `<template>` s direktivou `v-slot` a té předat název slotu jako parametr:

```vue-html
<BaseLayout>
  <template v-slot:header>
    <!-- obsah pro slot `header` -->
  </template>
</BaseLayout>
```

`v-slot` má učený zkrácený zápis `#`, takže `<template v-slot:header>` může být zkráceno jen na `<template #header>`. Představte si to jako pokyn _„vykreslit tento fragment šablony do slotu 'header' komponenty potomka“_.

![named slots diagram](./images/named-slots.png)

<!-- https://www.figma.com/file/2BhP8gVZevttBu9oUmUUyz/named-slot -->

Zde je kód, který předává obsah do všech tří slotů  `<BaseLayout>` s využitím zkráceného zápisu:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Zde může být titulek stránky</h1>
  </template>

  <template #default>
    <p>Odstavec pro hlavní obsah</p>
    <p>A další...</p>
  </template>

  <template #footer>
    <p>Zde jsou kontaktní informace</p>
  </template>
</BaseLayout>
```

Pokud komponenta akceptuje výchozí slot i pojmenované sloty, jsou všechny elementy nejvyšší úrovně, které nejsou `<template>`, implicitně považovány za obsah výchozího slotu. Výše uvedené lze tedy zapsat také jako:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Zde může být titulek stránky</h1>
  </template>

  <!-- implicitní obsah slotu `default` -->
  <p>Odstavec pro hlavní obsah</p>
  <p>A další...</p>

  <template #footer>
    <p>Zde jsou kontaktní informace</p>
  </template>
</BaseLayout>
```

Nyní bude všechno uvnitř `<template>` elementů bude předáno do odpovídajících slotů. Cílové vykreslené HTML bude:

```html
<div class="container">
  <header>
    <h1>Zde může být titulek stránky</h1>
  </header>
  <main>
    <p>Odstavec pro hlavní obsah</p>
    <p>A další...</p>
  </main>
  <footer>
    <p>Zde jsou kontaktní informace</p>
  </footer>
</div>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9UsFuwjAM/RWrHLgMOi5o6jIkdtphn9BLSF0aKU2ixEVjiH+fm8JoQdvRfu/5xS8+ZVvvl4cOsyITUQXtCSJS5zel1a13geBdRvyUR9cR1MG1MF/mt1YvnZdW5IOWVVwQtt5IQq4AxI2cau5ccZg1KCsMlz4jzWrzgQGh1fuGYIcgwcs9AmkyKHKGLyPykcfD1Apr2ZmrHUN+s+U5Qe6D9A3ULgA1bCK1BeUsoaWlyPuVb3xbgbSOaQGcxRH8v3XtHI0X8mmfeYToWkxmUhFoW7s/JvblJLERmj1l0+T7T5tqK30AZWSMb2WW3LTFUGZXp/u8o3EEVrbI9AFjLn8mt38fN9GIPrSp/p4/Yoj7OMZ+A/boN9KInPeZZpAOLNLRDAsPZDgN4p0L/NQFOV/Ayn9x6EZXMFNKvQ4E5YwLBczW6/WlU3NIi6i/sYDn5Qu2qX1OF51MsvMPkrIEHg==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9UkFuwjAQ/MoqHLiUpFxQlaZI9NRDn5CLSTbEkmNb9oKgiL934wRwQK3ky87O7njGPicba9PDHpM8KXzlpKV1qWVnjSP4FB6/xcnsCRpnOpin2R3qh+alBig1HgO9xkbsFcG5RyvDOzRq8vkAQLSury+l5lNkN1EuCDurBCFXAMWdH2pGrn2YtShqdCPOnXa5/kKH0MldS7BFEGDFDoEkKSwybo8rskjjaevo4L7Wrje8x4mdE7aFxjiglkWE1GxQE9tLi8xO+LoGoQ3THLD/qP2/dGMMxYZs8DP34E2HQUxUBFI35o+NfTlJLOomL8n04frXns7W8gCVEt5/lElQkxpdmVyVHvP2yhBo0SHThx5z+TEZvl1uMlP0oU3nH/kRo3iMI9Ybes960UyRsZ9pBuGDeTqpwfBAvn7NrXF81QUZm8PSHjl0JWuYVVX1PhAqo4zLYbZarUak4ZAWXv5gDq/pG3YBHn50EEkuv5irGBk=)

</div>

Možná vám opět pomůže lépe pochopit pojmenované sloty analogie s JavaScript funkcemi:

```js
// předávání více fragmentů šablony pod různými názvy
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`
})

// <BaseLayout> je vykresí na různá místa
function BaseLayout(slots) {
  return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
}
```

## Podmíněné sloty {#conditional-slots}

Někdy chcete část šablony vykreslit v závislosti na tom, zda byl nebo nebyl předán obsah do slotu.

Abyste toho dosáhli, můžete použít vlastnost [$slots](/api/component-instance.html#slots) v kombinaci s [v-if](/guide/essentials/conditional.html#v-if).

V příkladu níže definujeme komponentu `Card` s třemi podmíněnými sloty: `header`, `footer` a výchozím `default`.
Pokud je obsah pro header / footer / default slot v&nbsp;objektu přítomen, chceme jej obalit dodatečným stylováním:

```vue-html
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

[Vyzkoušejte si to](https://play.vuejs.org/#eNqVVMtu2zAQ/BWCLZBLIjVoTq4aoA1yaA9t0eaoCy2tJcYUSZCUKyPwv2dJioplOw4C+EDuzM4+ONYT/aZ1tumBLmhhK8O1IxZcr29LyTutjCN3zNRkZVRHLrLcXzz9opRFHvnIxIuDTgvmAG+EFJ4WTnhOCPnQAqvBjHFE2uvbh5Zbgj/XAolwkWN4TM33VI/UalixXvjyo5yeqVVKOpCuyP0ob6utlHL7vUE3U4twkWP4hJq/jiPP4vSSOouNrHiTPVolcclPnl3SSnWaCzC/teNK2pIuSEA8xoRQ/3+GmDM9XKZ41UK1PhF/tIOPlfSPAQtmAyWdMMdMAy7C9/9+wYDnCexU3QtknwH/glWi9z1G2vde1tj2Hi90+yNYhcvmwd4PuHabhvKNeuYu8EuK1rk7M/pLu5+zm5BXyh1uMdnOu3S+95pvSCWYtV9xQcgqaXogj2yu+AqBj1YoZ7NosJLOEq5S9OXtPZtI1gFSppx8engUHs+vVhq9eVhq9ORRrXdpRyseSqfo6SmmnONK6XTw9yis24q448wXSG+0VAb3sSDXeiBoDV6TpWDV+ktENatrdMGCfAoBfL1JYNzzpINJjVFoJ9yKUKho19ul6OFQ6UYPx1rjIpPYeXIc/vXCgjetawzbni0dPnhhJ3T3DMVSruI=)

## Dynamické pojmenované sloty {#dynamic-slot-names}

[Dynamické parametry](/guide/essentials/template-syntax.md#dynamic-arguments) fungují i na `v-slot`, což umožňuje definici dynamických názvů slotů:

```vue-html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- zkrácený zápis -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

Mějte na paměti, že výraz podléhá [pravidlům syntaxe](/guide/essentials/template-syntax#dynamic-argument-syntax-constraints) dynamických parametrů pro direktivy.

## Scoped sloty {#scoped-slots}

Jak už bylo rozebíráno v oddílu [rozsah vykreslování](#render-scope), obsah slotu nemá přístup ke stavovým proměnným komponenty potomka.

V některých případech by však mohlo být užitečné, kdyby obsah slotu mohl využívat data ze scope rodiče i potomka. Abychom toho dosáhli, potřebujeme způsob, jak může komponenta potomka předat svá data do slotu při jeho vykreslování.

Vlastně můžeme udělat přesně to - můžeme předávat atributy do výstupu slotu stejně jako se předávají vlastnosti komponentě:

```vue-html
<!-- <MyComponent> template -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

Přijímání vlastností slotů se trochu liší při použití jednoho výchozího slotu a při použití pojmenovaných slotů. Nejprve si ukážeme, jak přijímat vlastností pomocí jediného výchozího slotu, a to pomocí `v-slot` přímo na tagu komponenty potomka:

```vue-html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![scoped slots diagram](./images/scoped-slots.svg)

<!-- https://www.figma.com/file/QRneoj8eIdL1kw3WQaaEyc/scoped-slot -->

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNp9kMEKgzAMhl8l9OJlU3aVOhg7C3uAXsRlTtC2tFE2pO++dA5xMnZqk+b/8/2dxMnadBxQ5EL62rWWwCMN9qh021vjCMrn2fBNoya4OdNDkmarXhQnSstsVrOOC8LedhVhrEiuHca97wwVSsTj4oz1SvAUgKJpgqWZEj4IQoCvZm0Gtgghzss1BDvIbFkqdmID+CNdbbQnaBwitbop0fuqQSgguWPXmX+JePe1HT/QMtJBHnE51MZOCcjfzPx04JxsydPzp2Szxxo7vABY1I/p)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFkNFqxCAQRX9l8CUttAl9DbZQ+rzQD/AlJLNpwKjoJGwJ/nvHpAnusrAg6FzHO567iE/nynlCUQsZWj84+lBmGJ31BKffL8sng4bg7O0IRVllWnpWKAOgDF7WBx2em0kTLElt975QbwLkhkmIyvCS1TGXC8LR6YYwVSTzH8yvQVt6VyJt3966oAR38XhaFjjEkvBCECNcia2d2CLyOACZQ7CDrI6h4kXcAF7lcg+za6h5et4JPdLkzV4B9B6RBtOfMISmxxqKH9TarrGtATxMgf/bDfM/qExEUCdEDuLGXAmoV06+euNs2JK7tyCrzSNHjX9aurQf)

</div>

Vlastnosti předané komponentou potomka do slotu jsou k dispozici jako hodnota příslušné direktivy `v-slot`, ke které lze přistupovat pomocí výrazů uvnitř slotu.

Scoped slot si můžete představit jako funkci předávanou do komponenty potomka. Ta ji pak zavolá a jako parametry předá vlastnosti:

```js
MyComponent({
  // předávání do slotu `default`, ale v podobě funkce
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return `<div>${
    // volání funkce pro slot s parametry!
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

V podstatě je to velmi podobné tomu, jak jsou scoped sloty kompilovány a jak se scoped sloty používají v manuálních [funkcích vykreslování](/guide/extras/render-function).

Všimněte si, jak `v-slot="slotProps"` odpovídá signatuře slot funkce. Stejně jako parametry funkce je v rámci `v-slot` můžeme destrukturovat:

```vue-html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### Pojmenované scoped sloty {#named-scoped-slots}

Pojmenované scoped sloty fungují podobně - vlastnosti slotu jsou přístupné jako hodnota direktivy `v-slot`: `v-slot:name="slotProps"`. Při použití zkráceného zápisu to vypadá takto:

```vue-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

Předávání vlastností do pojmenovaného slotu:

```vue-html
<slot name="header" message="ahoj"></slot>
```

Pamatujte si, že atribut `name` pojmenovaného slotu nebude jako vlastnost zahrnut, protože jde o vyhrazené klíčové slovo - takže výsledný objekt `headerProps` bude `{ message: 'ahoj' }`.

Pokud kombinujete pojmenované sloty s výchozím scoped slotem, musíte pro výchozí slot použít explicitní tag `<template>`. Pokus umístit direktivu `v-slot` přímo na komponentu způsobí kompilační chybu. Tím se Vue brání nejasnostem ohledně scope pro vlastnosti výchozího slotu. Například:

```vue-html
<!-- šablona <MyComponent> -->
<div>
  <slot :message="hello"></slot>
  <slot name="footer" />
</div>
```

```vue-html
<!-- tato šablona se nezkompiluje -->
<MyComponent v-slot="{ message }">
  <p>{{ message }}</p>
  <template #footer>
    <!-- `message` patří do výchozího slotu, a zde není přístupná -->
    <p>{{ message }}</p>
  </template>
</MyComponent>
```

Použití explicitního tagu `<template>` pro výchozí slot pomáhá ujasnit si, že vlastnost `message` není přístupná v jiném slotu:

```vue-html
<MyComponent>
  <!-- použitího explicitního výchozího slotu -->
  <template #default="{ message }">
    <p>{{ message }}</p>
  </template>

  <template #footer>
    <p>Zde jsou kontaktní informace</p>
  </template>
</MyComponent>
```

### Příklad - Fancy List {#fancy-list-example}

Možná se ptáte, jaké by byl pro scoped sloty vhodné využití. Zde je příklad: představte si komponentu `<FancyList>`, která vykresluje seznam položek – může zapouzdřit logiku pro načítání vzdálených dat, používat data k zobrazení seznamu nebo dokonce pokročilé funkce, jako je stránkování nebo nekonečný scrolling. Chceme však, aby byla flexibilní ohledně toho, jak vypadá každá položka, a ponechat styl každé položky na komponentě rodiče, která ji implementuje. Požadované použití tedy může vypadat takto:

```vue-html
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

Uvnitř `<FancyList>` můžeme vykreslit stejný `<slot>` vícekrát s různými daty (všimněte si, že používáme `v-bind` pro předání objektu s vlastnostmi slotu):

```vue-html
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqFU2Fv0zAQ/StHJtROapNuZTBCNwnQQKBpTGxCQss+uMml8+bYlu2UlZL/zjlp0lQa40sU3/nd3Xv3vA7eax0uSwziYGZTw7UDi67Up4nkhVbGwScm09U5tw5yowoYhFEX8cBBImdRgyQMHRwWWjCHdAKYbdFM83FpxEkS0DcJINZoxpotkCIHkySo7xOixcMep19KrmGustUISotGsgJHIPgDWqg6DKEyvoRUMGsJ4HG9HGX16bqpAlU1izy5baqDFegYweYroMttMwLAHx/Y9Kyan36RWUTN2+mjXfpbrei8k6SjdSuBYFOlMaNI6AeAtcflSrqx5b8xhkl4jMU7H0yVUCaGvVeH8+PjKYWqWnpf5DQYBTtb+fc612Awh2qzzGaBiUyVpBVpo7SFE8gw5xIv/Wl4M9gsbjCCQbuywe3+FuXl9iiqO7xpElEEhUofKFQo2mTGiFiOLr3jcpFImuiaF6hKNxzuw8lpw7kuEy6ZKJGK3TR6NluLYXBVqwRXQjkLn0ueIc3TLonyZ0sm4acqKVovKIbDCVQjGsb1qvyg2telU4Yzz6eHv6ARBWdwjVqUNCbbFjqgQn6aW1J8RKfJhDg+5/lStG4QHJZjnpO5XjT0BMqFu+uZ81yxjEQJw7A1kOA76FyZjaWBy0akvu8tCQKeQ+d7wsy5zLpz1FlzU3kW1QP+x40ApWgWAySEJTv6/NitNMkllcTakwCaZZ5ADEf6cROas/RhYVQps5igEpkZLwzRROmG04OjDBcj7+Js+vYQDo9e0uH1qzeY5/s1vtaaqG969+vTTrsmBTMLLv12nuy7l+d5W673SBzxkzlfhPdWSXokdZMkSFWhuUDzTTtOnk6CuG2fBEwI9etrHXOmRLJUE0/vMH14In5vH30sCS4Nkr+WmARdztHQ6Jr02dUFPtJ/lyxUVgq6/UzyO1olSj9jc+0DcaWxe/fqab/UT51Uu7Znjw6lbUn5QWtR6vtJQM//4zPUt+NOw+lGzCqo/gLm1QS8)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNVNtq20AQ/ZWpQnECujhO0qaqY+hD25fQl4RCifKwllbKktXushcT1/W/d1bSSnYJNCCEZmbPmcuZ1S76olS6cTTKo6UpNVN2VQjWKqktfCOi3N4yY6HWsoVZmo0eD5kVAqAQ9KU7XNGaOG5h572lRAZBhTV574CJzJv7QuCzzMaMaFjaKk4sRQtgOeUmiiVO85siwncRQa6oThRpKHrO50XUnUdEwMMJw08M7mAtq20MzlAtSEtj4OyZGkweMIiq2AZKToxBgMcdxDCqVrueBfb7ZaaOQiOspZYgbL0FPBySIQD+eMeQc99/HJIsM0weqs+O258mjfZREE1jt5yCKaWiFXpSX0A/5loKmxj2m+YwT69p+7kXg0udw8nlYn19fYGufvSeZBXF0ZGmR2vwmrJKS4WiPswGWWYxzIIgs8fYH6mIJadnQXdNrdMiWAB+yJ7gsXdgLfjqcK10wtJqgmYZ+spnpGgl6up5oaa2fGKi6U8Yau9ZS6Wzpwi7WU1p7BMzaZcLbuBh0q2XM4fZXTc+uOPSGvjuWEWxlaAexr9uiIBf0qG3Uy6HxXwo9B+mn47CvbNSM+LHccDxAyvmjMA9Vdxh1WQiO0eywBVGEaN3Pj972wVxPKwOZ7BJWI2b+K5rOOVUNPbpYJNvJalwZmmahm3j7AhdSz3sPzDRS3R4SQwOCXxP4yVBzJqJarSzcY8H5mXWFfif1QVwPGjGcQWTLp7YrcLxCfyDdAuMW0cq30AOV+plcK1J+dxoXJkqR6igRCeNxjbxp3N6cX5V0Sb2K19dfFrA4uo9Gh8uP9K6Puvw3eyx9SH3IT/qPCZpiW6Y8Gq9mvekrutAN96o/V99ALPj)

</div>

### Komponenty bez vykreslení {#renderless-components}

Příklad s `<FancyList>`, o kterém jsme hovořili výše, zapouzdřuje jak opakovaně použitelnou logiku (načítání dat, stránkování atd.), tak vizuální výstup, přičemž část vizuálního výstupu deleguje na komponentu rodiče prostřednictvím scoped slotů.

Pokud tento koncept posuneme ještě o něco dále, můžeme přijít s komponentami, které pouze zapouzdřují logiku a samy o sobě nic nevykreslují – vizuální výstup je plně delegován na komponentu rodiče s použitím scoped slotů. Tento typ komponenty nazýváme **komponenty bez vykreslení (renderless)**.

Příklad renderless komponenty může být taková, která zapouzdřuje logiku pro sledování aktuální polohy myši:

```vue-html
<MouseTracker v-slot="{ x, y }">
  Myš je na: {{ x }}, {{ y }}
</MouseTracker>
```

<div class="composition-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqNUcFqhDAQ/ZUhF12w2rO4Cz301t5aaCEX0dki1SQko6uI/96J7i4qLPQQmHmZ9+Y9ZhQvxsRdiyIVmStsZQgcUmtOUlWN0ZbgXbcOP2xe/KKFs9UNBHGyBj09kCpLFj4zuSFsTJ0T+o6yjUb35GpNRylG6CMYYJKCpwAkzWNQOcgphZG/YZoiX/DQNAttFjMrS+6LRCT2rh6HGsHiOQKtmKIIS19+qmZpYLrmXIKxM1Vo5Yj9HD0vfD7ckGGF3LDWlOyHP/idYPQCfdzldTtjscl/8MuDww78lsqHVHdTYXjwCpdKlfoS52X52qGit8oRKrRhwHYdNrrDILouPbCNVZCtgJ1n/6Xx8JYAmT8epD3fr5cC0oGLQYpkd4zpD27R0vA=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://play.vuejs.org/#eNqVUU1rwzAM/SvCl7SQJTuHdLDDbttthw18MbW6hjW2seU0oeS/T0lounQfUDBGepaenvxO4tG5rIkoClGGra8cPUhT1c56ghcbA756tf1EDztva0iy/Ds4NCbSAEiD7diicafigeA0oFvLPAYNhWICYEE5IL00fMp8Hs0JYe0OinDIqFyIaO7CwdJGihO0KXTcLriK59NYBlUARTyMn6Hv0yHgIp7ARAvl3FXm8yCRiuu1Fv/x23JakVqtz3t5pOjNOQNoC7hPz0nHyRSzEr7Ghxppb/XlZ6JjRlzhTAlA+ypkLWwAM6c+8G2BdzP+/pPbRkOoL/KOldH2mCmtnxr247kKhAb9KuHKgLVtMEkn2knG+sIVzV9sfmy8hfB/swHKwV0oWja4lQKKjoNOivzKrf4L/JPqaQ==)

</div>

Ačkoli je to zajímavý vzor, většinu toho, čeho lze dosáhnout s renderless komponentami, lze zajistit efektivněji s Composition API, aniž by to znamenalo dodatečnou režii dalšího vnořování komponent. Později uvidíme, jak můžeme implementovat stejnou funkci sledování myši ve formě [composable](/guide/reusability/composables).

Scoped sloty jsou ovšem stále užitečné v případech, kdy potřebujeme zapouzdřit logiku **a zároveň** tvořit vizuální výstup, jako v příkladu `<FancyList>`.
