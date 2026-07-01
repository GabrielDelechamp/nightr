import { supabase } from '../client'
import type { Establishment } from '@nightr/types'

export type EstablishmentFilters = {
  live?: boolean
  ambiance?: string | null
  budget?: string | null
}

export async function getEstablishmentsByCity(
  cityId: string,
  filters: EstablishmentFilters = {}
): Promise<Establishment[]> {
  const needsEventsJoin = filters.live || !!filters.budget

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('establishments')
    .select(needsEventsJoin ? '*, events!inner(is_active, start_datetime, price_min)' : '*')
    .eq('city_id', cityId)
    .eq('is_validated', true)

  if (filters.ambiance) {
    query = query.ilike('ambiance', `%${filters.ambiance}%`)
  }

  if (filters.live) {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString()
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString()
    query = query
      .eq('events.is_active', true)
      .gte('events.start_datetime', startOfDay)
      .lte('events.start_datetime', endOfDay)
  }

  if (filters.budget) {
    switch (filters.budget) {
      case 'free':
        query = query.eq('events.price_min', 0)
        break
      case '10':
        query = query.gt('events.price_min', 0).lt('events.price_min', 10)
        break
      case '20':
        query = query.gte('events.price_min', 10).lte('events.price_min', 20)
        break
      case '20+':
        query = query.gt('events.price_min', 20)
        break
    }
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Establishment[]
}

export async function getEstablishmentById(id: string): Promise<Establishment | null> {
  const { data, error } = await supabase
    .from('establishments')
    .select('*, categories(*), cities(*), events(*), photos(*), opening_hours(*)')
    .eq('establishment_id', id)
    .single()

  if (error) throw error
  return data
}
