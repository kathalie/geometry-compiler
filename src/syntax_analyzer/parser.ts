import {TokenType} from "chevrotain";
import {LexerIterator} from "../lexer/lexer-iterator.js";
import {Token} from "../lexer/token.js";
import {FractionalLiteral, Identifier, IntegerLiteral, KeyWord, Operator} from "../lexer/token-types.js";
import {ASTNode, CommandNode, CoordsNode, GraphicalObjectNode, PointNode, TaskNode} from "./nodes.js";


class SyntaxError extends Error {
    constructor(expectedToken: string) {
        super(`Expecting a ${expectedToken} token.`);
    }
}

export type IdentifiersTable = Map<string, { x: number, y: number } >;

// export interface ASTNode {
//     toString(): string;
// }
//
// export class Node implements ASTNode{
//     constructor(public type: string, public children: ASTNode[] = []) {
//     }
//
//     public toString = (): string =>
//         `${this.type}: (${this.children.map(node => node.toString()).join(', ')})`;
// }
//
// export class Leaf implements ASTNode {
//     constructor(public type: string, public value: string) {
//     }
//
//     public toString = (): string => `${this.type} = ${this.value}`;
// }

export class Parser {
    //private currentToken?: Token | null;
    private identifiers: IdentifiersTable = new Map();

    constructor(private tokenIterator: LexerIterator) {
        if (!this.tokenIterator.hasNext())
            throw new SyntaxError(`any`);

        //this.currentToken = null;
    }

    public get identifiersTable(): IdentifiersTable {
        return this.identifiers;
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

    public parseTask(): TaskNode {
        const task = new TaskNode();

        while (this.tokenIterator.hasNext()) {
            task.commands.push(this.parseCommand());
        }

        // if (this.currentToken?.value !== 'eos') {
        //     throw new SyntaxError('eos');
        // }

        return task;
    }
    private parseCommand(): CommandNode {
        const operator = this.parseOperator();
        const object = this.parseObject();
        const separator = this.tryNextToken();

        if (separator.value != '.') throw new SyntaxError('.');

        return new CommandNode(operator, object);
    }

    private parseOperator(): string {
        const operator = this.tryNextToken(Operator);

        return operator.value;
    }

    private parseObject(): GraphicalObjectNode {
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

    private parsePoint(): PointNode {
        const pointId = this.parseIdPoint();
        const pointCoords = this.parseCoords();

        //TODO maybe worth removing
        if (this.identifiers.has(pointId))
            throw new Error(`Identifier ${pointId} is already declared.`);

        this.identifiers.set(pointId, {x: pointCoords.x, y: pointCoords.y})

        return new PointNode(pointId, pointCoords);
    }


    private parseIdPoint(): string {
        const pointId = this.tryNextToken(Identifier);

        return pointId.value;
    }

    private parseCoords(): CoordsNode {
        const lb = this.tryNextToken();

        if (lb.value != '(') throw new SyntaxError('(');

        const x = this.parseAnyNumber();

        const coma = this.tryNextToken();
        if (coma.value != ',') throw new SyntaxError(',');

        const y = this.parseAnyNumber();

        const rb = this.tryNextToken();
        if (rb.value != ')') throw new SyntaxError(')');

        return new CoordsNode(x, y);
    }

    private parseAnyNumber(): number {
        const nextToken = this.tryNextToken();

        if (nextToken.tokenType == FractionalLiteral)
            return parseFloat(nextToken.value);
        else if (nextToken.tokenType == IntegerLiteral)
            return parseInt(nextToken.value);

        throw new SyntaxError('numeric');
    }
}