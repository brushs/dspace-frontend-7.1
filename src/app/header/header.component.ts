import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/initial-menus-state';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html',
})
export class HeaderComponent {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;
  public showAuth = false;
  menuID = MenuID.PUBLIC;
  // OSPR code start
  public locationPath: string;
  // OSPR code end

  constructor(
    private menuService: MenuService
  ) {
      // OSPR code start
      this.getPath();
      // OSPR code end
  }

  public toggleNavbar(): void {
    this.menuService.toggleMenu(this.menuID);
  }

  // OSPR code start
  public getPath(): string {
    this.locationPath = document.location.href;
    if(this.locationPath.indexOf("#") > 0) {
      this.locationPath.substring(this.locationPath.indexOf("#") + 1);
    }
    return this.locationPath;
  }
  // OSPR code end
}
