import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScienceCommunityService {

  private storageKey = 'scienceId';

  setScienceId(id: string): void {
    localStorage.setItem(this.storageKey, id);
  }

  getScienceId(): string | null {
    return localStorage.getItem(this.storageKey);;
  }
 
}
