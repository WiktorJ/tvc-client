/**
 * Created by wjurasz on 14.09.16.
 */
import {IManipulationFunction} from '../types/IManipulationFunction';
/**
 * Type of Node or Edge to be used in visualisation.
 * Basic concept is to provide INode or IEdge implementation (@element) and if condition function
 * returns true particular node or edge it will we rendered according to @element.
 * Missing fields in @element will be taken from main implementation.
 */
export interface IPredefinedType<T> {
    /**
     * INode or IEdge implementation
     */
    element: T;
    /**
     * Condition which have to be fullfiled in order to use @element impl.
     */
    condition: IManipulationFunction<boolean>;
    /**
     * Description for legend.
     */
    description: string;
    /**
     * Name for legend, this field will be filled automatically.
     */
    // TODO: this shouldn't be exposed to client.
    name?: string;
}

