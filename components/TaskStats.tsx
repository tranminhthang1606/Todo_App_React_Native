import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TodoStats } from '@/types/Todo';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Card } from './ui/Card';

interface TaskStatsProps {
    stats: TodoStats;
}

export function TaskStats({ stats }: TaskStatsProps) {
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    const statItems = [
        {
            label: 'Tổng cộng',
            value: stats.total,
            icon: 'list-outline',
            color: Colors.light.primary,
        },
        {
            label: 'Hoàn thành',
            value: stats.completed,
            icon: 'checkmark-circle-outline',
            color: Colors.light.success,
        },
        {
            label: 'Đang chờ',
            value: stats.pending,
            icon: 'time-outline',
            color: Colors.light.warning,
        },
        {
            label: 'Quá hạn',
            value: stats.overdue,
            icon: 'alert-circle-outline',
            color: Colors.light.error,
        },
    ];

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Thống kê nhiệm vụ</Text>
                <View style={styles.completionRate}>
                    <Text style={styles.completionText}>{completionRate}%</Text>
                </View>
            </View>

            <View style={styles.statsGrid}>
                {statItems.map((item, index) => (
                    <View key={index} style={styles.statItem}>
                        <View style={[styles.statIcon, { backgroundColor: item.color }]}>
                            <Ionicons name={item.icon as any} size={20} color={Colors.light.background} />
                        </View>
                        <Text style={styles.statValue}>{item.value}</Text>
                        <Text style={styles.statLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>

            {stats.total > 0 && (
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${completionRate}%` }
                        ]}
                    />
                </View>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Sizes.padding.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Sizes.padding.lg,
    },
    title: {
        fontSize: Sizes.fontSize.lg,
        fontWeight: '700',
        color: Colors.light.text,
    },
    completionRate: {
        backgroundColor: Colors.light.primaryLight,
        paddingHorizontal: Sizes.padding.md,
        paddingVertical: Sizes.padding.sm,
        borderRadius: Sizes.borderRadius.md,
    },
    completionText: {
        fontSize: Sizes.fontSize.md,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Sizes.padding.lg,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Sizes.padding.sm,
    },
    statValue: {
        fontSize: Sizes.fontSize.xl,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: Sizes.padding.xs,
    },
    statLabel: {
        fontSize: Sizes.fontSize.xs,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
        backgroundColor: Colors.light.surface,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.light.success,
    },
});