import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from '../components/navbar'
import LargeCard from '../components/cards/large-card'
import {Colors} from '../constants/colors'

import { useTheme } from '../context/ThemeContext'

type Tab = 'event' | 'trending' | 'map' | 'favorites' | 'profile'

export default function Home() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<Tab>('map')

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.content}>

        <LargeCard
          image={{ uri: 'https://png.pngtree.com/thumb_back/fh260/background/20240522/pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg' }}
          badge="Trending"
          title="Villa du Taur"
          subtitle="17 april • Place du Cirque"
          tags={[
            { label: 'Très demandé', icon: 'people-outline',        variant: 'ghost',   color: Colors.purple },
            { label: 'House',        icon: 'musical-note-outline' },
            { label: '900m',         icon: 'location-outline' },
          ]}
          bottomChip="7€/personne"
          onShare={() => {}}
          onFavorite={() => {}}
          onPress={() => {}}
        />

      </View>
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
