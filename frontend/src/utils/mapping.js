const SIZE = 12; // must be a divisible of 4

export function newDefaultGrid() {
    const grid = new Array(SIZE);
    for (let i = 0; i < SIZE; i++) grid[i] = new Array(SIZE).fill([30,41,59]);
    return grid;
}
