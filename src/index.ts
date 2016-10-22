// export everything that you want to access directly in TS code outside the package
import './tvc/rendering-engine/module';
import {TreeComponent} from './tvc/TreeComponent';
import {GraphComponent} from './tvc/GraphComponent';
import {IConfiguration} from './tvc/configurations/IConfiguration'
import {IStyleManager} from './tvc/configurations/manager/IStyleManager'
import {IDataManager} from './tvc/configurations/IDataManager'
import {IVisualisationWindowSizes} from './tvc/configurations/manager/IVisualisationWindowSizes'
import {IMargins} from './tvc/configurations/manager/IMargins'
import {ILegend} from './tvc/configurations/manager/ILegend'
import {IDataFieldsMapping} from './tvc/configurations/manager/IDataFieldsMapping'
import {IAnimationParameters} from './tvc/configurations/manager/IAnimationParameters'
import {ITreeAnimationParameters} from './tvc/configurations/manager/ITreeAnimationParameters'
import {IGraphAnimationParameters} from './tvc/configurations/manager/IGraphAnimationParameters'
import {IPredefinedType} from './tvc/configurations/manager/IPredefinedType'
import {INodeDisplayConfig} from './tvc/configurations/manager/INodeDisplayConfig'
import {INodeDetails} from './tvc/configurations/manager/INodeDetails'
import {IEdgeDisplayConfig} from './tvc/configurations/manager/IEdgeDisplayConfig'
import {IEdgeDetails} from './tvc/configurations/manager/IEdgeDetails'
import {IDataMetaProcessor} from './tvc/configurations/types/IDataMetaProcessor'
import {IManipulationFunction} from './tvc/configurations/types/IManipulationFunction'
import {ICustomManipulation} from './tvc/configurations/types/ICustomManipulation'
import {ICustomEvent} from './tvc/configurations/types/ICustomEvent'
import {ConstantManipulationFunctionFactory} from './tvc/configurations/utils/ConstantManipulationFunctionFactory'
import {SupportedHTMLEvents} from './tvc/configurations/utils/SupportedHTMLEvents'
import {CustomMap} from './tvc/rendering-engine/utils/CustomMap'
import {Circle} from './tvc/configurations/manager/shapes/Circle'
import {Rectangle} from './tvc/configurations/manager/shapes/Rectangle'
import {Elipse} from './tvc/configurations/manager/shapes/Elipse'


export {
    IConfiguration, IStyleManager, IDataManager, IVisualisationWindowSizes, IMargins, ILegend,
    IDataFieldsMapping, IAnimationParameters, ITreeAnimationParameters, IGraphAnimationParameters, IPredefinedType,
    INodeDisplayConfig, INodeDetails, IEdgeDisplayConfig, IEdgeDetails, IDataMetaProcessor, IManipulationFunction, ICustomManipulation,
    ICustomEvent, ConstantManipulationFunctionFactory, SupportedHTMLEvents, CustomMap, Circle, Rectangle, Elipse
}

// add to the module everything that should be available via Angular DI mechanism

angular.module('app.tvc', ['app.engine'])
    .component(TreeComponent.IID, new TreeComponent())
    .component(GraphComponent.IID, new GraphComponent());
