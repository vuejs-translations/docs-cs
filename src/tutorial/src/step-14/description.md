# Slots {#slots}

Kromě předávání dat prostřednictvím vlastností (props) může komponenta rodiče také předávat fragmenty šablony komponentě potomka prostřednictvím slotů (**slots**):

<div class="sfc">

```vue-html
<ChildComp>
  Toto je obsah ve slotu!
</ChildComp>
```

</div>
<div class="html">

```vue-html
<child-comp>
  Toto je obsah ve slotu!
</child-comp>
```

</div>

V komponentně potomka může vykrelit obsah slotu z rodiče pomocí elementu `<slot>`:

<div class="sfc">

```vue-html
<!-- v šabloně potomka -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- v šabloně potomka -->
<slot></slot>
```

</div>

Obsah uvnitř tagu `<slot>` bude zpracován jako „záložní“ (fallback): zobrazí se, pokud komponenta rodiče nepředala slotu žádný obsah:

```vue-html
<slot>Záložní obsah</slot>
```

Momentálně žádný obsah slotu do `<ChildComp>` nepředáváme, takže byste měli vidět záložní obsah. Pojďme nějaký obsah slotu potomka poskytnout a zároveň využít proměnnou `msg` v rodiči.
