import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ExpenseList from './ExpenseList';
import type { ExpenseDTO } from '@/api/expenses';

// Mock data
// Mock data
const mockExpenses: ExpenseDTO[] = [
    {
        id: '1',
        userId: 'user1',
        amount: 50.00,
        category: 'Food',
        description: 'Lunch',
        expenseDate: '2023-10-25T12:00:00', // Explicit time
        createdAt: '2023-10-25T12:00:00Z'
    },
    {
        id: '2',
        userId: 'user1',
        amount: 100.00,
        category: 'Transport',
        description: 'Gas',
        expenseDate: '2023-10-26T12:00:00',
        createdAt: '2023-10-26T12:00:00Z'
    },
    {
        id: '3',
        userId: 'user1',
        amount: 25.00,
        category: 'Food',
        description: 'Coffee',
        expenseDate: '2023-10-24T12:00:00',
        createdAt: '2023-10-24T12:00:00Z'
    },
];

describe('ExpenseList Component', () => {
    it('renders all expenses initially', () => {
        render(<ExpenseList expenses={mockExpenses} />);

        expect(screen.getByText('Lunch')).toBeInTheDocument();
        expect(screen.getByText('Gas')).toBeInTheDocument();
        expect(screen.getByText('Coffee')).toBeInTheDocument();
        expect(screen.getByText('$175.00')).toBeInTheDocument(); // Total
    });

    it('filters expenses by category', async () => {
        render(<ExpenseList expenses={mockExpenses} />);

        const selects = screen.getAllByRole('combobox');
        const categorySelect = selects[0]; // Assuming first one is category

        fireEvent.change(categorySelect, { target: { value: 'Food' } });

        expect(screen.getByText('Lunch')).toBeInTheDocument();
        expect(screen.getByText('Coffee')).toBeInTheDocument();
        expect(screen.queryByText('Gas')).not.toBeInTheDocument();
        expect(screen.getByText('$75.00')).toBeInTheDocument(); // Total
    });

    it('sorts expenses by date (newest first by default)', () => {
        render(<ExpenseList expenses={mockExpenses} />);

        const items = screen.getAllByTestId('expense-item');
        // Log content for debugging
        console.log('Items Content:', items.map(i => i.textContent));

        expect(items[0]).toHaveTextContent('Gas');
        expect(items[1]).toHaveTextContent('Lunch');
        expect(items[2]).toHaveTextContent('Coffee');
    });

    it('sorts expenses by amount', () => {
        render(<ExpenseList expenses={mockExpenses} />);

        const selects = screen.getAllByRole('combobox');
        const sortSelect = selects[1]; // Assuming second one is sort

        fireEvent.change(sortSelect, { target: { value: 'amount-desc' } }); // Highest Amount

        const itemsDesc = screen.getAllByTestId('expense-item');
        expect(itemsDesc[0]).toHaveTextContent('Gas');
        expect(itemsDesc[1]).toHaveTextContent('Lunch');
        expect(itemsDesc[2]).toHaveTextContent('Coffee');

        fireEvent.change(sortSelect, { target: { value: 'amount-asc' } }); // Lowest Amount

        const itemsAsc = screen.getAllByTestId('expense-item');
        expect(itemsAsc[0]).toHaveTextContent('Coffee');
        expect(itemsAsc[1]).toHaveTextContent('Lunch');
        expect(itemsAsc[2]).toHaveTextContent('Gas');
    });

    it('displays "No expenses found" when list is empty', () => {
        render(<ExpenseList expenses={[]} />);
        expect(screen.getByText('No expenses found.')).toBeInTheDocument();
        expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
});
