import {ILexingError, IToken, TokenType} from "chevrotain";
import {Identifier} from "./token-types.js";

export type Token = {
    value: string,
    type: string,
    offset: number,
    id?: number,
    toString: () => string,
    tokenType?: TokenType
}

function tokenFromIToken(iToken: IToken): Token {
    const token = {
        value: iToken.image,
        type: iToken.tokenType.name,
        offset: iToken.startOffset,
        tokenType: iToken.tokenType,
    } as Token;

    if (token.type === Identifier.name) token.id = iToken.payload?.id;

    return token;
}

function tokenFromError(error: ILexingError): Token {
    return {
        value: error.message,
        type: "Error Lexeme",
        offset: error.offset
    } as Token;
}

export function toToken(errorOrToken: IToken | ILexingError): Token {
    let token: Token;

    if ((errorOrToken as IToken).image !== undefined)
        token = tokenFromIToken(errorOrToken as IToken);
    else
        token = tokenFromError(errorOrToken as ILexingError);

    const formattedOffset = token.offset;
    const formattedType = `\<${token.type}\>`;
    const formattedId = `${token.id !== undefined ? ` (id = ${token.id})` : ''}`;
    const formattedValue = token.value.replaceAll("\n", "\\n");

    token.toString = () =>
        `${formattedOffset}: ${formattedType}${formattedId}: ${formattedValue}`;

    return token;
}

