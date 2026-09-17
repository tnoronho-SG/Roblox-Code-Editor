export const inputPressedBlock = {
  id: 'input_pressed',
  category: 'input',
  name: 'Input pressed',
  type: 'event',
  color: '#44C8A8',
  contexts: ['client'],
  description: 'Fires when a specific key is pressed by the player.',
  tooltip: 'A client-side key listener using UserInputService.',
  inputs: [
    { name: 'key', type: 'string', required: true, default: 'E' },
  ],
  validation: ({ key }) => ({
    valid: Boolean(key && String(key).trim()),
    errors: Boolean(key && String(key).trim()) ? [] : ['A key is required.'],
  }),
};
