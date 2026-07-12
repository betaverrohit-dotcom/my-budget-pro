import { ArrowDownCircle, ArrowUpCircle, Landmark, PiggyBank, Plus, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Box, Fab, Paper, Typography } from '@mui/material';
import { SectionCard } from '../components/SectionCard';
import type { FinanceState } from '../data/financeData';
import { formatCurrency, formatDate } from '../utils/format';

interface DashboardPageProps {
  state: FinanceState;
  onAddTransaction: (type: 'income' | 'expense') => void;
  dark: boolean;
}

export function DashboardPage({ state, onAddTransaction, dark }: DashboardPageProps) {
  const totalIncome = state.transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = state.transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;
  const savings = Math.round(balance * 0.35);
  const recentTransactions = [...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const emiEstimate = Math.round(totalExpense * 0.12);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', xl: 'row' }, gap: 2 }}>
        {[
          { label: 'Total Balance', value: formatCurrency(balance, state.currency), icon: Wallet, color: '#16a34a', subtitle: 'Net balance available' },
          { label: 'Monthly Income', value: formatCurrency(totalIncome, state.currency), icon: ArrowUpCircle, color: '#0ea5e9', subtitle: 'All income entries' },
          { label: 'Monthly Expense', value: formatCurrency(totalExpense, state.currency), icon: ArrowDownCircle, color: '#ef4444', subtitle: 'Tracked spending' },
          { label: 'Savings', value: formatCurrency(savings, state.currency), icon: PiggyBank, color: '#f59e0b', subtitle: 'Projected reserve' },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} style={{ flex: 1 }}>
              <Paper elevation={0} sx={{ borderRadius: 4, p: 2.5, border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`, bgcolor: dark ? '#0f172a' : '#ffffff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>{item.label}</Typography>
                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>{item.value}</Typography>
                  </Box>
                  <Box sx={{ p: 1.25, borderRadius: 3, bgcolor: `${item.color}15`, color: item.color }}>
                    <Icon size={20} />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ mt: 1.5, color: dark ? 'text.secondary' : 'text.secondary' }}>{item.subtitle}</Typography>
              </Paper>
            </motion.div>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', xl: 'row' }, gap: 3 }}>
        <SectionCard title="Smart actions" subtitle="Capture money in a tap" dark={dark}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => onAddTransaction('income')} style={{ border: 'none', borderRadius: 16, padding: '14px 16px', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 12px 30px rgba(22, 163, 74, 0.2)' }}>
              <Plus size={16} /> Add Income
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => onAddTransaction('expense')} style={{ border: 'none', borderRadius: 16, padding: '14px 16px', background: dark ? '#111827' : '#0f172a', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              <TrendingUp size={16} /> Add Expense
            </motion.button>
          </Box>
        </SectionCard>

        <SectionCard title="Recent activity" subtitle="Your latest transactions" dark={dark}>
          {recentTransactions.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {recentTransactions.map((item) => (
                <Box key={item.id} sx={{ borderRadius: 3, p: 1.5, bgcolor: dark ? '#111827' : '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1.3, alignItems: 'center' }}>
                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: item.type === 'income' ? '#dcfce7' : '#fee2e2', color: item.type === 'income' ? '#16a34a' : '#ef4444' }}>
                      {item.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                      <Typography variant="caption" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>{item.category}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: item.type === 'income' ? '#16a34a' : '#ef4444' }}>{item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount, state.currency)}</Typography>
                    <Typography variant="caption" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>{formatDate(item.date)}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center', color: dark ? 'text.secondary' : 'text.secondary' }}>
              <Typography variant="body2">No transactions yet. Add one to start tracking your money.</Typography>
            </Box>
          )}
        </SectionCard>
      </Box>

      <SectionCard title="Financial snapshot" subtitle="A premium view of your month" dark={dark}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Paper elevation={0} sx={{ flex: 1, p: 2.2, borderRadius: 3, bgcolor: dark ? '#111827' : '#ecfdf5' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><Landmark size={18} color="#16a34a" /><Typography variant="body2" sx={{ fontWeight: 700 }}>Balance</Typography></Box>
            <Typography variant="h5" sx={{ mt: 1.2, fontWeight: 700 }}>{formatCurrency(balance, state.currency)}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ flex: 1, p: 2.2, borderRadius: 3, bgcolor: dark ? '#111827' : '#eff6ff' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><TrendingUp size={18} color="#0ea5e9" /><Typography variant="body2" sx={{ fontWeight: 700 }}>Income growth</Typography></Box>
            <Typography variant="h5" sx={{ mt: 1.2, fontWeight: 700 }}>+12.4%</Typography>
          </Paper>
          <Paper elevation={0} sx={{ flex: 1, p: 2.2, borderRadius: 3, bgcolor: dark ? '#111827' : '#fffbeb' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><Sparkles size={18} color="#f59e0b" /><Typography variant="body2" sx={{ fontWeight: 700 }}>EMI outlook</Typography></Box>
            <Typography variant="h5" sx={{ mt: 1.2, fontWeight: 700 }}>{formatCurrency(emiEstimate, state.currency)}</Typography>
          </Paper>
        </Box>
      </SectionCard>

      <Fab color="primary" aria-label="add transaction" onClick={() => onAddTransaction('expense')} sx={{ position: 'fixed', right: { xs: 24, md: 40 }, bottom: { xs: 92, md: 40 }, bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}>
        <Plus />
      </Fab>
    </Box>
  );
}
