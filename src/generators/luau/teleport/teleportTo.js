export function generateTeleportTo({ character = 'player.Character', position = 'Vector3.new(0, 5, 0)' } = {}) {
  const characterName = String(character || 'player.Character');
  const destination = String(position || 'Vector3.new(0, 5, 0)');

  return `${characterName}.PrimaryPart.CFrame = CFrame.new(${destination})`;
}
