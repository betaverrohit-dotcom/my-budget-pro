export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note: string;
}

export interface BudgetCategory {
  category: string;
  limit: number;
  color: string;
}

export interface FinanceState {
  theme: 'light' | 'dark';
  currency: string;
  transactions: Transaction[];
  budgets: BudgetCategory[];
}

export const expenseCategories = [
  'Housing',
  'Food',
  'Transport',
  'Utilities',
  'Shopping',
  'Health',
  'Entertainment',
  'Education',
];

export const incomeCategories = ['Salary', 'Freelance', 'Side Hustle', 'Investment'];

const createDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Salary Deposit',
    amount: 85000,
    type: 'income',
    category: 'Salary',
    date: createDate(2),
    note: 'Monthly salary credited',
  },
  {
    id: 'tx-2',
    title: 'Groceries',
    amount: 4800,
    type: 'expense',
    category: 'Food',
    date: createDate(1),
    note: 'Weekly grocery run',
  },
  {
    id: 'tx-3',
    title: 'Flight Booking',
    amount: 12800,
    type: 'expense',
    category: 'Travel',
    date: createDate(3),
    note: 'Weekend trip',
  },
  {
    id: 'tx-4',
    title: 'Freelance Project',
    amount: 18000,
    type: 'income',
    category: 'Freelance',
    date: createDate(5),
    note: 'Design retainer',
  },
  {
    id: 'tx-5',
    title: 'Electricity Bill',
    amount: 2400,
    type: 'expense',
    category: 'Utilities',
    date: createDate(6),
    note: 'Monthly bill',
  },
  {
    id: 'tx-6',
    title: 'Investment Return',
    amount: 6500,
    type: 'income',
    category: 'Investment',
    date: createDate(7),
    note: 'Dividend payout',
  },
];

export const initialBudgets: BudgetCategory[] = [
  { category: 'Food', limit: 15000, color: '#16a34a' },
  { category: 'Housing', limit: 22000, color: '#0f766e' },
  { category: 'Transport', limit: 8000, color: '#3b82f6' },
  { category: 'Utilities', limit: 12000, color: '#8b5cf6' },
  { category: 'Shopping', limit: 10000, color: '#f59e0b' },
  { category: 'Health', limit: 6000, color: '#ef4444' },
];

export const initialFinanceState: FinanceState = {
  theme: 'light',
  currency: 'INR',
  transactions: initialTransactions,
  budgets: initialBudgets,
};
