/**
 * Created by wjurasz on 14.09.16.
 */
import {ITreeAnimationParameters} from './ITreeAnimationParameters';
import {IGraphAnimationParameters} from './IGraphAnimationParameters';
/**
 * Parameters to change overall structure of visualisation.
 * These are separate for tree and graph.
 */
export interface IAnimationParameters {
    zoom?: boolean;
    treeParameters?: ITreeAnimationParameters;
    graphParameters?: IGraphAnimationParameters;
}