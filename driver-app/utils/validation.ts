export const validTWID = (id: string): boolean => {
    id = id.trim().toUpperCase();
    if (!/^[A-Z][12]\d{8}$/.test(id)) return false;

    const map: { [key: string]: number } = {
        A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, J: 18, K: 19, L: 20, M: 21,
        N: 22, P: 23, Q: 24, R: 25, S: 26, T: 27, U: 28, V: 29, X: 30, Y: 31, W: 32, Z: 33, I: 34, O: 35
    };

    const n = map[id[0]];
    if (!n) return false;

    const d = [
        Math.floor(n / 10),
        n % 10,
        parseInt(id[1]),
        parseInt(id[2]),
        parseInt(id[3]),
        parseInt(id[4]),
        parseInt(id[5]),
        parseInt(id[6]),
        parseInt(id[7]),
        parseInt(id[8]),
        parseInt(id[9])
    ];

    const sum =
        d[0] * 1 +
        d[1] * 9 +
        d[2] * 8 +
        d[3] * 7 +
        d[4] * 6 +
        d[5] * 5 +
        d[6] * 4 +
        d[7] * 3 +
        d[8] * 2 +
        d[9] * 1 +
        d[10] * 1;

    return sum % 10 === 0;
};
