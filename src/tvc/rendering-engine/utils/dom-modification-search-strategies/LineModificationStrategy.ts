import {DOMElements} from '../../namespaces/DOMElements';
import {IEdgeModificationSearchStrategy} from './IEdgeModificationSearchStrategy';
/**
 * Created by wjurasz on 27.09.16.
 */
export class LineModificationStrategy implements IEdgeModificationSearchStrategy {
    getElementToInsert(): string {
        return DOMElements.LINE;
    }
    attributesToCopy(element: any): any {
        return {
            x1: element.attributes.x1.nodeValue,
            x2: element.attributes.x2.nodeValue,
            y1: element.attributes.y1.nodeValue,
            y2: element.attributes.y2.nodeValue
        };
    }

    attributesToAdd(selection: any, pathCloningEntities: any): void {
        selection.attr('x1', (d: any) => pathCloningEntities[d.__id].x1)
            .attr('x2', (d: any) => pathCloningEntities[d.__id].x2)
            .attr('y1', (d: any) => pathCloningEntities[d.__id].y1)
            .attr('y2', (d: any) => pathCloningEntities[d.__id].y2)
    }

}