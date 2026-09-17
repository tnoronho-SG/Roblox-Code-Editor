export const notBlock = {
  id: 'not_block',
  category: 'logic',
  name: 'Not',
  type: 'expression',
  color: '#9B8BF4',
  contexts: ['server', 'client', 'both'],
  description: 'Negates a boolean condition.',
  tooltip: 'Equivalent to not value in Luau.',
  inputs: [
    { name: 'value', type: 'string', required: true, default: 'isDead' },
  ],
  validation: ({ value }) => ({
    valid: Boolean(value && String(value).trim()),
    errors: Boolean(value && String(value).trim()) ? [] : ['A value is required.'],
  }),
};
