export const movePartByBlock = {
  id: 'move_part_by',
  category: 'movement',
  name: 'Move part by',
  type: 'statement',
  color: '#36C2FF',
  contexts: ['server', 'client', 'both'],
  description: 'Moves a BasePart by offset in X, Y and Z.',
  tooltip: 'Adds a Vector3 offset to the current part position.',
  inputs: [
    { name: 'target', type: 'string', required: true, default: 'part' },
    { name: 'x', type: 'string', required: true, default: '1' },
    { name: 'y', type: 'string', required: true, default: '0' },
    { name: 'z', type: 'string', required: true, default: '2' },
  ],
  validation: ({ target, x, y, z }) => ({
    valid: Boolean(target && String(target).trim()) && Boolean(x !== undefined && x !== null && String(x).trim()) && Boolean(y !== undefined && y !== null && String(y).trim()) && Boolean(z !== undefined && z !== null && String(z).trim()),
    errors: Boolean(target && String(target).trim()) && Boolean(x !== undefined && x !== null && String(x).trim()) && Boolean(y !== undefined && y !== null && String(y).trim()) && Boolean(z !== undefined && z !== null && String(z).trim()) ? [] : ['Target and movement values are required.'],
  }),
};
