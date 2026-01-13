import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RequestPublicationPayload {
  itemUuid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestPublicationService {
  constructor(private http: HttpClient) {}

  requestPublication(payload: RequestPublicationPayload): Observable<void> {
    return this.http.post<void>('/api/request-publication', payload);
  }
}
