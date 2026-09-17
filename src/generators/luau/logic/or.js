export function generateOr({ left = 'isAlive', right = 'hasKey' } = {}) {
  const leftValue = String(left || 'isAlive');
  const rightValue = String(right || 'hasKey');
  return `${leftValue} or ${rightValue}`;
}
