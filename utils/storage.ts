import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, Category } from '@/types/Todo';

const TODOS_KEY = '@todos';
const CATEGORIES_KEY = '@categories';

export const StorageService = {
    // Todo operations
    async getTodos(): Promise<Todo[]> {
        try {
            const todos = await AsyncStorage.getItem(TODOS_KEY);
            if (todos) {
                return JSON.parse(todos).map((todo: any) => ({
                    ...todo,
                    createdAt: new Date(todo.createdAt),
                    completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
                    dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
                }));
            }
            return [];
        } catch (error) {
            console.error('Error loading todos:', error);
            return [];
        }
    },

    async saveTodos(todos: Todo[]): Promise<void> {
        try {
            await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
        } catch (error) {
            console.error('Error saving todos:', error);
        }
    },

    // Category operations
    async getCategories(): Promise<Category[]> {
        try {
            const categories = await AsyncStorage.getItem(CATEGORIES_KEY);
            if (categories) {
                return JSON.parse(categories);
            }
            return getDefaultCategories();
        } catch (error) {
            console.error('Error loading categories:', error);
            return getDefaultCategories();
        }
    },

    async saveCategories(categories: Category[]): Promise<void> {
        try {
            await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
        } catch (error) {
            console.error('Error saving categories:', error);
        }
    },
};

export const getDefaultCategories = (): Category[] => [
    { id: '1', name: 'Personal', color: '#007AFF', icon: 'person' },
    { id: '2', name: 'Work', color: '#FF9500', icon: 'briefcase' },
    { id: '3', name: 'Shopping', color: '#34C759', icon: 'bag' },
    { id: '4', name: 'Health', color: '#FF3B30', icon: 'heart' },
    { id: '5', name: 'Study', color: '#5856D6', icon: 'book' },
];