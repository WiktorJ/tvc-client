import {DOMAttributes} from '../namespaces/DOMAttributes';
import {DOMStyles} from '../namespaces/DOMStyles';
import {DOMElements} from '../namespaces/DOMElements';
import {DOMUtil} from '../utils/DOMUtil';
import {DOMValues} from '../namespaces/DOMValues';
import {SVGPathDescriptors} from '../namespaces/SVGPathDescriptors';
import {IRenderer} from './IRenderer';
import {PredefinedTypesService} from '../services/PredefinedTypesService';
import {IStyleManager} from '../../configurations/manager/IStyleManager';
import {IDataMetaProcessor} from '../../configurations/types/IDataMetaProcessor';
import {TopologySearchService} from '../services/TopologySearchService';
import {IEdgeModificationSearchStrategy} from '../utils/dom-modification-search-strategies/IEdgeModificationSearchStrategy';
import {PathModificationStrategy} from '../utils/dom-modification-search-strategies/PathModificationStrategy';

let d3Hierarchy = require('d3-hierarchy');
let stratify = d3Hierarchy.stratify;
let tree = d3Hierarchy.tree;
// import {stratify, tree} from 'd3-hierarchy';
/**
 * Created by wjurasz on 13.07.16.
 */

export class TreeRenderer implements IRenderer {
    public static IID: string = 'TreeRenderer';
    private edgesModificationSearchStrategy: IEdgeModificationSearchStrategy = new PathModificationStrategy();

    constructor(private predefinedTypesService: PredefinedTypesService) {
    }

    public render(svg: any,
                  initialData: any,
                  styleManager: IStyleManager,
                  showDetails: Function,
                  hideDetails: Function,
                  dataMetaProcessor: IDataMetaProcessor,
                  absUrl: string,
                  searchService: TopologySearchService,
                  mainNodeId: string): any {
        let i: number = 0;
        let nodesFadeValue: number = 1e-6;
        let nodesLabelOpacity: number = 1;
        let arrowBoxSize: number = styleManager.edgeDisplayConfig.arrowSize;
        let edgesModificationSearchStrategy: IEdgeModificationSearchStrategy = this.edgesModificationSearchStrategy;
        _.forEach(initialData, (val: any) => {
            val.id = val[styleManager.dataFieldsMapping.id];
            val.parentId = val[styleManager.dataFieldsMapping.parentId];
            val.label = val[styleManager.dataFieldsMapping.label] || '';
            val.edgeLabel = val[styleManager.dataFieldsMapping.edgeLabel] || '';
            val.data = val[styleManager.dataFieldsMapping.data];
        });

        if (!_.find(initialData, (val: any) => _.isUndefined(val.parentId) || _.isEmpty(val.parentId))) {
            if (!mainNodeId) {
                throw 'No root node found. You have to either provide dataset with exactly one node without parentId,' +
                'or specify mainNodeId in ITopologyQueryConfig in order to visualise tree structure.'
            }
            let rootNode: any = _.find(initialData, (val: any) => val.id === mainNodeId);
            if (!rootNode) {
                throw 'Node indicated as root (with id: ' + mainNodeId + ') Does not exist.'
            }
            rootNode.parentId = '';
        }

        let rootData: any = stratify()
            .id((d: any) => d.id)
            .parentId((d: any) => d.parentId)(initialData);


        tree().size([styleManager.sizes.relativeHeight, styleManager.sizes.relativeWidth])(rootData);

        rootData.x0 = styleManager.sizes.relativeHeight / 2;
        rootData.y0 = 0;

        if (styleManager.edgeDisplayConfig.drawEdgesDirection) {
            svg.append(DOMElements.DEFS);
        }

        let duration: number = styleManager.animationParameters.treeParameters.duration(dataMetaProcessor);
        this.predefinedTypesService.addINodeImplementation(rootData.descendants(), dataMetaProcessor);
        this.predefinedTypesService.addIEdgeImplementation(rootData.descendants().slice(1), dataMetaProcessor);

        update(rootData);

        function update(data: any): any {
            let nodes: any = rootData.descendants();
            let edges: any = rootData.descendants().slice(1);


            nodes.forEach((d: any) =>
                d.y = d.depth * styleManager.animationParameters.treeParameters.nodesDistance(dataMetaProcessor, d));

            let node: any = svg.selectAll(DOMValues.NODE)
                .data(nodes, (d: any) => d.__id || (d.__id = ++i));

            let nodeEnter: any = node.enter()
                .append(DOMElements.G)
                .attr(DOMAttributes.CLAZZ, DOMValues.NODE_CLASS)
                .attr(DOMAttributes.TRANSFORM, DOMUtil.translateFixed(data.y0, data.x0))
                .on(styleManager.nodeDisplayConfig.expandCollapse, expandCollapse)
                .on(styleManager.nodeDisplayConfig.showDetails,
                    (d: any) => showDetails(d.inodes.nodeDetails.content(dataMetaProcessor, d)))
                .on(styleManager.nodeDisplayConfig.hideDetails, hideDetails);

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
                .attrs((d: any) => DOMUtil.createCustomObject(d.inodes.customLabelsAttributes, d, dataMetaProcessor))
                .style(DOMStyles.FILL_OPACITY, nodesFadeValue)
                .style(DOMStyles.FONT, (d: any) => d.inodes.labelFont)
                .styles((d: any) => DOMUtil.createCustomObject(d.inodes.customLabelsStyles, d, dataMetaProcessor))
                .text((d: any) => d.data.label);

            DOMUtil.addCustomEvents(styleManager.nodeDisplayConfig.customNodesEvents, nodeEnter, dataMetaProcessor);
            DOMUtil.addCustomEvents(styleManager.nodeDisplayConfig.customLabelsEvents, nodeEnter, dataMetaProcessor);

            // transition nodes to their new position.
            transitNodes(node);
            transitNodes(nodeEnter);

            // transition exiting nodes to the parent's new position.
            let nodeExit: any = node.exit().transition()
                .duration(duration)
                .attr(DOMAttributes.TRANSFORM, DOMUtil.translateFixed(data.y, data.x))
                .remove();
            nodeExit.select('*')
                .attrs((d: any) => d.inodes.shape.getFadeAttributes());
            nodeExit.select(DOMElements.TEXT)
                .attr(DOMAttributes.X, (d: any) => d.inodes.labelX(dataMetaProcessor, d))
                .style(DOMStyles.FILL_OPACITY, nodesFadeValue);

            let edge: any = svg.selectAll(DOMValues.EDGE)
                .data(edges, (d: any) => d.__id);

            let edgeG: any = edge.enter()
                .insert(DOMElements.G, DOMElements.G);


            let edgeEnter: any = edgeG
                .append(DOMElements.PATH)
                .attr(DOMAttributes.CLAZZ, DOMValues.EDGE_CLASS)
                .attr(DOMAttributes.ID, (d: any) => d.__id)
                .attr(DOMAttributes.D, (d: any) => diagonalEdge({x: data.x0, y: data.y0}))
                .attr(DOMAttributes.MARKER_END, (d: any) => 'url(' + absUrl + '#' + DOMValues.END_MARKER + d.__id + ')')
                .attrs((d: any) => DOMUtil.createCustomObject(d.iedges.customEdgesAttributes, d, dataMetaProcessor))
                .style(DOMStyles.STROKE, (d: any) => d.iedges.color)
                .style(DOMStyles.STROKE_WIDTH,
                    (d: any) => d.iedges.strokeWidth)
                .styles((d: any) => DOMUtil.createCustomObject(d.iedges.customEdgesStyles, d, dataMetaProcessor))
                .on(styleManager.edgeDisplayConfig.showDetails,
                    (d: any) => showDetails(styleManager.edgeDisplayConfig.edgeDetails.content(dataMetaProcessor, d)))
                .on(styleManager.edgeDisplayConfig.hideDetails, hideDetails);

            searchService.edgesModificationSearchStrategy = edgesModificationSearchStrategy;
            searchService.d3EdgesGSelection = edgeG;
            searchService.d3EdgesPathSelection = edgeEnter;

            let edgeText: any = svg.selectAll(DOMValues.EDGE_TEXT)
                .data(edges, (d: any) => d.__id);

            edgeText.enter()
                .append(DOMElements.TEXT)
                .attr(DOMAttributes.CLAZZ, DOMValues.EDGE_TEXT_CLASS)
                .attr(DOMAttributes.TEXT_ANCHOR,
                    (d: any) => d.iedges.textAnchor)
                .attr(DOMAttributes.X,
                    (d: any) => styleManager.animationParameters.treeParameters.nodesDistance(dataMetaProcessor, d) / 2)
                .style(DOMStyles.FONT, (d: any) => d.iedges.labelFont)
                .attrs((d: any) => DOMUtil.createCustomObject(d.iedges.customLabelsAttributes, d, dataMetaProcessor))
                .styles((d: any) => DOMUtil.createCustomObject(d.iedges.customLabelsStyles, d, dataMetaProcessor))
                .append(DOMElements.TEXT_PATH)
                .attr(DOMAttributes.EDGE_LABEL_ID_ATTR, (d: any) => absUrl + '#' + d.__id)
                .text((d: any) => d.data.edgeLabel);

            DOMUtil.addCustomEvents(styleManager.edgeDisplayConfig.customEdgesEvents, edgeEnter, dataMetaProcessor);
            DOMUtil.addCustomEvents(styleManager.edgeDisplayConfig.customLabelsEvents, edgeText, dataMetaProcessor);


            transitEdges(edge);
            transitEdges(edgeEnter);
            transitEdges(edgeText);

            exitEdges(edge, data);
            exitEdges(edgeText, data);

            // TODO: arrowBoxSize should be changed to d.iedges.arrowSize
            if (styleManager.edgeDisplayConfig.drawEdgesDirection) {
                let markers: any = svg.select(DOMElements.DEFS).selectAll(DOMElements.MARKER)
                    .data(edges, (d: any) => d.__id);

                markers.enter().append(DOMElements.MARKER)
                    .attr(DOMAttributes.ID, (d: any) => DOMValues.END_MARKER + d.__id)
                    .attr(DOMAttributes.VIEW_BOX,
                        '0 ' + (-arrowBoxSize) + ' ' + (2 * arrowBoxSize) + ' ' + (2 * arrowBoxSize))
                    .attr(DOMAttributes.REF_X,
                        // horizontal distance from center
                        (d: any) => 2 * arrowBoxSize + d.inodes.shape.getWidth())
                    .attr(DOMAttributes.MARKER_WIDTH, arrowBoxSize)
                    .attr(DOMAttributes.MARKER_HEIGHT, arrowBoxSize)
                    .attr(DOMAttributes.ORIENT, DOMValues.AUTO)
                    .append(DOMElements.PATH)
                    .attr(DOMAttributes.D, SVGPathDescriptors.MOVE_TO + '0,'
                        + (-arrowBoxSize) + SVGPathDescriptors.LINE_TO + (2 * arrowBoxSize)
                        + ',0' + SVGPathDescriptors.LINE_TO + '0,' + arrowBoxSize);

                markers.transition()
                    .duration(duration);

                markers.exit().transition()
                    .duration(duration).remove();
            }

            nodes.forEach((d: any) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });

        }


        function expandCollapse(d: any): void {
            if (d.children) {
                d._children = d.children;
                d.children = undefined;
                update(d);
            } else {
                d.children = d._children;
                d._children = undefined;
                update(d);
            }
        }

        function diagonalEdgeExit(d: any): string {
            return SVGPathDescriptors.MOVE_TO + d.y + ',' + d.x
                + SVGPathDescriptors.CURVE_TO + d.y + ',' + d.x
                + ' ' + d.y + ',' + d.x
                + ' ' + d.y + ',' + d.x;
        }


        function diagonalEdge(d: any): string {
            let parent: any = d.parent ? d.parent : {x: d.x, y: d.y};
            return SVGPathDescriptors.MOVE_TO + parent.y + ',' + parent.x
                + SVGPathDescriptors.CURVE_TO + (d.y + parent.y) / 2 + ',' + parent.x
                + ' ' + (d.y + parent.y) / 2 + ',' + d.x
                + ' ' + d.y + ',' + d.x;
        }

        function transitNodes(nodes: any): void {
            let nodeUpdate: any = nodes.transition()
                .duration(duration)
                .attr(DOMAttributes.TRANSFORM, DOMUtil.translateDynamic('y', 'x'));

            nodeUpdate.select('*')
                .attrs((d: any) => d.inodes.shape.getAttributes())
                .attr(DOMAttributes.FILL,
                    (d: any) => d._children ? d.inodes.collapsedFillColor :
                        d.inodes.fillColor)
                .attrs((d: any) => DOMUtil.createCustomObject(d.inodes.customNodesAttributes, d, dataMetaProcessor))
                .styles((d: any) => DOMUtil.createCustomObject(d.inodes.customNodesStyles, d, dataMetaProcessor));

            nodeUpdate.select(DOMElements.TEXT)
                .attr(DOMAttributes.X, (d: any) => d.inodes.labelX(dataMetaProcessor, d))
                .style(DOMStyles.FILL_OPACITY, nodesLabelOpacity);
        }

        function transitEdges(edges: any): void {
            edges.transition()
                .duration(duration)
                .attr(DOMAttributes.D, diagonalEdge);
        }

        function exitEdges(edges: any, data: any): void {
            edges.exit().transition()
                .duration(duration)
                .attr(DOMAttributes.D, (d: any) => diagonalEdgeExit(data))
                .remove();
        }


    }


}
