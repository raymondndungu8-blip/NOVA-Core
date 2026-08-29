/**
 * NOVA Core — ProgressBar Component
 * Animated fill bar with Electric Blue / Neon Green gradient effect.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type BarColor = 'blue' | 'green' | 'orange' | 'violet' | 'red';

interface ProgressBarProps {
    value: number;      // 0–100
    label?: string;
    sublabel?: string;
    color?: BarColor;
    height?: number;
    showPercent?: boolean;
    animated?: boolean;
}

const barColors: Record<BarColor, string> = {
    blue: colors.electric.DEFAULT,
    green: colors.neon.DEFAULT,
    orange: colors.sunset.DEFAULT,
    violet: colors.violet.DEFAULT,
    red: colors.error,
};

const glowColors: Record<BarColor, string> = {
    blue: colors.electric.glow,
    green: colors.neon.glow,
    orange: colors.sunset.glow,
    violet: colors.violet.glow,
    red: 'rgba(255,59,92,0.3)',
};

export function ProgressBar({
    value,
    label,
    sublabel,
    color = 'blue',
    height = 8,
    showPercent = false,
    animated = true,
}: ProgressBarProps) {
    const widthAnim = useRef(new Animated.Value(0)).current;
    const clamped = Math.max(0, Math.min(100, value));

    useEffect(() => {
        if (animated) {
            Animated.timing(widthAnim, {
                toValue: clamped,
                duration: 800,
                useNativeDriver: false,
            }).start();
        } else {
            widthAnim.setValue(clamped);
        }
    }, [clamped]);

    const widthPct = widthAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.wrapper}>
            {(label || showPercent) && (
                <View style={styles.labelRow}>
                    {label && <Text style={styles.label}>{label}</Text>}
                    {showPercent && <Text style={[styles.percent, { color: barColors[color] }]}>{Math.round(clamped)}%</Text>}
                </View>
            )}
            <View style={[styles.track, { height, borderRadius: height / 2 }]}>
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            width: widthPct,
                            height,
                            borderRadius: height / 2,
                            backgroundColor: barColors[color],
                            shadowColor: glowColors[color],
                        },
                    ]}
                />
            </View>
            {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { gap: 6 },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    percent: {
        fontSize: 13,
        fontWeight: '700',
    },
    track: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
    },
    fill: {
        shadowOpacity: 0.8,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
    },
    sublabel: {
        fontSize: 11,
        color: colors.text.muted,
    },
});
