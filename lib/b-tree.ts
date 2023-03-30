
import { Pair, head, pair, tail } from "../lib/list";
import { Data } from "../src/database_engine";

export { BTree, BTreeNode, Child, NodeValue, NodeValues, Data }; 
export { new_btree, btree_insert, new_node, btree_for_each, btree_to_string_arr };

type IsLeaf = boolean;
type Index = number;
type NodeValue = Pair<Index, Data> | null;
type Child = BTreeNode | null;
type NodeValues = Array<NodeValue>;
type Children = Array<Child>;

type BTree = {
    t: number, // minimum degree of the tree
    root: BTreeNode
};

type BTreeNode = {
    leaf: IsLeaf, 
    n: number, // number of values held
    values: NodeValues, 
    children: Children
};


/**
 * Creates a new empty tree
 * @param t minimum degree of the tree
 * @precondition t is greater than 1
 * @returns new BTree
 */
// Might wanna change t functionality
function new_btree(t: number): BTree {
    const root_node: BTreeNode = new_node(t);
    return {t: t, 
            root: root_node};
}


/**
 * Creates a new node
 * @param t minimum degree of the tree
 * @returns new BTreeNode
 */
function new_node(t: number): BTreeNode {
    return {leaf: true, 
            n: 0,
            values: new Array<NodeValue>(2 * t - 1).fill(null), 
            children: new Array<Child>(2 * t).fill(null)};
}

/**
 * Splits a full given child of the given node, increasing the given
 * node's children by one and it's values by one.
 * @param node - node who has a full children to be split
 * @param index - index of the full children to be split
 * @param t - minimum degree of the tree
 */
function split_child(parent_node: BTreeNode, from_index: number, t: number): void {

    const from_node: BTreeNode = parent_node.children[from_index]!; // Precondition not null

    const to_node: BTreeNode = new_node(t);

    to_node.leaf = from_node.leaf;
    to_node.n = t - 1;

    // Transfer from_nodes's greates keys
    for (let i = 0; i < t - 1; i++) {
        to_node.values[i] = from_node.values[i + t];
        from_node.values[i + t] = null;
    }

    // Tranfer corresponding children
    if (! from_node.leaf) {
        for (let i = 0; i < t; i++) {
            to_node.children[i] = from_node.children[i + t];
            from_node.children[i + t] = null; // Added
        }
    }

    from_node.n = t - 1;

    // Shift parent_node children
    for (let i = parent_node.n + 1; i > from_index; i--) {
        parent_node.children[i + 1] = parent_node.children[i];
    }

    parent_node.children[from_index + 1] = to_node;

    // Shift parent_node keys
    for (let i = parent_node.n; i > from_index; i--) {
        parent_node.values[i] = parent_node.values[i - 1];
    }

    parent_node.values[from_index] = from_node.values[t - 1];
    from_node.values[t - 1] = null;

    parent_node.n++;
}

/**
 * Splits the root of the tree, increasing the height of the tree by 1
 * @param tree tree to apply function on
 * @param t minimum degree of the tree
 */
function split_root(tree: BTree, t: number): void {
    const to_node = new_node(t);
    to_node.leaf = false;
    to_node.n = 0;
    to_node.children[0] = tree.root;
    tree.root = to_node;
    split_child(tree.root, 0, t);
}

/**
 * Inserts into node that is not full through recursive lookup
 * @param node the node or ancestor to insert element into
 * @param element element to be inserted into node
 * @param t minimum degree of the tree
 * @precondition node not full
 */
function insert_nonfull(node: BTreeNode, element: NodeValue, t: number): void {
    let i = node.n;

    if (node.leaf) {
        while (i >= 1 && head(element!) < head(node.values[i - 1]!)) {   // Shift keys to make room for element
            node.values[i] = node.values[i - 1]; 
            i--;
        }

        node.values[i] = element;   // insertion
        node.n = node.n + 1;
    } else {
        while (i >= 1 && head(element!) < head(node.values[i - 1]!)) {   // Find the child where element belongs
            i--;
        }
        // i++;

        if (node.children[i]!.n === 2 * t - 1) {    // Check for room in child
            split_child(node, i, t);
            if (head(element!) > head(node.values[i]!)) {
                i++;
            }
        }
        return insert_nonfull(node.children[i]!, element, t);
    }
}


/**
 * Inserts element and rebalances the tree
 * @param tree tree to receive insertion
 * @param primary_key identier for the elements row in table
 * @param element the element to insert into the tree
 * @param t minimum degree of the tree
 */
function btree_insert(tree: BTree, primary_key: Index, element: Data, t: number): void {
    
    if (tree.root.n === 2 * t - 1) {
        split_root(tree, t);
        insert_nonfull(tree.root, pair(primary_key, element), t);
    } else {
        insert_nonfull(tree.root, pair(primary_key, element), t);
    }

}

/**
 * Applies fun to everynode of tree
 * @param tree tree to act on
 * @param fun unary function takes node as argument and return a node
 * @returns updated BTree
 */
function btree_for_each(tree: BTree, fun: (n: BTreeNode) => BTreeNode): BTree {
    function traverser(node: BTreeNode): BTreeNode {
        if (node.leaf) {
            return fun(node);
        } else {
            node = fun(node);
            node.children.forEach( 
                (n) => { return n === null ? n : traverser(n); } 
            );
            return node;
        }
    }

    tree.root = traverser(tree.root);

    return tree;
}

/**
 * Converts the values of a BTree into a single array of elements as strings
 * @param tree tree to take values from
 * @returns string of tree values as strings
 */
function btree_to_string_arr(tree: BTree): Array<string> {
    const data_arr: Array<Data> = [];

    btree_for_each(tree, (node: BTreeNode) => {
        const values: NodeValues = node.values.filter( (v) => v != null );
        values.forEach( (v: NodeValue) => { data_arr[head(v!)] = tail(v!); } );
        return node;
    });

    const string_arr: Array<string> = [];

    for (let i = 0; i < data_arr.length; i++) {
        const value_string: string = "" + data_arr[i];
        string_arr[i] = value_string;
    }

    return string_arr;
}