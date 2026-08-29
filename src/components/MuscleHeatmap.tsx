/**
 * NOVA Core — MuscleHeatmap Component
 * Visual body muscle map showing training intensity per group.
 * Color-intensity driven: cold (blue) → hot (neon green → orange).
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import type { MuscleHeatmapData } from '../services/progressService';

interface MuscleHeatmapProps {
    data: MuscleHeatmapData[];
}

/** Maps intensity 0–10 to a heat color */
function heatColor(intensity: number): string {
    if (intensity === 0) return 'rgba(255,255,255,0.04)';
    if (intensity <= 3) return colors.electric.subtle;
    if (intensity <= 6) return colors.electric.DEFAULT;
    if (intensity <= 8) return colors.neon.DEFAULT;
    return colors.sunset.DEFAULT;
}

function heatTextColor(intensity: number): string {
    if (intensity === 0) return colors.text.muted;
    if (intensity <= 3) return colors.electric.DEFAULT;
    if (intensity <= 6) return colors.electric.bright;
    if (intensity <= 8) return colors.neon.DEFAULT;
    return colors.sunset.DEFAULT;
}

const MUSCLE_ICONS: Record<string, string> = {
    chest: '💪',
    back: '🔙',
    shoulders: '🏋️',
    biceps: '💪',
    triceps: '💪',
    legs: '🦵',
    glutes: '🍑',
    core: '⚡',
    calves: '🦵',
    full_body: '🔥',
    forearms: '💪',
};

export function MuscleHeatmap({ data }: MuscleHeatmapProps) {
    if (!data || data.length === 0) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔥</Text>
                <Text style={styles.emptyText}>Log your first workout to see your muscle heatmap</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Weekly Muscle Activation</Text>
            <View style={styles.grid}>
                {data.map((item) => (
                    <View
                        key={item.muscle}
                        style={[
                            styles.cell,
                            {
                                backgroundColor: heatColor(item.intensity),
                                borderColor: item.intensity > 0
                                    ? `rgba(${item.intensity > 6 ? '0,255,136' : '0,163,255'},0.3)`
                                    : 'rgba(255,255,255,0.05)',
                            },
                        ]}
                    >
                        <Text style={styles.cellIcon}>{MUSCLE_ICONS[item.muscle] ?? '💪'}</Text>
                        <Text style={[styles.cellLabel, { color: heatTextColor(item.intensity) }]}>
                            {item.label}
                        </Text>
                        <Text style={[styles.cellIntensity, { color: heatTextColor(item.intensity) }]}>
                            {item.intensity === 0 ? 'Rest' : `${item.intensity * 10}%`}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                {[
                    { color: 'rgba(255,255,255,0.06)', label: 'Rest' },
                    { color: colors.electric.subtle, label: 'Light' },
                    { color: colors.electric.DEFAULT, label: 'Active' },
                    { color: colors.neon.DEFAULT, label: 'Heavy' },
                    { color: colors.sunset.DEFAULT, label: 'Peak' },
                ].map(({ color, label }) => (
                    <View key={label} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: color }]} />
                        <Text style={styles.legendLabel}>{label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 12 },
    subtitle: {
        fontSize: 13,
        color: colors.text.secondary,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    cell: {
        width: '30%',
        borderRadius: 12,
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        gap: 4,
    },
    cellIcon: { fontSize: 20 },
    cellLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
    cellIntensity: { fontSize: 10, fontWeight: '500' },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 4,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendLabel: { fontSize: 10, color: colors.text.muted },
    empty: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 8,
    },
    emptyIcon: { fontSize: 36 },
    emptyText: {
        color: colors.text.muted,
        fontSize: 13,
        textAlign: 'center',
    },
});
