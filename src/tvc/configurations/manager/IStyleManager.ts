import {IVisualisationWindowSizes} from './IVisualisationWindowSizes';
import {ILegend} from './ILegend';
import {IAnimationParameters} from './IAnimationParameters';
import {IPredefinedType} from './IPredefinedType';
import {IDataMetaProcessor} from '../types/IDataMetaProcessor';
import {INodeDisplayConfig} from './INodeDisplayConfig';
import {IDataFieldsMapping} from './IDataFieldsMapping';
import {IEdgeDisplayConfig} from './IEdgeDisplayConfig';
import {CustomMap} from '../../rendering-engine/utils/CustomMap';
import {ISearchLookDetails} from './ISearchLookDetails';
/**
 * Created by wjurasz on 25.07.16.
 */
/**
 * Every customizable part of component is defined here.
 */
export interface IStyleManager {
    sizes?: IVisualisationWindowSizes;
    legend?: ILegend;
    dataFieldsMapping?: IDataFieldsMapping;
    animationParameters?: IAnimationParameters;
    nodeDisplayConfig?: INodeDisplayConfig;
    edgeDisplayConfig?: IEdgeDisplayConfig;
    predefinedNodeTypes?: CustomMap<string, IPredefinedType<INodeDisplayConfig>>;
    predefinedEdgeTypes?: CustomMap<string, IPredefinedType<IEdgeDisplayConfig>>;
    nodeSearchLookDetails?: ISearchLookDetails;
    edgeSearchLookDetails?: ISearchLookDetails;
    /**
     * This function is triggered on every data reload.
     * By default it returns @IDataMetaProcessor with @graphData equals to @data.
     * Later return value of this function is passed to every @IManipulationFunction.
     * @param data: Input topology data
     * @param metaData: Optional metaData specified by user (not yet supported).
     */
    processData?: (data: any, metaData: any) => IDataMetaProcessor;
}
