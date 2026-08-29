import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width > 768;

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.style.backgroundColor = colors.background.DEFAULT;
      document.body.style.backgroundColor = colors.background.DEFAULT;
      
      // Keep viewport tidy on desktop, allowing normal scroll on mobile
      if (width > 768) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }, [width]);

  if (isDesktopWeb) {
    return (
      <View style={styles.desktopContainer}>
        {/* Glowing Ambient Spheres for visual depth */}
        <View style={[styles.ambientSphere, styles.sphereOrange]} />
        <View style={[styles.ambientSphere, styles.sphereGreen]} />

        {/* Info panel on the left (visible on desktop) */}
        <View style={styles.desktopInfo}>
          <Text style={styles.infoTitle}>NOVA Core</Text>
          <Text style={styles.infoSubtitle}>AI Fitness Companion</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚡ WEB PREVIEW ACTIVE</Text>
          </View>
          <Text style={styles.infoDescription}>
            You are viewing the interactive web sandbox simulation of the NOVA Core app. Experience the updated Orange-Charcoal theme and glassmorphism interface design.
          </Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 Sandbox Pro-Tips:</Text>
            <Text style={styles.tipItem}>• Use <Text style={styles.boldText}>✨ Try Guest Demo</Text> to bypass Firebase logins.</Text>
            <Text style={styles.tipItem}>• Resize your browser window to test the responsive mobile view.</Text>
            <Text style={styles.tipItem}>• Take a simulated scan workout inside the camera tab.</Text>
          </View>
        </View>

        {/* Interactive Phone Chassis Mockup */}
        <View style={styles.phoneChassis}>
          {/* Status notch (Dynamic Island style) */}
          <View style={styles.notch} />
          
          {/* Main App Container */}
          <View style={styles.phoneScreen}>
            <SafeAreaProvider>
              <StatusBar style="light" />
              <RootNavigator />
            </SafeAreaProvider>
          </View>

          {/* Bottom Home Indicator */}
          <View style={styles.homeIndicator} />
        </View>

        {/* Extra decorative details on the right */}
        <View style={styles.desktopControls}>
          <Text style={styles.footerBrand}>Powered by NOVA AI</Text>
        </View>
      </View>
    );
  }

  // Mobile viewport behavior: standard full screen
  return (
    <View style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
    minHeight: Platform.OS === 'web' ? ('100vh' as any) : undefined,
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#07070D',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh' as any,
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 40,
  },
  
  // Ambient Glowing Spheres
  ambientSphere: {
    position: 'absolute',
    borderRadius: 500,
    filter: 'blur(120px)' as any,
    opacity: 0.12,
  },
  sphereOrange: {
    width: 600,
    height: 600,
    backgroundColor: colors.electric.DEFAULT,
    top: '-10%',
    left: '10%',
  },
  sphereGreen: {
    width: 500,
    height: 500,
    backgroundColor: colors.neon.DEFAULT,
    bottom: '-10%',
    right: '15%',
  },

  // Info Column
  desktopInfo: {
    width: 320,
    marginRight: 60,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
  },
  infoSubtitle: {
    color: colors.electric.bright,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 102, 0, 0.12)',
    borderWidth: 1,
    borderColor: colors.electric.glow,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 16,
    marginBottom: 20,
  },
  badgeText: {
    color: colors.electric.bright,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  infoDescription: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 18,
  },
  tipTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  tipItem: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  boldText: {
    fontWeight: '700',
    color: colors.electric.bright,
  },

  // Device Chassis
  phoneChassis: {
    width: 390,
    height: 844,
    backgroundColor: colors.background.DEFAULT,
    borderRadius: 48,
    borderWidth: 12,
    borderColor: '#1D1D2C',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 15 },
    elevation: 24,
    zIndex: 10,
    borderStyle: 'solid',
  },
  phoneScreen: {
    flex: 1,
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -70 }],
    width: 140,
    height: 28,
    backgroundColor: '#1D1D2C',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    zIndex: 100,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: [{ translateX: -60 }],
    width: 120,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    zIndex: 100,
  },

  // Decorative right panel
  desktopControls: {
    width: 200,
    marginLeft: 60,
    alignItems: 'flex-start',
    zIndex: 10,
  },
  footerBrand: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
