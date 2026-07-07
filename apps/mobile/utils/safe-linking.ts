import { Linking } from 'react-native'

// Les champs phone/website viennent de la DB (saisis par les établissements) :
// on n'ouvre jamais l'URL brute, seulement après validation du schéma, pour éviter
// qu'un enregistrement malveillant déclenche intent://, file:// ou un deep link tiers.
const ALLOWED_SCHEMES = ['http:', 'https:', 'tel:']

function getScheme(url: string): string | null {
  const match = url.match(/^([a-zA-Z][a-zA-Z\d+\-.]*):/)
  return match ? `${match[1].toLowerCase()}:` : null
}

function openSafeUrl(url: string) {
  const scheme = getScheme(url.trim())
  if (!scheme || !ALLOWED_SCHEMES.includes(scheme)) {
    console.warn(`Blocked attempt to open URL with unsafe scheme: ${url}`)
    return
  }
  Linking.openURL(url).catch((err) => console.error(err))
}

export function openWebsite(website: string) {
  const url = /^https?:\/\//i.test(website) ? website : `https://${website}`
  openSafeUrl(url)
}

export function openPhone(phone: string) {
  const sanitized = phone.replace(/[^0-9+\-() .]/g, '').trim()
  if (!sanitized) return
  openSafeUrl(`tel:${sanitized}`)
}
