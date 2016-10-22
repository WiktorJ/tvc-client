import {IShape} from './IShape';
/**
 * Created by wjurasz on 19.09.16.
 */
export class Rectangle implements IShape {

    private _name: string;

    constructor(private width: number, private height: number, private rx?: number, private ry?: number) {
        this._name = 'rect'
    }

    get name(): string {
        return this._name;
    }

    public getAttributes(): any {
        let attributes: any = {
            width: this.width,
            height: this.height,
            x: - (this.width / 2),
            y: - (this.height / 2)
        };
        if(this.rx) attributes.rx = this.rx;
        if(this.ry) attributes.ry = this.ry;
        return attributes;
    }

    public getFadeAttributes(): any {
        let attributes: any = {
            width: 1e-6,
            height: 1e-6
        };
        if(this.rx) attributes.rx = 0;
        if(this.ry) attributes.ry = 0;
        return attributes;
    }

    public getWidth(): number {
        return this.width / 2;
    }

}