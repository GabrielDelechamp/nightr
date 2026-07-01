import { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import Chip from '../atomics/chip'
import FilterMenu, { type MenuOption } from './filter-menu'
import { Colors } from '../../constants/colors'

type MenuFilterKey = 'ambiance' | 'distance' | 'budget' | 'affluence'

type Selections = Record<MenuFilterKey, string | null>

export type FilterState = {
  live: boolean
  ambiance: string | null
  budget: string | null
}

const MENU_FILTERS: { key: MenuFilterKey; label: string; options: MenuOption[] }[] = [
  {
    key: 'ambiance',
    label: 'Ambiance',
    options: [
      { label: 'Festif', value: 'festif' },
      { label: 'Électro', value: 'électro' },
      { label: 'Rock', value: 'rock' },
      { label: 'Underground', value: 'underground' },
      { label: 'Convivial', value: 'convivial' },
      { label: 'Musical', value: 'musical' },
    ],
  },
  {
    key: 'distance',
    label: 'Distance',
    options: [
      { label: '< 500m', value: '500' },
      { label: '< 1km', value: '1000' },
      { label: '< 2km', value: '2000' },
      { label: '< 5km', value: '5000' },
    ],
  },
  {
    key: 'budget',
    label: 'Budget',
    options: [
      { label: 'Gratuit', value: 'free' },
      { label: '< 10€', value: '10' },
      { label: '10€ – 20€', value: '20' },
      { label: '> 20€', value: '20+' },
    ],
  },
  {
    key: 'affluence',
    label: 'Affluence',
    options: [
      { label: 'Basse', value: 'low' },
      { label: 'Moyenne', value: 'medium' },
      { label: 'Élevée', value: 'high' },
    ],
  },
]

type Props = {
  onFiltersChange: (filters: FilterState) => void
}

export default function FilterBar({ onFiltersChange }: Props) {
  const [liveActive, setLiveActive] = useState(false)
  const [selections, setSelections] = useState<Selections>({
    ambiance: null,
    distance: null,
    budget: null,
    affluence: null,
  })
  const [openMenu, setOpenMenu] = useState<MenuFilterKey | null>(null)

  const activeMenu = MENU_FILTERS.find((f) => f.key === openMenu)

  const notify = useCallback(
    (live: boolean, sels: Selections) => {
      onFiltersChange({ live, ambiance: sels.ambiance, budget: sels.budget })
    },
    [onFiltersChange]
  )

  const handleLivePress = () => {
    setLiveActive((prev) => {
      notify(!prev, selections)
      return !prev
    })
  }

  const handleSelect = (key: MenuFilterKey, value: string | null) => {
    setSelections((prev) => {
      const next = { ...prev, [key]: value }
      notify(liveActive, next)
      return next
    })
  }

  const chipLabel = (key: MenuFilterKey, defaultLabel: string) => {
    const val = selections[key]
    if (!val) return defaultLabel
    return MENU_FILTERS.find((f) => f.key === key)?.options.find((o) => o.value === val)?.label ?? defaultLabel
  }

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        pointerEvents="auto"
      >
        <Chip
          label="Live"
          variant={liveActive ? 'filled' : 'filled'}
          color={liveActive ? Colors.purple : Colors.slate}
          onPress={handleLivePress}
        />
        {MENU_FILTERS.map(({ key, label }) => {
          const hasValue = !!selections[key]
          return (
            <Chip
              key={key}
              label={chipLabel(key, label)}
              variant={hasValue ? 'filled' : 'filled'}
              color={hasValue ? Colors.purple : Colors.slate}
              chevron
              onPress={() => setOpenMenu(key)}
            />
          )
        })}
      </ScrollView>

      {activeMenu && (
        <FilterMenu
          visible={!!openMenu}
          title={activeMenu.label}
          options={activeMenu.options}
          selected={selections[activeMenu.key]}
          onSelect={(value) => handleSelect(activeMenu.key, value)}
          onClose={() => setOpenMenu(null)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
})
