/** Parses query to effienct structure */
import { DoubleLinkedList, make_empty, push } from "../lib/doublelinkedlist";
import { NoCollisionHashtable, nc_lookup } from "../lib/hashtables";
import { Elements, Command, Operand, Name } from "./evaluator";

/**
 * Splits user input into array to be treated in parse().
 * @param input input string
 * @returns Array elements of Array are either string or Array of string.
 *          f.e ['a', 'b', ['c', 'd'], 'e']
 */
export function split_input(input: string): Array<string | Array<string>> {
  const split_words = input.split(" ");
  const result: Array<string | Array<string>> = [];
  let continuous_array = false;
  let current_array: Array<string> = [];

  for (const word of split_words) {

    if (word.includes(",")) {
      // if the word includes a comma, it's the start of a continuous array
      continuous_array = true;
      const number = word.replace(",",'');
      if (number !== '') {
        current_array.push(number); // add numbers to current array
      }
    } else if (continuous_array) {
      // if we're in a continuous array and the word doesn't include a comma,
      // we've reached the end of the continuous array
      current_array.push(word);
      result.push(current_array);
      current_array = [];
      continuous_array = false;
    } else {
      // if not in a continuous array, add the word as a separate element
      result.push(word);
    }
  }

  if (continuous_array) {
    // if we reach the end of the loop and we're still in a continuous array,
    // add the current array to the result
    result.push(current_array);
  }

  return result.filter(n => n);
}


/**
 * Takes user input and searches the hashtable of commands. Creates a stack with records
 * of specified commands.
 * 
 * 
 * @param input string from user.
 * @param commands Hashtable with commands specified in main
 * @returns Stack of Elements.
 */
export function parse(input: string, commands: NoCollisionHashtable<string, Command>)
                      : DoubleLinkedList<Elements> {
    const words = split_input(input);
    let dlist: DoubleLinkedList<Elements> = make_empty();

    for (const word of words) {
        if (Array.isArray(word)) {
          const operand: Operand = { tag: "operand", item: word };
          dlist = push(operand, dlist);
        } else if (!isNaN(Number(word))) {
          const operand: Operand = { tag: "operand", item: Number(word)};
          dlist = push(operand, dlist);
        } else if (typeof(word) === "string" && word.charAt(0) === "\"" && word.slice(-1) === "\"") {
          const name: Name = { tag: "name", item: word};
          dlist = push(name, dlist);
        } else {
          const lookup: Command | undefined = nc_lookup(commands, word.toLowerCase());
          if (lookup !== undefined) {
            dlist = push(lookup, dlist);
          } else {
            throw Error("Invalid command " + word);
          }
        }
    }
    return dlist;
}