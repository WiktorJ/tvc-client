/**
 * Created by wjurasz on 10.08.16.
 */
import {IStyleManager} from './manager/IStyleManager';
import {ITopologyQueryConfig} from './ITopologyQueryConfig';
/**
 * Each visualisation has its own IDataManager.
 */
export interface IDataManager {
    /**
     * Here details of naming and querying are specified.
     */
    topologyQueryConfig: ITopologyQueryConfig;
    /**
     * Beside @styleManager in IConfiguration interface user can specify another here.
     * Setting in this one have the highest priority and will overwrite these from IConfiguration and defaults.
     */
    styleManager?: IStyleManager;

    useParser?: boolean;
}
