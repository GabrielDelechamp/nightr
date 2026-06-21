import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'
import { resolveVariant, Variant } from '../constants/variants'

type Props = {
  label: string
  variant?: Variant
  color?: string
}

export default function Badge({ label, variant = 'filled', color = Colors.purple }: Props) {
  const { backgroundColor, borderColor, textColor } = resolveVariant(variant, color)

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
})
