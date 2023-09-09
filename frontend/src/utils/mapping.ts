const SIZE = 12     // must be a divisible of 4

function rint() {
    return Math.floor(Math.random() * 127) + 128
}

export function getMapping(): number[][] {
    let mapping = new Array(256).fill([0, 0, 0])
    for (let i=0; i<256; i++)
        mapping[i] = [rint(), rint(), rint()]
    return mapping
}

export function newDefaultGrid(): number[][][] {
    let grid = new Array(SIZE);
    for (let i=0; i<SIZE; i++)
        grid[i] = new Array(SIZE).fill([30, 48, 75])
    return grid
}

