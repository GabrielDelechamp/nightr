import { supabase } from '../client'
import type { Establishment } from '@nightr/types'

export type EstablishmentFilters = {
  live?: boolean
  ambiance?: string | null
  budget?: string | null
}

// Schema day_of_week: 0=Lun, 1=Mar, 2=Mer, 3=Jeu, 4=Ven, 5=Sam, 6=Dim
// JS getDay():        0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
function jsToSchemaDay(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1
}

function isCurrentlyOpen(openingHours: { day_of_week: number; open_time: string; close_time: string; is_closed: boolean }[]): boolean {
  const now = new Date()
  const schemaToday = jsToSchemaDay(now.getDay())
  const schemaYesterday = schemaToday === 0 ? 6 : schemaToday - 1
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const currentTime = `${hh}:${mm}:00`

  const todayHours = openingHours.find((h) => h.day_of_week === schemaToday)
  if (todayHours && !todayHours.is_closed) {
    const { open_time, close_time } = todayHours
    if (close_time > open_time) {
      // Normal hours (no midnight crossing)
      if (currentTime >= open_time && currentTime <= close_time) return true
    } else {
      // Midnight crossing — this side: from open_time until midnight
      if (currentTime >= open_time) return true
    }
  }

  // Check yesterday's midnight-crossing hours (e.g. Sat 22:00→Sun 04:00, it's now 02:00 Sun)
  const yesterdayHours = openingHours.find((h) => h.day_of_week === schemaYesterday)
  if (yesterdayHours && !yesterdayHours.is_closed) {
    const { open_time, close_time } = yesterdayHours
    if (close_time < open_time && currentTime <= close_time) return true
  }

  return false
}

function matchesBudget(menuItems: { price_from: number | null }[], budget: string): boolean {
  const prices = menuItems.map((m) => m.price_from).filter((p): p is number => p != null)

  if (prices.length === 0) return budget === 'free'

  const minPrice = Math.min(...prices)

  switch (budget) {
    case 'free': return minPrice === 0
    case '10':   return minPrice < 10
    case '20':   return minPrice >= 10 && minPrice <= 20
    case '20+':  return minPrice > 20
    default:     return true
  }
}

export async function getEstablishmentsByCity(
  cityId: string,
  filters: EstablishmentFilters = {}
): Promise<Establishment[]> {
  const selectParts = ['*', 'categories(name)']
  if (filters.live)         selectParts.push('opening_hours(day_of_week, open_time, close_time, is_closed)')
  if (filters.budget)       selectParts.push('establishment_menu(price_from)')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('establishments')
    .select(selectParts.join(', '))
    .eq('city_id', cityId)
    .eq('is_validated', true)

  if (filters.ambiance) {
    query = query.ilike('ambiance', `%${filters.ambiance}%`)
  }

  const { data, error } = await query
  if (error) throw error

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let results: any[] = data ?? []

  if (filters.live) {
    results = results.filter((e: any) => isCurrentlyOpen(e.opening_hours ?? []))
  }

  if (filters.budget) {
    results = results.filter((e: any) => matchesBudget(e.establishment_menu ?? [], filters.budget!))
  }

  return results as Establishment[]
}

export async function getEstablishmentById(id: string): Promise<Establishment | null> {
  const [establishmentRes, photosRes] = await Promise.all([
    supabase
      .from('establishments')
      .select('*, categories(*), cities(*), events(*), opening_hours(*), reviews(*), establishment_features(*, features(*)), establishment_menu(*)')
      .eq('establishment_id', id)
      .single(),
    supabase
      .from('photos')
      .select('*')
      .eq('entity_id', id)
      .eq('entity_type', 'establishment'),
  ])

  if (establishmentRes.error) throw establishmentRes.error
  if (!establishmentRes.data) return null

  return { ...establishmentRes.data, photos: photosRes.data ?? [] }
}
