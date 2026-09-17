export const setScoreBlock = {
  id: 'set_score',
  category: 'variables',
  name: 'Set score',
  type: 'statement',
  color: '#2EC5A3',
  contexts: ['server', 'client', 'both'],
  description: 'Sets a score variable to a numeric value.',
  tooltip: 'Stores a value in a score variable.',
  inputs: [
    { name: 'variable', type: 'string', required: true, default: 'score' },
    { name: 'value', type: 'string', required: true, default: '0' },
  ],
  validation: ({ variable, value }) => ({
    valid: Boolean(variable && String(variable).trim()) && Boolean(value !== undefined && value !== null && String(value).trim() !== ''),
    errors: Boolean(variable && String(variable).trim()) && Boolean(value !== undefined && value !== null && String(value).trim() !== '') ? [] : ['Variable and value are required.'],
  }),
};
