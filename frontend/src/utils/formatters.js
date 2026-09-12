export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const calculateNights = (checkInStr, checkOutStr) => {
  if (!checkInStr || !checkOutStr) return 0;
  const start = new Date(checkInStr);
  const end = new Date(checkOutStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const calculatePriceBreakdown = (
  pricePerNight = 0,
  nights = 1,
  cleaningFee = 0,
  serviceFee = 0
) => {
  const nightlySubtotal = Number(pricePerNight) * nights;
  const cleaning = Number(cleaningFee);
  const service = Number(serviceFee);
  const total = nightlySubtotal + cleaning + service;
  return {
    nightlySubtotal,
    cleaningFee: cleaning,
    serviceFee: service,
    total,
  };
};
