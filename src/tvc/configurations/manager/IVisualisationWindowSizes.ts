/**
 * Created by wjurasz on 14.09.16.
 */
import {IMargins} from './IMargins';
export interface IVisualisationWindowSizes {
    /**
     * Margins of visualisation, so the
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

    width?: number;
}