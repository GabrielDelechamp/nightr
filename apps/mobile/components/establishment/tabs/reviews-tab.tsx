import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../../constants/colors'
import { FontFamily } from '../../../constants/fonts'
import type { Review } from '@nightr/types'

function RatingBars({ reviews }: { reviews: Review[] }) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))
  const max = Math.max(...counts.map((c) => c.count), 1)

  return (
    <View style={styles.bars}>
      {counts.map(({ star, count }) => (
        <View key={star} style={styles.barRow}>
          <Text style={styles.barLabel}>{star}</Text>
          <Ionicons name="star" size={10} color={Colors.purple} />
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${(count / max) * 100}%` },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Ionicons name="person" size={18} color="rgba(255,250,241,0.4)" />
      </View>

      {/* Commentaire */}
      <Text style={styles.comment} numberOfLines={3}>
        {review.comment ?? '—'}
      </Text>

      {/* Note */}
      <View style={styles.cardRating}>
        <Ionicons name="star" size={13} color={Colors.purple} />
        <Text style={styles.cardRatingNum}>{review.rating}</Text>
      </View>
    </View>
  )
}

type Props = { reviews: Review[] }

export default function ReviewsTab({ reviews }: Props) {
  if (!reviews.length) {
    return (
      <View style={styles.empty}>
        <Ionicons name="chatbubble-outline" size={32} color={Colors.slate} />
        <Text style={styles.emptyText}>Aucun avis pour le moment</Text>
      </View>
    )
  }

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <View style={styles.container}>
      {/* En-tête : barres + note globale */}
      <View style={styles.header}>
        <RatingBars reviews={reviews} />

        <View style={styles.globalRating}>
          <Text style={styles.avgNumber}>{avg.toFixed(1)}</Text>
          <View style={styles.avgStars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < Math.round(avg) ? 'star' : 'star-outline'}
                size={13}
                color={Colors.purple}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>{reviews.length} Reviews</Text>
        </View>
      </View>

      {/* Liste des avis */}
      <View style={styles.list}>
        {reviews.map((review) => (
          <ReviewCard key={review.review_id} review={review} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 24,
  },

  /* En-tête */
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 20,
  },

  /* Barres distribution */
  bars: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: 'rgba(255,250,241,0.6)',
    width: 10,
    textAlign: 'right',
    includeFontPadding: false,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(47,73,106,0.5)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.purple,
  },

  /* Note globale */
  globalRating: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  avgNumber: {
    fontFamily: FontFamily.displayBold,
    fontSize: 40,
    color: Colors.ivory,
    includeFontPadding: false,
  },
  avgStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewCount: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: 'rgba(255,250,241,0.45)',
    includeFontPadding: false,
  },

  /* Cartes avis */
  list: {
    paddingHorizontal: 20,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(47,73,106,0.25)',
    borderRadius: 14,
    padding: 14,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(47,73,106,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  comment: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,250,241,0.8)',
    lineHeight: 18,
  },
  cardRating: {
    alignItems: 'center',
    gap: 3,
    flexShrink: 0,
  },
  cardRatingNum: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.purple,
    includeFontPadding: false,
  },

  /* État vide */
  empty: {
    alignItems: 'center',
    paddingTop: 48,
    gap: 12,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: 'rgba(255,250,241,0.4)',
  },
})
