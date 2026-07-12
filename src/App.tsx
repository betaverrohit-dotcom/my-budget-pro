import { useMemo, useState } from 'react';
import { BarChart3, ChartPie, Home, Moon, ReceiptText, Settings as SettingsIcon, Sun, Wallet2 } from 'lucide-react';
import { Box, CssBaseline, IconButton, Paper, Typography, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
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
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

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
    <Box sx={{ minHeight: '100vh', bgcolor: dark ? '#020617' : '#f4f7fb', color: dark ? '#f8fafc' : '#0f172a', transition: 'all 0.3s ease' }}>
      <CssBaseline />
      <Box sx={{ maxWidth: 1320, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 2, lg: 3 } }}>
        <Paper elevation={0} sx={{ borderRadius: 4, p: { xs: 2.5, sm: 3, lg: 4 }, mb: 3, border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`, bgcolor: dark ? '#0f172a' : '#ffffff' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#16a34a', letterSpacing: 2.5, fontWeight: 700 }}>My Budget Pro</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.6rem', sm: '2.25rem' } }}>Premium finance command center</Typography>
              <Typography variant="body1" sx={{ mt: 1, color: dark ? 'text.secondary' : 'text.secondary' }}>Track income, control expenses, and monitor growth with a polished banking experience.</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: { xs: 'flex-start', sm: 'center' } }}>
              <IconButton onClick={handleToggleTheme} sx={{ border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`, bgcolor: dark ? '#111827' : '#f8fafc' }}>
                {dark ? <Moon size={18} /> : <Sun size={18} />}
              </IconButton>
              <Paper variant="outlined" sx={{ px: 2, py: 1, borderRadius: 999, borderColor: dark ? '#1e293b' : '#dbeafe' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{finance.currency} • {pageTitle}</Typography>
              </Paper>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xl: '240px 1fr' } }}>
          <Paper elevation={0} sx={{ borderRadius: 4, p: 2, border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`, bgcolor: dark ? '#0f172a' : '#ffffff', height: 'fit-content' }}>
            <Box sx={{ borderRadius: 3, p: 2.2, mb: 2, color: 'white', bgcolor: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
                <Box sx={{ borderRadius: 2, p: 1, bgcolor: 'rgba(255,255,255,0.2)' }}><ChartPie size={18} /></Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Financial health</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Stable</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {navItems.map(({ key, label, icon: Icon }) => (
                <Box key={key} component="button" onClick={() => setPage(key)} style={{ border: 'none', background: page === key ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : dark ? '#111827' : '#f8fafc', color: page === key ? '#fff' : dark ? '#e2e8f0' : '#334155', borderRadius: 16, padding: '12px 14px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontWeight: 700 }}>
                  <Icon size={16} /> {label}
                </Box>
              ))}
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {page === 'dashboard' ? <DashboardPage state={finance} onAddTransaction={handleQuickAction} dark={dark} /> : null}
            {page === 'transactions' ? <TransactionsPage state={finance} onAddOrUpdate={handleAddOrUpdate} onDelete={handleDelete} dark={dark} prefillType={pendingType} /> : null}
            {page === 'budget' ? <BudgetPage state={finance} dark={dark} /> : null}
            {page === 'reports' ? <ReportsPage state={finance} dark={dark} /> : null}
            {page === 'settings' ? <SettingsPage state={finance} onToggleTheme={handleToggleTheme} onResetData={handleResetData} dark={dark} /> : null}
          </Box>
        </Box>

        {!isMobile ? null : (
          <Box sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, px: 2, pb: 2, zIndex: 1200 }}>
            <Paper elevation={3} sx={{ borderRadius: 999, p: 1, display: 'flex', justifyContent: 'space-between', bgcolor: dark ? '#111827' : '#ffffff' }}>
              {navItems.map(({ key, label, icon: Icon }) => (
                <Box key={key} component="button" onClick={() => setPage(key)} style={{ border: 'none', background: page === key ? '#16a34a' : 'transparent', color: page === key ? '#fff' : dark ? '#e2e8f0' : '#64748b', borderRadius: 999, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, cursor: 'pointer' }}>
                  <Icon size={16} />
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{label}</span>
                </Box>
              ))}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}