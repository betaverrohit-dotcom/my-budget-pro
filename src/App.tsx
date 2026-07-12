import { useMemo, useState } from 'react';
import { BarChart3, ChartPie, Home, Moon, ReceiptText, Settings as SettingsIcon, Sun, Wallet2 } from 'lucide-react';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetPage } from './pages/BudgetPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { initialFinanceState, type FinanceState, type Transaction, type TransactionType } from './data/financeData';
import { useLocalStorage } from './hooks/useLocalStorage';

export type PageKey = 'dashboard' | 'transactions' | 'budget' | 'reports' | 'settings';

const navItems: Array<{ key: PageKey; label: string; icon: typeof Home }> = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'transactions', label: 'Transactions', icon: ReceiptText },
  { key: 'budget', label: 'Budget', icon: Wallet2 },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function App() {
  const [finance, setFinance] = useLocalStorage<FinanceState>('my-budget-pro-state', initialFinanceState);
  const [page, setPage] = useState<PageKey>('dashboard');
  const [pendingType, setPendingType] = useState<TransactionType>('expense');

  const dark = finance.theme === 'dark';

  const pageTitle = useMemo(() => {
    switch (page) {
      case 'transactions':
        return 'Transactions';
      case 'budget':
        return 'Budget';
      case 'reports':
        return 'Reports';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  }, [page]);

  const handleAddOrUpdate = (transaction: Transaction) => {
    setFinance((prev) => ({
      ...prev,
      transactions: prev.transactions.some((item) => item.id === transaction.id)
        ? prev.transactions.map((item) => (item.id === transaction.id ? transaction : item))
        : [transaction, ...prev.transactions],
    }));
    setPage('transactions');
  };

  const handleDelete = (id: string) => {
    setFinance((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((item) => item.id !== id),
    }));
  };

  const handleQuickAction = (type: TransactionType) => {
    setPendingType(type);
    setPage('transactions');
  };

  const handleToggleTheme = () => {
    setFinance((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const handleResetData = () => {
    setFinance((prev) => ({
      ...initialFinanceState,
      theme: prev.theme,
      currency: prev.currency,
    }));
    setPage('dashboard');
  };

  return (
    <div className={`min-h-screen transition-colors ${dark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className={`rounded-[28px] border p-4 shadow-sm sm:p-6 ${dark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-600">My Budget Pro</p>
              <h1 className={`mt-2 text-3xl font-semibold sm:text-4xl ${dark ? 'text-white' : 'text-slate-900'}`}>Premium personal finance control</h1>
              <p className={`mt-2 max-w-2xl text-sm sm:text-base ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Track income, budget by category, and review your savings in a polished banking-style workspace.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={handleToggleTheme} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${dark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-700'}`}>
                {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} {dark ? 'Dark' : 'Light'} mode
              </button>
              <div className={`rounded-full px-4 py-2 text-sm font-semibold ${dark ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                {finance.currency} • {pageTitle}
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
          <aside className={`rounded-[28px] border p-3 shadow-sm ${dark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
            <div className="mb-3 rounded-2xl bg-emerald-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/20 p-2">
                  <ChartPie className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Financial health</p>
                  <p className="text-xl font-semibold">Stable</p>
                </div>
              </div>
            </div>
            <nav className="space-y-2">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setPage(key)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${page === key ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : dark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">
            {page === 'dashboard' ? (
              <DashboardPage state={finance} onAddTransaction={handleQuickAction} dark={dark} />
            ) : null}
            {page === 'transactions' ? (
              <TransactionsPage state={finance} onAddOrUpdate={handleAddOrUpdate} onDelete={handleDelete} dark={dark} prefillType={pendingType} />
            ) : null}
            {page === 'budget' ? <BudgetPage state={finance} dark={dark} /> : null}
            {page === 'reports' ? <ReportsPage state={finance} dark={dark} /> : null}
            {page === 'settings' ? <SettingsPage state={finance} onToggleTheme={handleToggleTheme} onResetData={handleResetData} dark={dark} /> : null}
          </main>
        </div>
      </div>
    </div>
  );
}