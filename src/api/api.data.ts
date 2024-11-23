// api.data.ts
import fs from 'fs'
import path from 'path'
import type { MultiSidebarConfig } from '@vue/theme/src/vitepress/config.ts'
import { sidebar } from '../../.vitepress/config'

// Interface, který definuje strukturu jednoho API nadpisu
interface APIHeader {
  anchor: string
  text: string
}

// Interface, kter definuje strukturu API skupiny s textem, odkazem a polem objektů
export interface APIGroup {
  text: string
  anchor: string
  items: {
    text: string
    link: string
    headers: APIHeader[]
  }[]
}

// Deklarace typu pro vyhodnocené API skupiny
export declare const data: APIGroup[]

// Utility funkce pro vygenerování "slug" odkazu z řetězce (používaná pro odkazy (#anchors) na stránce)
function slugify(text: string): string {
  return (
    text
      // nahradit speciální znaky a mezery pomlčkami
      .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g, '-')
      // odstranit vícenásobné pomlčky
      .replace(/-{2,}/g, '-')
      // odstranit pomlčky na začátku a na konci
      .replace(/^-+|-+$/g, '')
      // ujistit se, že hodnota nezačíná číslem (např. #121)
      .replace(/^(\d)/, '_$1')
      // převést na lowercase
      .toLowerCase()
  )
}

// Utility funkce na načtení nadpisů z markdown souboru na předaném odkazu
function parsePageHeaders(link: string): APIHeader[] {
  const fullPath = path.join(__dirname, '../', link) + '.md' // vyhodnotit úplnou cestu k souboru
  const timestamp = fs.statSync(fullPath).mtimeMs // získat čas poslední modifikace souboru

  // kontrola, jestli je soubor uložen v cache a jestli čas poslední modifikace odpovídá
  const cached = headersCache.get(fullPath)
  if (cached && timestamp === cached.timestamp) {
    return cached.headers // vrátit uložené nadpisy, když jsou akutální
  }

  const src = fs.readFileSync(fullPath, 'utf-8') // číst markdown soubor
  const headers = extractHeadersFromMarkdown(src) // získat nadpisy z obsahu 

  // uložit získané nadpisy spolu s datem poslední modifikace do cache
  headersCache.set(fullPath, {
    timestamp,
    headers
  })

  return headers
}

// Pomocná funkce na získání všech nadpisů (h2) z markdown obsahu
function extractHeadersFromMarkdown(src: string): APIHeader[] {
  const h2s = src.match(/^## [^\n]+/gm) // získat všechny h2 nadpisy (## nadpis)
  const anchorRE = /\{#([^}]+)\}/ // regulární výraz pro načtení odkazu (např.: {#some-anchor})
  let headers: APIHeader[] = []

  if (h2s) {
    // zpracovat každý h2 nadpis a získat text + odkaz
    headers = h2s.map((h) => {
      const text = cleanHeaderText(h, anchorRE) // vyčistit text nadpsisu
      const anchor = extractAnchor(h, anchorRE, text) // extrahovat nebo vygenerovat odkaz
      return { text, anchor }
    })
  }

  return headers
}

// Pomocná funkce pro vyčištění texu nadpisu (např. odstranit superscript či formátování kódu)
function cleanHeaderText(h: string, anchorRE: RegExp): string {
  return h
    .slice(2) // odstranit "##" část
    .replace(/<sup class=.*/, '') // odstranit superscript (např. tagy <sup>)
    .replace(/\\</g, '<') // dekódovat escape znaky jako \<
    .replace(/`([^`]+)`/g, '$1') // odstranit inline formátování (např. `code`)
    .replace(anchorRE, '') // odstranit tagy odkazů (např. {#anchor})
    .trim() // oříznout prázdné  znaky na začátku a na konci
}

// Pomocná funkce pro extrahování odkazu z nadpisu (nebo generování nového, pokud neexistuje)
function extractAnchor(h: string, anchorRE: RegExp, text: string): string {
  const anchorMatch = h.match(anchorRE) // načíst odkaz, pokud existuje
  return anchorMatch?.[1] ?? slugify(text) // pokud odkaz neexistuje, vygenerovat nový přes `slugify`
}

// Cache pro ukládání nadpisů a jim odpovídajících časů poslední modifikace pro omezení znovu načítání souborů
const headersCache = new Map<
  string,
  {
    headers: APIHeader[]
    timestamp: number
  }
>()

// Hlavní funkce pro načítání API dat
export default {
  // deklarace souborů, které mají vyvolat HMR
  watch: './*.md',
  
  // načíst API data a zpracovat objekty na postranní liště
  load(): APIGroup[] {
    // generovat data API skupiny zpracováním konfigurace lišty
    return (sidebar as MultiSidebarConfig)['/api/'].map((group) => ({
      text: group.text, // text pro skupinu (např. 'API')
      anchor: slugify(group.text), // generovat odkaz pro název skupiny
      items: group.items.map((item) => ({
        ...item, // původní vlastnosti objektu
        headers: parsePageHeaders(item.link), // zpracovat nadpisy z markdown odkazu
      }))
    }))
  }
}