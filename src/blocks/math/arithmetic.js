export const arithmeticBlock = {
  id: 'arithmetic_block',
  category: 'math',
  name: 'Arithmetic',
  type: 'expression',
  color: '#46B3FF',
  contexts: ['server', 'client', 'both'],
  description: 'Applies arithmetic operators between two values.',
  tooltip: 'Supports +, -, *, / and %.',
  inputs: [
    { name: 'left', type: 'string', required: true, default: 'coins' },
    { name: 'operator', type: 'string', required: true, default: '+' },
    { name: 'right', type: 'string', required: true, default: '10' },
  ],
  validation: ({ left, operator, right }) => ({
    valid: Boolean(left && String(left).trim()) && Boolean(operator && String(operator).trim()) && Boolean(right && String(right).trim()),
    errors: Boolean(left && String(left).trim()) && Boolean(operator && String(operator).trim()) && Boolean(right && String(right).trim()) ? [] : ['Left side, operator and right side are required.'],
  }),
};
