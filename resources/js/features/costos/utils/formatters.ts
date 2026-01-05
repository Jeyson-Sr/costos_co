export const MONEDA = [
  { value: 'SOLES', label: 'SOLES' },
  { value: 'DOLARES', label: 'DOLARES' }
];

export const getCurrentDate = (): string => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  const now = new Date();
  return `${now.getDate()}-${months[now.getMonth()]}-${now.getFullYear().toString().slice(-2)}`;
};

export const getRandomPresupuesto = (): 'ACEPTADO' | 'DENEGADO' =>
  Math.random() > 0.5 ? 'ACEPTADO' : 'DENEGADO';


export const formatMoney = (amount: string | number): string => {
  if (!amount) return '';

  const numericValue = typeof amount === 'string' 
    ? Number.parseFloat(amount.replaceAll(',', ''))
    : amount;

  if (Number.isNaN(numericValue)) return '';

  return new Intl.NumberFormat('en-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};