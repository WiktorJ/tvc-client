/**
 * Created by wjurasz on 14.07.16.
 */
import {IStyleManager} from '../manager/IStyleManager';
import {IPredefinedType} from '../manager/IPredefinedType';
import {IAnimationParameters} from '../manager/IAnimationParameters';
import {IVisualisationWindowSizes} from '../manager/IVisualisationWindowSizes';
import {ILegend} from '../manager/ILegend';
import {IDataMetaProcessor} from '../types/IDataMetaProcessor';
import {IMargins} from '../manager/IMargins';
import {IManipulationFunction} from '../types/IManipulationFunction';
import {ITreeAnimationParameters} from '../manager/ITreeAnimationParameters';
import {IGraphAnimationParameters} from '../manager/IGraphAnimationParameters';
import {ConstantManipulationFunctionFactory} from '../utils/ConstantManipulationFunctionFactory';
import {ICustomManipulation} from '../types/ICustomManipulation';
import {ICustomEvent} from '../types/ICustomEvent';
import {SupportedHTMLEvents} from '../utils/SupportedHTMLEvents';
import {INodeDetails} from '../manager/INodeDetails';
import {IEdgeDetails} from '../manager/IEdgeDetails';
import {IDataFieldsMapping} from '../manager/IDataFieldsMapping';
import {INodeDisplayConfig} from '../manager/INodeDisplayConfig';
import {IEdgeDisplayConfig} from '../manager/IEdgeDisplayConfig';
import {CustomMap} from '../../rendering-engine/utils/CustomMap';
import {IShape} from '../manager/shapes/IShape';
import {Circle} from '../manager/shapes/Circle';
import {ISearchLookDetails} from '../manager/ISearchLookDetails';
/**
 * Default implementation of @IStyleManager.
 */

export class DefaultStyleManager implements IStyleManager {
    constructor(public sizes: IVisualisationWindowSizes = new DefaultSizes(),
                public legend: ILegend = new DefaultLegend(),
                public dataFieldsMapping: IDataFieldsMapping = new DefaultNames(),
                public animationParameters: IAnimationParameters = new DefaultAnimationParameters(),
                public nodeDisplayConfig: INodeDisplayConfig = new DefaultNodes(),
                public edgeDisplayConfig: IEdgeDisplayConfig = new DefaultEdges(),
                public nodeSearchLookDetails: ISearchLookDetails = new DefaultNodeSearchLookDetails(),
                public edgeSearchLookDetails: ISearchLookDetails = new DefaultEdgeSearchLookDetails(),
                public predefinedNodeTypes: CustomMap<string, IPredefinedType<INodeDisplayConfig>> = new CustomMap(),
                public predefinedEdgeTypes: CustomMap<string, IPredefinedType<INodeDisplayConfig>> = new CustomMap()) {
    }

    public processData(data: any, metaData: any): IDataMetaProcessor {
        return {graphData: data};
    }
}


class DefaultSizes implements IVisualisationWindowSizes {
    public relativeHeight: number;
    public relativeWidth: number;

    constructor(public margins: IMargins = new DefaultMargins(),
                public width: number = 800,
                public height: number = 600) {
        this.relativeHeight = height - this.margins.top - this.margins.bottom;
        this.relativeWidth = width - this.margins.right - this.margins.left;
    }

}


class DefaultMargins implements IMargins {
    constructor(public top: number = 30,
                public right: number = 40,
                public bottom: number = 50,
                public left: number = 50) {
    }

}

class DefaultLegend implements ILegend {
    constructor(public generateLegend: boolean = true,
                public width: number = 400,
                public defaultNodeDescription: string = 'default') {
    }
}


class DefaultNames implements IDataFieldsMapping {
    constructor(public id: string = 'id',
                public parentId: string = 'parentId',
                public label: string = 'label',
                public data: string = 'data',
                public edgeLabel: string = 'edgeLabel') {
    }
}

class DefaultAnimationParameters implements IAnimationParameters {
    constructor(public zoom: boolean = true,
                public treeParameters: ITreeAnimationParameters = new DefaultTreeAnimationParameters(),
                public graphParameters: IGraphAnimationParameters = new DefaultGraphAnimationParameters()) {
    }
}

class DefaultTreeAnimationParameters implements ITreeAnimationParameters {
    constructor(public duration: IManipulationFunction<number> = ConstantManipulationFunctionFactory.produce(1000),
                public nodesDistance: IManipulationFunction<number> = ConstantManipulationFunctionFactory.produce(180)) {
    }
}
class DefaultGraphAnimationParameters implements IGraphAnimationParameters {
    constructor(public linkStrength: IManipulationFunction<number> = ConstantManipulationFunctionFactory.produce(-0.0001),
                public nodeCharge: IManipulationFunction<number> = ConstantManipulationFunctionFactory.produce(-33),
                public nodeCollision: IManipulationFunction<number> = ConstantManipulationFunctionFactory.produce(-5)) {
    }
}

class DefaultNodes implements INodeDisplayConfig {
    public labelX: IManipulationFunction<number>;

    constructor(public fillColor: string = '#fff',
                public labelDY: string = '-.95em',
                public collapsedFillColor: string = 'lightsteelblue',
                public strokeColor: string = 'steelblue',
                public strokeWidth: string = '3px',
                labelX?: IManipulationFunction<number>,
                public textAnchor: string = 'start',
                public labelFont: string = '8px sans-serif',
                public expandCollapse: SupportedHTMLEvents = SupportedHTMLEvents.Click,
                public showDetails: SupportedHTMLEvents = SupportedHTMLEvents.MouseOver,
                public hideDetails: SupportedHTMLEvents = SupportedHTMLEvents.MouseOut,
                public customNodesEvents: Array<ICustomEvent> = [],
                public customLabelsEvents: Array<ICustomEvent> = [],
                public nodeDetails: INodeDetails = new DefaultNodeDetails(),
                public customNodesAttributes: Array<ICustomManipulation> = [],
                public customNodesStyles: Array<ICustomManipulation> = [],
                public customLabelsAttributes: Array<ICustomManipulation> = [],
                public customLabelsStyles: Array<ICustomManipulation> = [],
                public shape: IShape = new Circle(8)) {

        this.labelX = labelX || function (dataMetaProcessor: IDataMetaProcessor, nodeData?: any): any {
                return nodeData.inodes.shape.getWidth();
            };

    }
}

class DefaultNodeDetails implements INodeDetails {
    public content: IManipulationFunction<any>;

    constructor(content?: IManipulationFunction<any>) {
        this.content = content || function (dataMetaProcessor: IDataMetaProcessor, d: any): any {
                return d.data.label;
            };
    }
}

class DefaultEdges implements IEdgeDisplayConfig {
    constructor(public color: string = '#ccc',
                public strokeWidth: string = '2px',
                public textAnchor: string = 'middle',
                public arrowSize: number = 4,
                public labelFont: string = '8px sans-serif',
                public drawEdgesDirection: boolean = true,
                public customEdgesEvents: Array<ICustomEvent> = [],
                public customLabelsEvents: Array<ICustomEvent> = [],
                public customEdgesAttributes: Array<ICustomManipulation> = [],
                public customEdgesStyles: Array<ICustomManipulation> = [],
                public customLabelsAttributes: Array<ICustomManipulation> = [],
                public customLabelsStyles: Array<ICustomManipulation> = [],
                public showDetails: SupportedHTMLEvents = SupportedHTMLEvents.MouseOver,
                public hideDetails: SupportedHTMLEvents = SupportedHTMLEvents.MouseOut,
                public edgeDetails: IEdgeDetails = new DefaultEdgeDetails()) {

    }
}

class DefaultEdgeDetails implements IEdgeDetails {
    public content: IManipulationFunction<any>;


    constructor(content?: IManipulationFunction<any>) {
        this.content = content || function (dataMetaProcessor: IDataMetaProcessor, d: any): any {
                return d.data.edgeLabel;
            };
    }
}

class DefaultEdgeSearchLookDetails implements ISearchLookDetails {

    constructor(public color: string = 'red',
                public opacity: string = '0.6',
                public size: number = 5) {
    }

}

class DefaultNodeSearchLookDetails implements ISearchLookDetails {

    constructor(public color: string = 'red',
                public opacity: string = '0.6',
                public size: number = 10) {
    }

}
