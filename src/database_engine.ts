/** Program to act on database */

import { BTree, btree_insert, new_btree } from "../lib/b-tree";
import { append } from "../lib/utility";

export { Database, Table, Header, Data, Column, Row, ColumnData };
export { create_empty_database, add_table_to_database, create_empty_table, 
         create_column, add_column, insert_data, database_get_table, 
         database_set_table,table_get_header, column_get_name, column_get_size, 
         column_get_data, table_get_metadata, database_get_tables, 
         database_get_metadata, table_name_exist };

         
type Database = [Metadata, Tables];
type Tables = Array<Table>;

type Table = [Metadata, Header];
type Metadata = string;

type Header = [PrimaryKeyColumn, DataColumns];
type PrimaryKey = number;
type PrimaryKeyData = Array<PrimaryKey>;
type PrimaryKeyColumn = ["primary_key", PrimaryKeyData];
type DataColumns = Array<Column>;
type Column = [ColumnName, ColumnDataSize, ColumnData];
type ColumnName = string;
type ColumnDataSize = number;
type ColumnData = BTree;
type Data = string | number;

type Row = Array<Data>;


const blocksize = 10;

// Getters

function database_get_tables(database: Database): Tables {
    return database[1];
}

function database_get_table(database: Database, searched_table_name: string): Table {
    const tables: Tables = database_get_tables(database);
    let found_table: Table | null = null;
    
    for (const table of tables) {
        const table_name: string = table_get_metadata(table);
        if (table_name === searched_table_name) {
            found_table = table;
        }
    }
    if (found_table === null) {
        throw Error(`table ${searched_table_name} could not be found in database`);
    }

    return found_table;
}

function database_get_metadata(database: Database): Metadata {
    return database[0];
}

function table_get_header(table: Table): Header {
    return table[1];
}

function table_get_metadata(table: Table): Metadata {
    return table[0];
}

function table_get_datacolumns(table: Table): DataColumns {
    const header: Header = table_get_header(table);
    return header[1];
}

function table_get_primary_key_column(table: Table): PrimaryKeyColumn {
    const header: Header = table_get_header(table);
    return header[0]; 
}

function table_get_primary_keys(table: Table): Array<PrimaryKey> {
    const primary_key_column: PrimaryKeyColumn = table_get_primary_key_column(table);
    return primary_key_column[1];
}

function column_get_data(column: Column): ColumnData {
    return column[2];
}

function column_get_name(column: Column): ColumnName {
    return column[0].toString();
}

function column_get_size(column: Column): ColumnDataSize {
    return column[1];
}

// Setters
function database_set_tables(database: Database, tables: Tables): Database {
    database[1] = tables;
    return database;
}

function database_set_table(database: Database, table: Table): void {
    const table_name: string = table_get_metadata(table);
    const tables: Tables = database_get_tables(database);
    const number_of_tables: number = tables.length;
    for (let i = 0; i < number_of_tables; i++) {
        if (table_get_metadata(tables[i]) === table_name) {
            // update table
            database[1][i] = table;
        }
    }
}

function table_set_header(table: Table, header: Header): Table {
    table[1] = header;
    return table;
}

function table_set_datacolumncolumn(table: Table, column: Column, i: number): Table {
    const data_columns: DataColumns = table_get_datacolumns(table);
    data_columns[i] = column;
    return table_set_datacolumns(table, data_columns);
}

function table_set_datacolumncolumns(table: Table, data_columns: DataColumns): Table {
    const header: Header = table_get_header(table);
    header[1] = data_columns;
    return table; 
}

function table_set_datacolumns(table: Table, data_columns: DataColumns): Table {
    const header: Header = table_get_header(table);
    header[1] = data_columns;
    return table;
}

function table_set_primary_key_column(table: Table, primary_key_column: PrimaryKeyColumn): Table {
    const header: Header = table_get_header(table);
    header[0] = primary_key_column;
    return table;
}

function column_set_data(column: Column, data: ColumnData): Column {
    column[2] = data;
    return column;
}

// Constructors

function create_empty_header(): Header {
    return [create_epmty_primary_key_column(), []];
}

function create_epmty_primary_key_column(): PrimaryKeyColumn {
    return ["primary_key", []];
}

// Helpers

function validate_data(table: Table, data_row: Row): void {
    const dotdotdot = (element: string): string => element.length > 5 ? "... " : "";
    const data_columns: DataColumns = table_get_datacolumns(table);

    // Check for size of data input
    if (data_row.length > data_columns.length) {
        throw Error("Insertion Fail: tried to insert too many elements");
    }

    if (data_row.length < data_columns.length) {
        throw Error("Insertion Fail: tried to insert to few elements");
    }

    // Check for size of elements
    for (let i = 0; i < data_row.length; i++) {
        const column_size: number = column_get_size(data_columns[i]);
        const data_size: number = ("" + data_row[i]).length;

        if (data_size > column_size) {
            let element: string = "" + data_row[i];
            element = (element).slice(0, 5) + dotdotdot(element);
            throw Error(`Insertion Fail: ${element} could not fit into column ${column_get_name(data_columns[i])} with size ${column_get_size(data_columns[i])}`);
        }
    }
}

function table_name_exist(database: Database, new_table_name: string): boolean {
    let table_exist = false;
    const tables: Tables = database_get_tables(database);

    for (const table of tables) {
        const table_name = table_get_metadata(table);
        if (table_name === new_table_name) {
            table_exist = true;
        }
    }

    return table_exist;
}

function generate_primary_key(table: Table): PrimaryKey {
    const keys: Array<PrimaryKey> = table_get_primary_keys(table);

    return keys.length;
}

function insert_primary_key(table: Table, primary_key: PrimaryKey): Table {
    const primary_key_column: PrimaryKeyColumn = table_get_primary_key_column(table);
    const primary_key_data: PrimaryKeyData = primary_key_column[1];
    const updated_primary_key_data: PrimaryKeyData = append(primary_key_data, primary_key);
    primary_key_column[1] = updated_primary_key_data;
    return table;
}


//----------------------------Database actions---------------------------------

/**
 * create empty database with name
 * @param name name of the new database
 * @returns database with name
 */
function create_empty_database(name: string): Database {
    return [name, []];
}

/**
 * adds table to database
 * @param database database to recive table
 * @param table table to add to database
 * @returns updated database
 */
function add_table_to_database(database: Database, table: Table): Database {
    return database_set_tables(database, append(database_get_tables(database), table));
}

/**
 * creates new table with name
 * @param name name of new table
 * @returns empty table with name
 */
function create_empty_table(name: string): Table {
    return [name, create_empty_header()];
}

/**
 * create a empty column with name and size
 * @param column_name header name of the column
 * @param size size of data to be held in column
 * @returns new column
 */
function create_column(column_name: ColumnName, size: ColumnDataSize): Column {
    return [column_name, size, new_btree(blocksize)];
}

/**
 * adds column to table
 * @param table tabel to add column to
 * @param column column to add to table
 * @returns updated table
 */
function add_column(table: Table, column: Column): Table {
    const data_columns: DataColumns = table_get_datacolumns(table);
    const updated_data_columns = append(data_columns, column);
    const updated_table = table_set_datacolumns(table, updated_data_columns);
    return updated_table;   
}

/**
 * inserts data to table
 * @param table table to recieve data
 * @param data_row data to insert into table
 * @returns updated table
 */
function insert_data(table: Table, data_row: Row): Table {
    validate_data(table, data_row);

    const primary_key: number = generate_primary_key(table);
    insert_primary_key(table, primary_key);
    const data_columns: DataColumns = table_get_datacolumns(table);

    for (let i = 0; i < data_columns.length; i++) {
        const column: Column = data_columns[i];
        const data: Data = data_row[i];
        const column_data: ColumnData = column_get_data(column);

        btree_insert(column_data, primary_key, data, blocksize);

        const updated_column = column_set_data(column, column_data);
        table = table_set_datacolumncolumn(table, updated_column, i);
    }

    return table;
}