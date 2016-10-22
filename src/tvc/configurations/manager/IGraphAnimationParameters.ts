/**
 * Created by wjurasz on 14.09.16.
 */

import {IManipulationFunction} from '../types/IManipulationFunction';
/**
 * These parameters can be used to change forces in graph.
 * It's not an easy task to adjust them correctly.
 * Trials and errors is the best approach probably.
 * Negative values - repulsion, Positive values - attraction.
 */
export interface IGraphAnimationParameters {
    /**
     * Forces between two connected nodes.
     */
    linkStrength?: IManipulationFunction<number>;
    /**
     * Overall nodes charge.
     */
    nodeCharge?: IManipulationFunction<number>;
    /**
     * Forces between overlapping nodes
     */
    nodeCollision?: IManipulationFunction<number>;
}