export function generatePlaySound({ sound = 'coinSound', volume = '1' } = {}) {
  const soundName = String(sound || 'coinSound');
  const volumeValue = String(volume ?? '1');

  return `local sound = workspace:FindFirstChild("${soundName}") or Instance.new("Sound")
sound.Name = "${soundName}"
sound.Volume = ${volumeValue}
sound.Parent = workspace
sound:Play()`;
}
