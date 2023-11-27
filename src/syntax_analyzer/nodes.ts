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

export type GraphicalObjectNode = PointNode | LineNode | LineSegmentNode;

export class PointNode implements ASTNode {
    constructor(
        public id: string,
        public coords: CoordsNode,
    ) {
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

export class LineNode implements ASTNode {
    constructor(
        public p1: PointNode,
        public p2: PointNode,
    ) {
    }

    tree = () => {
        return {
            line: {
                point1: this.p1.tree(),
                point2: this.p2.tree(),
            }
        }
    }
}

export class LineSegmentNode implements ASTNode {
    constructor(
        public p1: PointNode,
        public p2: PointNode,
    ) {
    }

    tree = () => {
        return {
            lineSegment: {
                point1: this.p1.tree(),
                point2: this.p2.tree(),
            }
        }
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