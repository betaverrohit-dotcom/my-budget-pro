import { SectionCard } from '../components/SectionCard';
import type { FinanceState } from '../data/financeData';
import { formatCurrency } from '../utils/format';

interface BudgetPageProps {
  state: FinanceState;
  dark: boolean;
}

export function BudgetPage({ state, dark }: BudgetPageProps) {
  const expenses = state.transactions.filter((item) => item.type === 'expense');

  return (
    <div className="space-y-6">
      <SectionCard title="Monthly Budget" subtitle="Stay on top of your spending targets" dark={dark}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-emerald-50'}`}>
            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Planned</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(state.budgets.reduce((sum, budget) => sum + budget.limit, 0), state.currency)}</p>
          </div>
          <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-sky-50'}`}>
            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Actual</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(expenses.reduce((sum, item) => sum + item.amount, 0), state.currency)}</p>
          </div>
          <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-amber-50'}`}>
            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Remaining</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(state.budgets.reduce((sum, budget) => sum + budget.limit, 0) - expenses.reduce((sum, item) => sum + item.amount, 0), state.currency)}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Category Budgets" subtitle="Monitor your spending by category" dark={dark}>
        <div className="space-y-4">
          {state.budgets.map((budget) => {
            const spent = expenses.filter((item) => item.category === budget.category).reduce((sum, item) => sum + item.amount, 0);
            const progress = Math.min(100, Math.round((spent / budget.limit) * 100));
            return (
              <div key={budget.category} className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{budget.category}</p>
                    <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{formatCurrency(spent, state.currency)} of {formatCurrency(budget.limit, state.currency)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm ${progress >= 80 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{progress}%</span>
                </div>
                <div className={`h-3 overflow-hidden rounded-full ${dark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: budget.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
