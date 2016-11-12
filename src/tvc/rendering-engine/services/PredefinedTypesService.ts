import {IStyleManager} from '../../configurations/manager/IStyleManager';
import {IDataMetaProcessor} from '../../configurations/types/IDataMetaProcessor';
import {IPredefinedType} from '../../configurations/manager/IPredefinedType';
import {CustomMap} from '../utils/CustomMap';
let _ = require('lodash');
/**
 * Created by wjurasz on 29.08.16.
 */
export class PredefinedTypesService {
    public static IID: string = 'PredefinedTypesService';
    public static $inject: Array<string> = [];
    private _styleManager: IStyleManager;

    set styleManager(value: IStyleManager) {
        this._styleManager = value;
    }

    private getElementManagerImplementation<T>(dataMetaProcessor: IDataMetaProcessor,
                                               data: any,
                                               elements: CustomMap<string, IPredefinedType<T>>,
                                               defaultElement: T): T {
        let retVal: T = undefined;
        elements.forEach((value: IPredefinedType<T>): void => {
            if (value.condition(dataMetaProcessor, data)) {
                retVal = value.element;
            }
        });

        return retVal ? retVal : defaultElement;
    }

    public addIEdgeImplementation(edges: any,
                                  dataMetaProcessor: IDataMetaProcessor): void {
        _.forEach(edges, (element: any): void => {
            element.iedges = this.getElementManagerImplementation(dataMetaProcessor,
                element,
                this._styleManager.predefinedEdgeTypes,
                this._styleManager.edgeDisplayConfig);
        });
    }

    public addINodeImplementation(nodes: any,
                                  dataMetaProcessor: IDataMetaProcessor): void {
        _.forEach(nodes, (element: any): void => {
            element.inodes = this.getElementManagerImplementation(dataMetaProcessor,
                element,
                this._styleManager.predefinedNodeTypes,
                this._styleManager.nodeDisplayConfig);
        });
    }
}
