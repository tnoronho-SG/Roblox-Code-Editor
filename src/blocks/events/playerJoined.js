export const playerJoinedBlock = {
  id: 'player_joined',
  category: 'events',
  name: 'Player joined',
  type: 'event',
  color: '#FF5E8A',
  contexts: ['server'],
  description: 'Runs when a player joins the game.',
  tooltip: 'Triggered when Players.PlayerAdded fires.',
  documentation: {
    example: 'When a player joins, greet them.',
    luauEquivalent: 'game.Players.PlayerAdded:Connect(function(player)\n    print(player.Name)\nend)',
  },
};
