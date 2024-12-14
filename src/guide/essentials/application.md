# Vytvoření Vue aplikace {#creating-a-vue-application}

## Instance aplikace {#the-application-instance}

Každá Vue aplikace začíná vytvořením nové **instance** pomocí funkce [`createApp`](/api/application#createapp):

```js
import { createApp } from 'vue'

const app = createApp({
  /* nastavení root komponenty */
})
```

## Root komponenta {#the-root-component}

Objekt, který posílíme do funkce `createApp` je ve skutečnosti komponenta. Každá aplikace potřebuje „root komponentu“, která může obsahovat další komponenty a jejich potomky.

Pokud používáte Single-File komponenty (SFC), typicky importujeme kořenovou komponentu z jiného souboru:

```js
import { createApp } from 'vue'
// import root komponenty App ze Single-File komponenty (SFC)
import App from './App.vue'

const app = createApp(App)
```

I když mnoha příkladům v tomto průvodci stačí pouze jediná komponenta, většina skutečných aplikací je organizována do stromu vnořených, znovupoužitelných komponent. Strom komponent aplikace Todo může vypadat například takto:

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

## Připojení Vue aplikace {#mounting-the-app}

Instance aplikace nic nevykreslí, dokud není zavolána její funkce `.mount()`. Funkce jako svůj parametr očekává „kontejner“, což může být buď skutečný DOM element, nebo řetězec CSS selektoru:

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

Obsah root komponenty aplikace bude vykreslen uvnitř zadaného kontejneru. Samotný element kontejneru není za součást aplikace považován.

Funkce `.mount()` by měla být vždy volána po dokončení všech aplikačních konfigurací a&nbsp;registrací zdrojů. Všimněte si, že narozdíl od funkcí pro registraci zdrojů je její návratovou hodnotou instance root komponenty namísto instance aplikace.

### In-DOM šablona root komponenty {#in-dom-root-component-template}

Šablona root komponenty je většinou součástí komponenty samotné. Mžeme však šablonu poskytnout i samostatně, pokud ji zapíšeme přímo do elementu určeného pro připojení komponenty (mount container):

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

Pokud root komponenta ještě nemá vlastní nastavení `template`, Vue automaticky použije jako šablonu atribut `innerHTML` kontejneru.

In-DOM šablony jsou často používány v aplikacích, které [používají Vue bez build fáze](/guide/quick-start.html#using-vue-from-cdn). Mohou být také použity ve spojení se server-side frameworky, kde může být root šablona dynamicky generována serverem.

## Nastavení aplikace {#app-configurations}

Instance aplikace vystavuje objekt `.config`, jenž nám umožňuje nakonfigurovat několik globálních nastavení, například definovat globální hadler pro obsluhu chyb, který zachycuje chyby ze všech komponent potomků:

```js
app.config.errorHandler = (err) => {
  /* zpracovat chybu */
}
```

Instance aplikace také poskytuje několik funkcí pro registraci globálních zdrojů. Například registraci komponenty:

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

Díky tomu je `TodoDeleteButton` dostupný pro použití kdekoli v naší aplikaci. Registraci komponent a dalších typů zdrojů se budeme více věnovat v dalších částech průvodce. Můžete si také projít úplný seznam API funkcí instance aplikace v [API referenci](/api/application).

Ujistěte se, že jste všechny aplikační konfigurace použili před voláním funkce `.mount()`!

## Více aplikačních instancí {#multiple-application-instances}

Nejste omezeni na jednu instanci aplikace na jedné stránce. API `createApp` umožňuje koexistenci více Vue aplikací na stejné stránce, z nichž každá má svůj vlastní scope pro konfiguraci a globální zdroje:

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

Pokud používáte Vue k obohacení HTML generovaného na serveru a potřebujete ho pouze k ovládání konkrétních částí velké stránky, vyhněte se připojení (mount) jediné instance Vue aplikace na celou stránku. Místo toho vytvořte několik malých aplikačních instancí a připojte je k elementům, za které jsou zodpovědné.
