import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Box, Paper, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { SectionCard } from '../components/SectionCard';
import type { FinanceState } from '../data/financeData';
import { formatCurrency } from '../utils/format';

interface ReportsPageProps {
  state: FinanceState;
  dark: boolean;
}

export function ReportsPage({ state, dark }: ReportsPageProps) {
  const expenseCategories = state.transactions.filter((item) => item.type === 'expense').reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.amount;
    return acc;
  }, {});

  const pieData = Object.entries(expenseCategories).map(([name, value], index) => ({
    name,
    value,
    color: ['#16a34a', '#0f766e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][index % 6],
  }));

  const monthlyData = [
    { month: 'Jan', income: 78000, expense: 26000 },
    { month: 'Feb', income: 76000, expense: 24800 },
    { month: 'Mar', income: 82000, expense: 29500 },
    { month: 'Apr', income: 79000, expense: 27800 },
    { month: 'May', income: 85000, expense: 30200 },
    { month: 'Jun', income: 91000, expense: 28600 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <SectionCard title="Financial reports" subtitle="A visual overview of your money" dark={dark}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Paper elevation={0} sx={{ flex: 1, p: 2.2, borderRadius: 3, bgcolor: dark ? '#111827' : '#ecfdf5' }}>
            <Typography variant="body2" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>Tracked income</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>{formatCurrency(state.transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0), state.currency)}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ flex: 1, p: 2.2, borderRadius: 3, bgcolor: dark ? '#111827' : '#eff6ff' }}>
            <Typography variant="body2" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>Tracked expenses</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>{formatCurrency(state.transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0), state.currency)}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ flex: 1, p: 2.2, borderRadius: 3, bgcolor: dark ? '#111827' : '#fffbeb' }}>
            <Typography variant="body2" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>Average savings</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>{formatCurrency(12000, state.currency)}</Typography>
          </Paper>
        </Box>
      </SectionCard>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', xl: 'row' }, gap: 3 }}>
        <SectionCard title="Spending breakdown" subtitle="Category share" dark={dark} action={<PieChartIcon className="h-5 w-5 text-emerald-600" />}>
          <Box sx={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0), state.currency)} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </SectionCard>

        <SectionCard title="Monthly summary" subtitle="Income versus expenses" dark={dark} action={<BarChart3 className="h-5 w-5 text-emerald-600" />}>
          <Box sx={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="month" stroke={dark ? '#cbd5e1' : '#64748b'} />
                <YAxis stroke={dark ? '#cbd5e1' : '#64748b'} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0), state.currency)} />
                <Bar dataKey="income" fill="#16a34a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </SectionCard>
      </Box>
    </Box>
  );
}
