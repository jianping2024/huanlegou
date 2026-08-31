function formatPrice(n) {
  if (n < 1) return '¥' + n.toFixed(2);
  return '¥' + n.toFixed(n % 1 === 0 ? 0 : 2);
}
