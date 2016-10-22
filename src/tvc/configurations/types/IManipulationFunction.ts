import {IDataMetaProcessor} from './IDataMetaProcessor';
/**
 * Created by wjurasz on 14.09.16.
 */

export interface IManipulationFunction<T> {
    /**
     *
     * @param dataMetaProcessor
     * @param nodeData: Data of particular node.
     * Description of @nodeData structure:
     * //For tree
     * {
     *  //Meta data fields. To be described.
     *  data: {
     *      id: ...
     *      parentId: ...
     *      label: ... //optional
     *      edgeLabel: .. //optional
     *      data: {...} //optional
     *  }
     * }
     *
     *
     * //For graph node.
     * {
     * //Meta data fields. To be described.
     *  data: {
     *      id: ...
     *      label: ...//optional
     *      data: {...}//optional
     *  }
     * }
     *
     *
     *  //For graph edge.
     * {
     * //Meta data fields. To be described.
     *  data: {
     *      label: ...//optional
     *      data: {...}//optional
     *  }
     * }
     */
    (dataMetaProcessor: IDataMetaProcessor, nodeData?: any): T;
}