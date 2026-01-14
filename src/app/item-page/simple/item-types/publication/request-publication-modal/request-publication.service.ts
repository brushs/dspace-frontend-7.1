import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RESTURLCombiner } from '../../../../../core/url-combiner/rest-url-combiner';

export interface RequestPublicationPayload {
  publicationGUID: string;
  userEmailAddress: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestPublicationService {
  constructor(private http: HttpClient) {}

  requestPublication(payload: RequestPublicationPayload): Observable<void> {
    const url = new RESTURLCombiner('request', 'publicationrequests').toString();
    return this.http.post<void>(url, payload);
  }
}
