import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScienceCommunityService {

  private storageKey = 'scienceId';

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
  ) {}

  setScienceId(id: string): void {

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, id);
    }
    
  }

  getScienceId(): string | null {

    let scienceId = null;

    if (isPlatformBrowser(this.platformId)) {
      scienceId = localStorage.getItem(this.storageKey);
    }

    return scienceId;
    
  }
 
}
