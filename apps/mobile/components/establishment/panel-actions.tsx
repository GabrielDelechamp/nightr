import { Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { FontFamily } from '../../constants/fonts'
import { openPhone } from '../../utils/safe-linking'

type Props = {
  name: string
  address: string
  phone?: string
}

type Action = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
}

export default function PanelActions({ name, address, phone }: Props) {
  const actions: Action[] = [
    {
      icon: 'navigate-outline',
      label: 'Itinéraire',
      onPress: () => {
        const query = encodeURIComponent(address)
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`)
      },
    },
    ...(phone
      ? [
          {
            icon: 'call-outline' as const,
            label: 'Appeler',
            onPress: () => openPhone(phone),
          },
        ]
      : []),
    {
      icon: 'share-social-outline',
      label: 'Partager',
      onPress: () => Share.share({ title: name, message: `${name} — ${address}` }),
    },
  ]

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={action.onPress}
        >
          <Ionicons name={action.icon} size={18} color={Colors.ivory} />
          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.slate,
    backgroundColor: 'rgba(47,73,106,0.3)',
  },
  btnPressed: {
    opacity: 0.6,
  },
  label: {
    fontFamily: FontFamily.medium,
    color: Colors.ivory,
    fontSize: 13,
  },
})
