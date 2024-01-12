import { ref } from 'vue'

export default {
  setup() {
    // "ref" je reaktivní zdroj dat, který ukládá hodnotu.
    // Zde sice technicky nepotřebujeme obalovat string pomocí ref(),
    // abychom jej zobrazili, ale v příštím příkladu uvidíme,
    // proč je potřebný, pokud chceme hodnotu měnit.
    const message = ref('Ahoj, Vue!')

    return {
      message
    }
  }
}
