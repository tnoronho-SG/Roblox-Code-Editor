export function generateNot({ value = 'isDead' } = {}) {
  const valueString = String(value || 'isDead');
  return `not ${valueString}`;
}
