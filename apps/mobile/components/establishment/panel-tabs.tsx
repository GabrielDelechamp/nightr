import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import { FontFamily } from '../../constants/fonts'

export type TabKey = 'overview' | 'reviews' | 'gallery' | 'about'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'reviews', label: 'Avis' },
  { key: 'gallery', label: 'Galerie' },
  { key: 'about', label: 'Infos' },
]

type Props = {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export default function PanelTabs({ active, onChange }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map(({ key, label }) => (
        <Pressable key={key} style={styles.tab} onPress={() => onChange(key)}>
          <Text style={[styles.label, active === key && styles.labelActive]}>{label}</Text>
          {active === key && <View style={styles.underline} />}
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,73,106,0.5)',
    marginHorizontal: 20,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: 'rgba(255,250,241,0.4)',
  },
  labelActive: {
    fontFamily: FontFamily.bold,
    color: Colors.ivory,
  },
  underline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.purple,
    borderRadius: 1,
  },
})
