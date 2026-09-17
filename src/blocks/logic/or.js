export const orBlock = {
  id: 'or_block',
  category: 'logic',
  name: 'Or',
  type: 'expression',
  color: '#8B7CF3',
  contexts: ['server', 'client', 'both'],
  description: 'Returns true when at least one condition is true.',
  tooltip: 'Equivalent to left or right in Luau.',
  inputs: [
    { name: 'left', type: 'string', required: true, default: 'isAlive' },
    { name: 'right', type: 'string', required: true, default: 'hasKey' },
  ],
  validation: ({ left, right }) => ({
    valid: Boolean(left && String(left).trim()) && Boolean(right && String(right).trim()),
    errors: Boolean(left && String(left).trim()) && Boolean(right && String(right).trim()) ? [] : ['Both conditions are required.'],
  }),
};
