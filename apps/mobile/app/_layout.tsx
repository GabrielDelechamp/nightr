import { Stack } from 'expo-router'
import { NavigationBar } from 'expo-navigation-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider, useTheme } from '../context/ThemeContext'

function ThemedShell() {
  const { colorScheme } = useTheme()

  return (
    <>
      <NavigationBar style={colorScheme === 'system' ? 'auto' : colorScheme === 'light' ? 'dark' : 'light'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedShell />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
