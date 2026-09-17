export const setColorBlock = {
  id: 'set_color',
  category: 'appearance',
  name: 'Set color',
  type: 'statement',
  color: '#FFB347',
  contexts: ['server', 'client', 'both'],
  description: 'Sets the color of a BasePart or Model child object.',
  tooltip: 'Assigns a Color3 value to the target object.',
  inputs: [
    { name: 'target', type: 'string', required: true, default: 'part' },
    { name: 'color', type: 'string', required: true, default: 'Color3.fromRGB(255, 0, 0)' },
  ],
  validation: ({ target, color }) => ({
    valid: Boolean(target && String(target).trim()) && Boolean(color && String(color).trim()),
    errors: Boolean(target && String(target).trim()) && Boolean(color && String(color).trim()) ? [] : ['Target and color are required.'],
  }),
};
