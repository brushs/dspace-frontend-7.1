import { Component, HostBinding, Inject, Injector, OnInit } from '@angular/core';
import { rotate } from '../../../shared/animations/rotate';
import { AdminSidebarSectionComponent } from '../admin-sidebar-section/admin-sidebar-section.component';
import { slide } from '../../../shared/animations/slide';
import { CSSVariableService } from '../../../shared/sass-helper/sass-helper.service';
import { bgColor } from '../../../shared/animations/bgColor';
import { MenuID } from '../../../shared/menu/initial-menus-state';
import { MenuService } from '../../../shared/menu/menu.service';
import { combineLatest as combineLatestObservable, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { rendersSectionForMenu } from '../../../shared/menu/menu-section.decorator';

/**
 * Represents a expandable section in the sidebar
 */
@Component({
  selector: 'li[ds-expandable-admin-sidebar-section]',
  templateUrl: './expandable-admin-sidebar-section.component.html',
  styleUrls: ['./expandable-admin-sidebar-section.component.scss'],
  animations: [rotate, slide, bgColor]
})

@rendersSectionForMenu(MenuID.ADMIN, true)
export class ExpandableAdminSidebarSectionComponent extends AdminSidebarSectionComponent implements OnInit {
  /**
   * This section resides in the Admin Sidebar
   */
  menuID = MenuID.ADMIN;

  /**
   * The background color of the section when it's active
   */
  sidebarActiveBg;

  /**
   * Emits true when the sidebar is currently collapsed, true when it's expanded
   */
  sidebarCollapsed: Observable<boolean>;

  /**
   * Emits true when the sidebar's preview is currently collapsed, true when it's expanded
   */
  sidebarPreviewCollapsed: Observable<boolean>;

  /**
   * Emits true when the menu section is expanded, else emits false
   * This is true when the section is active AND either the sidebar or it's preview is open
   */
  expanded: Observable<boolean>;

  /** Attach classes to host element. */
  // @HostBinding('class')
  // get elementClasses() {
  //   return {
  //     'sidebar-section': true,
  //     'expanded' : this.expanded,
  //    // [`primary-button--${this.size}`]: true,
  //    // 'primary-button--color': false
  //   }
  // }

  constructor(@Inject('sectionDataProvider') menuSection, protected menuService: MenuService,
              private variableService: CSSVariableService, protected injector: Injector) {
    super(menuSection, menuService, injector);
  }

  /**
   * Set initial values for instance variables
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.sidebarActiveBg = this.variableService.getVariable('adminSidebarActiveBg');
    this.sidebarCollapsed = this.menuService.isMenuCollapsed(this.menuID);
    this.sidebarPreviewCollapsed = this.menuService.isMenuPreviewCollapsed(this.menuID);
    this.expanded = combineLatestObservable(this.active, this.sidebarCollapsed, this.sidebarPreviewCollapsed)
      .pipe(
        map(([active, sidebarCollapsed, sidebarPreviewCollapsed]) => (active && (!sidebarCollapsed || !sidebarPreviewCollapsed)))
      );
  }
}
