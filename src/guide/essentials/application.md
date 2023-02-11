# Vytvoření Vue aplikace {#creating-a-vue-application}

## Aplikační instance {#the-application-instance}

Každá Vue aplikace začíná vytvořením nové **Aplikační instance** pomocí funkce [`createApp`](/api/application#createapp):

```js
import { createApp } from 'vue'

const app = createApp({
  /* nastavení root kompomenty */
})
```

## Root komponenta {#the-root-component}

Objekt, který posílíme do funkce `createApp` je ve skutečnosti komponenta. Každá aplikace potřebuje "root komponentu", která může obsahovat další komponenty a jejich potomky.

Pokud používáte Single-File komponenty (SFC), typicky importujeme kořenovou komponentu z jiného souboru:

```js
import { createApp } from 'vue'
// import root komponenty App z single-file komponenty (SFC)
import App from './App.vue'

const app = createApp(App)
```

I když mnoho příkladů v tomto průvodci potřebuje pouze jedinou komponentu, většina skutečných aplikací je organizována do stromu vnořených, znovupoužitelných komponent. Strom komponent aplikace Todo může vypadat například takto:

```
App (root komponenta)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

V dalších částech průvodce probereme, jak definovat více komponent a skládat je dohromady. Předtím se zaměříme na to, co se děje uvnitř samostatné komponenty.

## Připojení (mount) Vue aplikace {#mounting-the-app}

Aplikační instance nic nevykreslí, dokud není zavolána její metoda `.mount()`. Metoda jako svůj parametr očekává „kontejner“, což může být buď skutečný prvek DOM, nebo řetězec selektoru:

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

Obsah root komponenty aplikace bude vykreslen uvnitř zadaného kontejneru. Samotný element kontejneru není považován za součást aplikace.

Metoda `.mount()` by měla být vždy volána po dokončení všech aplikačních konfigurací a registrací zdrojů. Všimněte si, že narozdíl od metod pro registraci zdrojů je její návratovou hodnotou instance root komponenty namísto aplikační instance.

### DOM-šablona root komponenty {#in-dom-root-component-template}

Při použití Vue bez build fáze můžeme zapsat šablonu naší root komponenty přímo do elementu kontejneru určeného pro připojení (mount):

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

Vue automaticky použije atribut `innerHTML` kontejneru jako šablonu, pokud root komponenta ještě nemá vlastní nastavení `template`.

## Nastavení aplikace {#app-configurations}

Aplikační instance vystavuje `.config` objekt, jenž nám umožňuje nakonfigurovat několik globálních nastavení, například definovat globální hadler pro obsluhu chyb, který zachycuje chyby ze všech podřízených komponent:

```js
app.config.errorHandler = (err) => {
  /* zpracovat chybu */
}
```

Aplikační instance také poskytuje několik metod pro registraci globálních zdrojů. Například registrace komponenty:

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

Díky tomu je `TodoDeleteButton` dostupný pro použití kdekoli v naší aplikaci. Registraci komponent a dalších typů zdrojů se budeme věnovat víc v dalších částech průvodce. Můžete si také projít úplný seznam API metod aplikační instance v [API referenci](/api/application).

Ujistěte se, že jste všechny aplikační konfigurace použili před voláním metody `.mount()`!

## Více aplikačních instancí {#multiple-application-instances}

Nejste omezeni na jednu aplikačních instanci na jedné stránce. API `createApp` umožňuje koexistenci více Vue aplikací na stejné stránce, z nichž každá má svůj vlastní scope pro konfiguraci a globální zdroje:

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

Pokud používáte Vue k obohacení HTML generovaného na serveru a potřebujete ho pouze k ovládání konkrétních částí velké stránky, vyhněte se připojení (mount) jediné aplikační instance Vue na celou stránku. Místo toho vytvořte několik malých aplikačních instancí a připojte je k prvkům, za které jsou zodpovědné.
