import {ILexerErrorMessageProvider, Lexer} from "chevrotain";
import {
    Operator,
    FractionalLiteral,
    Identifier,
    IntegerLiteral,
    KeyWord,
    Separator,
    WhiteSpace
} from "./token-types.js";


const allTokens = [
    WhiteSpace,
    Identifier,
    Separator,
    FractionalLiteral,
    IntegerLiteral,
    KeyWord,
    Operator,
];

const ErrorLexemeProvider: ILexerErrorMessageProvider = {
    buildUnexpectedCharactersMessage(
        fullText: string,
        startOffset: number,
        length: number,
    ): string {
        return (
            fullText.substring(startOffset, startOffset + length)
        );
    },
} as ILexerErrorMessageProvider;

export const lexer = new Lexer(allTokens, {
    errorMessageProvider: ErrorLexemeProvider,
});