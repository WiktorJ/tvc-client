/**
 * Created by wjurasz on 17.08.16.
 */
import {IRenderer} from './rendering-engine/renderers/IRenderer';
import {GraphRenderer} from './rendering-engine/renderers/GraphRenderer';
import {PredefinedTypesService} from './rendering-engine/services/PredefinedTypesService';
import {IConfiguration} from './configurations/IConfiguration';

export class GraphComponent implements ng.IComponentOptions {
    public static IID: string = 'acwGraph';


    public template: string = `
<acw-topology-visualisation 
configuration="$ctrl.configuration"
renderer="$ctrl.renderer"
parser-data-function="$ctrl.parserDataFunction"
dynamic-custom-parameters="$ctrl.dynamicCustomParameters"
show-managers-list="$ctrl.showManagersList">
</acw-topology-visualisation>
`;

    public bindings: any = {
        configuration: '<',
        dynamicCustomParameters: '<',
        parserDataFunction: '<',
        showManagersList: '<'
    };

    public controller: Function = GraphCtrl;
}

class GraphCtrl implements ng.IComponentController {
    public static $inject: Array<string> = [PredefinedTypesService.IID];

    constructor(private predefinedTypesService: PredefinedTypesService) {
    }

    private configuration: IConfiguration;
    private dynamicCustomParameters: any;
    private renderer: IRenderer;

    public $onInit(): void {
        this.renderer = new GraphRenderer(this.predefinedTypesService);
    }

    public $onChanges(changesObj: any): void {
        this.dynamicCustomParameters = changesObj.dynamicCustomParameters.currentValue;
    }

}
