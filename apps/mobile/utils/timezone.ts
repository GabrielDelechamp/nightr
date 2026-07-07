// Les horaires en base (opening_hours) sont saisis en heure locale de l'établissement,
// sans information de fuseau. Tant que l'app ne couvre que Nantes, on fixe ce fuseau ;
// si une ville hors Europe/Paris est ajoutée, ce calcul devra être fait par établissement
// (ex: colonne `timezone` sur `cities`).
export const ESTABLISHMENT_TIMEZONE = 'Europe/Paris'

// day_of_week en base : 0 = Lundi … 6 = Dimanche
const WEEKDAY_TO_DB_DAY: Record<string, number> = {
  Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
}

export function nowInEstablishmentTimezone(timeZone: string = ESTABLISHMENT_TIMEZONE) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const dbDay = WEEKDAY_TO_DB_DAY[get('weekday')]
  const hour = Number(get('hour'))
  const minute = Number(get('minute'))

  return { dbDay, minutes: hour * 60 + minute }
}
