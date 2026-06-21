import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from '../components/navbar'
import { useTheme } from '../context/ThemeContext'

type Tab = 'event' | 'trending' | 'map' | 'favorites' | 'profile'

export default function Home() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<Tab>('map')

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.content} />
      <View style={styles.navbarWrapper}>
        <Navbar activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  navbarWrapper: {
    paddingBottom: 10,
  },
})
