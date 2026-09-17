export const setVariableBlock = {
  id: 'set_variable',
  category: 'variables',
  name: 'Set variable',
  type: 'statement',
  color: '#2EC5A3',
  contexts: ['server', 'client', 'both'],
  description: 'Assigns a new value to a variable.',
  tooltip: 'Creates or updates a variable with a given value.',
  inputs: [
    { name: 'name', type: 'string', required: true, default: 'coins' },
    { name: 'value', type: 'string', required: true, default: '0' },
  ],
  validation: ({ name, value }) => ({
    valid: Boolean(name && String(name).trim()) && value !== undefined && value !== null && String(value).trim() !== '',
    errors: Boolean(name && String(name).trim()) && value !== undefined && value !== null && String(value).trim() !== ''
      ? []
      : ['Name and value are required.'],
  }),
};
