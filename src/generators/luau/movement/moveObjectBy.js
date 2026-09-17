export function generateMoveObjectBy({ target = 'part', distance = '10', direction = 'Vector3.new(0, 0, 1)' }) {
  const targetName = String(target || 'part');
  const distanceValue = String(distance || '10');
  const directionValue = String(direction || 'Vector3.new(0, 0, 1)');

  const safeTarget = targetName.includes('.') ? targetName : targetName;

  return `local target = ${safeTarget}\nif target:IsA("BasePart") then\n    local offset = ${directionValue} * ${distanceValue}\n    target.Position += offset\nelseif target:IsA("Model") then\n    local pivot = target:GetPivot()\n    local offset = ${directionValue} * ${distanceValue}\n    target:PivotTo(pivot + offset)\nelse\n    warn("move_object_by supports BasePart or Model only")\nend`;
}
