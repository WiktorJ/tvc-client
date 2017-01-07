export interface ILegend {
    /**
     * If set to true than legend will be generated based on @predefinedNodeTypes and @predefinedEdgeTypes
     */
    generateLegend: boolean;
    /**
     * Width of the legend
     */
    width?: number;
    /**
     * Description that will show up for node that is classified as any @IPredefinedType
     */
    defaultNodeDescription?: string;
}