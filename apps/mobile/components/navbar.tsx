import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

type Tab = 'home' | 'search' | 'explore' | 'notifications' | 'profile'

type Props = {
  activeTab: Tab
  onTabPress: (tab: Tab) => void
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'search', label: 'Search' },
  { key: 'explore', label: 'Explore' },
  { key: 'notifications', label: 'Notifs' },
  { key: 'profile', label: 'Profile' },
]

export default function Navbar({ activeTab, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, activeTab === tab.key && styles.labelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
  },
  labelActive: {
    fontWeight: 'bold',
  },
})
