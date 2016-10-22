import {TreeRenderer} from './rendering-engine/renderers/TreeRenderer';
import {IRenderer} from './rendering-engine/renderers/IRenderer';
import {PredefinedTypesService} from './rendering-engine/services/PredefinedTypesService';
import {IConfiguration} from './configurations/IConfiguration';

export class TreeComponent implements ng.IComponentOptions {
    public static IID: string = 'acwTree';

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


    public controller: Function = View1Ctrl;
}

class View1Ctrl implements ng.IComponentController {
    public static $inject: Array<string> = [PredefinedTypesService.IID];

    constructor(private predefinedTypesService: PredefinedTypesService) {
    }

    private configuration: IConfiguration;
    public dynamicCustomParameters: any;
    public renderer: IRenderer;

    public $onInit(): void {
        this.renderer = new TreeRenderer(this.predefinedTypesService);
    }

    public $onChanges(changesObj: any): void {
        this.dynamicCustomParameters = changesObj.dynamicCustomParameters.currentValue;
    }

}
