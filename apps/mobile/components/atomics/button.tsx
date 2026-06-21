import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'
import { resolveVariant, Variant } from '../../constants/variants'

type Props = {
  label: string
  onPress?: () => void
  variant?: Variant
  color?: string
}

export default function Button({ label, onPress, variant = 'filled', color = Colors.purple }: Props) {
  const { backgroundColor, borderColor, textColor } = resolveVariant(variant, color)

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.container, { backgroundColor, borderColor }]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
})
