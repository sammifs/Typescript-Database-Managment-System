import { nc_empty, nc_insert, NoCollisionHashtable } from "../lib/hashtables";
import { quit, help, create_table, display_database, 
         insert_column, display_table, insert_data_to_table } from "./command_functions";
import { Command } from "./evaluator";
import Crypto from "crypto";


const error_message = "Operation was unsuccessfull";

function hash_function(key: string): number {
    const new_key = Crypto.createHash('sha256').update(key).digest('hex');
    let hash = 0;
    for (let i=0; i<new_key.length; i++) {
        hash += new_key.charCodeAt(i);
    }
    return hash;
}

export function init_hashtable(): NoCollisionHashtable<string, Command> {
    const hshtble: NoCollisionHashtable<string, Command> 
            = nc_empty(35, hash_function);

    nc_insert(hshtble, "quit", { tag: "meta-command", result: error_message, operation: quit });
    nc_insert(hshtble, "help", { tag: "meta-command", result: error_message, operation: help });
    nc_insert(hshtble, "create-table", { tag: "database-command", result: error_message,
                operation: create_table });
    nc_insert(hshtble, "display-table", { tag: "database-command", result: error_message,
                operation: display_table });
    nc_insert(hshtble, "display-database", { tag: "meta-command", result: error_message, operation: display_database });
    nc_insert(hshtble, "insert-column", { tag: "column-command", result: error_message,
                operation: insert_column });
    nc_insert(hshtble, "insert-data", { tag: "column-command", result: error_message, 
                operation: insert_data_to_table });
    return hshtble;
}