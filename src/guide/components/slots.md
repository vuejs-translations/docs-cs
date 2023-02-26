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

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBGYW5jeUJ1dHRvbiBmcm9tICcuL0ZhbmN5QnV0dG9uLnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxGYW5jeUJ1dHRvbj5cbiAgICBDbGljayBtZSA8IS0tIHNsb3QgY29udGVudCAtLT5cbiBcdDwvRmFuY3lCdXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJGYW5jeUJ1dHRvbi52dWUiOiI8dGVtcGxhdGU+XG4gIDxidXR0b24gY2xhc3M9XCJmYW5jeS1idG5cIj5cbiAgXHQ8c2xvdC8+IDwhLS0gc2xvdCBvdXRsZXQgLS0+XG5cdDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmZhbmN5LWJ0biB7XG4gIGNvbG9yOiAjZmZmO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMzE1ZGVnLCAjNDJkMzkyIDI1JSwgIzY0N2VmZik7XG4gIGJvcmRlcjogbm9uZTtcbiAgcGFkZGluZzogNXB4IDEwcHg7XG4gIG1hcmdpbjogNXB4O1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbjwvc3R5bGU+In0=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBGYW5jeUJ1dHRvbiBmcm9tICcuL0ZhbmN5QnV0dG9uLnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgRmFuY3lCdXR0b24gfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPEZhbmN5QnV0dG9uPlxuICAgIENsaWNrIG1lIDwhLS0gc2xvdCBjb250ZW50IC0tPlxuIFx0PC9GYW5jeUJ1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkZhbmN5QnV0dG9uLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBjbGFzcz1cImZhbmN5LWJ0blwiPlxuICBcdDxzbG90Lz4gPCEtLSBzbG90IG91dGxldCAtLT5cblx0PC9idXR0b24+XG48L3RlbXBsYXRlPlxuXG48c3R5bGU+XG4uZmFuY3ktYnRuIHtcbiAgY29sb3I6ICNmZmY7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgzMTVkZWcsICM0MmQzOTIgMjUlLCAjNjQ3ZWZmKTtcbiAgYm9yZGVyOiBub25lO1xuICBwYWRkaW5nOiA1cHggMTBweDtcbiAgbWFyZ2luOiA1cHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuPC9zdHlsZT4ifQ==)

</div>

S použitím slotů je `<FancyButton>` zodpovědný za vykreslení vnějšího `<button>` (a jeho "fancy" stylování), zatímco vnitřní obsah je dodaný komponentou rodiče.

Další způsob, jak pochopit sloty, je porovnat je s JavaScript funkcemi:

```js
// komponenta rodiče předávající obsah slotu
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

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBGYW5jeUJ1dHRvbiBmcm9tICcuL0ZhbmN5QnV0dG9uLnZ1ZSdcbmltcG9ydCBBd2Vzb21lSWNvbiBmcm9tICcuL0F3ZXNvbWVJY29uLnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxGYW5jeUJ1dHRvbj5cbiAgICBDbGljayBtZVxuIFx0PC9GYW5jeUJ1dHRvbj5cbiAgPEZhbmN5QnV0dG9uPlxuICAgIDxzcGFuIHN0eWxlPVwiY29sb3I6Y3lhblwiPkNsaWNrIG1lISA8L3NwYW4+XG4gICAgPEF3ZXNvbWVJY29uIC8+XG4gIDwvRmFuY3lCdXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJGYW5jeUJ1dHRvbi52dWUiOiI8dGVtcGxhdGU+XG4gIDxidXR0b24gY2xhc3M9XCJmYW5jeS1idG5cIj5cbiAgXHQ8c2xvdC8+XG5cdDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmZhbmN5LWJ0biB7XG4gIGNvbG9yOiAjZmZmO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMzE1ZGVnLCAjNDJkMzkyIDI1JSwgIzY0N2VmZik7XG4gIGJvcmRlcjogbm9uZTtcbiAgcGFkZGluZzogNXB4IDEwcHg7XG4gIG1hcmdpbjogNXB4O1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbjwvc3R5bGU+IiwiQXdlc29tZUljb24udnVlIjoiPCEtLSB1c2luZyBhbiBlbW9qaSBqdXN0IGZvciBkZW1vIHB1cnBvc2VzIC0tPlxuPHRlbXBsYXRlPuKdpO+4jzwvdGVtcGxhdGU+In0=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBGYW5jeUJ1dHRvbiBmcm9tICcuL0ZhbmN5QnV0dG9uLnZ1ZSdcbmltcG9ydCBBd2Vzb21lSWNvbiBmcm9tICcuL0F3ZXNvbWVJY29uLnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgRmFuY3lCdXR0b24sIEF3ZXNvbWVJY29uIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxGYW5jeUJ1dHRvbj5cbiAgICBDbGljayBtZVxuIFx0PC9GYW5jeUJ1dHRvbj5cblxuICA8RmFuY3lCdXR0b24+XG4gICAgPHNwYW4gc3R5bGU9XCJjb2xvcjpjeWFuXCI+Q2xpY2sgbWUhIDwvc3Bhbj5cbiAgICA8QXdlc29tZUljb24gLz5cbiAgPC9GYW5jeUJ1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkZhbmN5QnV0dG9uLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBjbGFzcz1cImZhbmN5LWJ0blwiPlxuICBcdDxzbG90Lz5cblx0PC9idXR0b24+XG48L3RlbXBsYXRlPlxuXG48c3R5bGU+XG4uZmFuY3ktYnRuIHtcbiAgY29sb3I6ICNmZmY7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgzMTVkZWcsICM0MmQzOTIgMjUlLCAjNjQ3ZWZmKTtcbiAgYm9yZGVyOiBub25lO1xuICBwYWRkaW5nOiA1cHggMTBweDtcbiAgbWFyZ2luOiA1cHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuPC9zdHlsZT4iLCJBd2Vzb21lSWNvbi52dWUiOiI8IS0tIHVzaW5nIGFuIGVtb2ppIGp1c3QgZm9yIGRlbW8gcHVycG9zZXMgLS0+XG48dGVtcGxhdGU+4p2k77iPPC90ZW1wbGF0ZT4ifQ==)

</div>

S použitím slotů je naše komponenta `<FancyButton>` více flexibilní a znovupoužitelná. Nyní ji můžeme použít na různých místech s různým vnitřním obsahem, ale se stejným efektním stylováním.

Mechanismus slotů ve Vue komponentách je inspirován [nativním Web Component elementem `<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot), ovšem s dalšími možnostmi, které uvidíme později.

## Scope vykreslování {#render-scope}

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

Můžeme chtít, aby se uvnitř `<button>` zobrazil text "Odeslat", pokud rodič žádný obsah slotu neposkytl. Aby byl text "Odeslat" fallback obsahem, můžeme jej umístit mezi tagy `<slot>`:

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

Bude vykreslen fallback obsah, "Odeslat":

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

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBTdWJtaXRCdXR0b24gZnJvbSAnLi9TdWJtaXRCdXR0b24udnVlJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPCEtLSB1c2UgZmFsbGJhY2sgdGV4dCAtLT5cbiAgPFN1Ym1pdEJ1dHRvbiAvPlxuICBcbiAgPCEtLSBwcm92aWRlIGN1c3RvbSB0ZXh0IC0tPlxuICA8U3VibWl0QnV0dG9uPlNhdmU8L1N1Ym1pdEJ1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIlN1Ym1pdEJ1dHRvbi52dWUiOiI8dGVtcGxhdGU+XG4gIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlxuXHQgIDxzbG90PlxuICAgIFx0U3VibWl0IDwhLS0gZmFsbGJhY2sgY29udGVudCAtLT5cbiAgXHQ8L3Nsb3Q+XG5cdDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4ifQ==)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBTdWJtaXRCdXR0b24gZnJvbSAnLi9TdWJtaXRCdXR0b24udnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIFN1Ym1pdEJ1dHRvblxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8IS0tIHVzZSBmYWxsYmFjayB0ZXh0IC0tPlxuICA8U3VibWl0QnV0dG9uIC8+XG4gIFxuICA8IS0tIHByb3ZpZGUgY3VzdG9tIHRleHQgLS0+XG4gIDxTdWJtaXRCdXR0b24+U2F2ZTwvU3VibWl0QnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiU3VibWl0QnV0dG9uLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+XG5cdCAgPHNsb3Q+XG4gICAgXHRTdWJtaXQgPCEtLSBmYWxsYmFjayBjb250ZW50IC0tPlxuICBcdDwvc2xvdD5cblx0PC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

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

Výstup `<slot>` bez `name` má implicitně název "default".

V komponentě rodiče, která `<BaseLayout>` používá potřebujeme způsob, jak předat více fragmentů obsahu slotů, z nichž každý je zaměřen na jiný výstup slotu. K tomu slouží **pojmenované sloty**.

Pro předání pojmenovaného slotu musíme použít prvek `<template>` s direktivou `v-slot` a té předat název slotu jako argument:

```vue-html
<BaseLayout>
  <template v-slot:header>
    <!-- obsah pro slot `header` -->
  </template>
</BaseLayout>
```

`v-slot` má učený zkrácený zápis `#`, takže `<template v-slot:header>` může být zkráceno jen na `<template #header>`. Představte si to jako pokyn "vykreslit tento fragment šablony do slotu 'header' komponenty potomka".

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

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBCYXNlTGF5b3V0IGZyb20gJy4vQmFzZUxheW91dC52dWUnXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8QmFzZUxheW91dD5cbiAgICA8dGVtcGxhdGUgI2hlYWRlcj5cbiAgICAgIDxoMT5IZXJlIG1pZ2h0IGJlIGEgcGFnZSB0aXRsZTwvaDE+XG4gICAgPC90ZW1wbGF0ZT5cblxuICAgIDx0ZW1wbGF0ZSAjZGVmYXVsdD5cbiAgICAgIDxwPkEgcGFyYWdyYXBoIGZvciB0aGUgbWFpbiBjb250ZW50LjwvcD5cbiAgICAgIDxwPkFuZCBhbm90aGVyIG9uZS48L3A+XG4gICAgPC90ZW1wbGF0ZT5cblxuICAgIDx0ZW1wbGF0ZSAjZm9vdGVyPlxuICAgICAgPHA+SGVyZSdzIHNvbWUgY29udGFjdCBpbmZvPC9wPlxuICAgIDwvdGVtcGxhdGU+XG4gIDwvQmFzZUxheW91dD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJhc2VMYXlvdXQudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgPGhlYWRlcj5cbiAgICAgIDxzbG90IG5hbWU9XCJoZWFkZXJcIj48L3Nsb3Q+XG4gICAgPC9oZWFkZXI+XG4gICAgPG1haW4+XG4gICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgPC9tYWluPlxuICAgIDxmb290ZXI+XG4gICAgICA8c2xvdCBuYW1lPVwiZm9vdGVyXCI+PC9zbG90PlxuICAgIDwvZm9vdGVyPlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbiAgZm9vdGVyIHtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2NjYztcbiAgICBjb2xvcjogIzY2NjtcbiAgICBmb250LXNpemU6IDAuOGVtO1xuICB9XG48L3N0eWxlPiJ9)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCYXNlTGF5b3V0IGZyb20gJy4vQmFzZUxheW91dC52dWUnXG4gIFxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7XG4gICAgQmFzZUxheW91dFxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8QmFzZUxheW91dD5cbiAgICA8dGVtcGxhdGUgI2hlYWRlcj5cbiAgICAgIDxoMT5IZXJlIG1pZ2h0IGJlIGEgcGFnZSB0aXRsZTwvaDE+XG4gICAgPC90ZW1wbGF0ZT5cblxuICAgIDx0ZW1wbGF0ZSAjZGVmYXVsdD5cbiAgICAgIDxwPkEgcGFyYWdyYXBoIGZvciB0aGUgbWFpbiBjb250ZW50LjwvcD5cbiAgICAgIDxwPkFuZCBhbm90aGVyIG9uZS48L3A+XG4gICAgPC90ZW1wbGF0ZT5cblxuICAgIDx0ZW1wbGF0ZSAjZm9vdGVyPlxuICAgICAgPHA+SGVyZSdzIHNvbWUgY29udGFjdCBpbmZvPC9wPlxuICAgIDwvdGVtcGxhdGU+XG4gIDwvQmFzZUxheW91dD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJhc2VMYXlvdXQudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgPGhlYWRlcj5cbiAgICAgIDxzbG90IG5hbWU9XCJoZWFkZXJcIj48L3Nsb3Q+XG4gICAgPC9oZWFkZXI+XG4gICAgPG1haW4+XG4gICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgPC9tYWluPlxuICAgIDxmb290ZXI+XG4gICAgICA8c2xvdCBuYW1lPVwiZm9vdGVyXCI+PC9zbG90PlxuICAgIDwvZm9vdGVyPlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbiAgZm9vdGVyIHtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2NjYztcbiAgICBjb2xvcjogIzY2NjtcbiAgICBmb250LXNpemU6IDAuOGVtO1xuICB9XG48L3N0eWxlPiJ9)

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

Mějte na paměti, že výraz podléhá [pravidlům syntaxe](/guide/essentials/template-syntax.html#directives) dynamických argumentů pro direktivy.

## Scoped sloty {#scoped-slots}

Jak už bylo rozebíráno v oddílu [scope vykreslování](#render-scope), obsah slotu nemá přístup ke stavovým proměnným komponenty potomka.

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

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tICcuL015Q29tcG9uZW50LnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxNeUNvbXBvbmVudCB2LXNsb3Q9XCJzbG90UHJvcHNcIj5cbiAgXHR7eyBzbG90UHJvcHMudGV4dCB9fSB7eyBzbG90UHJvcHMuY291bnQgfX1cbiAgPC9NeUNvbXBvbmVudD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIk15Q29tcG9uZW50LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5jb25zdCBncmVldGluZ01lc3NhZ2UgPSAnaGVsbG8nXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2PlxuICBcdDxzbG90IDp0ZXh0PVwiZ3JlZXRpbmdNZXNzYWdlXCIgOmNvdW50PVwiMVwiPjwvc2xvdD5cblx0PC9kaXY+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tICcuL015Q29tcG9uZW50LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHtcbiAgICBNeUNvbXBvbmVudFxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8TXlDb21wb25lbnQgdi1zbG90PVwic2xvdFByb3BzXCI+XG4gIFx0e3sgc2xvdFByb3BzLnRleHQgfX0ge3sgc2xvdFByb3BzLmNvdW50IH19XG4gIDwvTXlDb21wb25lbnQ+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJNeUNvbXBvbmVudC52dWUiOiI8c2NyaXB0PlxuZXhwb3J0IGRlZmF1bHQge1xuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBncmVldGluZ01lc3NhZ2U6ICdoZWxsbydcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXY+XG4gIFx0PHNsb3QgOnRleHQ9XCJncmVldGluZ01lc3NhZ2VcIiA6Y291bnQ9XCIxXCI+PC9zbG90PlxuXHQ8L2Rpdj5cbjwvdGVtcGxhdGU+In0=)

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

V podstatě je to velmi podobné tomu, jak jsou scoped sloty kompilovány a jak se scoped sloty používají v manuálních [funkcích vykreslování](/guide/extras/render-function.html).

Všimněte si, jak `v-slot="slotProps"` odpovídá signatuře slot funkce. Stejně jako parametry funkce je v rámci `v-slot` můžeme dekonstruovat:

```vue-html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### Pojmenované scoped sloty {#named-scoped-slots}

Pojmenované scoped sloty fugují podobně - vlastnosti slotu jsou přístupné jako hodnota direktivy `v-slot`: `v-slot:name="slotProps"`. Při použití zkráceného zápisu to vypadá takto:

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

Předávání vlastností do pojemnovaného slotu:

```vue-html
<slot name="header" message="ahoj"></slot>
```

Pamatujte si, že atribut `name` pojmenovaného slotu nebude jako vlastnost zahrnut, protože jde o vyhrazené klíčové slovo - takže výsledný objekt `headerProps` bude `{ message: 'ahoj' }`.

Pokud kombinujete pojmenované sloty s výchozím scoped slotem, musíte pro výchozí slot použít explicitní tag `<template>`. Pokus umístit direktivu `v-slot` přímo na komponentu způsobí kompilační chybu. Tím se brání nejasnostem ohledně scope pro vlastnosti výchozího slotu. Například:

```vue-html
<!-- tato šablona se nezkompiluje -->
<template>
  <MyComponent v-slot="{ message }">
    <p>{{ message }}</p>
    <template #footer>
      <!-- `message` patří do výchozího slotu, a zde není přístupná -->
      <p>{{ message }}</p>
    </template>
  </MyComponent>
</template>
```

Použití explicitního tagu `<template>` pro výchozí slot pomáhá udělat jasno v tom, že vlastnost `message` není přístupná v jiném slotu:

```vue-html
<template>
  <MyComponent>
    <!-- použitího explicitního výchozího slotu -->
    <template #default="{ message }">
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <p>Zde jsou kontaktní informace</p>
    </template>
  </MyComponent>
</template>
```

### Příklad - Fancy List {#fancy-list-example}

Možná se ptáte, jaké by byl pro scoped sloty vhodné využití. Zde je příklad: představte si komponentu `<FancyList>`, která vykresluje seznam položek – může zapouzdřit logiku pro načítání vzdálených dat, používat data k zobrazení seznamu nebo dokonce pokročilé funkce, jako je stránkování nebo nekonečný scrolling. Chceme však, aby byla flexibilní s tím, jak vypadá každá položka, a ponechal styl každé položky na komponentě rodiče, která ji implementuje. Požadované použití tedy může vypadat takto:

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

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBGYW5jeUxpc3QgZnJvbSAnLi9GYW5jeUxpc3QudnVlJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPEZhbmN5TGlzdCA6YXBpLXVybD1cInVybFwiIDpwZXItcGFnZT1cIjEwXCI+XG4gICAgPHRlbXBsYXRlICNpdGVtPVwieyBib2R5LCB1c2VybmFtZSwgbGlrZXMgfVwiPlxuICAgICAgPGRpdiBjbGFzcz1cIml0ZW1cIj5cbiAgICAgICAgPHA+e3sgYm9keSB9fTwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJtZXRhXCI+Ynkge3sgdXNlcm5hbWUgfX0gfCB7eyBsaWtlcyB9fSBsaWtlczwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvdGVtcGxhdGU+XG4gIDwvRmFuY3lMaXN0PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlIHNjb3BlZD5cbi5tZXRhIHtcbiAgZm9udC1zaXplOiAwLjhlbTtcbiAgY29sb3I6ICM0MmI4ODM7XG59XG48L3N0eWxlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJGYW5jeUxpc3QudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgcHJvcHMgPSBkZWZpbmVQcm9wcyhbJ2FwaS11cmwnLCAncGVyLXBhZ2UnXSlcblxuY29uc3QgaXRlbXMgPSByZWYoW10pXG5cbi8vIG1vY2sgcmVtb3RlIGRhdGEgZmV0Y2hpbmdcbnNldFRpbWVvdXQoKCkgPT4ge1xuICBpdGVtcy52YWx1ZSA9IFtcbiAgICB7IGJvZHk6ICdTY29wZWQgU2xvdHMgR3VpZGUnLCB1c2VybmFtZTogJ0V2YW4gWW91JywgbGlrZXM6IDIwIH0sXG5cdCAgeyBib2R5OiAnVnVlIFR1dG9yaWFsJywgdXNlcm5hbWU6ICdOYXRhbGlhIFRlcGx1aGluYScsIGxpa2VzOiAxMCB9XG4gIF1cbn0sIDEwMDApXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8dWw+XG4gICAgPGxpIHYtaWY9XCIhaXRlbXMubGVuZ3RoXCI+XG4gICAgICBMb2FkaW5nLi4uXG4gICAgPC9saT5cbiAgICA8bGkgdi1mb3I9XCJpdGVtIGluIGl0ZW1zXCI+XG4gICAgICA8c2xvdCBuYW1lPVwiaXRlbVwiIHYtYmluZD1cIml0ZW1cIi8+XG4gICAgPC9saT5cbiAgPC91bD5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZSBzY29wZWQ+XG4gIHVsIHtcbiAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG4gICAgcGFkZGluZzogNXB4O1xuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgzMTVkZWcsICM0MmQzOTIgMjUlLCAjNjQ3ZWZmKTtcbiAgfVxuICBsaSB7XG4gICAgcGFkZGluZzogNXB4IDIwcHg7XG4gICAgbWFyZ2luOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gIH1cbjwvc3R5bGU+In0=)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBGYW5jeUxpc3QgZnJvbSAnLi9GYW5jeUxpc3QudnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIEZhbmN5TGlzdFxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8RmFuY3lMaXN0IGFwaS11cmw9XCJ1cmxcIiA6cGVyLXBhZ2U9XCIxMFwiPlxuICAgIDx0ZW1wbGF0ZSAjaXRlbT1cInsgYm9keSwgdXNlcm5hbWUsIGxpa2VzIH1cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpdGVtXCI+XG4gICAgICAgIDxwPnt7IGJvZHkgfX08L3A+XG4gICAgICAgIDxwIGNsYXNzPVwibWV0YVwiPmJ5IHt7IHVzZXJuYW1lIH19IHwge3sgbGlrZXMgfX0gbGlrZXM8L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L3RlbXBsYXRlPlxuICA8L0ZhbmN5TGlzdD5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZSBzY29wZWQ+XG4ubWV0YSB7XG4gIGZvbnQtc2l6ZTogMC44ZW07XG4gIGNvbG9yOiAjNDJiODgzO1xufVxuPC9zdHlsZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiRmFuY3lMaXN0LnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BzOiBbJ2FwaS11cmwnLCAncGVyLXBhZ2UnXSxcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IFtdXG4gICAgfVxuICB9LFxuICBtb3VudGVkKCkge1xuICAgIC8vIG1vY2sgcmVtb3RlIGRhdGEgZmV0Y2hpbmdcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaXRlbXMgPSBbXG4gICAgICAgIHsgYm9keTogJ1Njb3BlZCBTbG90cyBHdWlkZScsIHVzZXJuYW1lOiAnRXZhbiBZb3UnLCBsaWtlczogMjAgfSxcbiAgICAgICAgeyBib2R5OiAnVnVlIFR1dG9yaWFsJywgdXNlcm5hbWU6ICdOYXRhbGlhIFRlcGx1aGluYScsIGxpa2VzOiAxMCB9XG4gICAgICBdXG4gICAgfSwgMTAwMClcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHVsPlxuICAgIDxsaSB2LWlmPVwiIWl0ZW1zLmxlbmd0aFwiPlxuICAgICAgTG9hZGluZy4uLlxuICAgIDwvbGk+XG4gICAgPGxpIHYtZm9yPVwiaXRlbSBpbiBpdGVtc1wiPlxuICAgICAgPHNsb3QgbmFtZT1cIml0ZW1cIiB2LWJpbmQ9XCJpdGVtXCIvPlxuICAgIDwvbGk+XG4gIDwvdWw+XG48L3RlbXBsYXRlPlxuXG48c3R5bGUgc2NvcGVkPlxuICB1bCB7XG4gICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xuICAgIHBhZGRpbmc6IDVweDtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMzE1ZGVnLCAjNDJkMzkyIDI1JSwgIzY0N2VmZik7XG4gIH1cbiAgbGkge1xuICAgIHBhZGRpbmc6IDVweCAyMHB4O1xuICAgIG1hcmdpbjogMTBweDtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICB9XG48L3N0eWxlPiJ9)

</div>

### Komponenty bez vykreslování {#renderless-components}

Příklad s `<FancyList>`, o kterém jsme hovořili výše, zapouzdřuje jak opakovaně použitelnou logiku (načítání dat, stránkování atd.), tak vizuální výstup, přičemž část vizuálního výstupu deleguje na komponentu rodiče prostřednictvím scoped slotů.

Pokud tento koncept posuneme ještě o něco dále, můžeme přijít s komponentami, které pouze zapouzdřují logiku a samy o sobě nic nevykreslují – vizuální výstup je plně delegován na komponentu rodiče s použitím scoped slotů. Tento typ komponenty nazýváme **komponenty bez vykreslování (renderless)**.

Příklad renderless komponenty může být taková, která zapouzdřuje logiku pro sledování aktuální polohy myši:

```vue-html
<MouseTracker v-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```

<div class="composition-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBNb3VzZVRyYWNrZXIgZnJvbSAnLi9Nb3VzZVRyYWNrZXIudnVlJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PE1vdXNlVHJhY2tlciB2LXNsb3Q9XCJ7IHgsIHkgfVwiPlxuICBcdE1vdXNlIGlzIGF0OiB7eyB4IH19LCB7eyB5IH19XG5cdDwvTW91c2VUcmFja2VyPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiTW91c2VUcmFja2VyLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYsIG9uTW91bnRlZCwgb25Vbm1vdW50ZWQgfSBmcm9tICd2dWUnXG4gIFxuY29uc3QgeCA9IHJlZigwKVxuY29uc3QgeSA9IHJlZigwKVxuXG5jb25zdCB1cGRhdGUgPSBlID0+IHtcbiAgeC52YWx1ZSA9IGUucGFnZVhcbiAgeS52YWx1ZSA9IGUucGFnZVlcbn1cblxub25Nb3VudGVkKCgpID0+IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB1cGRhdGUpKVxub25Vbm1vdW50ZWQoKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHVwZGF0ZSkpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8c2xvdCA6eD1cInhcIiA6eT1cInlcIi8+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="options-api">

[Vyzkoušejte si to](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBNb3VzZVRyYWNrZXIgZnJvbSAnLi9Nb3VzZVRyYWNrZXIudnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIE1vdXNlVHJhY2tlclxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8TW91c2VUcmFja2VyIHYtc2xvdD1cInsgeCwgeSB9XCI+XG4gIFx0TW91c2UgaXMgYXQ6IHt7IHggfX0sIHt7IHkgfX1cblx0PC9Nb3VzZVRyYWNrZXI+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJNb3VzZVRyYWNrZXIudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICB1cGRhdGUoZSkge1xuICAgICAgdGhpcy54ID0gZS5wYWdlWFxuICAgICAgdGhpcy55ID0gZS5wYWdlWVxuICAgIH1cbiAgfSxcbiAgbW91bnRlZCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy51cGRhdGUpXG4gIH0sXG4gIHVubW91bnRlZCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy51cGRhdGUpXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxzbG90IDp4PVwieFwiIDp5PVwieVwiLz5cbjwvdGVtcGxhdGU+In0=)

</div>

Ačkoliv je to zajímavý vzor, většinu toho, čeho lze dosáhnout s renderless komponentami, lze zajistit efektivněji s Composition API, aniž by to znamenalo dodatečnou režii dalšího vnořování komponent. Později uvidíme, jak můžeme implementovat stejnou funkci sledování myši ve formě [composable](/guide/reusability/composables.html).

Scoped sloty jsou ovšem stále užitečné v případech, kdy potřebujeme zapouzdřit logiku **a zároveň** tvořit vizuální výstup, jako v příkladu `<FancyList>`.
