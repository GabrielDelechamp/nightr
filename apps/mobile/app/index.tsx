import { Text, View } from 'react-native'
import Navbar from './components/navbar.tsx'

export default function Home() {
  return (
    <View>
      <Text>Nightr</Text>
      <Navbar activeTab="home" onTabPress={(tab) => console.log('Pressed tab:', tab)} />
    </View>
  )
}