import {IDataManager} from '../../configurations/IDataManager';
import {CustomMap} from '../utils/CustomMap';
import isUndefined = require('lodash/isUndefined');
/**
 * Created by wjurasz on 7/6/16.
 */

export class DataService {
    public static IID: string = 'DataService';
    public static $inject: Array<string> = ['$http'];
    private _dataManagers: CustomMap<string, IDataManager>;

    constructor(private $http: ng.IHttpService) {
    }

    set dataManagers(value: CustomMap<string, IDataManager>) {
        this._dataManagers = value;
    }

    public getNodes(dataManagerName: string,
                    dynamicCustomParameters?: any): any {
        let dm: any = this._dataManagers.get(dataManagerName);
        let paramsObject: any =
            this.createCustomParameterObject(dm.topologyQueryConfig.queryCustomParameters,
                dm.topologyQueryConfig.useDynamicCustomParameters ? dynamicCustomParameters : undefined);
        paramsObject['queryName'] = dm.topologyQueryConfig.getAllQueryName;
        return this.$http.get('/api/tvc/nodes/' + dm.topologyQueryConfig.name,
            {params: paramsObject});
    }

    public getByDistance(dataManagerName: string,
                         nodeId: string,
                         dynamicCustomParameters?: any,
                         distance?: number): any {
        let dm: any = this._dataManagers.get(dataManagerName);
        let distanceToSend: number = distance || dm.topologyQueryConfig.defaultDistance;
        let paramsObject: any =
            this.createCustomParameterObject(dm.topologyQueryConfig.queryCustomParameters,
                dm.topologyQueryConfig.useDynamicCustomParameters ? dynamicCustomParameters : undefined);
        paramsObject['queryName'] = dm.topologyQueryConfig.getByIdQueryName;
        paramsObject['distance'] = distanceToSend;
        return this.$http.get('/api/tvc/nodes/' + dm.topologyQueryConfig.name +
            '/' + nodeId, {params: paramsObject});
    }

    public getByDistanceFromMainNode(dataManagerName: string,
                                     dynamicCustomParameters?: any,
                                     distance?: number): any {
        return this.getByDistance(dataManagerName,
            this._dataManagers.get(dataManagerName).topologyQueryConfig.mainNodeId(dynamicCustomParameters),
            dynamicCustomParameters,
            distance);
    }

    private createCustomParameterObject(customParameters: CustomMap<string, string>,
                                        dynamicCustomParameters?: any): any {
        let parameters: any = {};
        customParameters.forEach((value: string, key: string): any => {
            parameters[key] = value;
        });
        if (dynamicCustomParameters) {
            _.forEach(dynamicCustomParameters,(value: string, key: string): any => parameters[key] = value)
        }
        return parameters;
    }

}
