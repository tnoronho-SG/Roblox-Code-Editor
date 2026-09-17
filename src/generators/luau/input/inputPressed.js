export function generateInputPressed({ key = 'E' } = {}) {
  const keyName = String(key || 'E');
  return `local UserInputService = game:GetService("UserInputService")\nUserInputService.InputBegan:Connect(function(input, gameProcessed)\n    if gameProcessed then return end\n    if input.KeyCode == Enum.KeyCode.${keyName} then\n        -- action when ${keyName} is pressed\n    end\nend)`;
}
