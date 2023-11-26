import {TokenType} from "chevrotain";
import {LexerIterator} from "../lexer/lexer-iterator.js";
import {Token} from "../lexer/token.js";
import {FractionalLiteral, Identifier, IntegerLiteral, KeyWord, Operator, Separator} from "../lexer/token-types.js";
import {CommandNode, CoordsNode, GraphicalObjectNode, PointNode, TaskNode} from "./nodes.js";
import {SemanticError} from "../semantic_analyzer/translator.js";


export class SyntaxError extends Error {
    constructor(expectedToken: string = 'будь-який', offset: number ) {
        super(`Очікується токен ${expectedToken} на місці ${offset}.`);
    }
}

export type IdentifiersTable = Map<string, { x: number, y: number } >;

export class Parser {
    private identifiers: IdentifiersTable = new Map();

    constructor(private tokenIterator: LexerIterator) {
        if (!this.tokenIterator.hasNext())
            throw new SyntaxError(`початковий`, 0);
    }

    public get identifiersTable(): IdentifiersTable {
        return this.identifiers;
    }

    private tryNextToken = (
        expectedTokenType: TokenType | null = null,
        errorBuilder: ((offset: number) => SyntaxError) | null = null
    ): Token => {
        const syntaxError = (offset: number): SyntaxError => errorBuilder?.(offset) ?? new SyntaxError(expectedTokenType?.name, offset);

        if (!this.tokenIterator.hasNext())
            throw syntaxError(0);

        const nextToken = this.tokenIterator.next();

        if (expectedTokenType != null && nextToken.tokenType != expectedTokenType)
            throw syntaxError(nextToken.offset);

        return nextToken;
    };

    public parseTask(): TaskNode {
        const task = new TaskNode();

        while (this.tokenIterator.hasNext()) {
            task.commands.push(this.parseCommand());
        }

        return task;
    }
    private parseCommand(): CommandNode {
        const operator = this.parseOperator();
        const object = this.parseObject();
        const separator = this.tryNextToken(
            Separator,
            (offset) => new SyntaxError('.', offset)
        );

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
            throw new SemanticError(`Identifier ${pointId} is already declared.`);

        this.identifiers.set(pointId, {x: pointCoords.x, y: pointCoords.y})

        return new PointNode(pointId, pointCoords);
    }


    private parseIdPoint(): string {
        const pointId = this.tryNextToken(Identifier);

        return pointId.value;
    }

    private parseCoords(): CoordsNode {
        const lb = this.tryNextToken(
            Separator,
            (offset) => new SyntaxError('(', offset)
        );

        const x = this.parseAnyNumber();

        const coma = this.tryNextToken(
            Separator,
            (offset) => new SyntaxError(',', offset)
        );

        const y = this.parseAnyNumber();

        const rb = this.tryNextToken(
            Separator,
            (offset) => new SyntaxError(')', offset)
        );

        return new CoordsNode(x, y);
    }

    private parseAnyNumber(): number {
        const nextToken = this.tryNextToken();

        if (nextToken.tokenType == FractionalLiteral)
            return parseFloat(nextToken.value);
        else if (nextToken.tokenType == IntegerLiteral)
            return parseInt(nextToken.value);

        throw new SyntaxError('numeric', nextToken.offset);
    }
}