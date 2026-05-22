import { supabase } from '../client'
import type { Establishment } from '@nightr/types'

export async function getEstablishmentsByCity(cityId: string): Promise<Establishment[]> {
  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .eq('city_id', cityId)
    .eq('is_validated', true)

  if (error) throw error
  return data ?? []
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