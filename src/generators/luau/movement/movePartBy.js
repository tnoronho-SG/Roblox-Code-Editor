export function generateMovePartBy({ target = 'part', x = '1', y = '0', z = '2' } = {}) {
  const targetValue = String(target || 'part');
  const xValue = String(x ?? '1');
  const yValue = String(y ?? '0');
  const zValue = String(z ?? '2');

  return `${targetValue}.Position = ${targetValue}.Position + Vector3.new(${xValue}, ${yValue}, ${zValue})`;
}
