export const setWalkSpeedBlock = {
  id: 'set_walk_speed',
  category: 'character',
  name: 'Set walk speed',
  type: 'statement',
  color: '#5ED6D0',
  contexts: ['server', 'client', 'both'],
  description: 'Changes the walk speed of a character.',
  tooltip: 'Assigns a new value to the Humanoid WalkSpeed.',
  inputs: [
    { name: 'character', type: 'string', required: true, default: 'player.Character' },
    { name: 'speed', type: 'string', required: true, default: '16' },
  ],
  validation: ({ character, speed }) => ({
    valid: Boolean(character && String(character).trim()) && Boolean(speed !== undefined && speed !== null && String(speed).trim()),
    errors: Boolean(character && String(character).trim()) && Boolean(speed !== undefined && speed !== null && String(speed).trim()) ? [] : ['Character and speed are required.'],
  }),
};
