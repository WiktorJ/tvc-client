import {IManipulationFunction} from '../types/IManipulationFunction';
/**
 * All configurable parts of edges details look, feel and behaviour cen be defined here.
 */
export interface IEdgeDetails {
    /**
     * Function that return content of details to be shown on screen.
     */
    content?: IManipulationFunction<any>;
}
