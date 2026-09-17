export const playSoundBlock = {
  id: 'play_sound',
  category: 'audio',
  name: 'Play sound',
  type: 'statement',
  color: '#F59E0B',
  contexts: ['server', 'client', 'both'],
  description: 'Plays a sound instance with optional volume control.',
  tooltip: 'Creates or uses a Sound instance and plays it.',
  inputs: [
    { name: 'sound', type: 'string', required: true, default: 'coinSound' },
    { name: 'volume', type: 'string', required: false, default: '1' },
  ],
  validation: ({ sound, volume }) => ({
    valid: Boolean(sound && String(sound).trim()) && (volume === undefined || volume === null || String(volume).trim() !== ''),
    errors: Boolean(sound && String(sound).trim()) && (volume === undefined || volume === null || String(volume).trim() !== '') ? [] : ['Sound name and valid volume are required.'],
  }),
};
