export const whileBlock = {
  id: 'while_block',
  category: 'control',
  name: 'While',
  type: 'statement',
  color: '#3AA8FF',
  contexts: ['server', 'client', 'both'],
  description: 'Runs while a condition remains true.',
  tooltip: 'Equivalent to while condition do ... end',
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
