import { supabase } from '../client'
import type { Event } from '@nightr/types'

export async function getTodayEvents(cityId: string): Promise<Event[]> {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  const { data, error } = await supabase
    .from('events')
    .select('*, establishments!inner(city_id)')
    .eq('establishments.city_id', cityId)
    .eq('is_active', true)
    .gte('start_datetime', startOfDay)
    .lte('start_datetime', endOfDay)

  if (error) throw error
  return data ?? []
}