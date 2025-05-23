import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTodos } from '@/hooks/useTodos';
import { Todo } from '@/types/Todo';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { TodoItem } from '@/components/TodoItem';
import { TaskStats } from '@/components/TaskStats';
import { AddTodoModal } from '@/components/AddTodoModal';
import { Button } from '@/components/ui/Button';

type FilterType = 'all' | 'pending' | 'completed' | 'today' | 'overdue';

export default function HomeScreen() {
    const {
        todos,
        categories,
        loading,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        getStats,
        getTodayTodos,
        getOverdueTodos,
        reload,
    } = useTodos();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
    const [filter, setFilter] = useState<FilterType>('all');
    const [refreshing, setRefreshing] = useState(false);

    const stats = useMemo(() => getStats(), [todos]);

    const filteredTodos = useMemo(() => {
        switch (filter) {
            case 'pending':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            case 'today':
                return getTodayTodos();
            case 'overdue':
                return getOverdueTodos();
            default:
                return todos;
        }
    }, [todos, filter, getTodayTodos, getOverdueTodos]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await reload();
        setRefreshing(false);
    };

    const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
        if (editingTodo) {
            updateTodo(editingTodo.id, todoData);
            setEditingTodo(undefined);
        } else {
            addTodo(todoData);
        }
    };

    const handleEditTodo = (todo: Todo) => {
        setEditingTodo(todo);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingTodo(undefined);
    };

    const filterOptions = [
        { key: 'all', label: 'Tất cả', count: todos.length },
        { key: 'pending', label: 'Chờ xử lý', count: stats.pending },
        { key: 'today', label: 'Hôm nay', count: getTodayTodos().length },
        { key: 'overdue', label: 'Quá hạn', count: stats.overdue },
        { key: 'completed', label: 'Hoàn thành', count: stats.completed },
    ] as const;

    const renderTodoItem = ({ item }: { item: Todo }) => {
        const category = categories.find(cat => cat.id === item.category);
        return (
            <TodoItem
                todo={item}
                category={category}
                onToggle={toggleTodo}
                onEdit={handleEditTodo}
                onDelete={deleteTodo}
            />
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color={Colors.light.textSecondary} />
            <Text style={styles.emptyTitle}>
                {filter === 'all' ? 'Chưa có nhiệm vụ nào' : 'Không có nhiệm vụ phù hợp'}
            </Text>
            <Text style={styles.emptySubtitle}>
                {filter === 'all'
                    ? 'Bắt đầu thêm nhiệm vụ đầu tiên của bạn'
                    : 'Thử thay đổi bộ lọc để xem nhiệm vụ khác'}
            </Text>
            {filter === 'all' && (
                <Button
                    title="Thêm nhiệm vụ"
                    onPress={() => setShowAddModal(true)}
                    style={styles.emptyButton}
                />
            )}
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Đang tải...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Xin chào! 👋</Text>
                <Text style={styles.headerSubtitle}>Hôm nay bạn có {stats.pending} nhiệm vụ cần hoàn thành</Text>
            </View>

            <TaskStats stats={stats} />

            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={filterOptions}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                filter === item.key && styles.filterChipActive,
                            ]}
                            onPress={() => setFilter(item.key)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    filter === item.key && styles.filterChipTextActive,
                                ]}
                            >
                                {item.label}
                            </Text>
                            {item.count > 0 && (
                                <View style={styles.filterChipBadge}>
                                    <Text style={styles.filterChipBadgeText}>{item.count}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={filteredTodos}
                keyExtractor={item => item.id}
                renderItem={renderTodoItem}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowAddModal(true)}
            >
                <Ionicons name="add" size={24} color={Colors.light.background} />
            </TouchableOpacity>

            <AddTodoModal
                visible={showAddModal}
                onClose={handleCloseModal}
                onSave={handleAddTodo}
                categories={categories}
                editingTodo={editingTodo}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: Sizes.padding.lg,
        paddingVertical: Sizes.padding.md,
    },
    headerTitle: {
        fontSize: Sizes.fontSize.title,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: Sizes.padding.xs,
    },
    headerSubtitle: {
        fontSize: Sizes.fontSize.md,
        color: Colors.light.textSecondary,
    },
    filterContainer: {
        paddingHorizontal: Sizes.padding.lg,
        marginBottom: Sizes.padding.md,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.padding.md,
        paddingVertical: Sizes.padding.sm,
        marginRight: Sizes.padding.sm,
        borderRadius: Sizes.borderRadius.md,
        backgroundColor: Colors.light.surface,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    filterChipActive: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    filterChipText: {
        fontSize: Sizes.fontSize.sm,
        fontWeight: '600',
        color: Colors.light.text,
    },
    filterChipTextActive: {
        color: Colors.light.background,
    },
    filterChipBadge: {
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: Sizes.padding.xs,
        minWidth: 20,
        alignItems: 'center',
    },
    filterChipBadgeText: {
        fontSize: Sizes.fontSize.xs,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    listContent: {
        paddingHorizontal: Sizes.padding.lg,
        paddingBottom: 100,
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
        marginBottom: Sizes.padding.lg,
    },
    emptyButton: {
        marginTop: Sizes.padding.md,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.light.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});