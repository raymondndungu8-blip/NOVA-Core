/**
 * NOVA Core — AnimatedButton Component
 * Premium CTA button with press-scale animation and glow effect.
 */

import React, { useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Animated,
    StyleSheet,
    ActivityIndicator,
    type StyleProp,
    type ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

interface AnimatedButtonProps {
    label: string;
    onPress: () => void;
    variant?: Variant;
    loading?: boolean;
    disabled?: boolean;
    icon?: string;
    style?: StyleProp<ViewStyle>;
    fullWidth?: boolean;
}

const variantStyles: Record<Variant, { bg: string; border: string; text: string; glow: string }> = {
    primary: { bg: colors.electric.DEFAULT, border: colors.electric.DEFAULT, text: '#FFFFFF', glow: colors.electric.glow },
    secondary: { bg: 'transparent', border: colors.electric.DEFAULT, text: colors.electric.DEFAULT, glow: 'transparent' },
    ghost: { bg: colors.glass.DEFAULT, border: colors.glass.neutralBorder, text: colors.text.primary, glow: 'transparent' },
    danger: { bg: colors.error, border: colors.error, text: '#fff', glow: 'rgba(255,59,92,0.3)' },
    success: { bg: colors.neon.DEFAULT, border: colors.neon.DEFAULT, text: '#0F0F1A', glow: colors.neon.glow },
};

export function AnimatedButton({
    label,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    icon,
    style,
    fullWidth = true,
}: AnimatedButtonProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const v = variantStyles[variant];

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
            bounciness: 6,
        }).start();
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, fullWidth && { width: '100%' }, style]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                activeOpacity={1}
                style={[
                    styles.button,
                    {
                        backgroundColor: v.bg,
                        borderColor: v.border,
                        shadowColor: v.glow,
                        opacity: disabled ? 0.5 : 1,
                    },
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={v.text} size="small" />
                ) : (
                    <View style={styles.content}>
                        {icon && <Text style={[styles.icon, { color: v.text }]}>{icon}</Text>}
                        <Text style={[styles.label, { color: v.text }]}>{label}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        borderWidth: 1.5,
        paddingVertical: 15,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.6,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        elevation: 10,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        fontSize: 18,
    },
    label: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
