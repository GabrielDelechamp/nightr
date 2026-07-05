import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../../../constants/colors'
import { FontFamily } from '../../../../constants/fonts'

type Props = {
  address: string
  cityName?: string
}

export default function AddressSection({ address, cityName }: Props) {
  const openMaps = () => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`)
  }

  return (
    <Pressable style={({ pressed }) => [styles.section, pressed && styles.pressed]} onPress={openMaps}>
      <Ionicons name="location-outline" size={18} color={Colors.purple} style={styles.icon} />
      <View>
        <Text style={styles.address}>{address}</Text>
        {cityName && <Text style={styles.city}>{cityName}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={14} color="rgba(255,250,241,0.3)" style={styles.chevron} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,73,106,0.4)',
    gap: 12,
  },
  pressed: { opacity: 0.6 },
  icon: { marginTop: 2 },
  address: {
    fontFamily: FontFamily.medium,
    color: Colors.ivory,
    fontSize: 14,
  },
  city: {
    fontFamily: FontFamily.regular,
    color: 'rgba(255,250,241,0.5)',
    fontSize: 13,
    marginTop: 2,
  },
  chevron: { marginLeft: 'auto' },
})
