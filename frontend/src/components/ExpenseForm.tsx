import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExpense, type ExpenseDTO } from '@/api/expenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

interface ExpenseFormProps {
    userId: string;
}

interface ExpenseFormData {
    amount: number;
    category: string;
    description: string;
    expenseDate: string;
}

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ userId }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseFormData>();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: ExpenseFormData) => {
            const payload: ExpenseDTO = {
                userId,
                amount: data.amount,
                category: data.category,
                description: data.description,
                expenseDate: data.expenseDate,
                idempotencyKey: crypto.randomUUID(),
            };
            return createExpense(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            reset();
        },
    });

    const onSubmit = (data: ExpenseFormData) => {
        mutation.mutate(data);
    };

    // Helper to extract error message
    const getErrorMessage = () => {
        if (!mutation.isError) return null;
        const error = mutation.error;
        if (axios.isAxiosError(error) && error.response) {
            const data = error.response.data as any;

            // Handle Spring Boot Validation Map {"field": "error"}
            if (typeof data === 'object' && !Array.isArray(data) && !data.message && !data.error && !data.status) {
                // If keys look like field names (e.g., amount, category)
                // Check if it's not the default error object from Spring (status, error, message, path)
                return Object.values(data).join(', ');
            }

            // Handle other formats
            if (data.errors && Array.isArray(data.errors)) {
                return data.errors.join(', ');
            }
            if (data.message) return data.message;
            return `Error ${error.response.status}: ${error.response.statusText}`;
        }
        return error.message || 'An unknown error occurred.';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register('amount', {
                                    required: 'Amount is required',
                                    min: { value: 0.01, message: 'Amount must be positive' },
                                    valueAsNumber: true
                                })}
                            />
                            {errors.amount && <p className="text-destructive" style={{ fontSize: '0.75rem' }}>{errors.amount.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                {...register('expenseDate', { required: 'Date is required' })}
                            />
                            {errors.expenseDate && <p className="text-destructive" style={{ fontSize: '0.75rem' }}>{errors.expenseDate.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select id="category" {...register('category', { required: 'Category is required' })}>
                            <option value="">Select a category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Select>
                        {errors.category && <p className="text-destructive" style={{ fontSize: '0.75rem' }}>{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="What was this for?"
                            {...register('description')}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Adding...' : 'Add Expense'}
                    </Button>

                    {mutation.isError && (
                        <div className="text-destructive" style={{ fontSize: '0.875rem', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '0.25rem' }}>
                            {getErrorMessage()}
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default ExpenseForm;
