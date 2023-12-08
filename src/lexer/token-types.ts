import {createToken, Lexer} from "chevrotain";
import {integerNumberRegex} from "./constants/regex.js";
import {CustomPatternMatcherFunc} from "@chevrotain/types";
import {endingsKeywords, endingsOperators, StemmingInfo} from "./constants/reserved-words.js";

const identifiersTable: Map<string, number> = new Map();
function matchIdentifier(text: string, startOffset: number) {
    const execResult = RegExp(`^[A-Z]`).exec(text.substring(startOffset));

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

function matchWithStemming(stemmingInfo: StemmingInfo): CustomPatternMatcherFunc {
    return (text: string, startOffset: number) => {
        text = text.toLowerCase();

        const basesAndEndings = [] as string[];

        for (const [base, endings] of Object.entries(stemmingInfo)) {
            basesAndEndings.push(`${base}(${endings.join('|')})`);
        }

        const basesRegex = RegExp(Object.keys(stemmingInfo).join('|'));
        const basesAndEndingsRegex= RegExp(basesAndEndings.join('|'));

        const finalRegex = RegExp(`^(${basesAndEndingsRegex.source})`)
        const execResult = finalRegex.exec(text.substring(startOffset));

        if (!execResult) return null;

        const stemmed = basesRegex.exec(execResult[0])![0];

        return [stemmed];
    }
}

export const KeyWord = createToken({
    name: "Key Word",
    pattern: matchWithStemming(endingsKeywords) as CustomPatternMatcherFunc,
    line_breaks: false,
});

export const Separator = createToken({
    name: "Separator",
    pattern: /[;().,]/
});

export const Operator = createToken({
    name: "Operator",
    pattern: matchWithStemming(endingsOperators) as CustomPatternMatcherFunc,
    line_breaks: false,
});