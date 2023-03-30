/** Program loop */

import { take_command, make_string, print_error, print_status_update } from "../lib/cli";
import { parse } from "./parser";
import { evaluate } from "./evaluator";
import { init_hashtable } from "./init_hashtable";
import { Database, create_empty_database } from "./database_engine";

export { stop_program, database };

let run_program = true;
const database: Database = create_empty_database("Main");
const commands = init_hashtable();

/**
 * program off switch
 */
function stop_program(): void {
    run_program = false;
}

while (run_program) {
    try {
        const user_input = take_command();
        const parsed_input = parse(user_input, commands);
        const output = evaluate(parsed_input);
        print_status_update(make_string(output) + "\n");
    }
    catch (error: any) {
        print_error(error.message + "\n");
    }
}


[ "insert-table", ]