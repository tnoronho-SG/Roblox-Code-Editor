export const ifBlock = {
  id: 'if_block',
  category: 'control',
  name: 'If',
  type: 'statement',
  color: '#32C587',
  contexts: ['server', 'client', 'both'],
  description: 'Runs a block of code if a condition is true.',
  tooltip: 'Equivalent to if condition then ... end',
  inputs: [
    { name: 'left', type: 'string', required: false, default: 'score' },
    { name: 'operator', type: 'string', required: true, default: '>' },
    { name: 'right', type: 'string', required: false, default: '0' },
    { name: 'condition', type: 'boolean', required: false, default: 'true' },
  ],
  validation: ({ left, operator, right, condition }) => {
    const hasStructuredCondition = Boolean(left && String(left).trim()) && Boolean(operator && String(operator).trim()) && Boolean(right && String(right).trim());
    const hasLegacyCondition = Boolean(condition !== undefined && condition !== null && String(condition).trim());
    return {
      valid: hasStructuredCondition || hasLegacyCondition,
      errors: hasStructuredCondition || hasLegacyCondition ? [] : ['A condition is required.'],
    };
  },
};
