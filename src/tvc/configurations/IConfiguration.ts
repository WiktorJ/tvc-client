import {IStyleManager} from './manager/IStyleManager';
import {IDataManager} from './IDataManager';
import {CustomMap} from '../rendering-engine/utils/CustomMap';
/**
 * Created by wjurasz on 10.08.16.
 */

/**
 * Implementation of this interface should be passed into "graph" or "tree" directive under the name: "configuration"
 * (See @TreeExample or @GraphExample).
 */
export interface IConfiguration {
    /**
     * @styleManager is contains all options to configure look&fill of visualisation.
     * This field is optional as component provides its own default implementation.
     * All fields don't specified by user will be autocompleted from default styleManager.
     */
    styleManager?: IStyleManager;
    /**
     * As there can be multiple visualisation per application user can specify manager to each.
     * Key is just custom name that have to be specified at runntime in order to load correct data.
     */
    dataManagers: CustomMap<string, IDataManager>;
}
