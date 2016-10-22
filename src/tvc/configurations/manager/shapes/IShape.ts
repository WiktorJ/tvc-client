/**
 * Created by wjurasz on 19.09.16.
 */
/**
 * Interface that describe that to be used as node visualisation.
 */
export interface IShape {
    /**
     * Name of the shape. Must correspond to SVG available shapes
     */
    name: string;
    /**
     * Must return all mandatory attributes of shape @name.
     * Return object format: { attributeName1: attributeValue1, ...}
     */
    getAttributes(): any;
    getFadeAttributes(): any;
    getWidth(): number;
}