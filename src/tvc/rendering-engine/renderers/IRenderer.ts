import {IStyleManager} from '../../configurations/manager/IStyleManager';
import {IDataMetaProcessor} from '../../configurations/types/IDataMetaProcessor';
import {TopologySearchService} from '../services/TopologySearchService';
/**
 * Created by wjurasz on 17.08.16.
 */
export interface IRenderer {

    render(svg: any,
           initialData: any,
           styleManager: IStyleManager,
           showDetails: Function,
           hideDetails: Function,
           dataMetaProcessor: IDataMetaProcessor,
           absUlr: string,
           searchService: TopologySearchService,
           mainNodeId?: string): void;
}
