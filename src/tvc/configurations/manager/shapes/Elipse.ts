import {IShape} from './IShape';
/**
 * Created by wjurasz on 19.09.16.
 */
export class Elipse implements IShape {
    private _name: string;

    constructor(private _rx: number, private _ry: number) {
        this._name = 'ellipse'
    }

    get rx(): number {
        return this._rx;
    }

    get ry(): number {
        return this._ry;
    }

    get name(): string {
        return this._name;
    }

    public getAttributes(): any {
        return {
            rx: this._rx,
            ry: this._ry
        };
    }
    public getFadeAttributes(): any {
        return {
            rx: 1e-6,
            ry: 1e-6
        };
    }

    public getWidth(): number {
        return this._rx;
    }
}