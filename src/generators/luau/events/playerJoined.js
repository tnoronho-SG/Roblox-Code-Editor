export function generatePlayerJoined({ body = '' } = {}) {
  const lines = String(body || '')
    .split('\n')
    .filter(line => line.trim())
    .map(line => `    ${line}`);
  return [
    'game.Players.PlayerAdded:Connect(function(player)',
    ...lines,
    'end)',
  ].join('\n');
}
