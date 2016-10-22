/**
 * Created by wjurasz on 14.09.16.
 */
/**
 * Data passed to every @IManipulationFunction.
 * It is prepared by @processData function in @IStyleManager implementation.
 */
export interface IDataMetaProcessor {
    graphData: any;
}