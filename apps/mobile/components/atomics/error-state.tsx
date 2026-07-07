import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { FontFamily, FontSize } from '../../constants/fonts'
import Button from './button'

type Props = {
  message?: string
  onRetry: () => void
}

export default function ErrorState({ message = "Impossible de charger les données. Vérifie ta connexion.", onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={32} color={Colors.slate} />
      <Text style={styles.message}>{message}</Text>
      <Button label="Réessayer" onPress={onRetry} variant="filled" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 32,
    paddingVertical: 32,
    marginHorizontal: 24,
    borderRadius: 20,
    backgroundColor: Colors.navy,
  },
  message: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.cream,
    textAlign: 'center',
  },
})
