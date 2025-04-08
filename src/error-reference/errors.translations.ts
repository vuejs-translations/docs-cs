export const translatedRuntimeErrors = [
  { code: '0', translation: 'funkce pro setup' }, // /* setup function */
  { code: '1', translation: 'funkce pro vykreslení' }, // /* render function */
  { code: '2', translation: 'getter v rámci watcheru' }, // /* watcher getter */
  { code: '3', translation: 'callback funkce watcheru' }, // /* watcher callback */
  { code: '4', translation: 'cleanup funkce watcheru' }, // /* watcher cleanup function */
  { code: '5', translation: 'nativní event handler' }, // /* native event handler */
  { code: '6', translation: 'event handler komponenty' }, /* component event handler */
  { code: '7', translation: 'hook pro VNode' }, /* vnode hook */
  { code: '8', translation: 'hook pro direktivu' }, /* directive hook */
  { code: '9', translation: 'hook pro tranzici' }, /* transition hook */
  { code: '10', translation: 'chyba na úrovni aplikace' }, /* app errorHandler */
  { code: '11', translation: 'warning na úrovni aplikace' }, /* app warnHandler */
  { code: '12', translation: 'funkce \'ref\'' }, /* ref function */
  { code: '13', translation: 'načítání asynchronní komponenty' }, /* async component loader */
  { code: '14', translation: 'funkce flush v rámci scheduleru' }, /* scheduler flush */
  { code: '15', translation: 'update komponenty' }, /* component update */
  { code: '16', translation: 'cleanup funkce při odpojení komponenty' }, /* app unmount cleanup function */
  { code: 'sp', translation: 'metoda \'serverPrefetch\' životního cyklu komponenty' }, /* serverPrefetch hook */
  { code: 'bc', translation: 'metoda \'beforeCreate\' životního cyklu komponenty' }, /* beforeCreate hook */
  { code: 'c', translation: 'metoda \'created\' životního cyklu komponenty' }, /* created hook */
  { code: 'bm', translation: 'metoda \'beforeMount\' životního cyklu komponenty' }, /* beforeMount hook */
  { code: 'm', translation: 'metoda \'mounted\' životního cyklu komponenty' }, /* mounted hook */
  { code: 'bu', translation: 'metoda \'beforeUpdate\' životního cyklu komponenty' }, /* beforeUpdate hook */
  { code: 'u', translation: 'metoda \'updated\' životního cyklu komponenty' }, /* updated */
  { code: 'bum', translation: 'metoda \'beforeUnmount\' životního cyklu komponenty' }, /* beforeUnmount hook */
  { code: 'um', translation: 'metoda \'unmounted\' životního cyklu komponenty' }, /* unmounted hook */
  { code: 'a', translation: 'metoda \'activated\' životního cyklu komponenty' }, /* activated hook */
  { code: 'da', translation: 'metoda \'deactivated\' životního cyklu komponenty' }, /* deactivated hook */
  { code: 'ec', translation: 'metoda \'errorCaptured\' životního cyklu komponenty' }, /* errorCaptured hook */
  { code: 'rtc', translation: 'metoda \'renderTracked\' životního cyklu komponenty' }, /* renderTracked hook */
  { code: 'rtg', translation: 'metoda \'renderTriggered\' životního cyklu komponenty' }, /* renderTriggered hook */
]

export const translatedCompilerErrors = [
 { code: '0', translation: 'Nepovolený komentář.' }, // Illegal comment.	
 { code: '1', translation: 'Sekce DATA je povolena pouze v\xa0XML obsahu.' }, // CDATA section is allowed only in XML context.	
 { code: '2', translation: 'Duplicitní atribut.' }, // Duplicate attribute.	
 { code: '3', translation: 'Koncový tag nemůže obsahovat atributy.' }, // End tag cannot have attributes.	
 { code: '4', translation: 'Nepovolené \'/\' uvnitř tagů.' }, // Illegal '/' in tags.	
 { code: '5', translation: 'Neočekávaný konec souboru uvnitř tagu.' }, // Unexpected EOF in tag.	
 { code: '6', translation: 'Neočekávaný konec souboru uvnitř sekce CDATA.' }, // 	Unexpected EOF in CDATA section.	
 { code: '7', translation: 'Neočekávaný konec souboru uvnitř komentáře.' }, // Unexpected EOF in comment.	
 { code: '8', translation: 'Neočekávaný konec souboru uvnitř skriptu.' }, // Unexpected EOF in script.	
 { code: '9', translation: 'Neočekávaný konec souboru uvnitř tagu.' }, // Unexpected EOF in tag.	
 { code: '10', translation: 'Nesprávně uzavřený komentář.' }, // Incorrectly closed comment.	
 { code: '11', translation: 'Nesprávně otevřený komentář.' }, // Incorrectly opened comment.	
 { code: '12', translation: 'Nepovolený název tagu. Pro zobrazení \'<\' použijte \'&lt;\'.' }, // Illegal tag name. Use '&lt;' to print '<'.	
 { code: '13', translation: 'Byla očekávána hodnota atributu.' }, // Attribute value was expected.	
 { code: '14', translation: 'Byl očekáván název koncového tagu.' }, // End tag name was expected.	
 { code: '15', translation: 'Byl očekáván bílý znak.' }, // Whitespace was expected.	
 { code: '16', translation: 'Neočekávané \'<!--\' v\xa0komentáři.' }, // Unexpected '<!--' in comment.	
 { code: '17', translation: 'Název atributu nemůže obsahovat znaky U+0022 ("), U+0027 (\') a\xa0U+003C\xa0(<).' }, // Attribute name cannot contain U+0022 ("), U+0027 ('), and U+003C (<).	
 { code: '18', translation: 'Hodnota atributu bez uvozovek nemůže obsahovat znaky U+0022\xa0("), U+0027 (\'), U+003C (<), U+003D (=) a U+0060 (`).' }, // Unquoted attribute value cannot contain U+0022 ("), U+0027 ('), U+003C (<), U+003D (=), and U+0060 (`).	
 { code: '19', translation: 'Název atributu nemůže začínat znakem \'=\'.' }, // Attribute name cannot start with '='.	
 { code: '20', translation: 'Neočekávaný znak \'null\'.' }, // Unexpected null character.	
 { code: '21', translation: '\'<?\' je povoleno pouze v\xa0XML obsahu.' }, // '<?' is allowed only in XML context.	
 { code: '22', translation: 'Nepovolené \'/\' uvnitř tagů.' }, // Illegal '/' in tags.	
 { code: '23', translation: 'Neplatný koncový tag.' }, // Invalid end tag.	
 { code: '24', translation: 'Elementu chybí koncový tag.' }, // Element is missing end tag.	
 { code: '25', translation: 'Nebylo nalezeno znaménko pro ukončení interpolace.' }, // Interpolation end sign was not found.	
 { code: '26', translation: 'Byl očekáván platný název direktivy.' }, // Legal directive name was expected.	
 { code: '27', translation: 'Nebyla nalezena koncová závorka pro dynamický parametr direktivy. Pamatujte, že dynamický parametr direktivy nemůže obsahovat mezery.' }, // End bracket for dynamic directive argument was not found. Note that dynamic directive argument cannot contain spaces.	
 { code: '28', translation: 'Direktiva v-if/v-else-if postrádá hodnotu.' }, // v-if/v-else-if is missing expression.	
 { code: '29', translation: 'Větve v-if/else musí používat unikátní klíče.' }, // v-if/else branches must use unique keys.	
 { code: '30', translation: 'Direktiva v-else/v-else-if nemá související v-if nebo v-else-if.' }, // v-else/v-else-if has no adjacent v-if or v-else-if.	
 { code: '31', translation: 'Direktiva v-for postrádá hodnotu.' }, // v-for is missing expression.	
 { code: '32', translation: 'Direktiva v-for obsahuje neplatný výraz.' }, // v-for has invalid expression.	
 { code: '33', translation: 'Klíč pro <template v-for> má být umístěn na tagu <template>.' }, // <template v-for> key should be placed on the <template> tag.	
 { code: '34', translation: 'Direktiva v-bind postrádá hodnotu.' }, // v-bind is missing expression.	
 { code: '35', translation: 'Direktiva v-on postrádá hodnotu.' }, // v-on is missing expression.	
 { code: '36', translation: 'Neočekávaná custom direktiva na tagu <slot>.' }, // Unexpected custom directive on <slot> outlet.	
 { code: '37', translation: 'Direktiva v-slot je použita jak na komponentu, tak na vnořený tag <template>. Pokud existuje více pojmenovaných slotů, všechny sloty by měly použít <template> syntaxi, aby se předešlo nejasnostem ohledně platnosti rozsahů.' }, // Mixed v-slot usage on both the component and nested <template>. When there are multiple named slots, all slots should use <template> syntax to avoid scope ambiguity.	
 { code: '38', translation: 'Nalezeny duplicitní názvy slotů.' }, // Duplicate slot names found.	
 { code: '39', translation: 'Byly nalezeny nadbytečné elementy potomků, ačkoliv komponenta obsahuje explicitně pojmenovaný výchozí slot. Tito potomci budou ignorováni.' }, // Extraneous children found when component already has explicitly named default slot. These children will be ignored.	
 { code: '40', translation: 'Direktiva v-slot může být použita pouze na komponenty nebo tagy <template>.' }, // v-slot can only be used on components or <template> tags.	
 { code: '41', translation: 'Direktiva v-model postrádá hodnotu.' }, // v-model is missing expression.	
 { code: '42', translation: 'Hodnota v-model musí být platný JavaScript výraz.' }, // v-model value must be a valid JavaScript member expression.	
 { code: '43', translation: 'Direktivu v-model nelze použít na proměnné rozsahu v-for nebo v-slot, protože do nich nelze zapisovat.' }, // v-model cannot be used on v-for or v-slot scope variables because they are not writable.	
 { code: '44', translation: 'Direktivu v-model nelze použít na vlastnost (prop), protože do lokálních vlastností nelze zapisovat. Použijte místo toho v-bind v kombinaci s v-on listenerem, který emituje událost update:x.' }, // v-model cannot be used on a prop, because local prop bindings are not writable. Use a v-bind binding combined with a v-on listener that emits update:x event instead.	
 { code: '45', translation: 'Chyba při parsování JavaScript výrazu.' }, // Error parsing JavaScript expression:	
 { code: '46', translation: 'Komponenta <KeepAlive> očekává právě jednu komponentu potomka.' }, // <KeepAlive> expects exactly one child component.	
 { code: '47', translation: 'Možnost "prefixIdentifiers" není v\xa0tomto buildu kompilátoru podporována.' }, // "prefixIdentifiers" option is not supported in this build of compiler.	
 { code: '48', translation: 'Mód pro ES moduly není v tomto buildu kompilátoru podporován.' }, // ES module mode is not supported in this build of compiler.	
 { code: '49', translation: 'Možnost "cacheHandlers" je podporována pouze, pokud je zapnuta možnost "prefixIdentifiers".' }, // "cacheHandlers" option is only supported when the "prefixIdentifiers" option is enabled.	
 { code: '50', translation: 'Možnost "scopeId" je podporována pouze v módu (ES) modulů.' }, // "scopeId" option is only supported in module mode.	
 { code: '51', translation: 'Hooky @vnode-* už nejsou v\xa0šablonách podporovány. Použijte místo toho prefix vue:*. Např.:\xa0@vnode-mounted by se mělo změnit na @vue:mounted. Podpora\xa0@vnode-* hooků byla odstraněna ve verzi 3.4.' }, // @vnode-* hooks in templates are no longer supported. Use the vue: prefix instead. For example, @vnode-mounted should be changed to @vue:mounted. @vnode-* hooks support has been removed in 3.4.	
 { code: '52', translation: 'Direktiva v-bind se zkráceným zápisem stejného jména umožňuje pouze statické hodnoty.' }, // v-bind with same-name shorthand only allows static argument.	
 { code: '53', translation: 'Direktiva v-html postrádá hodnotu.' }, // v-html is missing expression.	
 { code: '54', translation: 'Direktiva v-html překryje elementy potomků.' }, // v-html will override element children.	
 { code: '55', translation: 'Direktiva v-text postrádá hodnotu.' }, // v-text is missing expression.	
 { code: '56', translation: 'Direktiva v-text překryje elementy potomků.' }, // v-text will override element children.	
 { code: '57', translation: 'Direktiva v-model může být použita pouze na elementy <input>, <textarea> a <select>.' }, // v-model can only be used on <input>, <textarea> and <select> elements.	
 { code: '58', translation: 'Hodnota direktivy v-model není podporována na ne-dynamických elementech.' }, // v-model argument is not supported on plain elements.	
 { code: '59', translation: 'Direktiva v-model nemůže být použita na vstupní elementy pro soubory, protože jsou read-only. Použijte místo toho v-on:change listener.' }, // v-model cannot be used on file inputs since they are read-only. Use a v-on:change listener instead.	
 { code: '60', translation: 'Nadbytečná vazba hodnoty použitá dohromady s v-model. Bude docházet k interferencím s chováním v-model.' }, // Unnecessary value binding used alongside v-model. It will interfere with v-model's behavior.	
 { code: '61', translation: 'Direktiva v-show postrádá hodnotu.' }, // v-show is missing expression.	
 { code: '62', translation: 'Komponenta <Transition> očekává právě jeden tag či komponentu potomka.' }, // <Transition> expects exactly one child element or component.	
 { code: '63', translation: 'Tagy s vedlejšími efekty (<script> a\xa0<style>) jsou v šablonách klientských komponent ignorovány.' }, // Tags with side effect (<script> and <style>) are ignored in client component templates.
]
