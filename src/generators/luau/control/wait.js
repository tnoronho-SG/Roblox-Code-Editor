export function generateWait({ seconds = '1' } = {}) {
  const value = String(seconds ?? '1');
  return `task.wait(${value})`;
}
