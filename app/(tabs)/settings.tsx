import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTodos } from '@/hooks/useTodos';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Card } from '@/components/ui/Card';

export default function SettingsScreen() {
    const { todos, categories, reload } = useTodos();

    const handleClearAllData = () => {
        Alert.alert(
            'Xóa tất cả dữ liệu',
            'Bạn có chắc chắn muốn xóa tất cả nhiệm vụ và danh mục? Hành động này không thể hoàn tác.',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa tất cả',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.multiRemove(['@todos', '@categories']);
                            await reload();
                            Alert.alert('Thành công', 'Đã xóa tất cả dữ liệu');
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa dữ liệu');
                        }
                    },
                },
            ]
        );
    };

    const settingsItems = [
        {
            title: 'Thông tin ứng dụng',
            icon: 'information-circle-outline',
            onPress: () => {
                Alert.alert(
                    'Todo App',
                    'Ứng dụng quản lý nhiệm vụ cá nhân\nPhiên bản: 1.0.0\nPhát triển bằng React Native & Expo'
                );
            },
        },
        {
            title: 'Thống kê',
            icon: 'analytics-outline',
            onPress: () => {
                Alert.alert(
                    'Thống kê',
                    `Tổng số nhiệm vụ: ${todos.length}\nTổng số danh mục: ${categories.length}`
                );
            },
        },
        {
            title: 'Xóa tất cả dữ liệu',
            icon: 'trash-outline',
            onPress: handleClearAllData,
            danger: true,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Cài đặt</Text>
                </View>

                <Card style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Tổng quan</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{todos.length}</Text>
                            <Text style={styles.statLabel}>Nhiệm vụ</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{categories.length}</Text>
                            <Text style={styles.statLabel}>Danh mục</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {todos.filter(t => t.completed).length}
                            </Text>
                            <Text style={styles.statLabel}>Hoàn thành</Text>
                        </View>
                    </View>
                </Card>

                <Card style={styles.settingsCard}>
                    {settingsItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.settingItem,
                                index < settingsItems.length - 1 && styles.settingItemBorder,
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.settingItemLeft}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={20}
                                    color={item.danger ? Colors.light.error : Colors.light.text}
                                />
                                <Text
                                    style={[
                                        styles.settingItemText,
                                        item.danger && styles.settingItemTextDanger,
                                    ]}
                                >
                                    {item.title}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color={Colors.light.textSecondary}
                            />
                        </TouchableOpacity>
                    ))}
                </Card>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Made with ❤️ using React Native & Expo
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        paddingHorizontal: Sizes.padding.lg,
        paddingBottom: Sizes.padding.xl,
    },
    header: {
        paddingVertical: Sizes.padding.md,
    },
    title: {
        fontSize: Sizes.fontSize.title,
        fontWeight: '700',
        color: Colors.light.text,
    },
    statsCard: {
        marginBottom: Sizes.padding.lg,
    },
    statsTitle: {
        fontSize: Sizes.fontSize.lg,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: Sizes.padding.md,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: Sizes.fontSize.xxl,
        fontWeight: '700',
        color: Colors.light.primary,
        marginBottom: Sizes.padding.xs,
    },
    statLabel: {
        fontSize: Sizes.fontSize.sm,
        color: Colors.light.textSecondary,
    },
    settingsCard: {
        marginBottom: Sizes.padding.lg,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Sizes.padding.md,
    },
    settingItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingItemText: {
        fontSize: Sizes.fontSize.md,
        color: Colors.light.text,
        marginLeft: Sizes.padding.md,
    },
    settingItemTextDanger: {
        color: Colors.light.error,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: Sizes.padding.xl,
    },
    footerText: {
        fontSize: Sizes.fontSize.sm,
        color: Colors.light.textSecondary,
    },
});