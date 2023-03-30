/** Evaluates parsed query and calls appropiate functions */
import { DoubleLinkedList, DoubleLinkedListNode, top_dlist } from "../lib/doublelinkedlist";

export { Command, Elements, Operand, Name, DatabaseCommand, ColumnCommand, MetaCommand };

type Elements = Command | Operand | Name;

type Command = DatabaseActions | MetaCommand;

type DatabaseActions = DatabaseCommand | ColumnCommand ;
type DatabaseCommand = { tag: "database-command", result: string, operation: Function };
type ColumnCommand = { tag: "column-command", result: string, operation: Function };

type MetaCommand = { tag: "meta-command", result: string, operation: Function };


type Operand = { tag: "operand", item: number | Array<string> };
type Name = { tag: "name", item: string };


function is_meta_command(comp: DoubleLinkedListNode<Elements>): comp is DoubleLinkedListNode<MetaCommand> {
    return comp.value.tag === "meta-command";
}

function is_database_command(comp: DoubleLinkedListNode<Elements>): comp is DoubleLinkedListNode<DatabaseCommand> {
    return comp.value.tag === "database-command";
}

function is_column_command(comp: DoubleLinkedListNode<Elements>): comp is DoubleLinkedListNode<ColumnCommand> {
    return comp.value.tag === "column-command";
}

function is_operand(comp: DoubleLinkedListNode<Elements>): comp is DoubleLinkedListNode<Operand> {
    return comp.value.tag === "operand";
}

function is_name(comp: DoubleLinkedListNode<Elements>): comp is DoubleLinkedListNode<Name> {
    return comp.value.tag === "name";
}


/**
 * Evaluates meta_command and executes the meta function.
 * 
 * @param comp Double linked list node of type MetaCommand
 * @returns MetaCommand record
 */
function eval_meta_command(comp: DoubleLinkedListNode<MetaCommand>): MetaCommand {
    comp.value.result = comp.value.operation();
    return comp.value;
}

/**
 * Evaluates Double linked list node of type DatabaseCommand, evaluates previous
 * and following nodes to cut down on uninteded behaviour.
 * 
 * @param comp Double linked list node of type DatabaseCommand
 * @returns DatabaseCommand record
 */
function eval_database_command(comp: DoubleLinkedListNode<DatabaseCommand>)
    : DatabaseCommand {
    if (comp.next === null) {
        throw Error("wrong use of database command - has to be followed by name");
    } else if (comp.prev !== null) {
        throw Error("wrong use of database command - cannot be preceded by anything");
    } else if (is_name(comp.next)) {
        comp.value.result = comp.value.operation(eval_name(comp.next));
        return comp.value;
    } else {
        throw Error("wrong use of database command - has to be followed by name");
    }
}


/**
 * Evaluates Double linked list node of type ColumnComand, evaluates previous node and
 * following nodes to cut down on unintended behaviour.
 * 
 * @param comp Double linked list node of type ColumnCommand.
 * @param dlist Double linked list. Used to access last in list for evaluation.
 * @returns ColumnCommand record
 */
function eval_column_command(comp: DoubleLinkedListNode<ColumnCommand>, dlist: DoubleLinkedList<Elements>)
    : ColumnCommand {
    if (comp.next === null || !is_name(comp.next)) {
        throw Error("wrong use of database command - has to be followed by name");
    } else if (comp.prev !== null) {
        throw Error("wrong use of database command - cannot be preceded by anything");
    } else if (dlist.tail === null) {
        throw Error("wrong use of column command - needs size/operand");
    } else if (comp.next.next !== null && is_operand(dlist.tail)) {
        const table_name = eval_name(comp.next);
        if (is_name(comp.next.next)) {
            const column_name = eval_name(comp.next.next);
            const operand = eval_operand(dlist.tail);
            comp.value.result = comp.value.operation(table_name, column_name, operand);
        } else if (is_operand(comp.next.next)) {
            const operand = eval_operand(dlist.tail);
            comp.value.result = comp.value.operation(table_name, operand);
        }
        return comp.value;
    } else {
        throw Error("wrong use of column command - needs size/operand");
    }
}

/**
 * Evaluates a node of type Operand and returns the array inside.
 * 
 * @param comp Double linked list node of type Name
 * @returns string denoting the name from the record type Name
 */
function eval_operand(comp: DoubleLinkedListNode<Operand>) : number | Array<string> {
    if (comp.next !== null) {
        throw Error("wrong input - operand cannot be followed by anything");
    } else {
        return comp.value.item;
    }
}

/**
 * Evaluates a node of type Name and returns the string denoting the name.
 * 
 * @param comp Double linked list node of type Name
 * @returns string denoting the name from the record type Name
 */
function eval_name(comp: DoubleLinkedListNode<Name>): string {
    if (comp.prev === null) {
        throw Error("wrong use of name - has to be preceded by database command or column command");
    } else if (is_database_command(comp.prev) || is_column_command(comp.prev) || is_name(comp.prev)) {
        return comp.value.item;
    } else {
        throw Error("wrong use of name - has to be in conjunction with database command or column command");
    }
}


/**
 * Evaluates a Double linked list of type Elements, assigns first node of list as current
 * and evaluates.
 * 
 * @param dlist Double linked list of type Elements to evaluate
 * @returns Literal (Array<string>, string, or number) or Command record
 */
export function evaluate(dlist: DoubleLinkedList<Elements>)
    : Command | Array<string> | string | number {

    const current: DoubleLinkedListNode<Elements> = top_dlist(dlist)!;


    if (is_database_command(current)) {
        return eval_database_command(current);
    } else if (is_meta_command(current)) {
        return eval_meta_command(current);
    } else if (is_column_command(current)) {
        return eval_column_command(current, dlist);
    } else if (is_operand(current)) {
        return eval_operand(current);
    } else if (is_name(current)) {
        return eval_name(current);
    } else {
        throw Error("undefined behaviour - evaluator fail");
    }
}