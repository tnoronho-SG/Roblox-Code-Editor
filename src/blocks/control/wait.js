export const waitBlock = {
  id: 'wait',
  category: 'control',
  name: 'Wait',
  type: 'statement',
  color: '#7C5CFF',
  contexts: ['server', 'client', 'both'],
  description: 'Pauses execution for a time in seconds.',
  tooltip: 'Equivalent to task.wait(seconds).',
  inputs: [
    { name: 'seconds', type: 'number', required: true, default: '1' },
  ],
  validation: ({ seconds }) => ({
    valid: seconds !== undefined && seconds !== null && String(seconds).trim() !== '',
    errors: seconds !== undefined && seconds !== null && String(seconds).trim() !== '' ? [] : ['A wait duration is required.'],
  }),
};
