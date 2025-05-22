import { useState, useEffect, useCallback } from 'react';
import { Todo, Category, TodoStats } from '@/types/Todo';
import { StorageService, getDefaultCategories } from '@/utils/storage';
import * as Haptics from 'expo-haptics';

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [loadedTodos, loadedCategories] = await Promise.all([
                StorageService.getTodos(),
                StorageService.getCategories(),
            ]);
            setTodos(loadedTodos);
            setCategories(loadedCategories);
        } catch (error) {
            console.error('Error loading data:', error);
            setCategories(getDefaultCategories());
        } finally {
            setLoading(false);
        }
    };

    // Todo operations
    const addTodo = useCallback(async (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
        const newTodo: Todo = {
            ...todoData,
            id: Date.now().toString(),
            createdAt: new Date(),
        };

        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        await StorageService.saveTodos(updatedTodos);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, [todos]);

    const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
        const updatedTodos = todos.map(todo =>
            todo.id === id ? { ...todo, ...updates } : todo
        );
        setTodos(updatedTodos);
        await StorageService.saveTodos(updatedTodos);
    }, [todos]);

    const deleteTodo = useCallback(async (id: string) => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
        await StorageService.saveTodos(updatedTodos);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }, [todos]);

    const toggleTodo = useCallback(async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const updates: Partial<Todo> = {
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date() : undefined,
        };

        await updateTodo(id, updates);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, [todos, updateTodo]);

    // Category operations
    const addCategory = useCallback(async (categoryData: Omit<Category, 'id'>) => {
        const newCategory: Category = {
            ...categoryData,
            id: Date.now().toString(),
        };

        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        await StorageService.saveCategories(updatedCategories);
    }, [categories]);

    const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
        const updatedCategories = categories.map(category =>
            category.id === id ? { ...category, ...updates } : category
        );
        setCategories(updatedCategories);
        await StorageService.saveCategories(updatedCategories);
    }, [categories]);

    const deleteCategory = useCallback(async (id: string) => {
        // Don't delete if there are todos in this category
        const todosInCategory = todos.filter(todo => todo.category === id);
        if (todosInCategory.length > 0) {
            throw new Error('Không thể xóa danh mục có nhiệm vụ');
        }

        const updatedCategories = categories.filter(category => category.id !== id);
        setCategories(updatedCategories);
        await StorageService.saveCategories(updatedCategories);
    }, [categories, todos]);

    // Statistics
    const getStats = useCallback((): TodoStats => {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        const overdue = todos.filter(todo =>
            !todo.completed &&
            todo.dueDate &&
            todo.dueDate < new Date()
        ).length;

        return { total, completed, pending, overdue };
    }, [todos]);

    const getTodosByCategory = useCallback((categoryId: string) => {
        return todos.filter(todo => todo.category === categoryId);
    }, [todos]);

    const getTodosByPriority = useCallback((priority: Todo['priority']) => {
        return todos.filter(todo => todo.priority === priority && !todo.completed);
    }, [todos]);

    const getOverdueTodos = useCallback(() => {
        return todos.filter(todo =>
            !todo.completed &&
            todo.dueDate &&
            todo.dueDate < new Date()
        );
    }, [todos]);

    const getTodayTodos = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return todos.filter(todo =>
            !todo.completed &&
            todo.dueDate &&
            todo.dueDate >= today &&
            todo.dueDate < tomorrow
        );
    }, [todos]);

    return {
        // State
        todos,
        categories,
        loading,

        // Todo operations
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,

        // Category operations
        addCategory,
        updateCategory,
        deleteCategory,

        // Getters
        getStats,
        getTodosByCategory,
        getTodosByPriority,
        getOverdueTodos,
        getTodayTodos,

        // Utils
        reload: loadData,
    };
}