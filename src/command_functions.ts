import { stop_program, database } from "./main";
import { print_information, print_information_header } from "../lib/cli";
import { table_data_to_string, table_header_to_string } from "./visualiser";
import { add_table_to_database, create_empty_table, create_column, add_column, 
         insert_data, database_get_table, database_set_table, 
         Table, table_get_metadata, database_get_tables, database_get_metadata, 
         Row, table_name_exist, create_empty_database, Database } from "./database_engine";

export { quit, help, create_table, display_database, insert_column, display_table, insert_data_to_table };

/**
 * prints all usable commands of the program
 * @returns string of information to the user
 */
function help(): string {
    const help_header = "\nCommands:";
    const help_commands = 
    " * QUIT\n" + 
    " * DISPLAY-DATABASE\n" + 
    " * DISPLAY-TABLE   \"name_of_table\"\n" +
    " * CREATE-TABLE    \"name_of_table\"\n" + 
    " * INSERT-COLUMN   \"name_of_table\"   \"name_of_column\"  size_of_column: number < 40\n" + 
    " * INSERT-DATA     \"name_of_table\"   data: Array<elements>\n";

    print_information_header(help_header);
    print_information(help_commands);
    return "help";
}

/**
 * stops the program from running
 * @returns string of information to the user
 */
function quit(): string {
    stop_program();
    return "closing program...";
}

/**
 * creates a new table with name and adds it to global database
 * @param name name of the table to create
 * @returns string of information to the user
 */
function create_table(name: string): string {
    if (table_name_exist(database, name)) {
        throw Error(`table with name ${name} already exist`);
    }

    if (name.length > 40) {
        throw Error(`table name cannot be longer than 40`);
    }

    const table = create_empty_table(name);
    add_table_to_database(database, table);
    return "created table " + name;
}

/**
 * creates and inserts new column with arguments 
 * as attibutes and adds it to table
 * @param table_name name of the table to insert into
 * @param column_name name of the new column
 * @param size size of the column to create
 * @returns string of information to the user
 */
function insert_column(table_name: string, column_name: string, size: number): string {

    if (column_name.length > 40) {
        throw Error(`column name cannot be longer than 40`);
    }

    if (size > 40) {
        throw Error(`column size cannot be bigger than 40`);
    }

    if (size < 1) {
        throw Error(`column size cannot be smaller than 1`);
    }

    const new_column = create_column(column_name, size);
    const table = database_get_table(database, table_name);
    const updated_table = add_column(table, new_column);
    database_set_table(database, updated_table);
    return `column ${column_name} was added to ${table_name} with size ${size}`;
}

function create_data_row(data: number | Array<string>): Row {
    return Array.isArray(data)
            ? data
            : [data];
}

/**
 * insert data to table with name of argument
 * @param table_name name of table to insert into
 * @param data_row row of data to insert into table
 * @returns string of inromation to the user
 */
function insert_data_to_table(table_name: string, data_row: number | Array<string>): string {
    
    const table: Table = database_get_table(database, table_name);
    const updated_table: Table = insert_data(table, create_data_row(data_row));

    database_set_table(database, updated_table);
    
    return `data was inserted to ${table_name}`;
}

/**
 * displays database and it's tables in cli
 * @returns string of inromation to the user 
 */
function display_database(): string {

    const database_tables: Array<Table> = database_get_tables(database);
    const table_names: Array<string> = [];

    if (database_tables.length === 0) {
        table_names.push("0 tables found");
    } else {
        for (const table of database_tables) {
            table_names.push(table_get_metadata(table));
        }
    }
    print_information_header("\n" + "Database Name: " + database_get_metadata(database));
    print_information("Tables: " + table_names.toString() + "\n");

    return "displayed database";
}

/**
 * displays table with name table_name in cli
 * @param table_name name of table to display
 * @returns string of inromation to the user 
 */
function display_table(table_name: string): string {
    const table: Table = database_get_table(database, table_name);
    
    const header_string: string = table_header_to_string(table);
    print_information_header(" ".repeat(header_string.length));
    print_information_header(header_string);

    const data_string: string = table_data_to_string(table);
    print_information(data_string);

    return `displayed table ${table_name}`;
}


