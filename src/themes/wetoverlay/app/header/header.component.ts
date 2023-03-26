import { AfterViewInit, Component, HostListener } from '@angular/core';
import { HostWindowService } from '../../../../app/shared/host-window.service';
import { MenuService } from '../../../../app/shared/menu/menu.service';
import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';
import { Observable } from 'rxjs';
import { Renderer2, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-header',
  // styleUrls: ['../../../../../node_modules/gcweb/css/theme.css'],
  styleUrls: ['../../styles/wet-theme.scss'],
  // styleUrls: ['../../../../app/header/header.component.scss'],
  templateUrl: 'header.component.html',
  // templateUrl: '../../../../app/header/header.component.html',
})
export class HeaderComponent extends BaseComponent {
  isXs$: Observable<boolean>;
  isSm$: Observable<boolean>;

  menuItems: Array<{link: string, label: string}> = [
    {link: 'https://www.canada.ca/en/services/jobs.html', label: 'Jobs and the workplace'},
    {link: 'https://www.canada.ca/en/services/immigration-citizenship.html', label: 'Immigration and citizenship'},
    {link: 'https://travel.gc.ca/', label: 'Travel and tourism'},
    {link: 'https://www.canada.ca/en/services/business.html', label: 'Business and industry'},
    {link: 'https://www.canada.ca/en/services/environment.html', label: 'Environment and natural resources'},
    {link: 'https://www.canada.ca/en/services/benefits.html', label: 'Benefits'},
    {link: 'https://www.canada.ca/en/services/health.html', label: 'Health'},
    {link: 'https://www.canada.ca/en/services/taxes.html', label: 'Taxes'},
    {link: 'https://www.canada.ca/en/services/defence.html', label: 'National security and defence'},
    {link: 'https://www.canada.ca/en/services/culture.html', label: 'Culture, history and sport'},
    {link: 'https://www.canada.ca/en/services/policing.html', label: 'Policing, justice and emergencies'},
    {link: 'https://www.canada.ca/en/services/transport.html', label: 'Transport and infrastructure'},
    {link: 'https://international.gc.ca/world-monde/index.aspx?lang=eng', label: 'Canada and the world'},
    {link: 'https://www.canada.ca/en/services/finance.html', label: 'Money and finances'},
    {link: 'https://www.canada.ca/en/services/science.html', label: 'Science and innovation'},
  ]
  constructor(
    protected windowService: HostWindowService,
    menuService: MenuService,
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document
  ) {
    super(menuService);
    this.isXs$ = this.windowService.isXs();
    this.isSm$ = this.windowService.isSm();
  }

  ngAfterViewInit() {
    this.loadScripts();
  }
  /** Dynamically append scripts to the DOM. Required here as opposed to angular.json to ensure component renders
   *  so the menu element is detected when the script performs the check. Even including the script in the index.html with the 
   * 'defer' attribute does not work. */
  async loadScripts() {
    let load = (src) => {
      return new Promise<void>((resolve, reject) => {
        let script = this._renderer2.createElement('script');
        script.type="text/javascript";
        script.src=src;
        script.onload = () => { return resolve(); }
        this._renderer2.appendChild(this._document.body, script)
      })
    }

    await load("assets/gcweb/jquery.magnific-popup.min.js");
    await load("assets/gcweb/wet-boew.min.js");
    await load("assets/gcweb/theme.min.js");
  }
}
