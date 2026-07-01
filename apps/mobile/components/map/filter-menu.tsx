import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'

export type MenuOption = { label: string; value: string }

type Props = {
  visible: boolean
  title: string
  options: MenuOption[]
  selected: string | null
  onSelect: (value: string | null) => void
  onClose: () => void
}

export default function FilterMenu({ visible, title, options, selected, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>{title}</Text>
        <ScrollView bounces={false}>
          {options.map((opt) => {
            const isSelected = selected === opt.value
            return (
              <Pressable
                key={opt.value}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                onPress={() => {
                  onSelect(isSelected ? null : opt.value)
                  onClose()
                }}
              >
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {opt.label}
                </Text>
                {isSelected && <View style={styles.dot} />}
              </Pressable>
            )
          })}
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.navy,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.slate,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: Colors.ivory,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47, 73, 106, 0.4)',
  },
  optionPressed: {
    backgroundColor: 'rgba(47, 73, 106, 0.3)',
  },
  optionLabel: {
    color: Colors.cream,
    fontSize: 15,
  },
  optionLabelSelected: {
    color: Colors.purple,
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.purple,
  },
})
