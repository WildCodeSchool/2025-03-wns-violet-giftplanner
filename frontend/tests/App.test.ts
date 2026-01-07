import { expect, test } from 'vitest'
function sum(a: number, b: number): number {
    return a + b;
}

test("1 + 1 = 2", () => {
    expect(sum(1, 1)).toBe(2);
});
