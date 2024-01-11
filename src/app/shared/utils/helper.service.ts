import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class HelperService {

    private focusElement: BehaviorSubject<string> = new BehaviorSubject(null);
    focusElement$ = this.focusElement.asObservable()

    setFocusElement(selector: string) {
        this.focusElement.next(selector)
    }

}
