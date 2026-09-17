export function generateSetProperty({ target = 'part', property = 'Transparency', value = '0.5' } = {}) {
  const targetValue = String(target || 'part');
  const propertyName = String(property || 'Transparency');
  const propertyValue = String(value ?? '0.5');

  return `${targetValue}.${propertyName} = ${propertyValue}`;
}
