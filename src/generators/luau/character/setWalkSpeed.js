export function generateSetWalkSpeed({ character = 'player.Character', speed = '16' } = {}) {
  const characterName = String(character || 'player.Character');
  const speedValue = String(speed ?? '16');

  return `local humanoid = ${characterName}:FindFirstChildOfClass("Humanoid")\nif humanoid then\n    humanoid.WalkSpeed = ${speedValue}\nend`;
}
