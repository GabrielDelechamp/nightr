// Les photos viennent de la table `photos` (URL saisie/liée par les établissements) :
// on ne charge que celles hébergées sur des domaines connus, pour éviter qu'un
// enregistrement pointe vers un pixel tracker ou une ressource tierce arbitraire.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''

function getHost(url: string): string | null {
  const match = url.match(/^https:\/\/([^/]+)/)
  return match ? match[1].toLowerCase() : null
}

// picsum.photos : placeholder utilisé par les données de seed/dev.
// À retirer une fois les photos réelles migrées vers le Supabase Storage du projet.
const TRUSTED_IMAGE_HOSTS = [getHost(SUPABASE_URL), 'picsum.photos'].filter(
  (host): host is string => !!host
)

export function isTrustedImageUrl(url: string): boolean {
  const host = getHost(url)
  return !!host && TRUSTED_IMAGE_HOSTS.includes(host)
}
