/**
 * Created by wjurasz on 18.08.16.
 */
import {DataService} from './services/DataService';
import {Configurations} from '../configurations/implementations/Configurations';
import {IRenderer} from './renderers/IRenderer';
import {PredefinedTypesService} from './services/PredefinedTypesService';
import {IStyleManager} from '../configurations/manager/IStyleManager';
import {IPredefinedType} from '../configurations/manager/IPredefinedType';
import {IConfiguration} from '../configurations/IConfiguration';
import {INodeDisplayConfig} from '../configurations/manager/INodeDisplayConfig';
import {CustomMap} from './utils/CustomMap';
import {TopologySearchService} from './services/TopologySearchService';
import {IDataManager} from '../configurations/IDataManager';


export class TopologyVisualisationComponent implements ng.IComponentOptions {
    public static IID: string = 'acwTopologyVisualisation';

    public template: string = `
  <select ng-if="$ctrl.showManagersList" class="control-switches" name="managersSelect" id="managersSelect" ng-model="$ctrl.managerName"
    ng-init="$ctrl.managerName = $ctrl.managers[0]; $ctrl.prepareData()"
    ng-options="manager for manager in $ctrl.managers"
    ng-click="$ctrl.prepareData($ctrl.managerName)">
</select>
<form class="control-switches" ng-if="$ctrl.data" ng-submit="$ctrl.performSearch(searchSelector)">
 <input class="control-switches" type="text" name="searchInput" ng-model="searchSelector">
</form>
<button ng-if="$ctrl.data" class="control-switches" ng-click="$ctrl.resetSearch()">Reset Search</button>
<acw-topology-rendering data="$ctrl.data" 
style-manager="$ctrl.baseConfiguration.styleManager"
renderer="$ctrl.renderer"
main-node-id="$ctrl.mainNodeId"></acw-topology-rendering>
`;

    public bindings: any = {
        configuration: '<',
        renderer: '<',
        parserDataFunction: '<',
        dynamicCustomParameters: '<',
        showManagersList: '<'
    };


    public controller: Function = TVCCtrl;
}

class TVCCtrl implements ng.IComponentController {
    public static $inject: Array<string> = [DataService.IID, PredefinedTypesService.IID, TopologySearchService.IID];


    constructor(private dataRepository: DataService,
                private predefinedTypesService: PredefinedTypesService,
                private searchService: TopologySearchService) {
    };

    private configuration: IConfiguration;
    private dynamicCustomParameters: any;
    private parserDataFunction: any;
    private renderer: IRenderer;
    private managers: string[] = [];
    private baseConfiguration: IConfiguration;
    private basicStyleManager: IStyleManager;
    private currentDataManager: IDataManager;
    private mainNodeId: string;
    private managerName: string;
    private styleManagerInitializationStatus: CustomMap<string, boolean>;
    private data: any;
    private showManagersList: boolean;

    public $onInit(): void {
        this.baseConfiguration = angular.copy(this.configuration, this.baseConfiguration);
        this.baseConfiguration.styleManager =
            _.defaultsDeep(this.baseConfiguration.styleManager, Configurations.defaultStyleManager())
            || Configurations.defaultStyleManager();
        this.baseConfiguration.dataManagers.forEach((value: any, key: string): any => {
            this.managers.push(key);
        });
        this.basicStyleManager = this.baseConfiguration.styleManager;
        this.styleManagerInitializationStatus = new CustomMap<string, boolean>();
        this.dataRepository.dataManagers = this.baseConfiguration.dataManagers;
    }

    public $onChanges(changesObj: any): void {
        this.dynamicCustomParameters = changesObj.dynamicCustomParameters.currentValue;
        if (!_.isUndefined(this.dynamicCustomParameters) && !_.isEmpty(this.dynamicCustomParameters)) {
            if (!this.showManagersList) {
                this.prepareData();
            } else {
                this.prepareData(this.managerName);
            }
        }

    }

    private performSearch(selector: string): any {
        this.searchService.performSearch(selector);
    }

    private resetSearch(): any {
        this.searchService.resetSearch();
    }


    public prepareData(dataManagerName?: string): any {
        if (!dataManagerName) {
            if (!_.head(this.managers)) {
                throw 'No data manager provided!'
            }
            dataManagerName = _.head(this.managers);
        }
        if (!this.baseConfiguration.dataManagers.get(dataManagerName)) {
            // TODO: pop-up
            console.log('There is no such dataManager');
        } else {
            this.currentDataManager = this.baseConfiguration.dataManagers.get(dataManagerName);
            if (this.currentDataManager.topologyQueryConfig.mainNodeId) {
                this.mainNodeId = this.currentDataManager.topologyQueryConfig.mainNodeId(this.dynamicCustomParameters);
            }
            let currentManager: IStyleManager = this.currentDataManager.styleManager;
            if (!this.styleManagerInitializationStatus.get(dataManagerName)) {
                currentManager = _.defaultsDeep(currentManager, this.basicStyleManager) || this.basicStyleManager;

                // customs for nodeDisplayConfig
                copyMissingCustoms(currentManager.nodeDisplayConfig.customLabelsAttributes,
                    this.basicStyleManager.nodeDisplayConfig.customLabelsAttributes);

                copyMissingCustoms(currentManager.nodeDisplayConfig.customLabelsEvents,
                    this.basicStyleManager.nodeDisplayConfig.customLabelsEvents);

                copyMissingCustoms(currentManager.nodeDisplayConfig.customLabelsStyles,
                    this.basicStyleManager.nodeDisplayConfig.customLabelsStyles);

                copyMissingCustoms(currentManager.nodeDisplayConfig.customNodesAttributes,
                    this.basicStyleManager.nodeDisplayConfig.customNodesAttributes);

                copyMissingCustoms(currentManager.nodeDisplayConfig.customNodesEvents,
                    this.basicStyleManager.nodeDisplayConfig.customNodesEvents);

                copyMissingCustoms(currentManager.nodeDisplayConfig.customNodesStyles,
                    this.basicStyleManager.nodeDisplayConfig.customNodesStyles);

                // customs for edgeDisplayConfig
                copyMissingCustoms(currentManager.edgeDisplayConfig.customLabelsAttributes,
                    this.basicStyleManager.edgeDisplayConfig.customLabelsAttributes);

                copyMissingCustoms(currentManager.edgeDisplayConfig.customLabelsEvents,
                    this.basicStyleManager.edgeDisplayConfig.customLabelsEvents);

                copyMissingCustoms(currentManager.edgeDisplayConfig.customLabelsStyles,
                    this.basicStyleManager.edgeDisplayConfig.customLabelsStyles);

                copyMissingCustoms(currentManager.edgeDisplayConfig.customEdgesAttributes,
                    this.basicStyleManager.edgeDisplayConfig.customEdgesAttributes);

                copyMissingCustoms(currentManager.edgeDisplayConfig.customEdgesEvents,
                    this.basicStyleManager.edgeDisplayConfig.customEdgesEvents);

                copyMissingCustoms(currentManager.edgeDisplayConfig.customEdgesStyles,
                    this.basicStyleManager.edgeDisplayConfig.customEdgesStyles);

                configurePredefinedObjects(currentManager.predefinedEdgeTypes,
                    this.basicStyleManager.predefinedEdgeTypes,
                    currentManager.edgeDisplayConfig);

                configurePredefinedObjects(currentManager.predefinedNodeTypes,
                    this.basicStyleManager.predefinedNodeTypes,
                    currentManager.nodeDisplayConfig);

                function configurePredefinedObjects(predefinedObjects: CustomMap<string, IPredefinedType<any>>,
                                                    basePredefinedObjects: CustomMap<string, IPredefinedType<any>>,
                                                    basicObject: any): void {
                    basePredefinedObjects.forEach((value: IPredefinedType<INodeDisplayConfig>, key: string): void => {
                        if (!predefinedObjects.get(key)) {
                            predefinedObjects.set(key, value);
                        }
                    });

                    predefinedObjects.forEach((value: IPredefinedType<any>, key: string): void => {
                        _.defaultsDeep(value.element, basicObject);
                    });

                    predefinedObjects.forEach((value: IPredefinedType<INodeDisplayConfig>, key: string): void => {
                        let baseObject: IPredefinedType<INodeDisplayConfig> = basePredefinedObjects.get(key);
                        _.defaultsDeep(value.element, baseObject ? baseObject.element : basicObject);
                    });
                }

                function copyMissingCustoms(targetCustoms: Array<any>, sourceCustoms: Array<any>): void {
                    _.forEach(sourceCustoms, (baseCustom: any): void => {
                        if (!_.find(targetCustoms, (currentCustom: any): boolean =>
                            currentCustom.name === baseCustom.name)) {
                            targetCustoms.push(baseCustom);
                        }
                    });
                }

                this.styleManagerInitializationStatus.set(dataManagerName, true);
                if (!this.currentDataManager.topologyQueryConfig.queryCustomParameters) {
                    this.currentDataManager.topologyQueryConfig.queryCustomParameters = new CustomMap();
                }
                if (_.isUndefined(this.currentDataManager.useParser)) {
                    this.currentDataManager.useParser = false;
                }
            }
            this.baseConfiguration.styleManager = currentManager;
            this.predefinedTypesService.styleManager = this.baseConfiguration.styleManager;
            this.searchService.edgeSearchLookDetails = this.baseConfiguration.styleManager.edgeSearchLookDetails;
            this.searchService.nodeSearchLookDetails = this.baseConfiguration.styleManager.nodeSearchLookDetails;
            if (!this.currentDataManager.topologyQueryConfig.defaultDistance) {
                this.dataRepository.getNodes(dataManagerName, this.dynamicCustomParameters).then((response: any) => {
                    this.data = this.parseData(response.data, this.baseConfiguration.dataManagers.get(dataManagerName).useParser)
                }).catch((err: any): any => {
                    // TODO: pop-up
                    console.log('Data was not found');
                });
            } else {
                this.dataRepository.getByDistanceFromMainNode(dataManagerName, this.dynamicCustomParameters)
                    .then((response: any) => {
                        this.data = this.parseData(response.data, this.baseConfiguration.dataManagers.get(dataManagerName).useParser)
                    }).catch((err: any): any => {
                    // TODO: pop-up
                    console.log('Data was not found');
                });
            }
        }
    }


    private parseData(data: any, useParser: boolean): any {
        if (!_.isArray(data)) {
            throw 'Data are not array of objects'
        }
        ;
        if (this.parserDataFunction && useParser) {
            try {
                return this.parserDataFunction(data);
            } catch (err) {
                // TODO: pop-up
                throw 'Parser function threw an error: ' + err;
            }
        }
        return data;
    }

}