import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../../../constants/colors'
import { FontFamily } from '../../../../constants/fonts'
import type { OpeningHour } from '@nightr/types'

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function fmt(time: string) {
  const [h, m] = time.split(':')
  return m === '00' ? `${h}h` : `${h}h${m}`
}

function groupHours(hours: OpeningHour[]) {
  const sorted = [...hours].sort((a, b) => a.day_of_week - b.day_of_week)
  const groups: { days: number[]; open_time: string; close_time: string; is_closed: boolean }[] = []

  for (const h of sorted) {
    const last = groups[groups.length - 1]
    const sameSlot = last &&
      last.open_time === h.open_time &&
      last.close_time === h.close_time &&
      last.is_closed === h.is_closed &&
      h.day_of_week === last.days[last.days.length - 1] + 1
    if (sameSlot) {
      last.days.push(h.day_of_week)
    } else {
      groups.push({ days: [h.day_of_week], open_time: h.open_time, close_time: h.close_time, is_closed: h.is_closed })
    }
  }
  return groups
}

function dayLabel(days: number[]) {
  if (days.length === 1) return DAY_NAMES[days[0]]
  return `${DAY_NAMES[days[0]]}-${DAY_NAMES[days[days.length - 1]]}`
}

type Props = { opening_hours: OpeningHour[] }

export default function OpeningHours({ opening_hours }: Props) {
  if (!opening_hours.length) return null
  const groups = groupHours(opening_hours)

  const jsDay = new Date().getDay()
  const todayDb = (jsDay + 6) % 7

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Ionicons name="time-outline" size={18} color={Colors.purple} />
        <Text style={styles.title}>Horaires</Text>
      </View>
      {groups.map((g, i) => {
        const isToday = g.days.includes(todayDb)
        return (
          <View key={i} style={styles.row}>
            <Text style={[styles.days, isToday && styles.today]}>{dayLabel(g.days)}</Text>
            <Text style={[styles.hours, isToday && styles.today]}>
              {g.is_closed ? 'Fermé' : `${fmt(g.open_time)} – ${fmt(g.close_time)}`}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,73,106,0.4)',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.ivory,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  days: {
    fontFamily: FontFamily.regular,
    color: 'rgba(255,250,241,0.5)',
    fontSize: 13,
  },
  hours: {
    fontFamily: FontFamily.regular,
    color: 'rgba(255,250,241,0.5)',
    fontSize: 13,
  },
  today: {
    fontFamily: FontFamily.semiBold,
    color: Colors.ivory,
  },
})
