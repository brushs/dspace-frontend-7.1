import { Component, Input, LOCALE_ID, NgZone, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BrowseByTypeConfig } from '../../../config/browse-by-type-config.interface';
import { environment } from '../../../environments/environment';
import { 
  CustomNativeWindowService
} from '../../core/services/window.service';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from '../utils/helper.service';

export interface ComColPageNavOption {
  id: string;
  label: string;
  routerLink: string;
  params?: any;
}

/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
@Component({
  selector: 'ds-comcol-page-browse-by',
  styleUrls: ['./comcol-page-browse-by.component.scss'],
  templateUrl: './comcol-page-browse-by.component.html'
})
export class ComcolPageBrowseByComponent implements OnInit {
  /**
   * The ID of the Community or Collection
   */
  @Input() id: string;
  @Input() contentType: string;
  @Input() browsingbyMetadata: boolean = false;
  /**
   * List of currently active browse configurations
   */
  types: BrowseByTypeConfig[];

  allOptions: ComColPageNavOption[];

  currentOptionId$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private zone: NgZone,
    private customNativeWindowService: CustomNativeWindowService,
    private helperService: HelperService,
    private translate: TranslateService
    ) {
  }

  ngOnInit(): void {
    this.allOptions = environment.browseBy.types
      .filter((config: BrowseByTypeConfig) => ((!config.displayOnlyOnLang) || this.translate.currentLang === config.displayOnlyOnLang))
      .map((config: BrowseByTypeConfig) => ({
        id: config.id,
        label: `browse.comcol.by.${config.id}`,
        routerLink: `/browse/${config.id}`,
        params: { scope: this.id, 'bbm.page': 1 }
      }));

    // if (this.contentType === 'collection') {
    //   this.allOptions = [ {
    //     id: this.id,
    //     label: 'collection.page.browse.recent.head',
    //     routerLink: getCollectionPageRoute(this.id)
    //   }, ...this.allOptions ];
    // } else if (this.contentType === 'community') {
    //   this.allOptions = [{
    //       id: this.id,
    //       label: 'community.all-lists.head',
    //       routerLink: getCommunityPageRoute(this.id)
    //     }, ...this.allOptions ];
    // }

    this.currentOptionId$ = this.route.params.pipe(
      map((params: Params) => params.id)
    );
  }

  ngAfterViewInit() {
     this.resetFocus()
  }

  ngAfterContentInit() {
    this.helperService.setFocusAfterRedirect();
  }

  resetFocus() {
    if(!this.helperService.getSelectorOfElementToFocusOnAfterRedirect()) {
      return;  
    }

    this.zone.runOutsideAngular(() => {
      // Set focus to the "Skip to links"
      let iId = setInterval(() => {
        let skipToLinksListEl = (this.customNativeWindowService.nativeDocument.querySelector('#wb-tphp') as HTMLElement);
        if(skipToLinksListEl) {
            skipToLinksListEl.setAttribute('tabindex', '-1');
            skipToLinksListEl.focus();
            if(skipToLinksListEl.scrollIntoView){
              skipToLinksListEl.scrollIntoView();
            }
            skipToLinksListEl.removeAttribute('tabindex');
          clearInterval(iId);
        }
      }, 250);
    })
  }

  getSelectedOptionById(id: string) {
    const selectedOption = this.allOptions
      .find((option: ComColPageNavOption) => option.id === id);
    return selectedOption;
  }

  setFocusSelector(event,focusElId: string) {    
    this.helperService.setSelectorOfElementToFocusOnAfterRedirect(focusElId);
  }

  onSelectChange(event: MouseEvent, newId: string, resetFocusToTop = false) {
    //if the control key is not pressed
    // AND the shift key is not pressed
    // AND the left mouse button is clicked
    if(
      !event.ctrlKey && !event.shiftKey && event.button === 0
    ){
      const selectedOption = this.allOptions
      .find((option: ComColPageNavOption) => option.id === newId);
      this.router.navigate([selectedOption.routerLink], { queryParams: selectedOption.params });
    }
    
  }
}
