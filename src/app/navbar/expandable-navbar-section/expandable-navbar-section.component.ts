import { Component, Inject, Injector, OnInit, HostListener, HostBinding } from '@angular/core';
import { NavbarSectionComponent } from '../navbar-section/navbar-section.component';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/initial-menus-state';
import { slide } from '../../shared/animations/slide';
import { first } from 'rxjs/operators';
import { HostWindowService } from '../../shared/host-window.service';
import { rendersSectionForMenu } from '../../shared/menu/menu-section.decorator';
import { ThemeActionTypes } from 'src/app/shared/theme-support/theme.actions';

/**
 * Represents an expandable section in the navbar
 * OSPR Changes - changed the selector to list/attribute
 * to conform with accessability guidlines
 */
@Component({
  selector: 'li[ds-expandable-navbar-section]',
  templateUrl: './expandable-navbar-section.component.html',
  styleUrls: ['./expandable-navbar-section.component.scss'],
  animations: [slide]
})
@rendersSectionForMenu(MenuID.PUBLIC, true)
export class ExpandableNavbarSectionComponent extends NavbarSectionComponent implements OnInit {
  /**
   * This section resides in the Public Navbar
   */
  menuID = MenuID.PUBLIC;

  constructor(@Inject('sectionDataProvider') menuSection,
              protected menuService: MenuService,
              protected injector: Injector,
              private windowService: HostWindowService
  ) {
    super(menuSection, menuService, injector);
    
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
 * OSPR Changes - Moved host element actions
 * and classes to component
 */
  @HostListener('window:keyup.enter', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    this.activateSection(event);
  }

  @HostListener('mouseenter', ['$event'])
  handleMouseEnter(event: MouseEvent) {
    this.activateSection(event);
  }

  @HostListener('mouseleave', ['$event'])
  handleMouseLeave(event: MouseEvent) {
    //this.deactivateSection(event);
  }
  
  @HostBinding('class') classAttribute: string = 'nav-item dropdown';
  
  /**
   * Overrides the super function that activates this section (triggered on hover)
   * Has an extra check to make sure the section can only be activated on non-mobile devices
   * @param {Event} event The user event that triggered this function
   */
  activateSection(event): void {
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (!isMobile) {
        super.activateSection(event);
      }
    });
  }

  /**
   * Overrides the super function that deactivates this section (triggered on hover)
   * Has an extra check to make sure the section can only be deactivated on non-mobile devices
   * @param {Event} event The user event that triggered this function
   */
  deactivateSection(event): void {
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (!isMobile) {
        super.deactivateSection(event);
      }
    });
  }

  /**
   * Overrides the super function that toggles this section (triggered on click)
   * Has an extra check to make sure the section can only be toggled on mobile devices
   * @param {Event} event The user event that triggered this function
   */
  toggleSection(event): void {
    event.preventDefault();
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (isMobile) {
        super.toggleSection(event);
      }
    });
  }
}
