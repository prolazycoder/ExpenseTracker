import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExpenseDTO } from '@/api/expenses';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface DashboardStatsProps {
    expenses: ExpenseDTO[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const DashboardStats: React.FC<DashboardStatsProps> = ({ expenses }) => {
    const totalAmount = useMemo(() => {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }, [expenses]);

    const categoryData = useMemo(() => {
        const categories: Record<string, number> = {};
        expenses.forEach(expense => {
            categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        });
        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    const dailyData = useMemo(() => {
        const days: Record<string, number> = {};
        expenses.forEach(expense => {
            const date = expense.expenseDate;
            days[date] = (days[date] || 0) + expense.amount;
        });
        return Object.entries(days)
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([date, amount]) => ({ date, amount }));
    }, [expenses]);

    return (
        <div className="dashboard-grid mb-8">
            <Card>
                <CardHeader className="flex items-center justify-between" style={{ flexDirection: 'row', paddingBottom: '0.5rem' }}>
                    <CardTitle style={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Expenses</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        style={{ height: '1rem', width: '1rem' }}
                        className="text-muted-foreground"
                    >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="font-bold" style={{ fontSize: '1.5rem' }}>${totalAmount.toFixed(2)}</div>
                    <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                        {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
                    </p>
                </CardContent>
            </Card>

            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent style={{ height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Amount']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Daily Trend</CardTitle>
                </CardHeader>
                <CardContent style={{ height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyData.slice(-7)}>
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Amount']} />
                            <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
};

export default DashboardStats;
