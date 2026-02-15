import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import DashboardStats from '@/components/DashboardStats';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import { getExpenses } from '@/api/expenses';

// Global User ID constant
const USER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const queryClient = new QueryClient();

// Main content component to use hooks
const ExpenseTrackerApp = () => {
  // Using global constant instead of state
  const userId = USER_ID;

  const { data: expenses = [], isLoading, isError } = useQuery({
    queryKey: ['expenses', userId],
    queryFn: () => getExpenses(userId),
  });

  return (
    <Layout>
      <div className="mb-8">
        {/* Stats Dashboard */}
        {isLoading ? (
          <div className="text-center" style={{ padding: '2rem 0' }}>Loading dashboard...</div>
        ) : (
          <DashboardStats expenses={expenses} />
        )}

        <div className="main-grid grid">
          {/* Expense Form */}
          <div className="col-span-1">
            <ExpenseForm userId={userId} />
          </div>

          {/* Expense List */}
          <div className="col-span-2">
            {isLoading ? (
              <div className="text-center" style={{ padding: '2rem 0' }}>Loading expenses...</div>
            ) : isError ? (
              <div className="text-center text-destructive" style={{ padding: '2rem 0' }}>Error loading expenses. Check backend connection.</div>
            ) : (
              <ExpenseList expenses={expenses} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ExpenseTrackerApp />
    </QueryClientProvider>
  );
};

export default App;
