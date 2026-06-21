import { Text, View } from 'react-native'
import Navbar from '../components/navbar'

export default function Home() {
  return (
    <View>
      <Text>Nightr</Text>
      <Navbar activeTab="map" onTabPress={(tab) => console.log('Pressed tab:', tab)} />
    </View>
  )
}