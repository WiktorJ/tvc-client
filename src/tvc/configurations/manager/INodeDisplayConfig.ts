/**
 * Created by wjurasz on 14.09.16.
 */

import {ICustomManipulation} from '../types/ICustomManipulation';
import {ICustomEvent} from '../types/ICustomEvent';
import {SupportedHTMLEvents} from '../utils/SupportedHTMLEvents';
import {INodeDetails} from './INodeDetails';
import {IShape} from './shapes/IShape';
import {IManipulationFunction} from '../types/IManipulationFunction';
/**
 * All configurable parts of nodes look, feel and behaviour cen be defined here.
 * The most important are explicitly exposed as fields. User can add any attribute, style or event
 * through custom arrays. See Quick User Guide to usage examples.
 */
export interface INodeDisplayConfig {
    fillColor?: string;
    /**
     * Relevant only for trees.
     */
    collapsedFillColor?: string;
    /**
     * Color of node's stroke.
     */
    strokeColor?: string;
    /**
     * Width of node's stroke.
     * It can be specified in different units eg. '3px' or '10mm'
     */
    strokeWidth?: string;
    /**
     * Relative shift of Node label in Y axis.
     * It corresponds to HTML dy attribute.
     * It can be specified in different units eg. '3px' or '10mm'
     */
    labelDY?: string;

    /**
     * Absolute shift of Node label in X axis
     * It corresponds to HTML x attribute.
     */
    labelX?: IManipulationFunction<number>;

    /**
     * It corresponds to HTML text-anchor attribute. Will be applied to node label.
     * This attribute is used to align (start-, middle- or end-alignment) a string of text relative to a given point.
     * Available vales are: start | middle | end | inherit
     */
    textAnchor?: string;

    /**
     * size od typeof font to be used in node label
     */
    labelFont?:string;

    /**
     * Specify event on which expand/collapse of tree branch should occur.
     * Relevant only for tree.
     */
    expandCollapse?: SupportedHTMLEvents; // tree only
    /**
     * Specify event on which details should be shown.
     */
    showDetails?: SupportedHTMLEvents;
    /**
     * Specify event on which details should be hide.
     */
    hideDetails?: SupportedHTMLEvents;

    /**
     * Any DOM attribute for nodes can be defined here.
     */
    customNodesAttributes?: Array<ICustomManipulation>;
    /**
     * Any DOM style for nodes can be defined here.
     */
    customNodesStyles?: Array<ICustomManipulation>;
    /**
     * Any DOM attribute for labels can be defined here.
     */
    customLabelsAttributes?: Array<ICustomManipulation>;
    /**
     * Any DOM style for labels can be defined here.
     */
    customLabelsStyles?: Array<ICustomManipulation>;

    /**
     * Any events for nodes can be defined here.
     */
    customNodesEvents?: Array<ICustomEvent>;
    /**
     * Any events for labels can be defined here.
     */
    customLabelsEvents?: Array<ICustomEvent>;

    /**
     * Configuration of node details.
     */
    nodeDetails?: INodeDetails;

    /**
     * Shape of the node. Can use one of implemented of create own by implementing IShape interface.
     */
    shape?: IShape;
}
