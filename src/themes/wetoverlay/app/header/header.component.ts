import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';

const TOGGLE_DISPLAY_BREAKPOINT_SIZE = 768;
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
export class HeaderComponent extends BaseComponent implements OnInit{
  hideToggleButton; // Remove button component when not supposed to be visible for accessibility compliance

  ngOnInit(): void {
    this.hideToggleButton = (window.innerWidth > TOGGLE_DISPLAY_BREAKPOINT_SIZE);
  }

  @HostListener("window:resize", [])
  onResize() {
    console.log('here', window.innerWidth)
    this.hideToggleButton = !!(window.innerWidth > TOGGLE_DISPLAY_BREAKPOINT_SIZE);
  }
}
