import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Todo, Category } from '@/types/Todo';
import { Colors, priorityColors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { DateHelpers } from '@/utils/dateHelpers';
import { Card } from './ui/Card';

interface TodoItemProps {
    todo: Todo;
    category?: Category;
    onToggle: (id: string) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
}

export function TodoItem({ todo, category, onToggle, onEdit, onDelete }: TodoItemProps) {
    const isOverdue = todo.dueDate && !todo.completed && DateHelpers.isOverdue(todo.dueDate);
    const isDueToday = todo.dueDate && DateHelpers.isDueToday(todo.dueDate);

    const handleDelete = () => {
        Alert.alert(
            'Xóa nhiệm vụ',
            'Bạn có chắc chắn muốn xóa nhiệm vụ này?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: () => onDelete(todo.id) },
            ]
        );
    };

    return (
        <Card style={[styles.container, todo.completed && styles.completed]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}
                    onPress={() => onToggle(todo.id)}
                >
                    {todo.completed && (
                        <Ionicons name="checkmark" size={16} color={Colors.light.background} />
                    )}
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text style={[styles.title, todo.completed && styles.titleCompleted]}>
                        {todo.title}
                    </Text>

                    {todo.description && (
                        <Text style={[styles.description, todo.completed && styles.descriptionCompleted]}>
                            {todo.description}
                        </Text>
                    )}

                    <View style={styles.metadata}>
                        {category && (
                            <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                                <Ionicons name={category.icon as any} size={12} color={Colors.light.background} />
                                <Text style={styles.categoryText}>{category.name}</Text>
                            </View>
                        )}

                        <View style={[styles.priorityBadge, { backgroundColor: priorityColors[todo.priority] }]}>
                            <Text style={styles.priorityText}>
                                {todo.priority === 'low' ? 'Thấp' : todo.priority === 'medium' ? 'Trung bình' : 'Cao'}
                            </Text>
                        </View>
                    </View>

                    {todo.dueDate && (
                        <View style={styles.dueDateContainer}>
                            <Ionicons
                                name="time-outline"
                                size={14}
                                color={isOverdue ? Colors.light.error : Colors.light.textSecondary}
                            />
                            <Text style={[
                                styles.dueDate,
                                isOverdue && styles.overdue,
                                isDueToday && styles.dueToday,
                            ]}>
                                {DateHelpers.formatDate(todo.dueDate)}
                                {isOverdue && ' (Quá hạn)'}
                                {isDueToday && ' (Hôm nay)'}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(todo)}>
                        <Ionicons name="pencil" size={18} color={Colors.light.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                        <Ionicons name="trash" size={18} color={Colors.light.error} />
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Sizes.padding.md,
    },
    completed: {
        opacity: 0.7,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Sizes.padding.md,
        marginTop: 2,
    },
    checkboxCompleted: {
        backgroundColor: Colors.light.primary,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: Sizes.fontSize.md,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: Sizes.padding.xs,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: Colors.light.textSecondary,
    },
    description: {
        fontSize: Sizes.fontSize.sm,
        color: Colors.light.textSecondary,
        marginBottom: Sizes.padding.sm,
        lineHeight: 20,
    },
    descriptionCompleted: {
        textDecorationLine: 'line-through',
    },
    metadata: {
        flexDirection: 'row',
        marginBottom: Sizes.padding.sm,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.padding.sm,
        paddingVertical: Sizes.padding.xs,
        borderRadius: Sizes.borderRadius.sm,
        marginRight: Sizes.padding.sm,
    },
    categoryText: {
        fontSize: Sizes.fontSize.xs,
        fontWeight: '600',
        color: Colors.light.background,
        marginLeft: 4,
    },
    priorityBadge: {
        paddingHorizontal: Sizes.padding.sm,
        paddingVertical: Sizes.padding.xs,
        borderRadius: Sizes.borderRadius.sm,
    },
    priorityText: {
        fontSize: Sizes.fontSize.xs,
        fontWeight: '600',
        color: Colors.light.background,
    },
    dueDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dueDate: {
        fontSize: Sizes.fontSize.xs,
        color: Colors.light.textSecondary,
        marginLeft: 4,
    },
    overdue: {
        color: Colors.light.error,
        fontWeight: '600',
    },
    dueToday: {
        color: Colors.light.warning,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        marginLeft: Sizes.padding.sm,
    },
    actionButton: {
        padding: Sizes.padding.sm,
        marginLeft: Sizes.padding.xs,
    },
});