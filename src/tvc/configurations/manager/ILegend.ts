export interface ILegend {
    /**
     * If set to true than legend will be generated based on @predefinedNodeTypes and @predefinedEdgeTypes
     */
    generateLegend: boolean;
    width?: number;
    defaultNodeDescription?: string;
}