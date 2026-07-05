import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../../../constants/colors'
import { FontFamily } from '../../../../constants/fonts'

type Props = {
  phone?: string
  website?: string
}

export default function ContactSection({ phone, website }: Props) {
  if (!phone && !website) return null

  return (
    <View>
      {phone && (
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() => Linking.openURL(`tel:${phone}`)}
        >
          <Ionicons name="call-outline" size={18} color={Colors.purple} />
          <Text style={styles.value}>{phone}</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,250,241,0.3)" style={styles.chevron} />
        </Pressable>
      )}
      {website && (
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() => Linking.openURL(website.startsWith('http') ? website : `https://${website}`)}
        >
          <Ionicons name="globe-outline" size={18} color={Colors.purple} />
          <Text style={styles.value}>{website}</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,250,241,0.3)" style={styles.chevron} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,73,106,0.4)',
  },
  pressed: { opacity: 0.6 },
  value: {
    fontFamily: FontFamily.regular,
    color: Colors.ivory,
    fontSize: 14,
    flex: 1,
  },
  chevron: { marginLeft: 'auto' },
})
