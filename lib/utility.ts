export { random_int, append };

/**
 * Generates a number within interval. min, max inclusive 
 * @param max upper bound of interval
 * @param min lower bound of interval
 * @returns 
 */
function random_int(min: number = 1, max: number = 100): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Adds a value to the end of a list.
 * It's like an array.push(value) for immutables
 * @param array input-array to be expanded
 * @param value value to be added
 * @returns new array with appended value
 */
const append = (array: Array<any>, value: any): Array<any> => [...array,value];
