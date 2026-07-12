import { ArrowDownCircle, ArrowUpCircle, Landmark, PiggyBank, Plus, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '../components/StatCard';
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total Balance" value={formatCurrency(balance, state.currency)} accent="bg-emerald-100 text-emerald-700" dark={dark} subtitle="Net balance for this month" />
        <StatCard icon={ArrowUpCircle} label="Monthly Income" value={formatCurrency(totalIncome, state.currency)} accent="bg-sky-100 text-sky-700" dark={dark} subtitle="All income entries" />
        <StatCard icon={ArrowDownCircle} label="Monthly Expense" value={formatCurrency(totalExpense, state.currency)} accent="bg-rose-100 text-rose-700" dark={dark} subtitle="Tracked spending" />
        <StatCard icon={PiggyBank} label="Savings" value={formatCurrency(savings, state.currency)} accent="bg-amber-100 text-amber-700" dark={dark} subtitle="Projected safe reserve" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <SectionCard title="Quick Actions" subtitle="Start tracking your money in seconds" dark={dark}>
          <div className="grid gap-3 sm:grid-cols-2">
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => onAddTransaction('income')} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-4 font-medium text-white shadow-lg shadow-emerald-600/20">
              <Plus className="h-4 w-4" /> Add Income
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => onAddTransaction('expense')} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-4 font-medium text-white shadow-lg shadow-slate-900/20">
              <TrendingUp className="h-4 w-4" /> Add Expense
            </motion.button>
          </div>
        </SectionCard>

        <SectionCard title="Recent Transactions" subtitle="Latest activity" dark={dark}>
          <div className="space-y-3">
            {recentTransactions.map((item) => (
              <div key={item.id} className={`flex items-center justify-between rounded-2xl p-3 ${dark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${item.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {item.type === 'income' ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className={`font-medium ${dark ? 'text-white' : 'text-slate-800'}`}>{item.title}</p>
                    <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>{item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount, state.currency)}</p>
                  <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{formatDate(item.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Monthly Snapshot" subtitle="Spending overview" dark={dark}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-emerald-50'}`}>
            <div className="flex items-center gap-2 text-emerald-600">
              <Landmark className="h-4 w-4" /> <span className="font-semibold">Balance</span>
            </div>
            <p className={`mt-3 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(balance, state.currency)}</p>
          </div>
          <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-sky-50'}`}>
            <div className="flex items-center gap-2 text-sky-600">
              <TrendingUp className="h-4 w-4" /> <span className="font-semibold">Income Growth</span>
            </div>
            <p className={`mt-3 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>+12.4%</p>
          </div>
          <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-amber-50'}`}>
            <div className="flex items-center gap-2 text-amber-600">
              <PiggyBank className="h-4 w-4" /> <span className="font-semibold">Emergency Fund</span>
            </div>
            <p className={`mt-3 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(savings, state.currency)}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
