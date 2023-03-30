import { type Pair, tail, pair } from '../lib/list';

export type HashFunction<K> = (key: K) => number;

export type NoCollisionHashtable<K, V> = {
    readonly arr: Array<Pair<K, V>>,
    readonly hash: HashFunction<K>,
    readonly length: number
};

/**
 * Creates empty NoCollisionHashtable of certain size.
 * 
 * @param size Size of NoCollisionHashtable
 * @param hash hashfunction - has to return number
 * @returns Empty NoCollisionHashtable
 */
export function nc_empty<K, V>(size: number, hash: HashFunction<K>): NoCollisionHashtable<K,V> {
    const arr = new Array(size);
    for (let i = 0 ; i < size ; i++) {
        arr[i] = null;
    }
    return { arr, hash, length: size };
}

/**
 * Searches a NoCollisionHashtable with key
 * 
 * @param param0 NoCollisionHashtable to search in
 * @param key search key
 * @returns Hashed object or undefined
 */
export function nc_lookup<K, V>({arr, hash, length}: NoCollisionHashtable<K, V>, key: K): V | undefined {
    const index = hash(key) % length;
    if (arr[index] === null) {
        return undefined;
    } else {
        return tail(arr[hash(key) % length]);
    }
}

/**
 * Inserts value with specified key into NoCollisionHashtable
 * 
 * @param param0 NoCollisionHashtable to insert item into
 * @param key search key
 * @param value inserted value
 */
export function nc_insert<K, V>({arr, hash, length}: NoCollisionHashtable<K,V>, key: K, value: V): void {
    const index = hash(key) % length;
    if (arr[index] === null) {
        arr[index] = pair(key, value);
    } else {
        throw new Error("Collision in NoCollisionHashtable");
    }
}
