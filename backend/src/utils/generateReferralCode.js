export const generateReferralCode = (name = 'JAN') => {
  const prefix = name.replace(/[^a-z]/gi, '').toUpperCase().slice(0, 3) || 'JAN';
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
};
