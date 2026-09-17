export function generateBoolean({ value = 'true' } = {}) {
  const booleanValue = String(value ?? 'true');
  const normalized = booleanValue === 'false' ? 'false' : 'true';
  return normalized;
}
