import {ICustomEvent} from '../../configurations/types/ICustomEvent';
import {IDataMetaProcessor} from '../../configurations/types/IDataMetaProcessor';
import {ICustomManipulation} from '../../configurations/types/ICustomManipulation';
let _ = require('lodash');

let select = require('d3-selection').select;
// import {select} from 'd3-selection';
/**
 * Created by wjurasz on 21.07.16.
 */
export class DOMUtil {
    public static translateFixed(x: any, y: any): (d: any) => string {
        return (d: any) => 'translate(' + x + ', ' + y + ')';
    }

    public static translateDynamic(x: string, y: string): (d: any) => string {
        return (d: any) => 'translate(' + d[x] + ', ' + d[y] + ')';
    }


    public static addCustomEvents(events: Array<ICustomEvent>,
                                  selection: any,
                                  dataMetaProcessor: IDataMetaProcessor): void {
        events.forEach((event: ICustomEvent) => {
            selection.on(event.name, function (d: any): void {
                event.run(select(this));
            });
        });
    }

    public static createCustomObject(customs: Array<ICustomManipulation>,
                                     nodeData: any,
                                     dataMetaProcessor: IDataMetaProcessor): any {
        return _.reduce(customs, (result: any, value: ICustomManipulation) => {
            result[value.name] = value.manipulationFunction;
            return result;
        }, {});
    }

    public static NODE_DETAILS_SHOW_FUNCTION_NAME: string = 'details-on';
    public static NODE_DETAILS_HIDE_FUNCTION_NAME: string = 'details-off';
}
