import { useRef } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { FontFamily } from '../../constants/fonts'

type Props = {
  value: string
  onChangeText: (text: string) => void
}

export default function SearchBar({ value, onChangeText }: Props) {
  const inputRef = useRef<TextInput>(null)

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={16} color="rgba(255,250,241,0.5)" style={styles.icon} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="Rechercher un établissement…"
        placeholderTextColor="rgba(255,250,241,0.35)"
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <Ionicons name="close-circle" size={16} color="rgba(255,250,241,0.4)" />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(0,33,71,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(47,73,106,0.6)',
    gap: 8,
  },
  icon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.ivory,
    padding: 0,
    includeFontPadding: false,
  },
})
