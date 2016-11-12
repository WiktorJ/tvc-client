import {IEdgeModificationSearchStrategy} from '../utils/dom-modification-search-strategies/IEdgeModificationSearchStrategy';
import {DOMElements} from '../namespaces/DOMElements';
import {DOMAttributes} from '../namespaces/DOMAttributes';
import {DOMStyles} from '../namespaces/DOMStyles';
import {ISearchLookDetails} from '../../configurations/manager/ISearchLookDetails';
let _ = require('lodash');

/**
 *
 * Created by wjurasz on 26.09.16.
 * IMPORTANT NOTE.
 * Searching algorithm is very inefficient.
 * Performance tests on big data batches are necessary.
 */
export class TopologySearchService {
    public static IID:string = 'TopologySearchService';
    public static $inject:Array<string> = [];
    private _d3NodesSelection:any;
    private _d3EdgesGSelection:any;
    private _d3EdgesPathSelection:any;
    private _edgesModificationSearchStrategy:IEdgeModificationSearchStrategy;
    private _nodeSearchLookDetails:ISearchLookDetails;
    private _edgeSearchLookDetails:ISearchLookDetails;

    private nodeIdsToRemove:string[] = [];
    private edgeIdsToRemove:string[] = [];

    public performSearch(selector:string):void {
        this.nodeSearch(selector)
    }

    public resetSearch():void {
        _.forEach(this.nodeIdsToRemove, (id:string):void => {
            this._d3NodesSelection.select(id).remove();
        });
        this.nodeIdsToRemove = [];
        _.forEach(this.edgeIdsToRemove, (id:string):void => {
            this._d3EdgesGSelection.select(id).remove();
        });
        this.edgeIdsToRemove = [];
    }

    private nodeSearch(selector:string):void {
        this.resetSearch();
        if (selector != null && selector != "") {

            this._d3NodesSelection.append(DOMElements.CIRCLE).filter((d:any):boolean => {
                    return d.data.label.toString().match(new RegExp(selector, 'i'))
                })
                .attr(DOMAttributes.ID, (d:any, i:number):string => {
                    let id:string = '__sid' + i;
                    this.nodeIdsToRemove.push('#' + id);
                    return id;
                })
                .attr(DOMAttributes.R, (d:any) => d.inodes.shape.getWidth() + this._nodeSearchLookDetails.size)
                .attr(DOMAttributes.FILL_OPACITY, this._nodeSearchLookDetails.opacity)
                .attr(DOMAttributes.FILL, this._nodeSearchLookDetails.color);


            let pathCloningEntities:any = {};

            _.forEach(this._d3EdgesPathSelection.nodes(),
                (elem:any):void => {
                    pathCloningEntities[elem.attributes.id.nodeValue] =
                        this._edgesModificationSearchStrategy.attributesToCopy(elem)
                });
            let searchResults:any = this._d3EdgesGSelection.filter((d:any):boolean =>
                    d.data.edgeLabel.toString().match(new RegExp(selector, 'i')))
                .insert(this._edgesModificationSearchStrategy.getElementToInsert(), ':first-child')
                .attr(DOMAttributes.ID, (d:any, i:number):string => {
                    let id:string = '__sid' + i;
                    this.edgeIdsToRemove.push('#' + id);
                    return id;
                })
                .style(DOMStyles.STROKE_WIDTH, (d:any) => +d.iedges.strokeWidth.match(/\d*/)[0] + this._edgeSearchLookDetails.size + 'px')
                .style(DOMStyles.STROKE_OPACITY, this._edgeSearchLookDetails.opacity)
                .style(DOMStyles.STROKE, this._edgeSearchLookDetails.color);
            this._edgesModificationSearchStrategy.attributesToAdd(searchResults, pathCloningEntities);
        }
    }

    set nodeSearchLookDetails(value:ISearchLookDetails) {
        this._nodeSearchLookDetails = value;
    }

    set edgeSearchLookDetails(value:ISearchLookDetails) {
        this._edgeSearchLookDetails = value;
    }

    set edgesModificationSearchStrategy(value:IEdgeModificationSearchStrategy) {
        this._edgesModificationSearchStrategy = value;
    }

    set d3EdgesPathSelection(value:any) {
        this._d3EdgesPathSelection = value;
    }

    set d3EdgesGSelection(value:any) {
        this._d3EdgesGSelection = value;
    }

    set d3NodesSelection(value:any) {
        this._d3NodesSelection = value;
    }

}
