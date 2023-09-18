import { expect, it, describe } from "bun:test";
import { max, randomInt } from "./util";

describe('randomInt', () => {
  it('should generate a random integer within the range', () => {
    const min = 1;
    const max = 6;
    const num = randomInt(max, min);
    expect(num).toBeGreaterThanOrEqual(min);
    expect(num).toBeLessThanOrEqual(max);
  });

  it('should work with default min value', () => {
    const max = 10;
    const num = randomInt(max);
    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThanOrEqual(max);
  });

  it('should generate an integer', () => {
    const min = 1;
    const max = 6;
    const num = randomInt(max, min);
    expect(Number.isInteger(num)).toBeTrue();
  });
});

describe('max', () => {
  it('should return the larger of two numbers', () => {
    expect(max(1, 2)).toBe(2);
  });

  it('should return the first argument if equal', () => {
    expect(max(3, 3)).toBe(3);
  });

  it('should return the second argument if first is smaller', () => {
    expect(max(-1, -2)).toBe(-1);
  });
});
