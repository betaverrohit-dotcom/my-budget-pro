import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
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
    <div className="space-y-6">
      <SectionCard title="Financial Reports" subtitle="Visual overview of your money" dark={dark}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-emerald-50'}`}>
            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Tracked Income</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(state.transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0), state.currency)}</p>
          </div>
          <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-sky-50'}`}>
            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Tracked Expenses</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(state.transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0), state.currency)}</p>
          </div>
          <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-amber-50'}`}>
            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Average Savings</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(12000, state.currency)}</p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Spending Breakdown" subtitle="Category share" dark={dark} action={<PieChartIcon className="h-5 w-5 text-emerald-600" />}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0), state.currency)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Monthly Summary" subtitle="Income vs expenses" dark={dark} action={<BarChart3 className="h-5 w-5 text-emerald-600" />}>
          <div className="h-72">
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
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
