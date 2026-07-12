import { useEffect, useMemo, useState } from 'react';
import { Banknote, BriefcaseBusiness, Building2, CarFront, CreditCard, HeartPulse, Home, Pencil, Plus, Search, ShoppingBag, Sparkles, Trash2, TrendingDown, TrendingUp, Utensils, Waves } from 'lucide-react';
import { Box, Chip, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { SectionCard } from '../components/SectionCard';
import type { FinanceState, Transaction, TransactionType } from '../data/financeData';
import { expenseCategories, incomeCategories } from '../data/financeData';
import { formatCurrency, formatDate } from '../utils/format';

const categoryIcons: Record<string, typeof Home> = {
  Food: Utensils,
  Housing: Home,
  Transport: CarFront,
  Utilities: Waves,
  Shopping: ShoppingBag,
  Health: HeartPulse,
  Entertainment: Sparkles,
  Education: BriefcaseBusiness,
  Salary: Banknote,
  Freelance: CreditCard,
  'Side Hustle': Sparkles,
  Investment: Building2,
};

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
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setType(prefillType);
    setCategory(prefillType === 'income' ? incomeCategories[0] : expenseCategories[0]);
  }, [prefillType]);

  const visibleTransactions = useMemo(() => {
    return state.transactions
      .filter((transaction) => (filter === 'all' ? true : transaction.type === filter))
      .filter((transaction) => selectedCategory === 'all' || transaction.category === selectedCategory)
      .filter((transaction) => selectedMonth === 'all' || new Date(transaction.date).toLocaleDateString('en-US', { month: 'long' }).toLowerCase() === selectedMonth.toLowerCase())
      .filter((transaction) => {
        const haystack = `${transaction.title} ${transaction.category} ${transaction.note}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filter, search, selectedCategory, selectedMonth, state.transactions]);

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

  const months = ['all', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xl: '0.95fr 1.05fr' } }}>
      <SectionCard title="Add transaction" subtitle="Capture income or expenses quickly" dark={dark}>
        <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField select label="Type" value={type} onChange={(event) => { const nextType = event.target.value as TransactionType; setType(nextType); setCategory(nextType === 'income' ? incomeCategories[0] : expenseCategories[0]); }} fullWidth>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
            <TextField label="Amount" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} fullWidth slotProps={{ htmlInput: { min: 0 } }} />
          </Box>
          <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} fullWidth placeholder="e.g. Freelance payout" />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField select label="Category" value={category} onChange={(event) => setCategory(event.target.value)} fullWidth>
              {(type === 'income' ? incomeCategories : expenseCategories).map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
            <TextField label="Date" type="date" value={date} onChange={(event) => setDate(event.target.value)} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
          </Box>
          <TextField label="Note" value={note} onChange={(event) => setNote(event.target.value)} multiline rows={3} fullWidth placeholder="Add a note" />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
            <Box component="button" type="submit" style={{ border: 'none', borderRadius: 16, padding: '12px 16px', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              <Plus size={16} /> {editingId ? 'Update' : 'Add'} {type}
            </Box>
            <Box component="button" type="button" onClick={resetForm} style={{ border: 'none', borderRadius: 16, padding: '12px 16px', background: dark ? '#111827' : '#f8fafc', color: dark ? '#e2e8f0' : '#334155', fontWeight: 700, cursor: 'pointer' }}>
              Cancel
            </Box>
          </Box>
        </Box>
      </SectionCard>

      <SectionCard title="Transaction history" subtitle="Search, filter, and manage your activity" dark={dark}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5 }}>
            <TextField placeholder="Search transactions" value={search} onChange={(event) => setSearch(event.target.value)} fullWidth slotProps={{ input: { startAdornment: <Search size={18} style={{ marginRight: 8, color: '#94a3b8' }} /> } }} />
            <TextField select label="Type" value={filter} onChange={(event) => setFilter(event.target.value as 'all' | TransactionType)} sx={{ minWidth: 140 }}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
            <TextField select label="Month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} sx={{ minWidth: 160 }}>
              {months.map((month) => <MenuItem key={month} value={month}>{month === 'all' ? 'All months' : month.charAt(0).toUpperCase() + month.slice(1)}</MenuItem>)}
            </TextField>
            <TextField select label="Category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} sx={{ minWidth: 180 }}>
              <MenuItem value="all">All categories</MenuItem>
              {(expenseCategories.concat(incomeCategories)).map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
            </TextField>
          </Box>

          {visibleTransactions.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {visibleTransactions.map((transaction) => {
                const Icon = categoryIcons[transaction.category] ?? Sparkles;
                return (
                  <Paper key={transaction.id} elevation={0} sx={{ borderRadius: 3, p: 1.6, bgcolor: dark ? '#111827' : '#f8fafc' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1.3 }}>
                      <Box sx={{ display: 'flex', gap: 1.3, alignItems: 'center' }}>
                        <Box sx={{ p: 1, borderRadius: '50%', bgcolor: transaction.type === 'income' ? '#dcfce7' : '#fee2e2', color: transaction.type === 'income' ? '#16a34a' : '#ef4444' }}>
                          {transaction.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{transaction.title}</Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip label={transaction.category} size="small" icon={<Icon size={14} />} sx={{ bgcolor: dark ? '#1e293b' : '#fff', color: dark ? '#f8fafc' : '#334155' }} />
                            <Typography variant="caption" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>{formatDate(transaction.date)}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: transaction.type === 'income' ? '#16a34a' : '#ef4444' }}>{transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, state.currency)}</Typography>
                        <Box component="button" onClick={() => startEdit(transaction)} style={{ border: 'none', background: dark ? '#1e293b' : '#fff', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Pencil size={14} /></Box>
                        <Box component="button" onClick={() => onDelete(transaction.id)} style={{ border: 'none', background: '#fee2e2', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></Box>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ py: 5, textAlign: 'center', color: dark ? 'text.secondary' : 'text.secondary' }}>
              <Typography variant="body2">No transactions match your filters yet.</Typography>
            </Box>
          )}
        </Box>
      </SectionCard>
    </Box>
  );
}
