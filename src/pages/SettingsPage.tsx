import { Moon, RotateCcw, Sun, Wallet2 } from 'lucide-react';
import { SectionCard } from '../components/SectionCard';
import type { FinanceState } from '../data/financeData';

interface SettingsPageProps {
  state: FinanceState;
  onToggleTheme: () => void;
  onResetData: () => void;
  dark: boolean;
}

export function SettingsPage({ state, onToggleTheme, onResetData, dark }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="App Preferences" subtitle="Personalize your finance workspace" dark={dark}>
        <div className="space-y-4">
          <div className={`flex items-center justify-between rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              {dark ? <Moon className="h-5 w-5 text-emerald-600" /> : <Sun className="h-5 w-5 text-amber-600" />}
              <div>
                <p className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Dark Mode</p>
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Switch the interface style</p>
              </div>
            </div>
            <button onClick={onToggleTheme} className={`rounded-full px-4 py-2 text-sm font-medium ${dark ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
              {dark ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className={`flex items-center justify-between rounded-2xl p-4 ${dark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <Wallet2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Currency</p>
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Primary display currency</p>
              </div>
            </div>
            <div className={`rounded-full px-4 py-2 text-sm font-semibold ${dark ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-800'}`}>
              {state.currency}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Data Management" subtitle="Reset your saved budget data" dark={dark}>
        <div className={`rounded-2xl border border-dashed p-6 ${dark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-white'}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Reset application data</p>
              <p className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>This will restore the starter budget data and clear your custom entries.</p>
            </div>
            <button onClick={onResetData} className="flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 font-medium text-white">
              <RotateCcw className="h-4 w-4" /> Reset Data
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
