export function generateJumpCharacter({ character = 'player.Character' } = {}) {
  const characterName = String(character || 'player.Character');
  return `local humanoid = ${characterName}:FindFirstChildOfClass("Humanoid")
if humanoid then
    humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
end`;
}
