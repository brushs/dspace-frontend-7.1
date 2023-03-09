import { Component, HostListener } from '@angular/core';
import { HostWindowService } from '../../../../app/shared/host-window.service';
import { MenuService } from '../../../../app/shared/menu/menu.service';
import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  // styleUrls: ['../../../../app/header/header.component.scss'],
  templateUrl: 'header.component.html',
  // templateUrl: '../../../../app/header/header.component.html',
})
export class HeaderComponent extends BaseComponent {
  isXsOrSm$; // Remove button component when not supposed to be visible for accessibility compliance
  constructor(
    protected windowService: HostWindowService,
    menuService: MenuService
  ) {
    super(menuService);
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }
}
