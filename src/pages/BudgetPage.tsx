import { ReceiptText, ShieldCheck, TrendingDown } from 'lucide-react';
import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import { SectionCard } from '../components/SectionCard';
import type { FinanceState } from '../data/financeData';
import { formatCurrency } from '../utils/format';

interface BudgetPageProps {
  state: FinanceState;
  dark: boolean;
}

export function BudgetPage({ state, dark }: BudgetPageProps) {
  const expenses = state.transactions.filter((item) => item.type === 'expense');
  const planned = state.budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const actual = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = planned - actual;
  const emiEstimate = Math.round(actual * 0.12);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <SectionCard title="Monthly budget" subtitle="Track your spending guardrails" dark={dark}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Paper elevation={0} sx={{ flex: 1, p: 2.2, borderRadius: 3, bgcolor: dark ? '#111827' : '#ecfdf5' }}>
            <Typography variant="body2" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>Planned</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>{formatCurrency(planned, state.currency)}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ flex: 1, p: 2.2, borderRadius: 3, bgcolor: dark ? '#111827' : '#eff6ff' }}>
            <Typography variant="body2" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>Actual</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>{formatCurrency(actual, state.currency)}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ flex: 1, p: 2.2, borderRadius: 3, bgcolor: dark ? '#111827' : '#fffbeb' }}>
            <Typography variant="body2" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>Remaining</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>{formatCurrency(remaining, state.currency)}</Typography>
          </Paper>
        </Box>
      </SectionCard>

      <SectionCard title="Category budgets" subtitle="See which areas need attention" dark={dark}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {state.budgets.map((budget) => {
            const spent = expenses.filter((item) => item.category === budget.category).reduce((sum, item) => sum + item.amount, 0);
            const progress = Math.min(100, Math.round((spent / budget.limit) * 100));
            return (
              <Paper key={budget.category} elevation={0} sx={{ borderRadius: 3, p: 2, bgcolor: dark ? '#111827' : '#f8fafc' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{budget.category}</Typography>
                    <Typography variant="caption" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>{formatCurrency(spent, state.currency)} of {formatCurrency(budget.limit, state.currency)}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: progress >= 80 ? '#ef4444' : '#16a34a' }}>{progress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 999, '& .MuiLinearProgress-bar': { bgcolor: budget.color } }} />
              </Paper>
            );
          })}
        </Box>
      </SectionCard>

      <SectionCard title="EMI tracker" subtitle="Plan major payments comfortably" dark={dark}>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2.2, bgcolor: dark ? '#111827' : '#f8fafc' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
              <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#dcfce7', color: '#16a34a' }}><ReceiptText size={18} /></Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Estimated monthly EMI</Typography>
                <Typography variant="caption" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>Based on your current spending profile</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
              <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#e0f2fe', color: '#0284c7' }}><ShieldCheck size={18} /></Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(emiEstimate, state.currency)}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1.5 }}>
            <TrendingDown size={16} color="#16a34a" />
            <Typography variant="caption" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>This estimate keeps your finances well within a healthy range.</Typography>
          </Box>
        </Paper>
      </SectionCard>
    </Box>
  );
}
