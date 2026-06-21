import { Text, View } from 'react-native'
import Navbar from '../components/navbar'
import Tag from '../components/tag'
import { Colors } from '../constants/colors'
import Chip from '../components/chip'
import Badge from '../components/badge'
import Button from '../components/button'

export default function Home() {
  return (
    <View>
      <Text>Nightr</Text>
      <Tag label="Trending" color={Colors.purple} icon="trending-up-outline" variant="ghost" />
      <Chip label="Explore" variant="filled" />
      <Badge label="New" variant="ghost" />
      <Button label="Get Started" variant="filled" color={Colors.blue} />
      <Navbar activeTab="map" onTabPress={(tab) => console.log('Pressed tab:', tab)} />
    </View>
  )
}