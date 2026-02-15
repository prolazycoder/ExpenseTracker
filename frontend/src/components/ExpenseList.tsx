import React, { useState, useMemo } from 'react';
import { type ExpenseDTO } from '@/api/expenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { format } from 'date-fns';

interface ExpenseListProps {
    expenses: ExpenseDTO[];
}

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<SortOption>('date-desc');

    const filteredAndSortedExpenses = useMemo(() => {
        let result = [...expenses];

        // Filter
        if (categoryFilter !== 'all') {
            result = result.filter(e => e.category === categoryFilter);
        }

        // Sort
        result.sort((a, b) => {
            switch (sortOrder) {
                case 'date-desc':
                    return new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime();
                case 'date-asc':
                    return new Date(a.expenseDate).getTime() - new Date(b.expenseDate).getTime();
                case 'amount-desc':
                    return b.amount - a.amount;
                case 'amount-asc':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

        return result;
    }, [expenses, categoryFilter, sortOrder]);

    const totalVisibleAmount = useMemo(() => {
        return filteredAndSortedExpenses.reduce((sum, e) => sum + e.amount, 0);
    }, [filteredAndSortedExpenses]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>Recent Transactions</CardTitle>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full sm:w-[150px]"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Select>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOption)}
                            className="w-full sm:w-[150px]"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Highest Amount</option>
                            <option value="amount-asc">Lowest Amount</option>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 p-4 rounded-lg bg-muted/20 border flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Visible Total</span>
                    <span className="text-lg font-bold">${totalVisibleAmount.toFixed(2)}</span>
                </div>

                <div className="space-y-4">
                    {filteredAndSortedExpenses.length === 0 ? (
                        <p className="text-center text-muted-foreground" style={{ padding: '2rem 0' }}>No expenses found.</p>
                    ) : (
                        filteredAndSortedExpenses.map((expense) => (
                            <div
                                key={expense.id}
                                className="expense-item"
                                data-testid="expense-item"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span style={{ fontWeight: 500 }}>{expense.category}</span>
                                        <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>| {format(new Date(expense.expenseDate), 'MMM d, yyyy')}</span>
                                    </div>

                                    {expense.description && (
                                        <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>{expense.description}</p>
                                    )}
                                </div>
                                <div className="font-bold" style={{ fontSize: '1.125rem' }}>
                                    ${expense.amount.toFixed(2)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ExpenseList;
