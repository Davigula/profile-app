import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export enum RxJsLoggingLevel {
    TRACE,
    DEBUG,
    INFO,
    ERROR
}

let rxjsLoggingLevel = RxJsLoggingLevel.DEBUG;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
    rxjsLoggingLevel = level;
}


export const debug = (message:string) =>
    (source: Observable<any>) => source
        .pipe(
            tap(val => {
                if (rxjsLoggingLevel == RxJsLoggingLevel.DEBUG) {
                    console.log('[' + (new Date()).toLocaleTimeString() + '] ' + message + ': ', val);
                }
            })
        );