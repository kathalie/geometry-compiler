import {createToken, Lexer} from "chevrotain";
import {identifierRegex, integerNumberRegex} from "./constants/regex.js";
import {CustomPatternMatcherFunc} from "@chevrotain/types";
import {builtInFunctions, keyWords} from "./constants/reserved-words.js";

const identifiersTable: Map<string, number> = new Map();
function matchIdentifier(text: string, startOffset: number) {
    const execResult = RegExp(`^${identifierRegex.source}`).exec(text.substring(startOffset));

    if (!execResult) return null;

    const identifier = execResult[0];

    if (!identifiersTable.has(identifier)) {
        identifiersTable.set(identifier, identifiersTable.size);
    }

    (execResult as [string] & { payload?: any }).payload = {id: identifiersTable.get(identifier)};

    return execResult;
}

export const Identifier = createToken({
    name: "Identifier",
    pattern: matchIdentifier as CustomPatternMatcherFunc,
    line_breaks: false,
});

export const IntegerLiteral = createToken({
    name: "Integer Number",
    pattern: integerNumberRegex
});

export const FractionalLiteral = createToken({
    name: "Fractional Number",
    pattern: RegExp(`(${integerNumberRegex.source})*\\.0*(${integerNumberRegex.source})*`),
});

export const WhiteSpace = createToken({
    name: "Whitespace",
    pattern: /\s+/,
    line_breaks: true,
    group: Lexer.SKIPPED
});

export const KeyWord = createToken({
    name: "Key Word",
    pattern: RegExp(keyWords.map(kw => `${kw}[А-ЯІЇЄ]*`).join('|')),
});

export const Separator = createToken({
    name: "Separator",
    pattern: /[;,().]/
});

export const Operator = createToken({
    name: "Operator",
    pattern: RegExp(builtInFunctions.join('|'))
});