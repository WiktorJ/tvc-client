import {IManipulationFunction} from '../types/IManipulationFunction';
/**
 * Created by wjurasz on 14.09.16.
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