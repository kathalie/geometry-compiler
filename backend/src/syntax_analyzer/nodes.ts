import {SemanticError} from "../semantic_analyzer/translator.js";

export interface ASTNode {
    tree: () => Object
}

export class TaskNode implements ASTNode {
    constructor(
        public commands: CommandNode[] = []
    ) {
    }

    tree = () => {
        return {
            task: this.commands.map(c => c.tree()),
        }
    }
}

export class CommandNode implements ASTNode {
    constructor(
        public operator: string,
        public object: GraphicalObjectNode,
    ) {
    }

    tree = () => {
        return {
            command: {
                operator: this.operator,
                object: this.object.tree(),
            }
        }
    }
}

export type GraphicalObjectNode = PointNode | LineNode | LineSegmentNode | PerpendicularNode | TriangleNode;

export class PointNode implements ASTNode {
    constructor(
        public id: string,
        public coords: CoordsNode,
    ) {
    }

    public x(): number {
        return this.coords.x;
    }

    public y(): number {
        return this.coords.y;
    }

    tree = () => {
        return {
            point: {
                id: this.id,
                coords: this.coords.tree()
            }
        }
    }
}

export class LinearNode implements ASTNode {
    constructor(
        public p1: PointNode,
        public p2: PointNode,
        private name: string
    ) {
    }

    public intersectionWithPerpendicular(from: PointNode): PointNode {
        const x1 = this.p1.x();
        const x2 = this.p2.x();
        const y1 = this.p1.y();
        const y2 = this.p2.y();

        const perpendicularToHorizontal = y1 === y2;
        const perpendicularToVertical = x1 === x2;

        const k = perpendicularToHorizontal ? 0 : (y1 - y2) / (x1 - x2);
        const b = perpendicularToVertical ? y1: y1 - k * x1;

        if (from.x() * k + b === from.y())
            throw new SemanticError('Точка, з якої має бути проведено перпендикуляр, не має лежати на прямій!');

        const kPerpendicular = perpendicularToVertical ? 0 : - 1 / k;
        const bPerpendicular = perpendicularToHorizontal ? from.y() : from.y() - kPerpendicular * from.x();

        const x = perpendicularToHorizontal ? from.x() : (b - bPerpendicular) / (kPerpendicular - k);
        const y = perpendicularToVertical ? from.y() : k * x + b;

        return new PointNode(`${from.id}'`, new CoordsNode(x, y));
    }

    tree = () => {
        return {
            [this.name]: {
                point1: this.p1.tree(),
                point2: this.p2.tree(),
            }
        }
    }
}

export class LineNode extends LinearNode {
    constructor(
        public p1: PointNode,
        public p2: PointNode,
    ) {
        super(p1, p2, 'line');
    }

}

export class LineSegmentNode extends LinearNode {
    constructor(
        public p1: PointNode,
        public p2: PointNode,
    ) {
        super(p1, p2, 'lineSegment');
    }

    public length(): number {
        const x1 = this.p1.x();
        const x2 = this.p2.x();
        const y1 = this.p1.y();
        const y2 = this.p2.y();

        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}

export class CoordsNode implements ASTNode {
    constructor(
        public x: number,
        public y: number,
    ) {
    }

    tree = () => {
        return {
            coords: {
                x: this.x,
                y: this.y
            }
        }
    }
}

export class PerpendicularNode implements ASTNode {
    constructor(
        public to: LineNode | LineSegmentNode,
        public from: PointNode,
    ) {
    }

    tree = () => {
        return {
            perpendicular: {
                to: this.to.tree(),
                from: this.from.tree()
            }
        }
    }
}

export class TriangleNode implements ASTNode {
    public readonly s1: LineSegmentNode;
    public readonly s2: LineSegmentNode;
    public readonly s3: LineSegmentNode;
    constructor(
        public p1: PointNode,
        public p2: PointNode,
        public p3: PointNode,
    ) {
        this.s1 = new LineSegmentNode(this.p1, this.p2);
        this.s2 = new LineSegmentNode(this.p2, this.p3);
        this.s3 = new LineSegmentNode(this.p1, this.p3);
    }

    tree = () => {
        return {
            triangle: {
                point1: this.p1.tree(),
                point2: this.p2.tree(),
                point3: this.p3.tree(),
            }
        }
    }
}