/**
 * Created by wjurasz on 14.09.16.
 */
import {IMargins} from './IMargins';

/**
 * Configurable parts of size of visualisation window.
 */
export interface IVisualisationWindowSizes {
    /**
     * Margins of visualisation
     */
    margins?: IMargins;
    /**
     * By default this calculated based on height and margin and should not be specified by user.
     */
    relativeHeight?: number;

    height?: number;
    /**
     * By default this calculated based on width and margin and should not be specified by user.
     */
    relativeWidth?: number;

    /**
     * Its only used for setting tree width. Visualisation canvas with is automatically adjusted to fill all the space it can.
     */
    width?: number;
}