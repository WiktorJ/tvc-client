import {IManipulationFunction} from './IManipulationFunction';
/**
 * Created by wjurasz on 14.09.16.
 */

export interface ICustomManipulation {
    /**
     * Value of attribute, style or event.
     */
    manipulationFunction: any;
    /**
     * Name of the attribute or style.
     */
    name: string;
}