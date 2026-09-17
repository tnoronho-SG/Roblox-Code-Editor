export const setPropertyBlock = {
  id: 'set_property',
  category: 'objects',
  name: 'Set property',
  type: 'statement',
  color: '#58D68D',
  contexts: ['server', 'client', 'both'],
  description: 'Sets any property on a Roblox object.',
  tooltip: 'Generic property assignment for objects like Part and Model.',
  inputs: [
    { name: 'target', type: 'string', required: true, default: 'part' },
    { name: 'property', type: 'string', required: true, default: 'Transparency' },
    { name: 'value', type: 'string', required: true, default: '0.5' },
  ],
  validation: ({ target, property, value }) => ({
    valid: Boolean(target && String(target).trim()) && Boolean(property && String(property).trim()) && Boolean(value !== undefined && value !== null && String(value).trim()),
    errors: Boolean(target && String(target).trim()) && Boolean(property && String(property).trim()) && Boolean(value !== undefined && value !== null && String(value).trim()) ? [] : ['Target, property and value are required.'],
  }),
};
