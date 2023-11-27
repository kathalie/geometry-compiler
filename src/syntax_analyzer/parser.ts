import {TokenType} from "chevrotain";
import {LexerIterator} from "../lexer/lexer-iterator.js";
import {Token} from "../lexer/token.js";
import {FractionalLiteral, Identifier, IntegerLiteral, KeyWord, Operator, Separator} from "../lexer/token-types.js";
import {CommandNode, CoordsNode, GraphicalObjectNode, LineNode, LineSegmentNode, PointNode, TaskNode} from "./nodes.js";
import {SemanticError} from "../semantic_analyzer/translator.js";
import {randomInt} from "crypto";


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

    private tryNextToken = (
        expectedTokenType?: TokenType,
        expectedValue?: string,
        //errorBuilder: ((offset: number) => SyntaxError) | null = null,
    ): Token => {
        const syntaxError = (offset: number): SyntaxError =>
            //errorBuilder?.(offset) ??
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
        const separator = this.tryNextToken(Separator, '.');

        return new CommandNode(operator, object);
    }

    private parseOperator(): string {
        const operator = this.tryNextToken(Operator);

        return operator.value;
    }

    private parseAnyNumber(): number {
        const nextToken = this.tryNextToken();

        if (nextToken.tokenType == FractionalLiteral)
            return parseFloat(nextToken.value);
        else if (nextToken.tokenType == IntegerLiteral)
            return parseInt(nextToken.value);

        throw new SyntaxError('numeric', nextToken.offset, this.tokenIterator.current()?.value ?? '');
    }

    private parseCoords(): CoordsNode {
        this.tryNextToken(Separator, '(');
        const x = this.parseAnyNumber();

        this.tryNextToken(Separator,',');

        const y = this.parseAnyNumber();
        this.tryNextToken(Separator, ')');

        return new CoordsNode(x, y);
    }

    private parsePointId(): string {
        const pointId = this.tryNextToken(Identifier);

        return pointId.value;
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

    private parsePoint(): PointNode {
        const pointId = this.parsePointId();

        let pointCoords: CoordsNode;

        try {
            this.tokenIterator.takeSnapshot();
            pointCoords = this.parseCoords();
        } catch(e) {
            if (this.identifiers.has(pointId)) {
                const existingCoords= this.identifiers.get(pointId)!;

                return new PointNode(pointId, new CoordsNode(existingCoords.x, existingCoords.y));
            }

            this.tokenIterator.backToLastSnapshot();

            pointCoords = this.randomAverageCoords();
        }

        if (this.identifiers.has(pointId))
            throw new SemanticError(`Точка ${pointId} вже має задані координати.`);

        this.identifiers.set(pointId, {x: pointCoords.x, y: pointCoords.y})

        return new PointNode(pointId, pointCoords);
    }

    private parsePossibleKeyword(keyWord: string) {
        this.tryNextToken(KeyWord, keyWord);
    }

    private checkThatNextTokenSatisfies(func: () => void) {
        this.tokenIterator.takeSnapshot();
        try {
            func();
        } catch (e) {
            this.tokenIterator.backToLastSnapshot();
        }
    }

    private parsePointsForStraightLine(): { p1: PointNode, p2: PointNode} {
        this.checkThatNextTokenSatisfies(() =>
            this.parsePossibleKeyword('ТОЧ')
        );

        const point1 = this.parsePoint();

        this.checkThatNextTokenSatisfies(() =>
            this.tryNextToken(Separator, ',')
        );

        this.checkThatNextTokenSatisfies(() =>
            this.parsePossibleKeyword('ТОЧ')
        );

        const point2 = this.parsePoint();

        return {p1: point1, p2: point2};
    }

    private parseLine(): LineNode {
        const {p1, p2} = this.parsePointsForStraightLine();

        return new LineNode(p1, p2);
    }

    private parseLineSegment(): LineSegmentNode {
        const {p1, p2} = this.parsePointsForStraightLine();

        return new LineSegmentNode(p1, p2);
    }

    private parseObject(): GraphicalObjectNode {
        const keyWord = this.tryNextToken(KeyWord);

        switch (keyWord.value) {
            case 'ТОЧ':
                return this.parsePoint();
            case 'ПРЯМ':
                return this.parseLine();
            case 'ВІДРІЗ':
                return this.parseLineSegment();
            // case 'ПЕРПЕНДИКУЛЯР':
            //     return this.parsePerpendicular();
            default:
                throw new SyntaxError('назва графічного обʼєкта (ТОЧКА, ПРЯМА тощо)', keyWord.offset, this.tokenIterator.current()?.value ?? '');

        }
    }
}