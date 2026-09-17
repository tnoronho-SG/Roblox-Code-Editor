export function generateComparison({ left = 'coins', operator = '>', right = '0' } = {}) {
  const leftValue = String(left || 'coins');
  const rightValue = String(right || '0');
  const op = String(operator || '>');
  return `${leftValue} ${op} ${rightValue}`;
}
