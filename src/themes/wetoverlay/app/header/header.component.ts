import { AfterViewInit, Component, HostListener, NgZone } from '@angular/core';
import { HostWindowService } from '../../../../app/shared/host-window.service';
import { MenuService } from '../../../../app/shared/menu/menu.service';
import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';
import { Observable } from 'rxjs';
import { Renderer2, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-header',
  styleUrls: ['../../../../app/header/header.component.scss', './header.component.scss'],
  templateUrl: './header.component.html',
  // templateUrl: '../../../../app/header/header.component.html',
})
export class HeaderComponent extends BaseComponent {
  isXs$: Observable<boolean>;
  isSm$: Observable<boolean>;

  constructor(
    protected windowService: HostWindowService,
    menuService: MenuService,
    private _renderer2: Renderer2, 
    public translate: TranslateService,
    private zone: NgZone,
    @Inject(DOCUMENT) private _document: Document
  ) {
    super(menuService);
    this.isXs$ = this.windowService.isXs();
    this.isSm$ = this.windowService.isSm();
    // FOSRC code start
    this.getPath();
    // FOSRC code end
  }
  
  forceGetRequest(query) {
    window.location.href = `https://www.canada.ca/en/sr/srb.html?q=${query}&wb-srch-sub=`;
  }

  ngAfterViewInit() {
    this.loadScripts().then(x=>{
      this.zone.runOutsideAngular(() => {
        setTimeout(()=> {
          let skipSectionList = document.querySelector('#wb-tphp')
          skipSectionList.removeChild(skipSectionList.lastChild)
        }, 500)
      })
    });
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

    await load("https://www.canada.ca/etc/designs/canada/wet-boew/js/wet-boew.min.js");
    await load("https://www.canada.ca/etc/designs/canada/wet-boew/js/theme.min.js");
  }

  // FOSRC code start
  public getPath(): string {
    this.locationPath = document.location.href;
    if(this.locationPath.indexOf("#") > 0) {
      return this.locationPath.substring(0, this.locationPath.indexOf("#"));
    }
    return this.locationPath;
  }
  // FOSRC code end
  
}