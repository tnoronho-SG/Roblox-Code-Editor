function normalizeOperator(value = '>') {
  const op = String(value || '>').trim();
  if (op === '=') return '==';
  if (op === '==') return '==';
  if (op === '!=') return '!=';
  if (op === '~=') return '~=';
  if (op === '≠') return '~=';
  return op || '>';
}

export function generateWhile({ condition, left, operator = '>', right, body = 'print("loop")' } = {}) {
  const conditionValue = condition !== undefined && condition !== null && String(condition).trim() !== ''
    ? String(condition)
    : `${String(left ?? 'score')} ${normalizeOperator(operator)} ${String(right ?? '0')}`;
  const blockBody = String(body || 'print("loop")');
  return `while ${conditionValue} do\n    ${blockBody}\nend`;
}
