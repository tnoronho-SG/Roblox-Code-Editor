function toLuauLiteral(value) {
  if (value === undefined || value === null) return 'nil';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';

  const raw = String(value).trim();
  if (!raw) return '""';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) return raw;
  if (/^true$|^false$|^nil$/.test(raw) || /^-?\d+(?:\.\d+)?$/.test(raw) || /^[-+*/%<>=!~()\[\].]+$/.test(raw)) return raw;
  if (/[\+\-*/%<>=!~()\[\].]/.test(raw) || raw.includes(' ') || raw.includes('\t')) return raw;

  return `"${raw.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function generateSetScore({ variable = 'score', value = '0' } = {}) {
  const variableName = String(variable || 'score');
  const valueExpression = toLuauLiteral(value);
  return `${variableName} = ${valueExpression}`;
}
