import {IToken, TokenType} from "chevrotain";
import {LexerIterator} from "../lexer/lexer-iterator.js";
import {Token} from "../lexer/token.js";
import {FractionalLiteral, Identifier, IntegerLiteral, KeyWord, Operator, Separator} from "../lexer/token-types.js";


class SyntaxError extends Error {
    constructor(expectedToken: string) {
        super(`Expecting a ${expectedToken} token.`);
    }
}
interface ASTNode {
    toString(): string;
}

class Node implements ASTNode{
    constructor(public type: string, public children: ASTNode[] = []) {
    }

    public toString = (): string =>
        `${this.type}: (${this.children.map(node => node.toString()).join(', ')})`;
}

class Leaf implements ASTNode {
    constructor(public type: string, public value: string) {
    }

    public toString = (): string => `${this.type} = ${this.value}`;
}

export class Parser {
    private currentToken?: Token | null;

    constructor(private tokenIterator: LexerIterator) {
        if (!this.tokenIterator.hasNext())
            throw new SyntaxError(`any`);

        this.currentToken = null;
    }

    private tryNextToken = (expectedTokenType: TokenType | null = null): Token => {
        // if (
        //     !this.tokenIterator.hasNext() ||
        //     (expectedTokenType != null && this.currentToken.tokenType != expectedTokenType)
        // ) throw new SyntaxError(expectedTokenType?.name ?? '');

        const syntaxError = new SyntaxError(expectedTokenType?.name ?? '');

        if (!this.tokenIterator.hasNext())
            throw syntaxError;

        const nextToken = this.tokenIterator.next();

        if (expectedTokenType != null && nextToken.tokenType != expectedTokenType)
            throw syntaxError;

        return nextToken;
    };

    public parseTask(): ASTNode {
        const task = new Node('Task');

        while (this.tokenIterator.hasNext()) {
            task.children.push(this.parseCommand());
        }

        // if (this.currentToken?.value !== 'eos') {
        //     throw new SyntaxError('eos');
        // }

        return task;
    }
    private parseCommand(): ASTNode {
        const operator = this.parseOperator();
        const object = this.parseObject();
        const separator = this.tryNextToken();

        if (separator.value != '.') throw new SyntaxError('.');

        return new Node('Command', [operator, object]);
    }

    private parseOperator(): ASTNode {
        const operator = this.tryNextToken(Operator);

        return new Leaf('Operator', operator.value);
    }

    private parseObject(): ASTNode {
        const keyWord = this.tryNextToken(KeyWord);
        const keyWordValue = keyWord.value;

        return this.parsePoint(); // REMOVE IT AND UNCOMMENT THE REST

        // switch (keyWordValue) {
        //     case 'ТОЧК':
        //         return this.parsePoint();
            // case 'ПРЯМ':
            //     return this.parseLine();
            // case 'ВІДРІЗ':
            //     return this.parseLineSegment();
            // case 'ПЕРПЕНДИКУЛЯР':
            //     return this.parsePerpendicular();
        //}
    }

    private parsePoint(): ASTNode {
        const pointId = this.parseIdPoint();
        const pointCoords = this.parseCoords();

        return new Node('Point', [pointId, pointCoords]);
    }


    private parseIdPoint(): ASTNode {
        const pointId = this.tryNextToken(Identifier);

        return new Leaf('Point_ID', pointId.value);
    }

    private parseCoords(): ASTNode {
        const lb = this.tryNextToken();

        if (lb.value != '(') throw new SyntaxError('(');

        const x = this.parseAnyNumber();

        const coma = this.tryNextToken();
        if (coma.value != ',') throw new SyntaxError(',');

        const y = this.parseAnyNumber();

        const rb = this.tryNextToken();
        if (rb.value != ')') throw new SyntaxError(')');

        return new Node('Coords', [x, y]);
    }

    private parseAnyNumber(): ASTNode {
        const nextToken = this.tryNextToken();

        if (nextToken.tokenType != FractionalLiteral && nextToken.tokenType != IntegerLiteral)
            throw new SyntaxError('numeric');

        return new Leaf('Number', nextToken.value);
    }
}