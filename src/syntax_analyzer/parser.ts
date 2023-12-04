import {TokenType} from "chevrotain";
import {LexerIterator} from "../lexer/lexer-iterator.js";
import {Token} from "../lexer/token.js";
import {FractionalLiteral, Identifier, IntegerLiteral, KeyWord, Operator, Separator} from "../lexer/token-types.js";
import {
    CommandNode,
    CoordsNode,
    GraphicalObjectNode,
    LineNode,
    LineSegmentNode,
    PerpendicularNode,
    PointNode,
    TaskNode
} from "./nodes.js";
import {randomInt} from "crypto";
import {keywords} from "../lexer/constants/reserved-words.js";



export class SyntaxError extends Error {
    constructor(expectedToken: string = 'будь-який', offset: number, currentTokenValue: string ) {
        super(`${offset}: ...${currentTokenValue} -> Очікується токен <${expectedToken}>.`);
    }
}

export type CoordinateObject = { x: number, y: number };
export type IdentifiersTable = Map<string, CoordinateObject >;

export class Parser {
    private identifiers: IdentifiersTable = new Map();

    constructor(private tokenIterator: LexerIterator) {
        if (!this.tokenIterator.hasNext())
            throw new SyntaxError(`початковий`, 0, this.tokenIterator.current()?.value ?? '');
    }

    public get identifiersTable(): IdentifiersTable {
        return this.identifiers;
    }


    private tryNextToken (
        expectedTokenType?: TokenType,
        expectedValue?: string,
    ): Token {
        const syntaxError = (offset: number): SyntaxError =>
            new SyntaxError(`${expectedTokenType?.name ?? ''} <${expectedValue ?? ''}>`, offset, this.tokenIterator.current()?.value ?? '');

        if (!this.tokenIterator.hasNext())
            throw syntaxError(this.tokenIterator.current()?.offset ?? 0);

        const nextToken = this.tokenIterator.next();
        const unexpectedType: boolean = !!expectedTokenType && nextToken.tokenType != expectedTokenType;
        const unexpectedValue: boolean = !!expectedValue && nextToken.value != expectedValue;

        if (unexpectedType || unexpectedValue)
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
        this.tryNextToken(Separator, '.');

        return new CommandNode(operator, object);
    }

    private parseOperator(): string {
        const operator = this.tryNextToken(Operator);

        return operator.value;
    }

    private parseObject(): GraphicalObjectNode {
        const keyWord = this.tokenIterator.peekForward();

        switch (keyWord.value) {
            case keywords.point:
                return this.parsePoint();
            case keywords.line: {
                return this.parseLine();
            }
            case keywords.lineSegment: {
                return this.parseLineSegment();
            }
            case keywords.perpendicular:
                return this.parsePerpendicular();
            default:
                throw new SyntaxError('назва графічного обʼєкта (ТОЧКА, ПРЯМА тощо)', keyWord.offset, this.tokenIterator.current()?.value ?? '');

        }
    }

    private parseLine(): LineNode {
        this.tryNextToken(KeyWord, keywords.line);

        const {p1, p2} = this.parseTwoPoints();

        return new LineNode(p1, p2);
    }

    private parseLineSegment(): LineSegmentNode {
        this.tryNextToken(KeyWord, keywords.lineSegment);

        const {p1, p2} = this.parseTwoPoints();

        return new LineSegmentNode(p1, p2);
    }

    private parseTwoPoints(): {p1: PointNode, p2: PointNode} {
        const p1 = this.parsePoint();
        const p2 = this.parsePoint();

        return {p1, p2};
    }

    private parsePerpendicular(): PerpendicularNode {
        this.tryNextToken(KeyWord, keywords.perpendicular);

        const pointFrom = this.parsePoint();
        const keyWord = this.tokenIterator.peekForward();

        switch (keyWord.value) {
            case keywords.line:
                return new PerpendicularNode(this.parseLine(), pointFrom);
            case keywords.lineSegment:
                return new PerpendicularNode(this.parseLineSegment(), pointFrom);
            default:
                throw new SyntaxError('ПРЯМА або ВІДРІЗОК', this.tokenIterator.next()?.offset, this.tokenIterator.current()?.value ?? '');
        }
    }

    private parsePoint(): PointNode {
        if (this.tokenIterator.peekForward().value == keywords.point)
            return this.parsePointWithKeyword();

        return this.parsePointWithoutKeyword();
    }

    private parsePointWithKeyword(): PointNode {
        this.tryNextToken(KeyWord, keywords.point);

        return this.parsePointWithoutKeyword();
    }

    private parsePointWithoutKeyword(): PointNode {
        const pointId = this.parsePointId();

        let pointCoords: CoordsNode;

        if (this.tokenIterator.peekForward()?.value == '(')
            pointCoords = this.parseCoords();
        else if (this.identifiers.has(pointId)) {
            const {x, y} = this.identifiers.get(pointId)!;

            pointCoords = new CoordsNode(x, y);
        } else {
            pointCoords = this.randomAverageCoords();
        }

        this.identifiers.set(pointId, {x: pointCoords.x, y: pointCoords.y})

        return new PointNode(pointId, pointCoords);
    }

    private parsePointId(): string {
        const pointId = this.tryNextToken(Identifier);

        return pointId.value;
    }

    private parseCoords(): CoordsNode {
        this.tryNextToken(Separator, '(');
        const x = this.parseAnyNumber();

        this.tryNextToken(Separator,',');

        const y = this.parseAnyNumber();
        this.tryNextToken(Separator, ')');

        return new CoordsNode(x, y);
    }

    private randomAverageCoords(): CoordsNode {
        let averageX: number = 0;
        let countX: number = 0;
        let averageY: number = 0;
        let countY: number = 0;

        this.identifiersTable.forEach(coord => {
            averageX = (averageX + coord.x) / ++countX;
            averageY = (averageY + coord.y) / ++countY;
        });

        return new CoordsNode(averageX + randomInt(1, 5), averageY + randomInt(1, 5));
    }

    private parseAnyNumber(): number {
        const nextToken = this.tryNextToken();

        if (nextToken.tokenType == FractionalLiteral)
            return parseFloat(nextToken.value);
        else if (nextToken.tokenType == IntegerLiteral)
            return parseInt(nextToken.value);

        throw new SyntaxError('numeric', nextToken.offset, this.tokenIterator.current()?.value ?? '');
    }
}