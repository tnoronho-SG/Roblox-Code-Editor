export function generateAnd({ left = 'coins > 0', right = 'lives > 0' } = {}) {
  const leftValue = String(left || 'coins > 0');
  const rightValue = String(right || 'lives > 0');
  return `${leftValue} and ${rightValue}`;
}
