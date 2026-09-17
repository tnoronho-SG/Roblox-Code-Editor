export const andBlock = {
  id: 'and_block',
  category: 'logic',
  name: 'And',
  type: 'expression',
  color: '#7F8CFF',
  contexts: ['server', 'client', 'both'],
  description: 'Returns true only when both conditions are true.',
  tooltip: 'Equivalent to left and right in Luau.',
  inputs: [
    { name: 'left', type: 'string', required: true, default: 'coins > 0' },
    { name: 'right', type: 'string', required: true, default: 'lives > 0' },
  ],
  validation: ({ left, right }) => ({
    valid: Boolean(left && String(left).trim()) && Boolean(right && String(right).trim()),
    errors: Boolean(left && String(left).trim()) && Boolean(right && String(right).trim()) ? [] : ['Both conditions are required.'],
  }),
};
