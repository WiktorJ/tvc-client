import {IRenderer} from './IRenderer';
import {DOMAttributes} from '../namespaces/DOMAttributes';
import {DOMValues} from '../namespaces/DOMValues';
import {DOMElements} from '../namespaces/DOMElements';
import {DOMStyles} from '../namespaces/DOMStyles';
import {D3Forces} from '../namespaces/D3Forces';
import {DOMUtil} from '../utils/DOMUtil';
import {SVGPathDescriptors} from '../namespaces/SVGPathDescriptors';
import {D3Events} from '../namespaces/D3Events';
import {PredefinedTypesService} from '../services/PredefinedTypesService';
import {IDataMetaProcessor} from '../../configurations/types/IDataMetaProcessor';
import {IStyleManager} from '../../configurations/manager/IStyleManager';
import {TopologySearchService} from '../services/TopologySearchService';
import {IEdgeModificationSearchStrategy} from '../utils/dom-modification-search-strategies/IEdgeModificationSearchStrategy';
import {LineModificationStrategy} from '../utils/dom-modification-search-strategies/LineModificationStrategy';

let d3Force = require('d3-force');
let forceSimulation = d3Force.forceSimulation;
let forceLink = d3Force.forceLink;
let forceManyBody = d3Force.forceManyBody;
let forceCollide = d3Force.forceCollide;
let forceCenter = d3Force.forceCenter;
// import {forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter} from 'd3-force';

let drag = require('d3-drag').drag;
// import {drag} from 'd3-drag';

let d3Selection = require('d3-selection');
// import {event} from 'd3-selection';
/**
 * Created by wjurasz on 16.08.16.
 */
export class GraphRenderer implements IRenderer {
    public static IID: string = 'GraphRenderer';
    private edgesModificationSearchStrategy: IEdgeModificationSearchStrategy = new LineModificationStrategy();

    constructor(private predefinedTypesService: PredefinedTypesService) {
    }

    public render(svg: any,
                  initialData: Array<any>,
                  styleManager: IStyleManager,
                  showDetails: Function,
                  hideDetails: Function,
                  dataMetaProcessor: IDataMetaProcessor,
                  absUrl: string,
                  searchService: TopologySearchService): void {
        let i: number = 0;
        let arrowBoxSize: number = styleManager.edgeDisplayConfig.arrowSize;
        let graph: any = prepareData(angular.copy(initialData));
        let edgesModificationSearchStrategy: IEdgeModificationSearchStrategy = this.edgesModificationSearchStrategy;
        this.predefinedTypesService.addINodeImplementation(graph.nodes, dataMetaProcessor);
        this.predefinedTypesService.addIEdgeImplementation(graph.links, dataMetaProcessor);
        _.forEach(graph.links, (element: any): void => {
            let node: any = _.head(_.filter(graph.nodes, (node: any): any => element.target === node.id));
            element.nodeSize = node.inodes.shape.getWidth();
        });

        let simulation: any = forceSimulation()
            .force(D3Forces.LINK, forceLink().id((d: any): any => {
                return d.id;
            }).strength(styleManager.animationParameters.graphParameters.linkStrength))
            .force(D3Forces.CHARGE,
                forceManyBody().strength(styleManager.animationParameters.graphParameters.nodeCharge))
            .force(D3Forces.COLLISION, forceCollide(styleManager.animationParameters.graphParameters.nodeCollision))
            .force(D3Forces.CENTER, forceCenter(styleManager.sizes.width / 2, styleManager.sizes.height / 2));


        if (styleManager.edgeDisplayConfig.drawEdgesDirection) {
            svg.append(DOMElements.DEFS);
        }

        let edgesData: any = svg.selectAll(DOMValues.EDGE)
            .data(graph.links,  (d: any) => d.__id || (d.__id = ++i))
            .enter()
            .append(DOMElements.G)
            .on(styleManager.edgeDisplayConfig.showDetails,
                (d: any) => showDetails(d.iedges.edgeDetails.content(dataMetaProcessor, d)))
            .on(styleManager.edgeDisplayConfig.hideDetails, hideDetails);

        let edges: any = edgesData
            .append(DOMElements.LINE)
            .attr(DOMAttributes.ID, (d: any) => d.__id)
            .attr(DOMAttributes.CLAZZ, DOMValues.EDGE_CLASS)
            .attr(DOMAttributes.MARKER_END, (d: any) => {
                return 'url(' + absUrl + '#' + DOMValues.END_MARKER + d.source + ')'
            })
            .attrs((d: any) => DOMUtil.createCustomObject(d.iedges.customEdgesAttributes, d, dataMetaProcessor))
            .style(DOMStyles.STROKE, (d: any) => d.iedges.color)
            .style(DOMStyles.STROKE_WIDTH, (d: any) => d.iedges.strokeWidth)
            .styles((d: any) => DOMUtil.createCustomObject(d.iedges.customEdgesStyles, d, dataMetaProcessor));

        let edgeText: any = edgesData
            .append(DOMElements.TEXT)
            .attr(DOMAttributes.CLAZZ, DOMValues.EDGE_TEXT_CLASS)
            .attr(DOMAttributes.TEXT_ANCHOR,
                (d: any) => d.iedges.textAnchor)
            .style(DOMStyles.FONT, (d: any) => d.iedges.labelFont)
            .attrs((d: any) => DOMUtil.createCustomObject(d.iedges.customLabelsAttributes, d, dataMetaProcessor))
            .text((d: any) => d.data.edgeLabel)
            .styles((d: any) => DOMUtil.createCustomObject(d.iedges.customLabelsStyles, d, dataMetaProcessor));

        searchService.edgesModificationSearchStrategy = edgesModificationSearchStrategy;
        searchService.d3EdgesGSelection = edgesData;
        searchService.d3EdgesPathSelection = edges;

        DOMUtil.addCustomEvents(styleManager.edgeDisplayConfig.customEdgesEvents, edges, dataMetaProcessor);
        DOMUtil.addCustomEvents(styleManager.edgeDisplayConfig.customLabelsEvents, edges, dataMetaProcessor);

        let nodesData: any = svg.selectAll(DOMValues.NODE)
            .data(graph.nodes);

        let nodeEnter: any = nodesData.enter()
            .append(DOMElements.G)
            .attr(DOMAttributes.CLAZZ, DOMValues.NODE_CLASS)
            .on(styleManager.nodeDisplayConfig.showDetails,
                (d: any) => showDetails(d.inodes.nodeDetails.content(dataMetaProcessor, d)))
            .on(styleManager.nodeDisplayConfig.hideDetails, hideDetails)
            .call(drag()
                .on(D3Events.START, dragStarted)
                .on(D3Events.DRAG, dragged)
                .on(D3Events.END, dragEnded));

        searchService.d3NodesSelection = nodeEnter;

        nodeEnter.append(function (d: any) {
            var document = this.ownerDocument,
                uri = this.namespaceURI,
                xhtml = 'http://www.w3.org/1999/xhtml';
            return uri === xhtml && document.documentElement.namespaceURI === xhtml
                ? document.createElement(d.inodes.shape.name)
                : document.createElementNS(uri, d.inodes.shape.name);
        })
            .attrs((d: any) => d.inodes.shape.getAttributes())
            .attr(DOMAttributes.FILL, (d: any) => d.inodes.fillColor)
            .attr(DOMStyles.STROKE, (d: any) => d.inodes.strokeColor)
            .attr(DOMStyles.STROKE_WIDTH,
                (d: any) => d.inodes.strokeWidth)
            .attrs((d: any) => DOMUtil.createCustomObject(d.inodes.customNodesAttributes, d, dataMetaProcessor))
            .styles((d: any) => DOMUtil.createCustomObject(d.inodes.customNodesStyles, d, dataMetaProcessor));

        nodeEnter.append(DOMElements.TEXT)
            .attr(DOMAttributes.X, (d: any) => d.inodes.labelX(dataMetaProcessor, d))
            .attr(DOMAttributes.DY, (d: any) => d.inodes.labelDY)
            .attr(DOMAttributes.TEXT_ANCHOR, (d: any) => d.inodes.textAnchor)
            .style(DOMStyles.FONT, (d: any) => d.inodes.labelFont)
            .attrs((d: any) => DOMUtil.createCustomObject(d.inodes.customLabelsAttributes, d, dataMetaProcessor))
            .styles((d: any) => DOMUtil.createCustomObject(d.inodes.customLabelsStyles, d, dataMetaProcessor))
            .text((d: any) => d.data.label);

        DOMUtil.addCustomEvents(styleManager.nodeDisplayConfig.customNodesEvents, nodeEnter, dataMetaProcessor);
        DOMUtil.addCustomEvents(styleManager.nodeDisplayConfig.customLabelsEvents, nodeEnter, dataMetaProcessor);

        if (styleManager.edgeDisplayConfig.drawEdgesDirection) {
            let markers: any = svg.select(DOMElements.DEFS).selectAll(DOMElements.MARKER)
                .data(graph.links);

            markers.enter().append(DOMElements.MARKER)
                .attr(DOMAttributes.ID, (d: any) => {
                    return DOMValues.END_MARKER + d.source;
                })
                .attr(DOMAttributes.VIEW_BOX,
                    '0' + (-arrowBoxSize) + ' ' + (2 * arrowBoxSize) + ' ' + (2 * arrowBoxSize))
                .attr(DOMAttributes.REF_X,
                    // horizontal distance from center
                    (d: any) => 2 * arrowBoxSize + d.nodeSize)
                .attr(DOMAttributes.MARKER_WIDTH, arrowBoxSize)
                .attr(DOMAttributes.MARKER_HEIGHT, arrowBoxSize)
                .attr(DOMAttributes.ORIENT, DOMValues.AUTO)
                .append(DOMElements.PATH)
                .attr(DOMAttributes.D, SVGPathDescriptors.MOVE_TO + '0,'
                    + (-arrowBoxSize) + SVGPathDescriptors.LINE_TO + (2 * arrowBoxSize)
                    + ',0' + SVGPathDescriptors.LINE_TO + '0,' + arrowBoxSize);

        }

        simulation
            .nodes(graph.nodes)
            .on(D3Events.TICK, ticked);

        simulation.force(D3Forces.LINK)
            .links(graph.links);

        function ticked(): void {
            edges
                .attr('x1', (d: any): any => {
                    return d.source.x;
                })
                .attr('y1', (d: any): any => {
                    return d.source.y;
                })
                .attr('x2', (d: any): any => {
                    return d.target.x;
                })
                .attr('y2', (d: any): any => {
                    return d.target.y;
                });

            nodeEnter
                .attr(DOMAttributes.TRANSFORM, DOMUtil.translateDynamic('x', 'y'));

            edgeText
                .attr('x', (d: any): any => {
                    return (d.source.x + (d.target.x - d.source.x) * 0.5);
                })
                .attr('y', (d: any): any => {
                    return (d.source.y + (d.target.y - d.source.y) * 0.5);
                });
        }

        function prepareData(data: Array<any>): any {
            let nodes: Array<any> = [];
            _.forEach(data, (node: any): any => {
                node.source = node._source[styleManager.dataFieldsMapping.id];
                node.target = node._target[styleManager.dataFieldsMapping.id];
                node.data = node.edge;
                node.data.edgeLabel = node.edge[styleManager.dataFieldsMapping.edgeLabel] || '';
                if (!_.find(nodes, (obj: any): any => obj.id === node._source.id)) {
                    node._source.id = node._source[styleManager.dataFieldsMapping.id];
                    node._source.label = node._source[styleManager.dataFieldsMapping.label] || '';
                    node._source.data = node._source[styleManager.dataFieldsMapping.data];
                    nodes.push(node._source);
                }

                if (!_.find(nodes, (obj: any): any => obj.id === node._target.id)) {
                    node._target.id = node._target[styleManager.dataFieldsMapping.id];
                    node._target.label = node._target[styleManager.dataFieldsMapping.label] || '';
                    node._target.data = node._target[styleManager.dataFieldsMapping.data];
                    nodes.push(node._target);
                }
            });
            return {
                nodes: _.sortBy(_.map(nodes, (n: any): any => {
                    return {id: n.id, data: n};
                }), (node: any) => node.id),
                links: data
            };
        }


        function dragStarted(d: any): void {
            if (!d3Selection.event.active) {
                simulation.force(D3Forces.CHARGE, undefined).alphaTarget(0.01).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d: any): void {
            d.fx = d3Selection.event.x;
            d.fy = d3Selection.event.y;
        }

        function dragEnded(d: any): void {
            if (!d3Selection.event.active) {
                simulation.alphaTarget(0);
            }
            d.fx = undefined;
            d.fy = undefined;
        }

    }

}
