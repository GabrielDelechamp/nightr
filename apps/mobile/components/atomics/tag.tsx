import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { resolveVariant, Variant } from '../../constants/variants'

type Props = {
  label: string
  variant?: Variant
  color?: string
  icon?: keyof typeof Ionicons.glyphMap
}

export default function Tag({ label, variant = 'outline', color = Colors.slate, icon }: Props) {
  const { backgroundColor, borderColor, textColor } = resolveVariant(variant, color)

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      {icon && <Ionicons name={icon} size={12} color={textColor} />}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
})
