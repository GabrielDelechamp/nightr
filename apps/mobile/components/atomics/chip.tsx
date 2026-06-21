import { Pressable, Text, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'
import { resolveVariant, Variant } from '../../constants/variants'

type Props = {
  label: string
  onPress?: () => void
  variant?: Variant
  color?: string
}

export default function Chip({ label, onPress, variant = 'outline', color = Colors.slate }: Props) {
  const { backgroundColor, borderColor, textColor } = resolveVariant(variant, color)

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor, borderColor, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
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
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
})
