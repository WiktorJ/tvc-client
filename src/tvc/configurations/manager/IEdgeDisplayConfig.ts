/**
 * Created by wjurasz on 14.09.16.
 */

import {ICustomManipulation} from '../types/ICustomManipulation';
import {ICustomEvent} from '../types/ICustomEvent';
import {SupportedHTMLEvents} from '../utils/SupportedHTMLEvents';
import {IEdgeDetails} from './IEdgeDetails';
/**
 * All configurable parts of edges look, feel and behaviour cen be defined here.
 * The most important are explicitly exposed as fields. User can add any attribute, style or event
 * through custom arrays. See Quick User Guide to usage examples.
 */
export interface IEdgeDisplayConfig {
    /**
     * Color of edge.
     */
    color?: string;
    /**
     * Thickness of edge.
     */
    strokeWidth?: string;
    /**
     * It corresponds to HTML text-anchor attribute. Will be applied to edge label.
     * This attribute is used to align (start-, middle- or end-alignment) a string of text relative to a given point.
     * Available vales are: start | middle | end | inherit
     */
    textAnchor?: string;

    /**
     * size od typeof font to be used in edge label
     */
    labelFont?:string;

    /**
     * Any DOM attribute for edges can be defined here.
     */
    customEdgesAttributes?: Array<ICustomManipulation>;
    /**
     * Any DOM style for edges can be defined here.
     */
    customEdgesStyles?: Array<ICustomManipulation>;
    /**
     * Any DOM attribute for labels can be defined here.
     */
    customLabelsAttributes?: Array<ICustomManipulation>;
    /**
     * Any DOM style for labels can be defined here.
     */
    customLabelsStyles?: Array<ICustomManipulation>;

    /**
     * If true than edges will have direction drown.
     */
    drawEdgesDirection?: boolean;
    /**
     * Any events for edges can be defined here.
     */
    customEdgesEvents?: Array<ICustomEvent>;
    /**
     * Any events for labels can be defined here.
     */
    customLabelsEvents?: Array<ICustomEvent>;
    /**
     * Specify event on which details should be shown.
     */
    showDetails?: SupportedHTMLEvents;
    /**
     * Specify event on which details should be hide.
     */
    hideDetails?: SupportedHTMLEvents;
    /**
     * Configuration of edges details.
     */
    edgeDetails?: IEdgeDetails;
    /**
     * Relevant only if @directed is set to true.
     */
    arrowSize?:number;
}
