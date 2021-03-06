export const randomInRange = n => Math.floor(Math.random() * n);

export function* range(n: number, step?: number) {
    if (!step) {
        step = 1;
    }
    for (let i = step < 0 ? n : 0; i < n; i += step) {
        yield i;
    }
}
