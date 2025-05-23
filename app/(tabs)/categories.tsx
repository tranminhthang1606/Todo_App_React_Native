import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTodos } from '@/hooks/useTodos';
import { Category } from '@/types/Todo';
import { Colors, categoryColors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CategoriesScreen() {
    const {
        categories,
        todos,
        addCategory,
        updateCategory,
        deleteCategory,
        getTodosByCategory,
    } = useTodos();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>();
    const [categoryName, setCategoryName] = useState('');
    const [selectedColor, setSelectedColor] = useState(categoryColors[0]);
    const [selectedIcon, setSelectedIcon] = useState('folder');

    const iconOptions = [
        'folder', 'briefcase', 'heart', 'book', 'car', 'home',
        'fitness', 'musical-notes', 'camera', 'airplane', 'gift', 'pizza'
    ];

    const handleSaveCategory = async () => {
        if (!categoryName.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
            return;
        }

        try {
            const categoryData = {
                name: categoryName.trim(),
                color: selectedColor,
                icon: selectedIcon,
            };

            if (editingCategory) {
                await updateCategory(editingCategory.id, categoryData);
            } else {
                await addCategory(categoryData);
            }

            resetForm();
            setShowAddForm(false);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu danh mục');
        }
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setSelectedColor(category.color);
        setSelectedIcon(category.icon);
        setShowAddForm(true);
    };

    const handleDeleteCategory = async (category: Category) => {
        const todosInCategory = getTodosByCategory(category.id);

        if (todosInCategory.length > 0) {
            Alert.alert(
                'Không thể xóa',
                `Danh mục này có ${todosInCategory.length} nhiệm vụ. Vui lòng xóa hoặc chuyển các nhiệm vụ trước.`
            );
            return;
        }

        Alert.alert(
            'Xóa danh mục',
            `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => deleteCategory(category.id),
                },
            ]
        );
    };

    const resetForm = () => {
        setCategoryName('');
        setSelectedColor(categoryColors[0]);
        setSelectedIcon('folder');
        setEditingCategory(undefined);
    };

    const handleCancelAdd = () => {
        resetForm();
        setShowAddForm(false);
    };

    const renderCategoryItem = ({ item }: { item: Category }) => {
        const todoCount = getTodosByCategory(item.id).length;

        return (
            <Card style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                        <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                            <Ionicons name={item.icon as any} size={20} color={Colors.light.background} />
                        </View>
                        <View style={styles.categoryDetails}>
                            <Text style={styles.categoryName}>{item.name}</Text>
                            <Text style={styles.categoryCount}>
                                {todoCount} nhiệm vụ
                            </Text>
                        </View>
                    </View>
                    <View style={styles.categoryActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleEditCategory(item)}
                        >
                            <Ionicons name="pencil" size={16} color={Colors.light.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteCategory(item)}
                        >
                            <Ionicons name="trash" size={16} color={Colors.light.error} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Danh mục</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddForm(true)}
                >
                    <Ionicons name="add" size={24} color={Colors.light.primary} />
                </TouchableOpacity>
            </View>

            {showAddForm && (
                <Card style={styles.addForm}>
                    <Text style={styles.formTitle}>
                        {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                    </Text>

                    <Input
                        label="Tên danh mục"
                        value={categoryName}
                        onChangeText={setCategoryName}
                        placeholder="Nhập tên danh mục"
                        autoFocus
                    />

                    <View style={styles.colorSection}>
                        <Text style={styles.sectionLabel}>Màu sắc</Text>
                        <View style={styles.colorGrid}>
                            {categoryColors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.colorOptionSelected,
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                >
                                    {selectedColor === color && (
                                        <Ionicons name="checkmark" size={16} color={Colors.light.background} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.iconSection}>
                        <Text style={styles.sectionLabel}>Biểu tượng</Text>
                        <View style={styles.iconGrid}>
                            {iconOptions.map((icon) => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[
                                        styles.iconOption,
                                        selectedIcon === icon && styles.iconOptionSelected,
                                    ]}
                                    onPress={() => setSelectedIcon(icon)}
                                >
                                    <Ionicons
                                        name={icon as any}
                                        size={20}
                                        color={selectedIcon === icon ? selectedColor : Colors.light.textSecondary}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formActions}>
                        <Button
                            title="Hủy"
                            onPress={handleCancelAdd}
                            variant="ghost"
                            style={styles.cancelButton}
                        />
                        <Button
                            title={editingCategory ? 'Cập nhật' : 'Thêm'}
                            onPress={handleSaveCategory}
                            style={styles.saveButton}
                        />
                    </View>
                </Card>
            )}

            <FlatList
                data={categories}
                keyExtractor={item => item.id}
                renderItem={renderCategoryItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="folder-outline" size={64} color={Colors.light.textSecondary} />
                        <Text style={styles.emptyTitle}>Chưa có danh mục nào</Text>
                        <Text style={styles.emptySubtitle}>Thêm danh mục để tổ chức nhiệm vụ của bạn</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Sizes.padding.lg,
        paddingVertical: Sizes.padding.md,
    },
    title: {
        fontSize: Sizes.fontSize.title,
        fontWeight: '700',
        color: Colors.light.text,
    },
    addButton: {
        padding: Sizes.padding.sm,
    },
    addForm: {
        marginHorizontal: Sizes.padding.lg,
        marginBottom: Sizes.padding.md,
    },
    formTitle: {
        fontSize: Sizes.fontSize.lg,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: Sizes.padding.lg,
    },
    colorSection: {
        marginBottom: Sizes.padding.lg,
    },
    sectionLabel: {
        fontSize: Sizes.fontSize.sm,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: Sizes.padding.sm,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Sizes.padding.sm,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorOptionSelected: {
        borderWidth: 3,
        borderColor: Colors.light.background,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    iconSection: {
        marginBottom: Sizes.padding.lg,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Sizes.padding.sm,
    },
    iconOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.surface,
    },
    iconOptionSelected: {
        backgroundColor: Colors.light.primaryLight,
    },
    formActions: {
        flexDirection: 'row',
        gap: Sizes.padding.sm,
    },
    cancelButton: {
        flex: 1,
    },
    saveButton: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: Sizes.padding.lg,
        paddingBottom: Sizes.padding.xl,
    },
    categoryCard: {
        marginBottom: Sizes.padding.md,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Sizes.padding.md,
    },
    categoryDetails: {
        flex: 1,
    },
    categoryName: {
        fontSize: Sizes.fontSize.md,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: Sizes.padding.xs,
    },
    categoryCount: {
        fontSize: Sizes.fontSize.sm,
        color: Colors.light.textSecondary,
    },
    categoryActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: Sizes.padding.sm,
        marginLeft: Sizes.padding.xs,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.padding.xl * 2,
    },
    emptyTitle: {
        fontSize: Sizes.fontSize.lg,
        fontWeight: '600',
        color: Colors.light.text,
        marginTop: Sizes.padding.md,
        marginBottom: Sizes.padding.sm,
    },
    emptySubtitle: {
        fontSize: Sizes.fontSize.md,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
});