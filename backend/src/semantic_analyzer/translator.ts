import {CoordinateObject, IdentifiersTable} from "../syntax_analyzer/parser.js";
import {
    CommandNode, CoordsNode,
    GraphicalObjectNode,
    LineNode,
    LineSegmentNode, PerpendicularNode,
    PointNode,
    TaskNode, TriangleNode
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

const drawPointCommand = (pointId: string, coords: CoordinateObject): GraphicalCommand => {
    return {
        elementType: 'point',
        parents: [coords.x, coords.y],
        attributes: {name: pointId},
    }
}

const drawLineCommand = (pointId1: string, pointId2: string): GraphicalCommand => {
    return {
        elementType: 'line',
        parents: [pointId1, pointId2]
    };
}

const drawLineSegmentCommand = (pointId1: string, pointId2: string): GraphicalCommand => {
    return {
        elementType: 'line',
        parents: [pointId1, pointId2],
        attributes: {straightFirst:false, straightLast:false}
    };
}

export class Translator {
    private drawnPoints: string[] = [];
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
        if (objectNode instanceof LineNode)
            return this.translateLine(objectNode);

        if (objectNode instanceof LineSegmentNode)
            return this.translateLineSegment(objectNode);

        if (objectNode instanceof PerpendicularNode)
            return this.translatePerpendicular(objectNode);

        if (objectNode instanceof TriangleNode)
            return this.translateTriangle(objectNode);

        return this.translatePoint(objectNode);
    }

    private translatePoint(pointNode: PointNode): GraphicalCommand[] {
        if (this.drawnPoints.includes(pointNode.id)) return [];

        const pointId = pointNode.id;

        if (!this.identifiers.has(pointId))
            throw new SemanticError(`Для точки ${pointNode.id} не знайдено заданих координат.`);

        const coords = this.identifiers.get(pointId)!;

        this.drawnPoints.push(pointId)

        return [drawPointCommand(pointId, coords)];
    }

    private translateLine(lineNode: LineNode): GraphicalCommand[] {
        const p1 = lineNode.p1;
        const p2 = lineNode.p2;

       return  [
            ...this.translatePoint(p1),
            ...this.translatePoint(p2),
            drawLineCommand(p1.id, p2.id)
        ];
    }

    private translateLineSegment(segmentNode: LineSegmentNode): GraphicalCommand[] {
        const p1 = segmentNode.p1;
        const p2 = segmentNode.p2;

       return  [
            ...this.translatePoint(p1),
            ...this.translatePoint(p2),
            drawLineSegmentCommand(p1.id, p2.id)
        ];
    }

    private translatePerpendicular(perpendicular: PerpendicularNode): GraphicalCommand[] {
        const pFrom = perpendicular.from;
        const p1 = perpendicular.to.p1;
        const p2 = perpendicular.to.p2;

        const commands = [
            ...this.translatePoint(pFrom),
            ...(perpendicular.to instanceof LineNode ?
                this.translateLine(perpendicular.to):
                this.translateLineSegment(perpendicular.to))
        ];

        const intersection = perpendicular.to.intersectionWithPerpendicular(pFrom);

        if (p1.x() === intersection.x() && p1.y() === intersection.y())
            commands.push(drawLineCommand(pFrom.id, p1.id));
        else if (p2.x() === intersection.x() && p2.y() === intersection.y())
            commands.push(drawLineCommand(pFrom.id, p2.id));
        else {
            commands.push(drawPointCommand(intersection.id, intersection.coords));
            commands.push(drawLineCommand(pFrom.id, intersection.id));
        }

        return commands;
    }

    private translateTriangle(triangle: TriangleNode): GraphicalCommand[] {
        const ab = triangle.s1.length();
        const bc = triangle.s2.length();
        const ac = triangle.s3.length();

        if (ab + bc <= ac || ab + ac <= bc || bc + ac <= ab)
            throw new SemanticError('Сторони трикутника не задовільняють нерівність трикутників2б.');

        return [
            ...this.translateLineSegment(triangle.s1),
            ...this.translateLineSegment(triangle.s2),
            ...this.translateLineSegment(triangle.s3),
        ];
    }
}