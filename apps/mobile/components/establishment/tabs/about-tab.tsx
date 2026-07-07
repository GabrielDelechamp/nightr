import { useState } from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../../constants/colors'
import { FontFamily } from '../../../constants/fonts'
import type { EstablishmentFull, EstablishmentFeature, FeatureCategory, MenuItem } from '@nightr/types'

const CHIP_W = (Dimensions.get('window').width - 40 - 8) / 2  // padding 20*2 + gap 8

const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  ambiance:      'Ambiance',
  accessibilite: 'Accessibilité',
  services:      'Services',
}

const CATEGORY_ORDER: FeatureCategory[] = ['ambiance', 'accessibilite', 'services']

function FeatureChip({ item }: { item: EstablishmentFeature }) {
  const { features, enabled, value_text } = item
  const label = value_text ?? features.label

  return (
    <View style={[styles.chip, !enabled && styles.chipDisabled]}>
      <Ionicons
        name={features.icon as any}
        size={15}
        color={enabled ? Colors.ivory : 'rgba(255,250,241,0.3)'}
      />
      <Text style={[styles.chipLabel, !enabled && styles.chipLabelDisabled]} numberOfLines={1}>
        {label}
      </Text>
      <Ionicons
        name={enabled ? 'checkmark' : 'close'}
        size={13}
        color={enabled ? Colors.blue : 'rgba(255,250,241,0.25)'}
      />
    </View>
  )
}

const DEFAULT_VISIBLE = 4

function FeatureSection({ category, items }: { category: FeatureCategory; items: EstablishmentFeature[] }) {
  const [expanded, setExpanded] = useState(false)
  if (!items.length) return null

  const sorted = [...items].sort((a, b) => a.features.sort_order - b.features.sort_order)
  const visible = expanded ? sorted : sorted.slice(0, DEFAULT_VISIBLE)
  const hasMore = sorted.length > DEFAULT_VISIBLE

  const rows: EstablishmentFeature[][] = []
  for (let i = 0; i < visible.length; i += 2) {
    rows.push(visible.slice(i, i + 2))
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{CATEGORY_LABELS[category]}</Text>
      <View style={styles.chipGrid}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.chipRow}>
            {row.map((item) => (
              <FeatureChip key={item.feature_id} item={item} />
            ))}
          </View>
        ))}
      </View>
      {hasMore && (
        <Pressable onPress={() => setExpanded((v) => !v)} style={styles.expandBtn}>
          <Text style={styles.expandLabel}>
            {expanded ? 'Voir moins' : `Voir plus (${sorted.length - DEFAULT_VISIBLE})`}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={13}
            color={Colors.purple}
          />
        </Pressable>
      )}
    </View>
  )
}

function formatPrice(item: MenuItem) {
  if (item.price_from == null) return ''
  if (item.price_to == null) return `dès ${item.price_from} €`
  return `${item.price_from}-${item.price_to} €`
}

function MenuSection({ items }: { items: MenuItem[] }) {
  if (!items.length) return null
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Boissons & Prix</Text>
      <View style={styles.menuList}>
        {sorted.map((item) => (
          <View key={item.menu_id} style={styles.menuRow}>
            <View style={styles.menuIcon}>
              <Ionicons name="wine-outline" size={18} color={Colors.purple} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuName}>{item.name}</Text>
              {item.description ? (
                <Text style={styles.menuDesc} numberOfLines={1}>{item.description}</Text>
              ) : null}
            </View>
            <Text style={styles.menuPrice}>{formatPrice(item)}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

type Props = { establishment: EstablishmentFull }

export default function AboutTab({ establishment }: Props) {
  const features = establishment.establishment_features ?? []
  const menu = establishment.establishment_menu ?? []

  const byCategory = CATEGORY_ORDER.reduce<Record<FeatureCategory, EstablishmentFeature[]>>(
    (acc, cat) => {
      acc[cat] = features.filter((f) => f.features?.category === cat)
      return acc
    },
    { ambiance: [], accessibilite: [], services: [] }
  )

  const hasFeatures = features.length > 0
  const hasMenu = menu.length > 0

  if (!hasFeatures && !hasMenu) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucune information disponible</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {CATEGORY_ORDER.map((cat) => (
        <FeatureSection key={cat} category={cat} items={byCategory[cat]} />
      ))}
      <MenuSection items={menu} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },

  /* Section */
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: 15,
    color: Colors.ivory,
  },

  /* Grille features */
  chipGrid: {
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    width: CHIP_W,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: 'rgba(47,73,106,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(47,73,106,0.5)',
  },
  chipDisabled: {
    backgroundColor: 'rgba(47,73,106,0.12)',
    borderColor: 'rgba(47,73,106,0.25)',
  },
  chipLabel: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.ivory,
    includeFontPadding: false,
  },
  chipLabelDisabled: {
    color: 'rgba(255,250,241,0.3)',
  },

  /* Menu */
  menuList: {
    gap: 0,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,73,106,0.35)',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(138,43,226,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuText: {
    flex: 1,
    gap: 2,
  },
  menuName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.ivory,
    includeFontPadding: false,
  },
  menuDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: 'rgba(255,250,241,0.45)',
    includeFontPadding: false,
  },
  menuPrice: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.purple,
    flexShrink: 0,
    includeFontPadding: false,
  },

  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  expandLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.purple,
    includeFontPadding: false,
  },

  /* Vide */
  empty: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: 'rgba(255,250,241,0.4)',
  },
})
