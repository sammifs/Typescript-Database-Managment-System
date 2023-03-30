export { DoubleLinkedList, DoubleLinkedListNode, is_empty, make_empty, push, pop, top_dlist, display_dlist };

type DoubleLinkedListNode<T> = {
    value: T,
    prev: DoubleLinkedListNode<T> | null,
    next: DoubleLinkedListNode<T> | null,
};

type DoubleLinkedList<T> = {
    head: DoubleLinkedListNode<T> | null,
    tail: DoubleLinkedListNode<T> | null,
    length: number
};

/**
 * Checks whether a dlist is empty.
 * @param stck dlist to check for emptiness
 * @returns Returns true, if the dlist lst has no nodes, false otherwise.
 */
function is_empty<T>(lst: DoubleLinkedList<T>): boolean {
    return lst.length === 0;
}

/**
 * Constructs a dlist without any elements.
 * @returns Returns an empty dlist.
 */
function make_empty<T>(): DoubleLinkedList<T> {
    return { head: null, tail: null, length: 0 };
}

/**
 * Creates and pushes a node to tail of dlist.
 * @param value value to create node of.
 * @param lst dlist to be appended.
 * @returns Returns dlist lst with the node with value at the end.
 */
function push<T>(value: T, lst: DoubleLinkedList<T>): DoubleLinkedList<T> {
    const node: DoubleLinkedListNode<T> = { value, prev: null, next: null };
    if (lst.length === 0) {
        lst.head = node;
        lst.tail = node;
    } else {
        node.prev = lst.tail;
        lst.tail!.next = node;
        lst.tail = node;
    }
    lst.length++;
    return lst;
}

/**
 * Removes the first node from dlist and returns the list
 * @param lst dlist to remove the first element from.
 * @returns dlist lst without the first node.
 */
function pop<T>(lst: DoubleLinkedList<T>): DoubleLinkedList<T> {
    if (lst.length === 0) {
        return lst;
    }
    else if (lst.length === 1) {
        lst.head = null;
        lst.tail = null;
        lst.length--;
        return lst;
    }
    else {
        const node = lst.head!.next!;
        node.prev = null;
        lst.head = node;
        lst.length--;
        return lst;
    }
}

/**
 * Retrieves the first node of the dlist.
 * @param lst dlist to get the first node of.
 * @returns Returns the head node of dlist lst.
 */
function top_dlist<T>(lst: DoubleLinkedList<T>): DoubleLinkedListNode<T> | null {
    return lst.head;
}

function display_dlist<T>(lst: DoubleLinkedList<T>): string {
    function print(s: DoubleLinkedList<T>): string {
        return is_empty(s)
               ? ""
               : top_dlist(s) + "<-> " + print(pop(s));
    }
    if (is_empty(lst)) {
        return "dlist()";
    } else {
        return "dlist(" + print(lst) + ")";
    }
}