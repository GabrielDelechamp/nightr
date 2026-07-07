import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { FontFamily } from '../../constants/fonts'
import type { Category, OpeningHour, Review } from '@nightr/types'
import { nowInEstablishmentTimezone } from '../../utils/timezone'

function getTodayStatus(hours: OpeningHour[]) {
  const { dbDay, minutes: cur } = nowInEstablishmentTimezone()
  const today = hours.find((h) => h.day_of_week === dbDay)
  if (!today || today.is_closed) return { isOpen: false, label: 'Fermé' }

  const [oh, om] = today.open_time.split(':').map(Number)
  const [ch, cm] = today.close_time.split(':').map(Number)
  let close = ch * 60 + cm
  if (close < oh * 60 + om) close += 24 * 60

  const isOpen = cur >= oh * 60 + om && cur < close
  const closeLabel = ch.toString().padStart(2, '0') + 'h' + (cm > 0 ? cm.toString().padStart(2, '0') : '')
  return { isOpen, label: isOpen ? `Ferme à ${closeLabel}` : `Ouvre à ${today.open_time.slice(0, 5).replace(':', 'h')}` }
}

function getAvgRating(reviews: Review[]) {
  if (!reviews.length) return null
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  return { avg: avg.toFixed(1), count: reviews.length }
}

type Props = {
  name: string
  category: Category | null
  opening_hours: OpeningHour[]
  reviews: Review[]
}

export default function PanelHeader({ name, category, opening_hours, reviews }: Props) {
  const status = getTodayStatus(opening_hours)
  const rating = getAvgRating(reviews)

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>

      {category && (
        <Text style={styles.category}>{category.name}</Text>
      )}

      {rating && (
        <View style={styles.row}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < Math.round(Number(rating.avg)) ? 'star' : 'star-outline'}
              size={14}
              color={Colors.purple}
            />
          ))}
          <Text style={styles.ratingText}>{rating.avg} ({rating.count})</Text>
        </View>
      )}

      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: status.isOpen ? Colors.blue : Colors.purple }]} />
        <Text style={[styles.status, { color: status.isOpen ? Colors.blue : Colors.purple }]}>
          {status.isOpen ? 'Ouvert' : 'Fermé'}
        </Text>
        <Text style={[styles.statusSub, { color: status.isOpen ? Colors.blue : Colors.purple }]}>
          {' · '}{status.label}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: FontFamily.displayBold,
    color: Colors.ivory,
    fontSize: 20,
    textAlign: 'center',
  },
  category: {
    fontFamily: FontFamily.regular,
    color: 'rgba(255,250,241,0.5)',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  status: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
  },
  statusSub: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
  },
  ratingText: {
    fontFamily: FontFamily.medium,
    color: Colors.cream,
    fontSize: 13,
    marginLeft: 4,
  },
})
