export const teleportToBlock = {
  id: 'teleport_to',
  category: 'teleport',
  name: 'Teleport to',
  type: 'statement',
  color: '#FF7B72',
  contexts: ['server', 'client'],
  description: 'Moves a character or object to a target position.',
  tooltip: 'Uses CFrame or a destination Vector3 to move the player or part.',
  inputs: [
    { name: 'character', type: 'string', required: true, default: 'player.Character' },
    { name: 'position', type: 'string', required: true, default: 'Vector3.new(0, 5, 0)' },
  ],
  validation: ({ character, position }) => ({
    valid: Boolean(character && String(character).trim()) && Boolean(position && String(position).trim()),
    errors: Boolean(character && String(character).trim()) && Boolean(position && String(position).trim()) ? [] : ['Character and destination are required.'],
  }),
};
