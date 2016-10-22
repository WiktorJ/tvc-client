/**
 * Created by wjurasz on 14.09.16.
 */

import {IManipulationFunction} from '../types/IManipulationFunction';
/**
 * All configurable parts of nodes details look, feel and behaviour cen be defined here.
 */
export interface INodeDetails {
    /**
     * Function that return content of details to be shown on screen.
     */
    content?: IManipulationFunction<any>;
}
