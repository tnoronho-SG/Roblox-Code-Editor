export const jumpCharacterBlock = {
  id: 'jump_character',
  category: 'character',
  name: 'Jump character',
  type: 'statement',
  color: '#5ED6D0',
  contexts: ['server', 'client', 'both'],
  description: 'Forces a character to jump if they have a Humanoid.',
  tooltip: 'Triggers a jump on the Humanoid instance.',
  inputs: [
    { name: 'character', type: 'string', required: true, default: 'player.Character' },
  ],
  validation: ({ character }) => ({
    valid: Boolean(character && String(character).trim()),
    errors: Boolean(character && String(character).trim()) ? [] : ['Character is required.'],
  }),
};
