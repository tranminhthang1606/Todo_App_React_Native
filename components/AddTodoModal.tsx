import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
    Platform,
    ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Todo, Category } from '@/types/Todo';
import { Colors, priorityColors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { CategoryPicker } from './CategoryPicker';
import { Card } from './ui/Card';

interface AddTodoModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
    categories: Category[];
    editingTodo?: Todo;
}

export function AddTodoModal({
                                 visible,
                                 onClose,
                                 onSave,
                                 categories,
                                 editingTodo,
                             }: AddTodoModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Todo['priority']>('medium');
    const [category, setCategory] = useState('');
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (editingTodo) {
            setTitle(editingTodo.title);
            setDescription(editingTodo.description || '');
            setPriority(editingTodo.priority);
            setCategory(editingTodo.category);
            setDueDate(editingTodo.dueDate);
        } else {
            resetForm();
        }
    }, [editingTodo, visible]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory(categories[0]?.id || '');
        setDueDate(undefined);
    };

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề nhiệm vụ');
            return;
        }

        if (!category) {
            Alert.alert('Lỗi', 'Vui lòng chọn danh mục');
            return;
        }

        const todoData: Omit<Todo, 'id' | 'createdAt'> = {
            title: title.trim(),
            description: description.trim() || undefined,
            completed: editingTodo?.completed || false,
            priority,
            category,
            dueDate,
            completedAt: editingTodo?.completedAt,
        };

        onSave(todoData);
        resetForm();
        onClose();
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDueDate(selectedDate);
        }
    };

    const removeDueDate = () => {
        setDueDate(undefined);
    };

    const priorityOptions = [
        { key: 'low', label: 'Thấp', color: priorityColors.low },
        { key: 'medium', label: 'Trung bình', color: priorityColors.medium },
        { key: 'high', label: 'Cao', color: priorityColors.high },
    ] as const;

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {editingTodo ? 'Chỉnh sửa nhiệm vụ' : 'Thêm nhiệm vụ mới'}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Input
                        label="Tiêu đề *"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Nhập tiêu đề nhiệm vụ"
                        autoFocus
                    />

                    <Input
                        label="Mô tả"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Nhập mô tả (tùy chọn)"
                        multiline
                        numberOfLines={3}
                    />

                    <CategoryPicker
                        categories={categories}
                        selectedCategory={category}
                        onSelectCategory={setCategory}
                    />

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Mức độ ưu tiên</Text>
                        <View style={styles.priorityContainer}>
                            {priorityOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.key}
                                    style={[
                                        styles.priorityOption,
                                        { borderColor: option.color },
                                        priority === option.key && {
                                            backgroundColor: option.color,
                                        },
                                    ]}
                                    onPress={() => setPriority(option.key)}
                                >
                                    <Text
                                        style={[
                                            styles.priorityText,
                                            {
                                                color:
                                                    priority === option.key
                                                        ? Colors.light.background
                                                        : option.color,
                                            },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Hạn hoàn thành</Text>
                        {dueDate ? (
                            <Card style={styles.dueDateCard}>
                                <View style={styles.dueDateContainer}>
                                    <View style={styles.dueDateInfo}>
                                        <Ionicons name="calendar" size={20} color={Colors.light.primary} />
                                        <Text style={styles.dueDateText}>
                                            {dueDate.toLocaleDateString('vi-VN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={removeDueDate}>
                                        <Ionicons name="close-circle" size={20} color={Colors.light.error} />
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        ) : (
                            <Button
                                title="Chọn ngày hạn"
                                onPress={() => setShowDatePicker(true)}
                                variant="outline"
                            />
                        )}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title="Hủy"
                        onPress={onClose}
                        variant="ghost"
                        style={styles.cancelButton}
                    />
                    <Button
                        title={editingTodo ? 'Cập nhật' : 'Thêm'}
                        onPress={handleSave}
                        style={styles.saveButton}
                    />
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                    />
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.padding.lg,
        paddingVertical: Sizes.padding.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    title: {
        fontSize: Sizes.fontSize.lg,
        fontWeight: '700',
        color: Colors.light.text,
    },
    content: {
        flex: 1,
        paddingHorizontal: Sizes.padding.lg,
        paddingTop: Sizes.padding.lg,
    },
    section: {
        marginBottom: Sizes.padding.lg,
    },
    sectionLabel: {
        fontSize: Sizes.fontSize.sm,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: Sizes.padding.sm,
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priorityOption: {
        flex: 1,
        paddingVertical: Sizes.padding.md,
        marginHorizontal: Sizes.padding.xs,
        borderRadius: Sizes.borderRadius.md,
        borderWidth: 1,
        alignItems: 'center',
    },
    priorityText: {
        fontSize: Sizes.fontSize.sm,
        fontWeight: '600',
    },
    dueDateCard: {
        padding: Sizes.padding.md,
    },
    dueDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dueDateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dueDateText: {
        fontSize: Sizes.fontSize.md,
        color: Colors.light.text,
        marginLeft: Sizes.padding.sm,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: Sizes.padding.lg,
        paddingVertical: Sizes.padding.md,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    cancelButton: {
        flex: 1,
        marginRight: Sizes.padding.sm,
    },
    saveButton: {
        flex: 1,
        marginLeft: Sizes.padding.sm,
    },
});