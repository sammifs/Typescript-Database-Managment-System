/** Terminal user interface */
import PromptSync from "prompt-sync";
import { blue, bold, cyan, green, redBright, underline } from "chalk";
import { ColumnCommand, Command, DatabaseCommand, MetaCommand } from "../src/evaluator";

const prompt: PromptSync.Prompt = PromptSync({ sigint: true });

export { take_command, print, print_error, print_success, print_status_update, 
         print_information_header, print_information, make_string };

/**
 * prompts user and returns user input
 * @returns user input
 */
function take_command(): string {
    return prompt("tsdbms> ");
}

/**
 * prints prompt to terminal
 * @param prompt text to print
 */
function print(prompt: string): void {
    console.log(prompt);
}

/**
 * prints prompt to terminal in bright red color
 * @param prompt text to print
 */
function print_error(prompt: string): void {
    print(redBright(prompt));
}

/**
 * prints prompt to terminal in green color
 * @param prompt text to print
 */
function print_success(prompt: string): void {
    print(green(prompt));
}

/**
 * prints prompt to terminal in cyan color
 * @param prompt text to print
 */
function print_status_update(prompt: string): void {
    print(cyan(prompt));
}

/**
 * prints prompt to terminal foramatted with underline and bold in blue color
 * @param prompt text to print
 */
function print_information_header(header: string): void {
    print(blue(underline(bold(header))));
}

/**
 * prints prompt to terminal in blue color
 * @param prompt text to print
 */
function print_information(commands: string): void {
    print(blue(commands));
}
// ------------------------------------------------------

function is_database_command(comp: Command): comp is DatabaseCommand {
    return comp.tag === "database-command";
}

function is_column_command(comp: Command): comp is ColumnCommand {
    return comp.tag === "column-command";
}

function is_meta_command(comp: Command): comp is MetaCommand {
    return comp.tag === "meta-command";
}

function make_string(obj: Command | Array<string> | string | number): string {
    return Array.isArray(obj)
            ? obj.toString()
            : typeof(obj) === "string" || typeof(obj) === "number"
            ? obj.toString()
            : is_database_command(obj)
            ? "Database operation" + ' - ' + obj.result
            : is_column_command(obj)
            ? "Column operation" + ' - ' + obj.result
            : is_meta_command(obj)
            ? "Meta operation" + ' - ' + obj.result
            : "Invalid output - make_string fail";
}