import {DefaultStyleManager} from './DefaultStyleManager';
import {IStyleManager} from '../manager/IStyleManager';
/**
 * Created by wjurasz on 02.08.16.
 */

// TODO: There should be more 'default' configurations, user should specify one at runtime
/**
 * Predefined @IStyleManager implementations are available here.
 */
export class Configurations {
    public static defaultStyleManager(): IStyleManager {
        return new DefaultStyleManager();
    }
}
