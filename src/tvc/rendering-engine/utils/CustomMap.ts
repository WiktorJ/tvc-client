/**
 * Created by wjurasz on 19.09.16.
 */
export class CustomMap<K extends string, V> {
    private mapObject: any;
    private _size: number;

    constructor() {
        this.mapObject = {};
        this._size = 0;
    }

    public set(key: K, value: V): CustomMap<K, V> {
        if (!this.mapObject[key.toString()]) {
            this._size++;
        }
        this.mapObject[key.toString()] = value;
        return this;
    }

    public get(key: K): any {
        return this.mapObject[key.toString()];
    }

    public delete(key: K): void {
        if (this.mapObject[key.toString()]) {
            this._size--;
        }
        delete this.mapObject[key.toString()];
    }

    public forEach(callback: Function): void {
        for (let key in this.mapObject) {
            if (this.mapObject.hasOwnProperty(key)) {
                callback(this.mapObject[key], key)
            }
        }
    }

    get size(): number {
        return this._size;
    }
}