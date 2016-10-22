import {DOMElements} from '../namespaces/DOMElements';
import {DOMAttributes} from '../namespaces/DOMAttributes';
import {DOMUtil} from '../utils/DOMUtil';
import {IRenderer} from '../renderers/IRenderer';

require('d3-transition');
require('d3-selection-multi');
let d3Selection = require('d3-selection');
let select = d3Selection.select;
// import {select, selectAll, event} from 'd3-selection';

let d3Zoom = require('d3-zoom');
let zoom = d3Zoom.zoom;
let zoomIdentity = d3Zoom.zoomIdentity;
// import {zoom, zoomIdentity} from 'd3-zoom';

import {D3Events} from '../namespaces/D3Events';
import {DOMValues} from '../namespaces/DOMValues';
import {DOMStyles} from '../namespaces/DOMStyles';
import {IDataMetaProcessor} from '../../configurations/types/IDataMetaProcessor';
import {IStyleManager} from '../../configurations/manager/IStyleManager';
import {IMargins} from '../../configurations/manager/IMargins';
import {IPredefinedType} from '../../configurations/manager/IPredefinedType';
import {IConfiguration} from '../../configurations/IConfiguration';
import {INodeDisplayConfig} from '../../configurations/manager/INodeDisplayConfig';
import {TopologySearchService} from '../services/TopologySearchService';
/**
 * Created by wjurasz on 17.08.16.
 */
export class TopologyRenderingDirective implements ng.IDirective {
    public static IID: string = 'acwTopologyRendering';

    constructor(private $timeout: ng.ITimeoutService,
                private $compile: ng.ICompileService,
                private $location: ng.ILocationService,
                private $sce: ng.ISCEService,
                private searchService: TopologySearchService) {
    }

    public static factory(): ng.IDirectiveFactory {
        let directive: angular.IDirectiveFactory =
            ($timeout: ng.ITimeoutService,
             $compile: ng.ICompileService,
             $location: ng.ILocationService,
             $sce: ng.ISCEService,
             searchService: TopologySearchService): angular.IDirective =>
                new TopologyRenderingDirective($timeout,
                    $compile,
                    $location,
                    $sce,
                    searchService);
        directive.$inject = ['$timeout', '$compile', '$location', '$sce', TopologySearchService.IID];
        return directive;
    }

    public template: string = `
<button class="resetButton">Reset zoom</button>
<div class="rendered-content" ng-if="data">
    <fieldset class="graph-border">
        <svg class="graph" id="graph">
            <g></g>
        </svg>
    </fieldset>
    <div class="details-column">
        <fieldset class="graph-legend"> 
            <legend class="legend">Legend</legend>
            <svg></svg>
        </fieldset>
        <div id="nodeDetails" class="nodeDetails nodeDetails-info" ng-show="showDetails">
        {{details}}
        </div>
    </div>
</div>
<div class="no-data" ng-if="!data">Choose signal to see visualisation</div>
`
        ;
    public scope: any = {
        data: '<',
        styleManager: '<',
        renderer: '<',
        mainNodeId: '<'
    };

    public link(scope: ng.IScope & {renderer: IRenderer,
        styleManager: IStyleManager,
        mainNodeId: string,
        details: any,
        hideDetailsButton: Function,
        showDetails: boolean},
                elem: ng.IAugmentedJQuery,
                attrs: ng.IAttributes): any {
        scope.hideDetailsButton = hideDetailsButton;
        let renderer: IRenderer = scope.renderer;
        scope.$watch('data', function (newValue: any, oldValue: any): any {
            if (newValue) {
                draw(newValue);
            }
        }, true);

        let location: ng.ILocationService = this.$location;
        let compile: ng.ICompileService = this.$compile;
        let ss: TopologySearchService = this.searchService;


        function draw(data: any): void {
            if (data.length > 0) {
                let styleManager: IStyleManager = scope.styleManager;
                let margin: IMargins = styleManager.sizes.margins;
                // TODO: Getting elements from template must be improved!
                let graphG: any = elem.find(DOMElements.G)[0];
                let legendSVG: any = elem.find(DOMElements.SVG)[1];
                let resetZoomDuration: number = 750;
                let zoomScale: Array<number> = [0.1, 40];
                let rootSvg: any = select(elem.find(DOMElements.SVG)[0])
                    .attr(DOMAttributes.WIDTH, '100%')
                    .attr(DOMAttributes.HEIGHT, styleManager.sizes.height);

                select(graphG).selectAll('*').remove();
                select(legendSVG).selectAll('*').remove();
                let svg: any = select(graphG)
                    .attr(DOMAttributes.TRANSFORM, DOMUtil.translateFixed(margin.left, margin.top));
                if (styleManager.animationParameters.zoom) {
                    let zoomObject: any = zoom()
                        .scaleExtent(zoomScale)
                        .on(D3Events.ZOOM, zoomed);

                    select(DOMValues.RESET_CLASS)
                        .on(D3Events.CLICK, resetted);

                    rootSvg.call(zoomObject);

                    function zoomed(): void {
                        svg.attr(DOMAttributes.TRANSFORM, d3Selection.event.transform);
                    }

                    function resetted(): void {
                        rootSvg.transition()
                            .duration(resetZoomDuration)
                            .call(zoomObject.transform, zoomIdentity.translate(styleManager.sizes.margins.left,
                                styleManager.sizes.margins.top));
                    }

                }
                // TODO: this should be passed from controller
                let metaData: any = {};
                let dataMetaProcessor: IDataMetaProcessor = styleManager.processData(data, metaData);

                if (styleManager.legend.generateLegend) {
                    let predefinedNodeTypes: Array<IPredefinedType<INodeDisplayConfig>> = [];
                    styleManager.predefinedNodeTypes.forEach((entry: IPredefinedType<INodeDisplayConfig>, key: string): any => {
                        entry.name = key;
                        predefinedNodeTypes.push(entry);
                    });
                    predefinedNodeTypes.push({
                        element: styleManager.nodeDisplayConfig,
                        condition: () => true,
                        description: styleManager.legend.defaultNodeDescription
                    });
                    let prevNodeEndingPosition: number = 0;
                    let maxWidth: number = 0;
                    predefinedNodeTypes.forEach((entry: any): void => {
                        let nodeWidth: number = +entry.element.strokeWidth.match(/\d*/)[0]
                            + entry.element.shape.getWidth();
                        maxWidth = maxWidth < nodeWidth ? nodeWidth : maxWidth;
                        entry.legendX = 0;
                        entry.legendY = prevNodeEndingPosition + nodeWidth;
                        prevNodeEndingPosition += (2 * nodeWidth);
                    });

                    let legendG: any = select(legendSVG)
                        .attr(DOMAttributes.WIDTH, styleManager.legend.width)
                        .attr(DOMAttributes.HEIGHT, prevNodeEndingPosition)
                        .append(DOMElements.G)
                        .attr(DOMAttributes.TRANSFORM, DOMUtil.translateFixed(50, 0))
                        .selectAll(DOMElements.G)
                        .data(predefinedNodeTypes)
                        .enter()
                        .append(DOMElements.G)
                        .attr(DOMAttributes.TRANSFORM, DOMUtil.translateDynamic('legendX', 'legendY'));

                    legendG.append(function (d: any) {
                        var document = this.ownerDocument,
                            uri = this.namespaceURI,
                            xhtml = 'http://www.w3.org/1999/xhtml';
                        return uri === xhtml && document.documentElement.namespaceURI === xhtml
                            ? document.createElement(d.element.shape.name)
                            : document.createElementNS(uri, d.element.shape.name);
                    })
                        .attrs((d: any) => d.element.shape.getAttributes())
                        .attr(DOMAttributes.FILL, (d: any) => d.element.fillColor)
                        .attr(DOMStyles.STROKE, (d: any) => d.element.strokeColor)
                        .attr(DOMStyles.STROKE_WIDTH,
                            (d: any) => d.element.strokeWidth)
                        .attrs((d: any) =>
                            DOMUtil.createCustomObject(d.element.customNodesAttributes, d, dataMetaProcessor))
                        .styles((d: any) => DOMUtil.createCustomObject(d.element.customNodesStyles, d, dataMetaProcessor));

                    legendG.append(DOMElements.TEXT)
                        .attr(DOMAttributes.X, (d: any) => 2 * maxWidth)
                        .attrs((d: any) =>
                            DOMUtil.createCustomObject(d.element.customLabelsAttributes, d, dataMetaProcessor))
                        .styles((d: any) => DOMUtil.createCustomObject(d.element.customLabelsStyles, d, dataMetaProcessor))
                        .text((d: any) => {
                            let name: string = d.name ? d.name + ': ' : '';
                            return name + d.description;
                        });

                }

                renderer.render(svg,
                    data,
                    styleManager,
                    showDetails,
                    hideDetails,
                    dataMetaProcessor,
                    location.absUrl(),
                    ss,
                    scope.mainNodeId);
            } else {
                // TODO: pop-up
                console.log('No data provided');
            }
        }

        function showDetails(details: any): void {
            scope.$apply(function (): void {
                var pageElement = angular.element(document.getElementById("nodeDetails"));
                pageElement.empty();
                try {
                    pageElement.append(compile(details)(scope));
                } catch (e) {
                    pageElement.append(details.toString());
                }
                pageElement
                    .append(compile(`
                <button class="close-button" ng-click="hideDetailsButton()">
                    <i class="fa fa-times"></i>
                    Close
                </button>`)(scope));
                scope.showDetails = true;
            });
        }

        function hideDetails(): void {
            scope.$apply(function (): void {
                scope.showDetails = false;
            });
        }

        function hideDetailsButton(): void {
            scope.showDetails = false;
        }


    }
}
