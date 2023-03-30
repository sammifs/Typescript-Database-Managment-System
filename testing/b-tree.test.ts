import { random_int } from "../lib/utility";
import { BTreeNode, BTree, Child, new_btree, NodeValue, Data, NodeValues, btree_insert } from "../lib/b-tree"

function node_n_is_correct(node: BTreeNode): boolean {
    const values = node.values.filter( (e) => e != null );
    return values.length === node.n;
}

function node_values_are_sorted(node: BTreeNode): boolean {
    const node_values: NodeValues = node.values.filter((v: NodeValue) => v != null);
    const values_length: number = node_values.length;

    for (let i = 0; i < values_length; i++) {
        for (let j = i + 1; j < values_length; j++) {
            if ( node_values[i]! > node_values[j]! ) {
                return false;
            }
        }
    }

    return true;
}

function node_has_correct_number_of_children(node: BTreeNode): boolean {
    const number_of_values: number = node.n;
    const number_of_children: number = node.children.filter( (c: Child) => c != null ).length;

    if (node.leaf) {
        return number_of_children === 0;
    } else {
        return number_of_values + 1 === number_of_children;
    }

}


// Bug
function node_values_separate_ranges(node: BTreeNode): boolean {

    function find_left_child_value(node: BTreeNode, i: number): NodeValue {
        const child: BTreeNode = node.children[i]!
        const child_values: NodeValues = child.values.filter( (v: NodeValue) => v != null );
        const last_element: NodeValue = child_values[child_values.length - 1];
        return last_element;
    }

    function find_right_child_value(node: BTreeNode, i: number): NodeValue {
        const child: BTreeNode = node.children[i + 1]!
        const child_values: NodeValues = child.values.filter( (v: NodeValue) => v != null );
        const first_element: NodeValue = child_values[0];
        return first_element;
    }

    const number_of_values: number = node.n;

    if (node.leaf || number_of_values === 0) {
        return true; 
    }

    for (let i = 0; i < number_of_values; i++) {
        const value: Data = node.values[i]!;

        const left_child_value: NodeValue = find_left_child_value(node, i)!;
        const right_child_value: NodeValue = find_right_child_value(node, i)!;
        
        if (left_child_value > value || value > right_child_value) {
            return false;
        }
    }

    return true;

}

function node_has_valid_degree(node: BTreeNode, t: number) {
    return node.n <= 2 * t - 1;
}

function tree_has_correct_leaf_attribute(tree: BTree): boolean {
    let result = true;

    function node_has_no_children(node: BTreeNode): boolean {
        return node.children.filter( (c: Child) => c != null ).length === 0;
    }

    function leaf_control_node(node: BTreeNode): boolean {
        if (node.leaf) {
            return node_has_no_children(node);
        } else {
            return !node_has_no_children(node);
        }
    }

    function traverser(node: BTreeNode): void {
        if (node_has_no_children(node) === false) {
            node.children.forEach( 
                (n) => { return n === null ? n : traverser(n); } 
            );
        }

        if (leaf_control_node(node) === false)  {
            result = false;
        }
    }

    traverser(tree.root);

    return result;
}

function create_test_tree(max_t: number = 10, max_elements: number = 1000): BTree {
    max_t = max_t < 2 ? 2 : max_t;
    const t: number = random_int(2, max_t);
    max_elements = max_elements < t ? t : max_elements;
    const number_of_elements: number = random_int(t, max_elements);
    const tree: BTree = new_btree(t);

    for (let i = 0; i < number_of_elements; i++) {
        btree_insert(tree, random_int(0, max_elements), t);
    }

    return tree;
}


test("root n is correct", () => {
    const tree: BTree = create_test_tree();
    expect(node_n_is_correct(tree.root)).toBe(true);
})

test("tree has correct leaf attribute", () => {
    const tree: BTree = create_test_tree();
    expect(node_n_is_correct(tree.root)).toBe(true);
})

test("root values are sorted", () => {
    const tree: BTree = create_test_tree();
    expect(node_values_are_sorted(tree.root)).toBe(true);
})

test("root has correct number of children", () => {
    const tree: BTree = create_test_tree();
    expect(node_has_correct_number_of_children(tree.root)).toBe(true);
})

test("root has values separate ranges", () => {
    const tree: BTree = create_test_tree();
    expect(node_values_separate_ranges(tree.root)).toBe(true);
})

test("root has valid degree", () => {
    const tree: BTree = create_test_tree();
    expect(node_has_valid_degree(tree.root, tree.t)).toBe(true);
})

test("testtree is valid", () => {
    const tree: BTree = create_test_tree();
    const t = tree.t;

    function control_node_and_descendants(node: BTreeNode): boolean {
        if (node.leaf === false) {
            node.children.forEach( 
                (n) => { return n === null 
                                ? n 
                                : control_node_and_descendants(n); } 
            );
        }

        const n_is_correct: boolean = node_n_is_correct(node);
        const values_are_sorted: boolean = node_values_are_sorted(node);
        const correct_number_of_children :boolean = node_has_correct_number_of_children(node);
        const values_separate_ranges: boolean = node_values_separate_ranges(node);
        const valid_degree: boolean = node_has_valid_degree(node, t)

        expect(n_is_correct).toBe(true);
        expect(values_are_sorted).toBe(true);
        expect(correct_number_of_children).toBe(true);
        expect(values_separate_ranges).toBe(true);
        expect(valid_degree).toBe(true);

        const node_valid: boolean = n_is_correct &&
                                    values_are_sorted &&
                                    correct_number_of_children &&
                                    values_separate_ranges &&
                                    valid_degree;

        return node_valid;
    }

    expect(tree_has_correct_leaf_attribute(tree)).toBe(true);
    expect(control_node_and_descendants(tree.root)).toBe(true);
})