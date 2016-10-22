/**
 * Created by wjurasz on 14.09.16.
 */
/**
 * Names of the key fields.
 */
export interface IDataFieldsMapping {
    /**
     * Column that should be consider as unique id.
     */
    id?: string;
    /**
     * Column that should be consider as parent id.
     * Relevant only with tree topology.
     */
    parentId?: string;
    /**
     * Label of the node.
     */
    label?: string;
    /**
     * Label of the edge.
     */
    edgeLabel?: string;
    /**
     * Any other data that are to be passed in.
     * Component don't make any assumption about "data" data structure,
     * it's entirely up tu user.
     */
    data?: string;
}
