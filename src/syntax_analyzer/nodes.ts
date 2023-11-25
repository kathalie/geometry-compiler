import {GraphicalCommand} from "../semantic_analyzer/translator.js";

export interface ASTNode {
    toString: () => String
}

export class TaskNode implements ASTNode{
    constructor(
        public commands: CommandNode[] = []
    ) {
    }
    toString = () =>
        `TASK: [${this.commands.map(c => c.toString()).join(', ')}]`;
}

export class CommandNode implements ASTNode{
    constructor(
        public operator: string,
        public object: GraphicalObjectNode,
    ) {
    }

    toString = () =>
        `COMMAND: [${this.operator}, ${this.object.toString()}]`
}

export type GraphicalObjectNode = PointNode | LineNode | LineSegmentNode;

export class PointNode implements ASTNode {
    constructor(
        public id: string,
        public coords?: CoordsNode | undefined,
    ) {
    }

    toString = () =>
        `POINT: [${this.id}, ${this.coords?.toString()}]`
}

export class LineNode implements ASTNode {
    constructor(
        public p1: PointNode,
        public p2: PointNode,
    ) {
    }

    toString = () =>
        `LINE: [${this.p1.toString()}, ${this.p2.toString()}]`
}

export class LineSegmentNode implements ASTNode {
    constructor(
        public p1: PointNode,
        public p2: PointNode,
    ) {
    }

    toString = () =>
        `LINE SEGMENT: [${this.p1.toString()}, ${this.p2.toString()}]`
}

export class CoordsNode implements ASTNode {
    constructor(
        public x: number,
        public y: number,
    ) {
    }

    toString = () =>
        `COORDS: [${this.x}, ${this.y}]`
}

export class PerpendicularNode implements ASTNode {
    constructor(
        public to: LineNode | LineSegmentNode,
        public from: PointNode,
    ) {
    }

    toString = () =>
        `PERPENDICULAR: [${this.to}, ${this.from}]`
}