import {lexer} from "./lexer.js";
import {ILexingError, IToken} from "chevrotain";
import {Token, toToken} from "./token.js";


export class LexerIterator {
    private currentToken: Token | null = null;
    private readonly tokens: IToken[];
    private readonly errors: ILexingError[];
    private tokenIndex: number = 0;
    private errorIndex: number = 0;
    private tokenIndexSnapshots: number[] = [0];
    private errorIndexSnapshots: number[] = [0];

    constructor(input: string, withErrors: boolean = true) {
        const lexingResult = lexer.tokenize(input);

        this.tokens = lexingResult.tokens;
        this.errors = withErrors ? lexingResult.errors : [];
    }

    private hasCorrectToken(): boolean {
        return this.tokenIndex < this.tokens.length;
    }

    private hasErrorToken(): boolean {
        return this.errorIndex < this.errors.length;
    }

    private nextCorrectToken(): Token {
        return toToken(this.tokens[this.tokenIndex++]);
    }

    private nextErrorToken(): Token {
        return toToken(this.errors[this.errorIndex++]);
    }

    private nextMinimumToken(): Token {
        const correctToken = toToken(this.tokens[this.tokenIndex]);
        const errorToken = toToken(this.errors[this.errorIndex]);

        if (correctToken.offset < errorToken.offset) {
            this.tokenIndex++;

            return correctToken;
        }

        this.errorIndex++;

        return errorToken;
    }

    public next(): Token {
        let nextToken: Token;

        if (!this.hasCorrectToken()) nextToken = this.nextErrorToken();
        else if (!this.hasErrorToken()) nextToken = this.nextCorrectToken();
        else nextToken = this.nextMinimumToken();

        return this.currentToken = nextToken;
    }

    public current = (): Token | null => this.currentToken;

    public hasNext(): boolean {
        return this.hasCorrectToken() || this.hasErrorToken();
    }

    public takeSnapshot() {
        this.tokenIndexSnapshots.push(this.tokenIndex);
        this.errorIndexSnapshots.push(this.errorIndex);
    }

    public backToLastSnapshot() {
        this.tokenIndex = this.tokenIndexSnapshots.pop() ?? 0;
        this.errorIndex = this.errorIndexSnapshots.pop() ?? 0;
    }
}


