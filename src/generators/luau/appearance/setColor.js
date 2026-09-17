export function generateSetColor({ target = 'part', color = 'Color3.fromRGB(255, 0, 0)' } = {}) {
  const targetValue = String(target || 'part');
  const colorValue = String(color || 'Color3.fromRGB(255, 0, 0)');
  return `${targetValue}.Color = ${colorValue}`;
}
