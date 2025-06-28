# První kroky {#getting-started}

Vítejte u Vue tutoriálu!

Úkolem tohoto tutoriálu je rychle vám zprostředkovat, jaké je to pracovat s Vue přímo v prohlížeči. Nesnaží se být obsáhlý a nemusíte předem rozumět všemu. Jakmile ho však dokončíte, určitě si přečtěte také <a target="_blank" href="/guide/introduction.html">Průvodce</a>, který každé téma pokrývá více do hloubky.

## Předpoklady {#prerequisites}

Tutoriál předpokládá základní znalost HTML, CSS a JavaScriptu. Pokud je pro vás vývoj frontendu úplnou novinkou, není možná nejlepší nápad vrhnout se jako první rovnou na framework. Raději se napřed trochu seznamte se základy a teprve poté se vraťte zpět! Předchozí zkušenost s jinými frameworky pomůže, ale není nezbytná.

## Jak používat tento tutoriál {#how-to-use-this-tutorial}

Můžete editovat kód <span class="wide">napravo</span><span class="narrow">níže</span> a okamžitě uvidíte výsledek změny. Každý krok představí jednu základní funkcionalitu Vue a od vás se očekává, že doplníte kód, aby demo začalo fungovat. Pokud se zaseknete, bude k dispozici tlačítko „Ukázat řešení“, které pro vás výsledný kód odkryje. Pokuste se na něj příliš nespoléhat – budete se učit rychleji tím, že na to přijdete sami.

Pokud jste zkušený vývojář přecházející z Vue 2 nebo jiných frameworků, je zde několik nastavení, které můžete naladit tak, aby vám tento tutoriál byl co nejvíc užitečný. Pokud jste začátečník, doporučujeme pokračovat s výchozím nastavením.

<details>
<summary>Detaily možného nastavení</summary>

- Vue nabízí dva API styly: Options API a Composition API. Tento tutoriál jen navržen pro práci s oběma – můžete si vybrat preferovaný styl pomocí  **přepínače API preference** vlevo nahoře. <a target="_blank" href="/guide/introduction.html#api-styles">Zjistit víc o API stylech</a>.

- Můžete také přepínat mezi SFC-módem a HTML-módem. První z&nbsp;nich zobrazí příklady kódu ve formátu <a target="_blank" href="/guide/introduction.html#single-file-components">Single-File komponenty</a> (SFC), který používá většina vývojářů, pokud pracují s Vue s build fází. HTML-mód ukazuje použití bez build fáze.

<div class="html">

:::tip
Pokud ve vašich aplikacích chcete používat HTML-mód bez build fáze, ujistěte se, že buďto uvnitř vašich skriptů změníte importy na:

```js
import { ... } from 'vue/dist/vue.esm-bundler.js'
```

 nebo nastavíte build tool, aby odpovídajícím způsobem vyhodnocoval import z `vue`. Ukázková konfigurace pro [Vite](https://vitejs.dev/) je zde:

```js [vite.config.js]
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

Pro více informací se podívejte se na příslušnou [sekci v průvodci o&nbsp;Nástrojích](/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation).
:::

</div>

</details>

Připraveni? Klikněte na „Další“ pro zahájení výuky.
