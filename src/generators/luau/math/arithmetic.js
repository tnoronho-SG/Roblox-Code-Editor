export function generateArithmetic({ left = 'coins', operator = '+', right = '10' } = {}) {
  const leftValue = String(left || 'coins');
  const rightValue = String(right || '10');
  const op = String(operator || '+');
  return `${leftValue} ${op} ${rightValue}`;
}
