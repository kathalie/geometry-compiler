import {CoordinateObject, IdentifiersTable} from "../syntax_analyzer/parser.js";
import {
    CommandNode, CoordsNode,
    GraphicalObjectNode,
    LineNode,
    LineSegmentNode, PerpendicularNode,
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
        if (objectNode instanceof PointNode)
            return this.translatePoint(objectNode);

        if (objectNode instanceof LineNode)
            return this.translateLine(objectNode);

        if (objectNode instanceof LineSegmentNode)
            return this.translateLineSegment(objectNode);

        // add perpendicular
        return this.translatePerpendicular(objectNode);
    }

    private translatePoint(pointNode: PointNode): GraphicalCommand[] {
        const pointId = pointNode.id;

        if (!this.identifiers.has(pointId))
            throw new SemanticError(`Для точки ${pointNode.id} на знайдено заданих координат.`);

        const coords = this.identifiers.get(pointId)!;

        this.drawnPoints.push(pointId)

        return [drawPointCommand(pointId, coords)];
    }

    private translateLine(lineNode: LineNode): GraphicalCommand[] {
        const p1 = lineNode.p1;
        const p2 = lineNode.p2;

        for (const p of [p1, p2])
            if (!this.identifiers.has(p.id))
                throw new SemanticError(`Координати для точки ${p.id} не було задано.`);

        const commands =  [];

        for (const p of [p1, p2]) {
            if (!this.drawnPoints.includes(p.id))
                commands.push(drawPointCommand(p.id, p.coords));
        }

        commands.push(drawLineCommand(p1.id, p2.id));

        return commands;
    }

    private translateLineSegment(segmentNode: LineSegmentNode): GraphicalCommand[] {
        const p1 = segmentNode.p1;
        const p2 = segmentNode.p2;

        for (const p of [p1, p2])
            if (!this.identifiers.has(p.id))
                throw new SemanticError(`Координати для точки ${p.id} не було задано.`);

        const commands =  [];

        for (const p of [p1, p2]) {
            if (!this.drawnPoints.includes(p.id))
                commands.push(drawPointCommand(p.id, p.coords));
        }

        commands.push(drawLineSegmentCommand(p1.id, p2.id));

        return commands;
    }

    private translatePerpendicular(perpendicular: PerpendicularNode): GraphicalCommand[] {
        const p = perpendicular.from;
        const p1 = perpendicular.to.p1;
        const p2 = perpendicular.to.p2;

        const k = (p1.coords.y - p2.coords.y) / (p1.coords.x - p2.coords.x);
        const b = p1.coords.y - k * p1.coords.x;

        if (p.coords.x * k + b == p.coords.y)
            throw new SemanticError('Точка, з якої має бути проведено перпендикуляр, не має лежати на прямій!');

        const kPerpendicular = - 1 / k;
        const bPerpendicular = p.coords.y - kPerpendicular * p.coords.x;

        const x = (b - bPerpendicular) / (kPerpendicular - k);
        const y = k * x + b;
        const intersectionPointId = `${p.id}'`

        const commands = [];

        if (!this.drawnPoints.includes(p.id))
            commands.push(drawPointCommand(p.id, p.coords));

        commands.push(drawPointCommand(intersectionPointId, {x, y}));
        commands.push(drawLineCommand(p.id, intersectionPointId));

        return commands;
    }
}