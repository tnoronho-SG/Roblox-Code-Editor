export const comparisonBlock = {
  id: 'comparison_block',
  category: 'logic',
  name: 'Comparison',
  type: 'expression',
  color: '#8C6DFF',
  contexts: ['server', 'client', 'both'],
  description: 'Compares two values with a relational operator.',
  tooltip: 'Produces true or false from a comparison such as > or ==.',
  inputs: [
    { name: 'left', type: 'string', required: true, default: 'coins' },
    { name: 'operator', type: 'string', required: true, default: '>' },
    { name: 'right', type: 'string', required: true, default: '0' },
  ],
  validation: ({ left, operator, right }) => ({
    valid: Boolean(left && String(left).trim()) && Boolean(operator && String(operator).trim()) && Boolean(right && String(right).trim()),
    errors: Boolean(left && String(left).trim()) && Boolean(operator && String(operator).trim()) && Boolean(right && String(right).trim()) ? [] : ['Left side, operator and right side are required.'],
  }),
};
