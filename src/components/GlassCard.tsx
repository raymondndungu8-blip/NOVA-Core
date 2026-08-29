/**
 * NOVA Core — GlassCard Component
 * Glassmorphism card with glowing Electric Blue border.
 * Supports accent color variants and animated press states.
 */

import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    type ViewStyle,
    type StyleProp,
} from 'react-native';
import { colors } from '../theme/colors';

type Accent = 'blue' | 'green' | 'orange' | 'violet' | 'none';

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    accent?: Accent;
    glow?: boolean;
    padding?: number;
}

const accentBorderColor: Record<Accent, string> = {
    blue: 'rgba(255,102,0,0.30)',
    green: colors.neon.glow,
    orange: colors.sunset.glow,
    violet: colors.violet.glow,
    none: 'rgba(255,255,255,0.06)',
};

const accentGlowColor: Record<Accent, string> = {
    blue: colors.electric.glow,
    green: colors.neon.glow,
    orange: colors.sunset.glow,
    violet: colors.violet.glow,
    none: 'transparent',
};

export function GlassCard({
    children,
    style,
    onPress,
    accent = 'blue',
    glow = false,
    padding = 16,
}: GlassCardProps) {
    const cardStyle = [
        styles.card,
        {
            borderColor: accentBorderColor[accent],
            padding,
            ...(glow && {
                shadowColor: accentGlowColor[accent],
                shadowOpacity: 0.6,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 0 },
                elevation: 12,
            }),
        },
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.75}
            >
                {/* Subtle top shine line for glass effect */}
                <View style={styles.shine} />
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyle}>
            <View style={styles.shine} />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.glass.DEFAULT,
        borderRadius: 18,
        borderWidth: 1,
        overflow: 'hidden',
    },
    shine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
});
