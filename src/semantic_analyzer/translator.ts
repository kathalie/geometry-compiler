import {IdentifiersTable} from "../syntax_analyzer/parser.js";
import {
    CommandNode,
    GraphicalObjectNode,
    LineNode,
    LineSegmentNode,
    PointNode,
    TaskNode
} from "../syntax_analyzer/nodes.js";

export class SemanticError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

type GraphicalObject = 'point' | 'line'

export type GraphicalCommand = {
    elementType: GraphicalObject,
    parents: string[] | number[],
    attributes?: Object | undefined
}

export class Translator {
    constructor(private taskNode: TaskNode, private identifiers: IdentifiersTable) {
    }

    public translate(): GraphicalCommand[] {
        const gcs = [] as GraphicalCommand[];

        for (const command of this.taskNode.commands)
            gcs.push(...this.translateCommand(command))

        return gcs;
    }

    private translateCommand(commandNode: CommandNode): GraphicalCommand[] {
        return this.translateGraphicalObject(commandNode.object);
    }

    private translateGraphicalObject(objectNode: GraphicalObjectNode): GraphicalCommand[] {
        if (objectNode instanceof PointNode)
            return this.translatePoint(objectNode);

        if (objectNode instanceof LineNode)
            return this.translateLine(objectNode);

        if (objectNode instanceof LineSegmentNode)
            return this.translateLineSegment(objectNode);

        // add perpendicular
        return this.translateLineSegment(objectNode);
    }

    private translatePoint(pointNode: PointNode): GraphicalCommand[] {
        const pointId = pointNode.id;

        if (!this.identifiers.has(pointId))
            throw new SemanticError(`No coordinates specified for a point ${pointNode.id} found.`);

        //TODO think of how to better work with points: let points without coordinates or not

        const coords = this.identifiers.get(pointId)!;

        return [{
            elementType: 'point',
            parents: [coords.x, coords.y],
            attributes: {name: pointId},
        }];
    }

    private translateLine(lineNode: LineNode): GraphicalCommand[] {
        const p1 = lineNode.p1;
        const p2 = lineNode.p2;

        if (!this.identifiers.has(p1.id))
            throw new SemanticError(`Coordinates for point ${p1.id} were never stated.`);

        if (!this.identifiers.has(p2.id))
            throw new SemanticError(`Coordinates for point ${p2.id} were never stated.`);

        return [{
            elementType: 'line',
            parents: [p1.id, p2.id]
        }];
    }

    private translateLineSegment(segmentNode: LineSegmentNode): GraphicalCommand[] {
        const p1 = segmentNode.p1;
        const p2 = segmentNode.p2;

        if (!this.identifiers.has(p1.id))
            throw new SemanticError(`Coordinates for point ${p1.id} were never stated.`);

        if (!this.identifiers.has(p2.id))
            throw new SemanticError(`Coordinates for point ${p2.id} were never stated.`);

        return [{
            elementType: 'line',
            parents: [p1.id, p2.id],
            attributes: {straightFirst:false, straightLast:false}
        }];
    }
}