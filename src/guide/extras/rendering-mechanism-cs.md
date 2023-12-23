---
outline: deep
---

# Mechanismus vykreslování {#rendering-mechanism}

Jak Vue převádí šablonu na skutečné DOM elementy? Jak Vue tyto uzly efektivně aktualizuje? Na tyto otázky se zde pokusíme odpovědět tím, že se ponoříme do vnitřního vykreslovacího mechanismu Vue.

## Virtuální DOM {#virtual-dom}

O termínu "virtuální DOM" jste již pravděpodobně slyšeli. Na něm je vykreslovací systém Vue založený.

Virtuální DOM (VDOM) je programovací koncept, kde je ideální, neboli "virtuální", reprezentace UI uchovávána v paměti a synchronizována s "reálným" DOM. Tento koncept byl vyvinutý v rámci [Reactu](https://reactjs.org/) a byl s různými implementacemi převzat mnoha dalšími frameworky, včetně Vue.

Virtuální DOM je spíše vzor než konkrétní technologie, takže neexistuje jedna kanonická implementace. Můžeme si to ilustrovat na jednoduchém příkladu:

```js
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* další elementy (vnodes) */
  ]
}
```

Zde je `vnode` obyčejný JavaScriptový objekt (tzv. "virtuální uzel"), který reprezentuje element `<div>`. Obsahuje veškeré informace, které potřebujeme k vytvoření skutečného elementu. Obsahuje také další potomky vnodes, což z něj činí root virtuálního DOM stromu.

Vykreslovací modul může procházet virtuálním DOM stromem a vytvářet z něj skutečný DOM strom. Tento proces se nazývá **mount** ("připojení").

Pokud máme dvě kopie virtuálních DOM stromů, vykreslovací modul je také může procházet a porovnávat, zjišťovat rozdíly a aplikovat tyto změny na skutečný DOM. Tento proces se nazývá **patch** ("aktualizace"), také známý jako "diffing" nebo "reconciliation".

Hlavní výhodou virtuálního DOM je, že umožňuje vývojáři programově zakládat, prohlížet a skládat požadované struktury UI deklarativním způsobem, zatímco přímá manipulace s DOM je ponechána na vykreslovacím modulu.

## Vykreslovací pipeline {#render-pipeline}

V globálním pohledu se při připojování Vue komponenty děje následující:

1. **Kompilace**: Vue šablony jsou kompilovány do **funkcí pro vykreslování**: funkcí, které vrací virtuální DOM stromy. Tento krok lze provést buď předem v rámci build fáze, nebo on-the-fly pomocí runtime kompilátoru.

2. **Mount**: Během spouštění vykreslovacího modulu jsou volány funkce pro vykreslování, prochází se vrácený virtuální DOM strom a na jeho základě jsou vytvořeny skutečné DOM elementy. Tento krok se provádí jako [reaktivní efekt](./reactivity-in-depth), takže sleduje všechny použité reaktivní závislosti.

3. **Patch**: Pokud se během vykreslování změní nějaká závislost, efekt se spustí znovu. Tentokrát je vytvořen nový aktualizovaný virtuální DOM strom. Vykreslovací modul prochází nový strom, porovnává ho s tím starým a aplikuje potřebné aktualizace na skutečný DOM.

![Vykreslovací pipeline](./images/render-pipeline.png)

<!-- https://www.figma.com/file/elViLsnxGJ9lsQVsuhwqxM/Rendering-Mechanism -->

## Šablony vs. Funkce pro vykreslování{#templates-vs-render-functions}

Vue šablony jsou kompilovány do funkcí pro vykreslování virtuálního DOM. Vue také poskytuje API, která nám umožňují přeskočit krok kompilace šablony a přímo vytvářet funkce pro vykreslování. Tyto funkce jsou flexibilnější než šablony při práci s více dynamickou logikou, protože můžete pracovat s vnodes s využitím plné síly JavaScriptu.

Proč tedy Vue primárně doporučuje šablony? Existuje několik důvodů:

1. Šablony jsou blíže skutečnému HTML. To usnadňuje znovupoužití existujících HTML fragmentů, aplikaci osvěčených postupů pro přístupnost, stylování pomocí CSS a je to lepší pro porozumění a úpravy ze strany designérů.

2. Šablony jsou snáze staticky analyzovatelné díky své deterministické syntaxi. To umožňuje kompilátoru Vue šablon provádět v době kompilace mnoho optimalizací, aby se zlepšil výkon virtuálního DOM (o čemž se budeme bavit níže).

V praxi jsou šablony dostatečné pro většinu použití v aplikacích. Funkce pro vykreslování se obvykle používají pouze ve znovupoužitelných komponentech, které potřebují pracovat s více dynamickou vykreslovací logikou. Použití těchto funkcí je podrobněji popsáno v průvodci [Funkce pro vykresování a JSX](./render-function).

## Kompilátorem informovaný virtuální DOM {#compiler-informed-virtual-dom}

Implementace virtuálního DOM v Reactu a většině dalších implementací virtuálního DOM jsou čistě runtime: srovnávací algoritmus nemůže předpokládat nic o přicházejícím virtuálním DOM stromu, takže musí strom plně procházet a porovnávat vlastnosti každého vnode, aby zajistil správnost. Navíc, i když se část stromu nikdy nemění, jsou pro ni při každém překreslení vždy vytvářeny nové vnodes, což vede k zbytečnému zatížení paměti. To je jedna z nejvíce kritizovaných stránek virtuálního DOM: poněkud hrubý proces srovnávání obětuje efektivitu ve prospěch deklarativnosti a správnosti.

Ale nemusí to tak být. Ve Vue ovládá framework jak kompilátor, tak běhové prostředí. To nám umožňuje implementovat mnoho optimalizací prováděných při kompilaci, které může využít pouze pevně svázaný renderer. Kompilátor může staticky analyzovat šablonu a v generovaném kódu ponechávat nápovědy, aby běhové prostředí mohlo využívat zkratky, kdykoliv je to možné. Zároveň stále zachováváme možnost, aby uživatel přešel na úroveň funkce pro vykreslování a získal tak v okrajových případech přímější kontrolu. Tento hybridní přístup nazýváme **Kompilátorem informovaný virtuální DOM** ("Compiler-Informed Virtual DOM").

Níže budeme mluvit o několika hlavních optimalizacích provedených kompilátorem Vue šablon pro zlepšení runtime výkonu virtuálního DOM.

### Statický hoisting {#static-hoisting}

Velmi často se v šabloně budou nacházet části, které neobsahují žádné dynamické vazby:

```vue-html{2-3}
<div>
  <div>foo</div> <!-- vytaženo (hoisted) -->
  <div>bar</div> <!-- vytaženo (hoisted) -->
  <div>{{ dynamic }}</div>
</div>
```

[Prozkoumat v Template Exploreru](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2PmZvbzwvZGl2PiA8IS0tIGhvaXN0ZWQgLS0+XG4gIDxkaXY+YmFyPC9kaXY+IDwhLS0gaG9pc3RlZCAtLT5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj5cbiIsIm9wdGlvbnMiOnsiaG9pc3RTdGF0aWMiOnRydWV9fQ==)

Div elementy `foo` a `bar` jsou statické - znovu vytvářet vnodes a porovnávat je při každém překreslení je zbytečné. Vue kompilátor automaticky vytáhne volání tvorby jejich vnodes z funkce pro vykreslování a při každém překreslení použije stejné vnodes znovu. Renderer také dokáže úplně přeskočit jejich porovnávání, když si všimne, že starý a nový vnode je ten samý.

Kromě toho, když je dostatek po sobě jdoucích statických elementů, budou sloučeny do jednoho "statického vnode", který obsahuje prostý HTML řetězec pro všechny tyto elementy ([Příklad](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)). Tyto statické vnodes jsou připojeny přímo atributem `innerHTML`. Také si na počátečním připojení cachují odpovídající DOM elementy - pokud je stejný obsah použit jinde v aplikaci, jsou vytvořeny nové DOM elementy pomocí nativní funkce `cloneNode()`, což je extrémně efektivní.

### Patch Flags {#patch-flags}

Pro jediný element s dynamickými vazbami můžeme také v době kompilace odvodit mnoho informací:

```vue-html
<!-- pouze vazba na třídu -->
<div :class="{ active }"></div>

<!-- pouze vazby na `id` a `value` -->
<input :id="id" :value="value">

<!-- pouze textové potomky -->
<div>{{ dynamic }}</div>
```

[Prozkoumat v Template Exploreru](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2IDpjbGFzcz1cInsgYWN0aXZlIH1cIj48L2Rpdj5cblxuPGlucHV0IDppZD1cImlkXCIgOnZhbHVlPVwidmFsdWVcIj5cblxuPGRpdj57eyBkeW5hbWljIH19PC9kaXY+)

Při generování kódu funkce pro vykreslování těchto prvků Vue zakóduje typ aktualizace, kterou každý z nich potřebuje, přímo ve volání vytváření vnode:

```js{3}
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* CLASS */)
```

Poslední argument, `2`, je [patch flag](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts). Prvek může mít více patch flags, které se sloučí do jednoho čísla. Runtime renderer pak může pomocí [bitových operací](https://en.wikipedia.org/wiki/Bitwise_operation) flagy kontrolovat a určit, zda je třeba provést určitou akci:

```js
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // aktualizovat třídu prvku
}
```

Bitové kontroly jsou extrémně rychlé. Díky patch flags je Vue schopno provést nejmenší možné množství práce při aktualizaci elementů s dynamickými vazbami.

Vue také zakóduje typ potomků, které vnode obsahuje. Například šablona s více root elementy je reprezentována jako fragment. Většinou víme jistě, že se pořadí těchto  root elementů nikdy nezmění, takže tato informace může být také předána do runtime jako patch flag:

```js{4}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* potomci */
  ], 64 /* STABLE_FRAGMENT */))
}
```

Runtime renderer tak může kontrolu pořadí potomků u root fragmentu úplně vynechat.

### Zploštění stromu {#tree-flattening}

Při podrobnějším pohledu na vygenerovaný kód z předchozího příkladu si všimnete, že root virtuálního DOM stromu je vytvořen pomocí speciálního volání `createElementBlock()`:

```js{2}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

Konceptuálně je "blok" částí šablony, která má stabilní vnitřní strukturu. V tomto případě má celá šablona jediný blok, protože neobsahuje žádné strukturální direktivy jako `v-if` a `v-for`.

Každý blok sleduje všechny elementy potomků (nejen přímé potomky), kteří mají příznaky opravy. Například:

```vue-html{3,5}
<div> <!-- root blok -->
  <div>...</div>         <!-- není sledován -->
  <div :id="id"></div>   <!-- je sledován -->
  <div>                  <!-- není sledován -->
    <div>{{ bar }}</div> <!-- je sledován -->
  </div>
</div>
```

Výsledkem je redukované pole, které obsahuje pouze dynamické potomky:

```plaintext
div (root blok)
- div s vazbou :id
- div s vazbou {{ bar }}
```

Když je třeba tuto komponentu znovu vykreslit, stačí projít zploštělým stromem místo celého stromu. Toto se nazývá **Zploštění stromu** ("tree flattening") a výrazně snižuje počet elementů, které je třeba projít při srovnávání virtuálního DOM. Jakékoliv statické části šablony jsou reálně přeskočeny.

Direktivy `v-if` a `v-for` vytvoří nové blokové elementy:

```vue-html
<div> <!-- root blok -->
  <div>
    <div v-if> <!-- blok pro v-if -->
      ...
    <div>
  </div>
</div>
```

Blok potomka je sledován v poli dynamických potomků rodičovského bloku. To zachovává stabilní strukturu pro blok rodiče.

### Vliv na hydrataci při SSR {#impact-on-ssr-hydration}

Jak příznaky opravy, tak zploštění stromu také výrazně zlepšují výkon [Vue hydratace při SSR](/guide/scaling-up/ssr#client-hydration):

- Hydratace jediného prvku může využít rychlé cesty na základě patch flag odpovídajícího vnode.

- Při hydrataci je potřeba procházet pouze blokové elementy a jejich dynamické potomky, čímž se efektivně dosahuje částečné hydratace na úrovni šablony.
