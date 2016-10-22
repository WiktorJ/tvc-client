import {IShape} from './IShape';
/**
 * Created by wjurasz on 19.09.16.
 */
export class Circle implements IShape {
    private _name: string;

    constructor(private _r: number) {
        this._name = 'circle'
    }

    get r(): number {
        return this._r;
    }

    get name(): string {
        return this._name;
    }

    public getAttributes(): any {
        return {r: this._r};
    }

    public getFadeAttributes(): any {
        return {r: 1e-6};
    }

    public getWidth(): number {
        return this._r;
    }
}