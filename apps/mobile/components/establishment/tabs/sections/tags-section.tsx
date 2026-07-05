import { StyleSheet, View } from 'react-native'
import { Colors } from '../../../../constants/colors'
import Chip from '../../../atomics/chip'
import Tag from '../../../atomics/tag'

type Props = {
  ambiance?: string
  tags?: string[]
}

export default function TagsSection({ ambiance, tags }: Props) {
  const ambianceTags = ambiance ? ambiance.split(',').map((t) => t.trim()).filter(Boolean) : []
  const allTags = tags ?? []

  if (!ambianceTags.length && !allTags.length) return null

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        {ambianceTags.map((tag) => (
          <Chip key={tag} label={tag} variant="ghost" color={Colors.purple} />
        ))}
        {allTags.map((tag) => (
          <Chip key={tag} label={tag} variant="filled" color={Colors.slate} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,73,106,0.4)',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
})
