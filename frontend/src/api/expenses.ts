import api from './axios';

export interface ExpenseDTO {
    id?: string;
    userId: string;
    amount: number;
    category: string;
    description?: string;
    expenseDate: string; // ISO date string YYYY-MM-DD
    createdAt?: string;
    idempotencyKey?: string;
}

export const getExpenses = async (userId?: string, category?: string, sort: string = 'date_desc') => {
    const params: Record<string, string> = { sort };
    if (userId) params.userId = userId;
    if (category) params.category = category;

    const response = await api.get<ExpenseDTO[]>('/expenses', { params });
    return response.data;
};

export const createExpense = async (expense: ExpenseDTO) => {
    const response = await api.post<ExpenseDTO>('/expenses', expense);
    return response.data;
};
