import {TopologyRenderingDirective} from './directives/TopologyRenderingDirective';
import {PredefinedTypesService} from './services/PredefinedTypesService';
import {TopologyVisualisationComponent} from './TopologyVisualisationComponent';
import {DataService} from './services/DataService';
import {TopologySearchService} from './services/TopologySearchService';
angular.module('app.engine', [])
    .service(PredefinedTypesService.IID, PredefinedTypesService)
    .service(DataService.IID, DataService)
    .service(TopologySearchService.IID, TopologySearchService)
    .directive(TopologyRenderingDirective.IID, TopologyRenderingDirective.factory())
    .component(TopologyVisualisationComponent.IID, new TopologyVisualisationComponent());
