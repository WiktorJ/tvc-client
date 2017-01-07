import {IManipulationFunction} from '../types/IManipulationFunction';
/**
 * Created by wjurasz on 14.09.16.
 */

/**
 * Configurable parts of tree visualisation animations.
 */
export interface ITreeAnimationParameters {
    /**
     * Duration of expand/collapse animation.
     */
    duration?: IManipulationFunction<number>;
    /**
     * Distance between nodes.
     */
    nodesDistance?: IManipulationFunction<number>;
}