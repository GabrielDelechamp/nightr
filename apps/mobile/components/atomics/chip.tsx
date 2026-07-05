import { Pressable, Text, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { FontFamily } from '../../constants/fonts'
import { resolveVariant, Variant } from '../../constants/variants'

type Props = {
  label: string
  onPress?: () => void
  variant?: Variant
  color?: string
  chevron?: boolean
}

export default function Chip({ label, onPress, variant = 'outline', color = Colors.slate, chevron = false }: Props) {
  const { backgroundColor, borderColor, textColor } = resolveVariant(variant, color)

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor, borderColor, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.inner}>
        <Text style={[styles.label, { color: textColor }]}>
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </Text>
        {chevron && (
          <Ionicons name="chevron-down" size={13} color={textColor} style={styles.icon} />
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1.5,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    includeFontPadding: false,
  },
  icon: {
    marginTop: 1,
  },
})
