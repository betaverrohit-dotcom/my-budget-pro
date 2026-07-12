import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { SectionCard } from '../components/SectionCard';
import type { FinanceState, Transaction, TransactionType } from '../data/financeData';
import { expenseCategories, incomeCategories } from '../data/financeData';
import { formatCurrency, formatDate } from '../utils/format';

interface TransactionsPageProps {
  state: FinanceState;
  onAddOrUpdate: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  dark: boolean;
  prefillType?: TransactionType;
}

export function TransactionsPage({ state, onAddOrUpdate, onDelete, dark, prefillType = 'expense' }: TransactionsPageProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(expenseCategories[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setType(prefillType);
    setCategory(prefillType === 'income' ? incomeCategories[0] : expenseCategories[0]);
  }, [prefillType]);

  const visibleTransactions = useMemo(() => {
    return state.transactions
      .filter((transaction) => (filter === 'all' ? true : transaction.type === filter))
      .filter((transaction) => {
        const haystack = `${transaction.title} ${transaction.category} ${transaction.note}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filter, search, state.transactions]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !amount) return;

    const transaction: Transaction = {
      id: editingId ?? `tx-${Date.now()}`,
      title,
      amount: Number(amount),
      type,
      category,
      date,
      note,
    };

    onAddOrUpdate(transaction);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setAmount('');
    setCategory(type === 'income' ? incomeCategories[0] : expenseCategories[0]);
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
  };

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setType(transaction.type);
    setTitle(transaction.title);
    setAmount(String(transaction.amount));
    setCategory(transaction.category);
    setDate(transaction.date);
    setNote(transaction.note);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Manage Transactions" subtitle="Add or edit your financial entries" dark={dark}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className={dark ? 'text-slate-300' : 'text-slate-600'}>Type</span>
              <select value={type} onChange={(event) => { const nextType = event.target.value as TransactionType; setType(nextType); setCategory(nextType === 'income' ? incomeCategories[0] : expenseCategories[0]); }} className={`w-full rounded-2xl border px-3 py-3 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className={dark ? 'text-slate-300' : 'text-slate-600'}>Amount</span>
              <input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0" className={`w-full rounded-2xl border px-3 py-3 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} placeholder="0" />
            </label>
          </div>
          <label className="space-y-2 text-sm">
            <span className={dark ? 'text-slate-300' : 'text-slate-600'}>Title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} className={`w-full rounded-2xl border px-3 py-3 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} placeholder="e.g. Freelance payout" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className={dark ? 'text-slate-300' : 'text-slate-600'}>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className={`w-full rounded-2xl border px-3 py-3 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                {(type === 'income' ? incomeCategories : expenseCategories).map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className={dark ? 'text-slate-300' : 'text-slate-600'}>Date</span>
              <input value={date} onChange={(event) => setDate(event.target.value)} type="date" className={`w-full rounded-2xl border px-3 py-3 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
          </div>
          <label className="space-y-2 text-sm">
            <span className={dark ? 'text-slate-300' : 'text-slate-600'}>Note</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} className={`w-full rounded-2xl border px-3 py-3 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} rows={3} placeholder="Add a note" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white">
              <Plus className="h-4 w-4" /> {editingId ? 'Update' : 'Add'} {type}
            </button>
            <button type="button" onClick={resetForm} className={`rounded-2xl px-4 py-3 font-medium ${dark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>Cancel</button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Transaction History" subtitle="Search and filter your activity" dark={dark}>
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <div className={`flex flex-1 items-center gap-2 rounded-2xl border px-3 py-3 ${dark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
            <Search className="h-4 w-4 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transactions" className={`w-full bg-transparent outline-none ${dark ? 'text-white' : 'text-slate-900'}`} />
          </div>
          <select value={filter} onChange={(event) => setFilter(event.target.value as 'all' | TransactionType)} className={`rounded-2xl border px-3 py-3 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="space-y-3">
          {visibleTransactions.map((transaction) => (
            <div key={transaction.id} className={`flex flex-col gap-3 rounded-2xl p-3 md:flex-row md:items-center md:justify-between ${dark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {transaction.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div>
                  <p className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{transaction.title}</p>
                  <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{transaction.category} • {formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>{transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, state.currency)}</p>
                <button onClick={() => startEdit(transaction)} className={`rounded-full p-2 ${dark ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-700'}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(transaction.id)} className="rounded-full bg-rose-100 p-2 text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
