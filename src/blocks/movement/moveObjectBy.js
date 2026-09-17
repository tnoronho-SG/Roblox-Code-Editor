export const moveObjectByBlock = {
  id: 'move_object_by',
  category: 'movement',
  name: 'Move object by',
  type: 'statement',
  color: '#36C2FF',
  contexts: ['server', 'client', 'both'],
  description: 'Moves a target object by a distance in a direction.',
  tooltip: 'Use this block to move a Part, Model or Character by a vector distance.',
  inputs: [
    { name: 'target', type: 'Instance', required: true },
    { name: 'distance', type: 'number', required: true },
    { name: 'direction', type: 'Vector3', required: false, default: 'Vector3.new(0, 0, 1)' },
  ],
  documentation: {
    example: 'Move portal by 10 studs along the front direction.',
    luauEquivalent: 'local target = door\nlocal offset = Vector3.new(0, 0, 10)\ntarget:PivotTo(target:GetPivot() + offset)',
  },
  validation: ({ target, distance }) => {
    const errors = [];
    if (!target || !String(target).trim()) {
      errors.push('A target object is required.');
    }
    if (distance === undefined || distance === null || distance === '') {
      errors.push('A distance value is required.');
    }
    return { valid: errors.length === 0, errors };
  },
};
