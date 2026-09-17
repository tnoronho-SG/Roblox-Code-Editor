export const booleanBlock = {
  id: 'boolean_value',
  category: 'logic',
  name: 'Boolean',
  type: 'expression',
  color: '#7A57FF',
  contexts: ['server', 'client', 'both'],
  description: 'Represents a boolean value.',
  tooltip: 'True or false for logic operations.',
  inputs: [
    { name: 'value', type: 'boolean', required: true, default: 'true' },
  ],
  validation: ({ value }) => ({
    valid: value !== undefined && value !== null && String(value).trim() !== '',
    errors: value !== undefined && value !== null && String(value).trim() !== '' ? [] : ['A boolean value is required.'],
  }),
};
