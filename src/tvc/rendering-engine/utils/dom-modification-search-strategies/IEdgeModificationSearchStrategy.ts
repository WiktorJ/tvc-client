/**
 * Created by wjurasz on 27.09.16.
 */
export interface IEdgeModificationSearchStrategy {
    getElementToInsert(): string;
    attributesToCopy(element: any): any;
    attributesToAdd(selection: any, pathCloningEntities: any): void;
}