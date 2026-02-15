import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExpenseForm from './ExpenseForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Mock createExpense API
const mockCreateExpense = vi.fn();
vi.mock('@/api/expenses', () => ({
    createExpense: (data: any) => mockCreateExpense(data),
}));

describe('ExpenseForm Component', () => {
    it('renders form fields', () => {
        render(<ExpenseForm userId="test-user" />, { wrapper: Wrapper });

        expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Add Expense/i })).toBeInTheDocument();
    });

    it('shows validation error for negative amount', async () => {
        render(<ExpenseForm userId="test-user" />, { wrapper: Wrapper });

        const amountInput = screen.getByLabelText(/Amount/i);
        const submitBtn = screen.getByRole('button', { name: /Add Expense/i });

        fireEvent.change(amountInput, { target: { value: '-10' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Amount must be positive')).toBeInTheDocument();
        });
    });

    it('shows validation error for missing fields', async () => {
        render(<ExpenseForm userId="test-user" />, { wrapper: Wrapper });

        const submitBtn = screen.getByRole('button', { name: /Add Expense/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Amount is required')).toBeInTheDocument();
            expect(screen.getByText('Date is required')).toBeInTheDocument();
            expect(screen.getByText('Category is required')).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        mockCreateExpense.mockResolvedValue({});
        render(<ExpenseForm userId="test-user" />, { wrapper: Wrapper });

        fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '50.00' } });
        fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2023-10-25' } });
        fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Food' } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Lunch' } });

        const submitBtn = screen.getByRole('button', { name: /Add Expense/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockCreateExpense).toHaveBeenCalledWith(expect.objectContaining({
                amount: 50,
                category: 'Food',
                description: 'Lunch',
                expenseDate: '2023-10-25',
                userId: 'test-user'
            }));
        });
    });
});
