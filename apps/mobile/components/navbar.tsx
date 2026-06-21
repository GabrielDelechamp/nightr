import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'
import { Ionicons } from '@expo/vector-icons'

type Tab = 'event' | 'trending' | 'map' | 'favorites' | 'profile'

type Props = {
  activeTab: Tab
  onTabPress: (tab: Tab) => void
}

const TABS: { key: Tab; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'event', icon: 'ticket-outline' },
  { key: 'trending', icon: 'flame-outline' },
  { key: 'map', icon: 'map-outline' },
  { key: 'favorites', icon: 'heart-outline' },
  { key: 'profile', icon: 'person-outline' },
]

export default function Navbar({ activeTab, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = activeTab === tab.key

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.8}
          >

            {active && (
              <>
                <View style={styles.glowOuter} />
                <View style={styles.glowMiddle} />
                <View style={styles.glowInner} />
              </>
            )}

            <View
              style={[
                styles.iconContainer,
                active && styles.iconActive,
              ]}
            >
              <Ionicons
                name={tab.icon}
                size={24}
                color={active ? Colors.cream : Colors.ivory}
              />
            </View>

          </TouchableOpacity>
        )
      })}
    </View>
  )
}


const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    height: 75,
    alignItems: 'center',
    overflow: 'visible',
  },


  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },


  /*
    HALO NEON
  */

  glowOuter: {
    position: 'absolute',

    width: 90,
    height: 90,
    borderRadius: 100,

    backgroundColor: 'transparent',

    transform: [
      { translateY: -8 },
    ],

    shadowColor: Colors.purple,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.8,
    shadowRadius: 45,

    elevation: 40,
  },


  glowMiddle: {
    position: 'absolute',

    width: 70,
    height: 70,
    borderRadius: 100,

    backgroundColor: Colors.purple,

    opacity: 0.12,

    transform: [
      { translateY: -8 },
    ],
  },


  glowInner: {
    position: 'absolute',

    width: 55,
    height: 55,
    borderRadius: 100,

    backgroundColor: Colors.purple,

    opacity: 0.22,

    transform: [
      { translateY: -8 },
    ],
  },


  /*
    ICONE
  */

  iconContainer: {
    width: 50,
    height: 50,

    borderRadius: 100,

    backgroundColor: Colors.slateLight,

    borderColor: Colors.slate,
    borderWidth: 2,

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 2,
  },


  iconActive: {

    transform: [
      { translateY: -8 },
      { scale: 1.15 },
    ],

    backgroundColor: Colors.purple,

    borderColor: Colors.purple,

    shadowColor: Colors.purple,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 1,
    shadowRadius: 18,

    elevation: 25,
  },

})