export const showTextBlock = {
  id: 'show_text',
  category: 'ui',
  name: 'Show text',
  type: 'statement',
  color: '#60A5FA',
  contexts: ['client'],
  description: 'Sets the text displayed by a GUI label.',
  tooltip: 'Updates a TextLabel or TextBox content.',
  inputs: [
    { name: 'target', type: 'string', required: true, default: 'scoreLabel' },
    { name: 'text', type: 'string', required: true, default: 'Level 1' },
  ],
  validation: ({ target, text }) => ({
    valid: Boolean(target && String(target).trim()) && Boolean(text !== undefined && text !== null && String(text).trim() !== ''),
    errors: Boolean(target && String(target).trim()) && Boolean(text !== undefined && text !== null && String(text).trim() !== '') ? [] : ['Target and text are required.'],
  }),
};
