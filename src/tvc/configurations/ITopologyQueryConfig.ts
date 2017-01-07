/**
 * Created by wjurasz on 14.09.16.
 */

import {CustomMap} from '../rendering-engine/utils/CustomMap';
/**
     *  This interface contains all information needed in order to correctly extract data from server.
 */
export interface ITopologyQueryConfig {
    /**
     * @name can be name of @VisualisationDataDao implementation or,
     * if particular data set is extracted by generic service that calls database functions @name is passed there.
     */
    name: string;

    /**
     * If set to true then component variable (object) arguments @dynamicCustomParameters will be added to query parameters
     */
    useDynamicCustomParameters?: boolean;

    /**
     * Name of the query to extracat all data from topology.
     * Relevant only if using database functions.
     */
    getAllQueryName?: string;
    /**
     * Name of the query to extracat nodes in specified distance from given node.
     * Relevant only if using database functions.
     */
    getByIdQueryName?: string;
    /**
     * If @defaultDistance is specified Name of the node will passed to @getByIdQueryName or adequate @VisualisationDataDao function
     * when data are loaded for the first time.
     * For tree visualisation if there is no root in data (no node without parentId) node with this id will be considered as root.
     * @dynamicCustomParameters Those are parameters that you can set dynamically in runtime vai @dynamic-custom-parameters binding to acw-tree or acw-graph
     */
    mainNodeId?(dynamicCustomParameters: any): string;
    /**
     * Distance in which nodes are loaded (from given node).
     * This is passed to @VisualisationDataDao implementation or to database function.
     * In future versions there will be possibility to change distance at runtime.
     */
    defaultDistance?: number;
    /**
     * Any other parameters that user would like to pass to his dao or data base function.
     * To be supported in future versions.
     */
    queryCustomParameters?: CustomMap<string, string>;

}