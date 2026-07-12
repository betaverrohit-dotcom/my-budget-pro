import { Moon, RotateCcw, Sun, Wallet2 } from 'lucide-react';
import { Box, Button, Paper, Switch, Typography } from '@mui/material';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <SectionCard title="App preferences" subtitle="Personalize your workspace" dark={dark}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: dark ? '#111827' : '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
              {dark ? <Moon size={18} color="#16a34a" /> : <Sun size={18} color="#f59e0b" />}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Dark mode</Typography>
                <Typography variant="caption" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>Switch the interface style instantly</Typography>
              </Box>
            </Box>
            <Switch checked={dark} onChange={onToggleTheme} color="success" />
          </Paper>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: dark ? '#111827' : '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
              <Wallet2 size={18} color="#16a34a" />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Currency</Typography>
                <Typography variant="caption" sx={{ color: dark ? 'text.secondary' : 'text.secondary' }}>Primary display currency</Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{state.currency}</Typography>
          </Paper>
        </Box>
      </SectionCard>

      <SectionCard title="Data management" subtitle="Reset your saved budget data" dark={dark}>
        <Paper elevation={0} sx={{ borderRadius: 3, border: `1px dashed ${dark ? '#334155' : '#cbd5e1'}`, p: 2.5, bgcolor: dark ? '#111827' : '#ffffff' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 1.5 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>Reset application data</Typography>
              <Typography variant="body2" sx={{ mt: 0.6, color: dark ? 'text.secondary' : 'text.secondary' }}>This restores the starter budget data and clears your custom entries.</Typography>
            </Box>
            <Button variant="contained" color="error" startIcon={<RotateCcw size={16} />} onClick={onResetData}>
              Reset data
            </Button>
          </Box>
        </Paper>
      </SectionCard>
    </Box>
  );
}
