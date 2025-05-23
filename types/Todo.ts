export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category: string;
    createdAt: Date;
    completedAt?: Date;
    dueDate?: Date;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
}

export interface TodoStats {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
}