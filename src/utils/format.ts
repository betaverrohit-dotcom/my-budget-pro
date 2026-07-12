export const formatCurrency = (amount: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

export const formatMonth = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });
