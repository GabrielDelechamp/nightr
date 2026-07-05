import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../../../constants/colors'
import { FontFamily } from '../../../../constants/fonts'

type Props = {
  description?: string
}

export default function DescriptionSection({ description }: Props) {
  const [expanded, setExpanded] = useState(false)
  if (!description) return null

  const isLong = description.length > 120
  const displayed = expanded || !isLong ? description : description.slice(0, 120) + '…'

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Description</Text>
      <Text style={styles.text}>
        {displayed}
        {isLong && !expanded && (
          <Text onPress={() => setExpanded(true)} style={styles.more}> Voir plus</Text>
        )}
      </Text>
      {expanded && isLong && (
        <Pressable onPress={() => setExpanded(false)}>
          <Text style={styles.more}>Voir moins</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  title: {
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.ivory,
    fontSize: 15,
  },
  text: {
    fontFamily: FontFamily.regular,
    color: 'rgba(255,250,241,0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  more: {
    fontFamily: FontFamily.semiBold,
    color: Colors.purple,
  },
})
