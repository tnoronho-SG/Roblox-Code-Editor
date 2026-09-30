function quoteLuauString(value) {
  const raw = String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${raw}"`;
}

export function formatLuauValue(type, key, value, definitions, normalizeOperator, expressionCode) {
  if (key === 'operator') return normalizeOperator(value);
  if (value === undefined || value === null) {
    value = definitions[type]?.props?.[key] ?? 'nil';
  }
  if (key === 'object' && definitions[type]?.output === 'OBJECT') {
    return String(value).trim() || 'nil';
  }
  if (key === 'value' && definitions[type]?.output === 'TEXT') return quoteLuauString(value);
  if (value && typeof value === 'object') return expressionCode(value);
  if (value === 'any') return 'nil';

  if (typeof value === 'string') {
    const raw = value.trim();
    if (['name', 'variable', 'newName', 'function'].includes(key)) return raw || 'value';
    if (!raw) return '""';
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) return raw;
    if (/^true$|^false$|^nil$/.test(raw) || /^-?\d+(?:\.\d+)?$/.test(raw) || /^[-+*/%<>=!~()\[\].]+$/.test(raw)) return raw;
    if (/[+\-*/%<>=!~()\[\].]/.test(raw) || raw.includes(' ') || raw.includes('\t')) return raw;
    return quoteLuauString(raw);
  }

  if (key === 'text' || (key === 'value' && type === 'print') || (key === 'value' && definitions[type]?.props?.valueType === 'Texto')) {
    return quoteLuauString(value);
  }
  if (key === 'value' && definitions[type]?.props?.valueType === 'Boolean') {
    return String(value).toLowerCase() === 'true' ? 'true' : 'false';
  }
  return value;
}

export function serializeLuauExpression(node, definitions, normalizeOperator) {
  const definition = definitions[node.type];
  let code = definition.template;
  Object.entries(node.properties || {}).forEach(([key, value]) => {
    const expressionCode = child => serializeLuauExpression(child, definitions, normalizeOperator);
    code = code.replaceAll(`{${key}}`, formatLuauValue(node.type, key, value, definitions, normalizeOperator, expressionCode));
  });
  return code;
}