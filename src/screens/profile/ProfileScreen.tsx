import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/authStore';
import { colors } from '../../theme/colors';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedButton } from '../../components/AnimatedButton';

export function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const displayName = user?.displayName ?? 'Athlete';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* ── Main Profile GlassCard ── */}
        <GlassCard accent="orange" glow={true} padding={20} style={styles.profileCard}>
          <View style={styles.userRow}>
            <View style={styles.avatarGradient}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{user?.email ?? 'guest@novacore.ai'}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✨ APEX ATHLETE</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* ── Settings Section ── */}
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.menuContainer}>
          <GlassCard accent="none" padding={0}>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemIcon}>🎯</Text>
                <Text style={styles.menuItemText}>Goals & preferences</Text>
              </View>
              <Text style={styles.menuItemArrow}>➔</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemIcon}>🔔</Text>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <Text style={styles.menuItemArrow}>➔</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemIcon}>🔒</Text>
                <Text style={styles.menuItemText}>Privacy & data</Text>
              </View>
              <Text style={styles.menuItemArrow}>➔</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>

        {/* ── Sign Out ── */}
        <AnimatedButton
          label="Sign Out"
          variant="ghost"
          onPress={() => signOut()}
          icon="🚪"
          style={styles.signOutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },
  profileCard: {
    marginBottom: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.electric.subtle,
    borderWidth: 2,
    borderColor: colors.electric.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  avatarText: {
    color: colors.electric.bright,
    fontSize: 28,
    fontWeight: '800',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  userEmail: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 102, 0, 0.12)',
    borderWidth: 1,
    borderColor: colors.electric.glow,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.electric.bright,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 8,
  },
  menuContainer: {
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemIcon: {
    fontSize: 18,
    marginRight: 2,
  },
  menuItemText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemArrow: {
    color: colors.text.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  signOutBtn: {
    marginTop: 8,
    marginBottom: 24,
  },
});
