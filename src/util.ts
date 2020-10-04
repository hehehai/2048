export function randomInt(max: number, min = 0): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function max(a: number, b: number): number {
  return a > b ? a : b;
}
