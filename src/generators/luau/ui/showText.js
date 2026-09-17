export function generateShowText({ target = 'scoreLabel', text = 'Level 1' } = {}) {
  const labelName = String(target || 'scoreLabel');
  const textValue = String(text ?? 'Level 1');
  return `local label = ${labelName}
if label then
    label.Text = "${textValue.replace(/"/g, '\\"')}"
end`;
}
