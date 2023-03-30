import { btree_to_string_arr } from "../lib/b-tree";
import { Header, Table, column_get_data, column_get_name, table_get_header } from "./database_engine";

export { table_header_to_string, table_data_to_string };

/**
 * turns the header of the table into a beautiful string
 * @param table table who holds the header
 * @returns formatted string of data
 */
function table_header_to_string(table: Table): string {
    const header: Header = table_get_header(table);
    const data_columns = header[1];

    if (data_columns.length === 0) {
        throw Error("table has 0 columns, nothing to display");
    }

    let header_string = `| Key |`;
    
    for (const column of data_columns) {
        let column_name: string = column_get_name(column);
        column_name = column_name.length > 20 ? column_name.slice(0, 16) + "... " : column_name;
        const column_name_size: number = column_name.length;

        const space_string = "                    ";

        header_string += " " + column_name.toLocaleUpperCase() + space_string.slice(0, -column_name_size - 1) + "|";

    }

    return header_string;
}

/**
 * turn the data of the table into a beautiful string
 * @precondition table has atleast one column 
 * @param table table who holds the data
 * @returns formatted string of data
 */
function table_data_to_string(table: Table): string {
    const header: Header = table_get_header(table);
    const primary_key_column = header[0];
    const data_columns = header[1];

    const table_string_arr: Array<Array<string>> = [];
    const column0: Array<string> =  btree_to_string_arr(column_get_data(data_columns[0]));

    if (column0.length === 0) {
        return "|     | no data was found... ";
    }

    for (let i = 0; i < column0.length; i++) {
        table_string_arr[i] = Array<string>(data_columns.length + 1); // + 1 for primary keys
    }

    for (let i = 0; i < primary_key_column[1].length; i++) {
        table_string_arr[i][0] = "" + primary_key_column[1][i];
    }


    for (let i = 0; i < data_columns.length; i++) {
        const column = btree_to_string_arr(column_get_data(data_columns[i]));
        for (let j = 0; j < table_string_arr.length; j++) {
            table_string_arr[j][i + 1] = column[j];
        }
    }

    const space_string = "                    ";
    let data_string = "";

    for (let i = 0; i < table_string_arr.length; i++) {
        let row = "|";
        for (let j = 0; j < table_string_arr[0].length; j++) {
            let element: string = table_string_arr[i][j];
            const element_size: number =  element === undefined ? 9 : element.length;

            if (j === 0) { // primary key element
                element = element_size > 8 ? element.slice(0, 8) + "." : element;
                row += " " + element + space_string.slice(0, -element_size - 16) + "|";
            } else {
                element = element_size > 20 ? element.slice(0, 15) + "... " : element;
                row += " " + element + space_string.slice(0, -element_size - 1) + "|";
            }

        }
        data_string += row + "\n";
    }

    return data_string;
}
