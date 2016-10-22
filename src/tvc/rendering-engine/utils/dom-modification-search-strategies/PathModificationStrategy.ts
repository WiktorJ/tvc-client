import {DOMElements} from '../../namespaces/DOMElements';
import {IEdgeModificationSearchStrategy} from './IEdgeModificationSearchStrategy';
import {DOMAttributes} from '../../namespaces/DOMAttributes';
/**
 * Created by wjurasz on 27.09.16.
 */
export class PathModificationStrategy implements  IEdgeModificationSearchStrategy{
    getElementToInsert(): string {
        return DOMElements.PATH;
    }
    attributesToCopy(element: any): any {
        return  {
            d: element.attributes.d.nodeValue,
            clazz: element.attributes.class.nodeValue,
        };
    }

    attributesToAdd(selection: any, pathCloningEntities: any): void {
        selection
            .attr(DOMAttributes.D, (d: any) => pathCloningEntities[d.__id].d)
            .attr(DOMAttributes.CLAZZ, (d: any) => pathCloningEntities[d.__id].clazz)
    }

}