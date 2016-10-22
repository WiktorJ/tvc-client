import {IDataMetaProcessor} from './IDataMetaProcessor';
import {SupportedHTMLEvents} from '../utils/SupportedHTMLEvents';
export interface ICustomEvent {
    /**
     * Behaviour.
     */
    run(element: any): void;
    /**
     * Name of event.
     */
    name: SupportedHTMLEvents;
}
