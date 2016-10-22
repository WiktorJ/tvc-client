/**
 * Created by wjurasz on 14.09.16.
 */
import {IDataMetaProcessor} from '../types/IDataMetaProcessor';
/**
 * Helper class.
 * If some parameter should be constant regardless of data @produce method can be used.
 */
export class ConstantManipulationFunctionFactory {
    public static produce(constant: any): any {
        return function (dataMetaProcessor: IDataMetaProcessor, data: any): any {
            return constant;
        };
    }
}