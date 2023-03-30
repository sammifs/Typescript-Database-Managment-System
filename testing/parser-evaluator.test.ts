import { split_input, parse } from "../src/parser";
import { display_dlist } from "../lib/doublelinkedlist";
import { nc_empty, nc_insert, NoCollisionHashtable } from "../lib/hashtables";
import { evaluate, DatabaseCommand, MetaCommand } from "../src/evaluator";


test("Test split_input", () => {
    const input1 = "create leave hello";
    const input2 = "create hello 1, 2, 3, 4";
    const input3 = "create hello 1, 2, 3, 4, ,";

    expect(split_input(input1)).toStrictEqual(['create', 'leave', 'hello']);
    expect(split_input(input2)).toStrictEqual(['create', 'hello', ['1','2','3','4']]);
    expect(split_input(input3)).toStrictEqual(['create', 'hello', ['1', '2', '3', '4']]);
});

const commands: NoCollisionHashtable<string, DatabaseCommand | MetaCommand> = nc_empty(5, (key: string) => key.charCodeAt(0));

test("Simple parser test", () => {

    expect(display_dlist(parse("1, 2, 3", commands))).toBe("dlist([object Object]<-> )");
    expect(display_dlist(parse("\"hello\"", commands))).toBe("dlist([object Object]<-> )");
});

test("Command parse test", () => {

    function success(): string {
        return "success";
    }

    nc_insert(commands, "1test", { tag: "meta-command", result: "Fail",  operation: success });

    expect(display_dlist(parse("1test", commands))).toBe("dlist([object Object]<-> )");
});

test("Evaluate operand test", () => {
    expect(evaluate(parse("1, 2, 3", commands))).toStrictEqual(['1', '2', '3']);
})

test("Evaluate meta-command test", () => {
    
    function success(): string {
        return "success";
    }

    nc_insert(commands, "2test", { tag: "meta-command", result: "Fail", operation: success });

    expect(evaluate(parse("2test", commands))).toStrictEqual({"operation": success, "result": "success", "tag": "meta-command"});
})

test("Evaluate database command test", () => {

    function success(): string {
        return "success";
    }

    nc_insert(commands, "3test", { tag: "database-command", result: "Fail", operation: success });

    expect(evaluate(parse("3test \"hello\"", commands))).toStrictEqual({"operation": success, "result": "success", "tag": "database-command"});
})