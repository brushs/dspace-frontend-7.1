import { Component, EventEmitter, Injector, Input, NgZone, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { fadeIn, fadeInOut } from '../animations/fade';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { getStartsWithComponent, StartsWithType } from '../starts-with/starts-with-decorator';
import { PaginationService } from '../../core/pagination/pagination.service';
import { HelperService } from '../utils/helper.service';
import { LocaleService } from '../../core/locale/locale.service';

@Component({
  selector: 'ds-browse-by',
  styleUrls: ['./browse-by.component.scss'],
  templateUrl: './browse-by.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Component to display a browse-by page for any ListableObject
 */
export class BrowseByComponent implements OnInit {
  /**
   * The i18n message to display as title
   */
  @Input() title: string;
 
  /**
   * The current field being browsed by
   */
  @Input() browseField: string;

  /**
   * The current search value
   */
  @Input() currentTerm: string;

  /**
   * The parent name
   */
  @Input() parentname: string;
  /**
   * The list of objects to display
   */
  @Input() objects$: Observable<RemoteData<PaginatedList<ListableObject>>>;

  /**
   * The pagination configuration used for the list
   */
  @Input() paginationConfig: PaginationComponentOptions;

  /**
   * The sorting configuration used for the list
   */
  @Input() sortConfig: SortOptions;

  /**
   * The type of StartsWith options used to define what component to render for the options
   * Defaults to text
   */
  @Input() type = StartsWithType.text;

  /**
   * The list of options to render for the StartsWith component
   */
  @Input() startsWithOptions = [];

  /**
   * Whether or not the pagination should be rendered as simple previous and next buttons instead of the normal pagination
   */
  @Input() enableArrows = false;

  /**
   * If enableArrows is set to true, should it hide the options gear?
   */
  @Input() hideGear = false;

  /**
   * If enableArrows is set to true, emit when the previous button is clicked
   */
  @Output() prev = new EventEmitter<boolean>();

  /**
   * If enableArrows is set to true, emit when the next button is clicked
   */
  @Output() next = new EventEmitter<boolean>();

  /** DSPR Sprint5 issue 248/249/250/251 **/
  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
   @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
   @Output() sortFieldChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * An event fired when on of the pagination parameters changes
   */
   @Output() paginationChange: EventEmitter<any> = new EventEmitter<any>();

   hidePagerWhenSinglePage = true;

   hidePaginationDetail = false;
   
  /**
   * If enableArrows is set to true, emit when the page size is changed
   */
  @Output() pageSizeChange = new EventEmitter<number>();

  /**
   * If enableArrows is set to true, emit when the sort direction is changed
   */
  @Output() sortDirectionChange = new EventEmitter<SortDirection>();

  /**
   * An object injector used to inject the startsWithOptions to the switchable StartsWith component
   */
  objectInjector: Injector;

  /**
   * Declare SortDirection enumeration to use it in the template
   */
  public sortDirections = SortDirection;

  public constructor(private injector: Injector,
                     protected paginationService: PaginationService,
                     public locale: LocaleService,
                     private helperService: HelperService,
                     public route: ActivatedRoute,
                     private zone: NgZone
  ) {
  }

  /**
   * Get the switchable StartsWith component dependant on the type
   */
  getStartsWithComponent() {
    return getStartsWithComponent(this.type);
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'startsWithOptions', useFactory: () => (this.startsWithOptions), deps:[] },
        { provide: 'paginationId', useFactory: () => (this.paginationConfig?.id), deps:[] }
      ],
      parent: this.injector
    });
  }

  ngAfterViewInit(){
    this.helperService.focusElement$.pipe(first()).subscribe(selector => {
      if(selector) {
        this.helperService.setFocusElement(null);
        let intervalID = setInterval( () => {
            let el: HTMLElement = document.querySelector(selector);
            if(el) {
              el.focus();
              clearInterval(intervalID)
            }
          }, 250)
      }
    })
    this.zone.run(()=> {
      this.route.queryParams.subscribe(params => {
        this.currentTerm = params.startsWith;
      }); 
    })
  }

  /** DSPR Sprint5 issue 248/249/250/251 **/
  /**
   * Emits the current page when it changes
   * @param event The new page
   */
   onPageChange(event) {
    this.pageChange.emit(event);
  }

  /**
   * Emits the current page size when it changes
   * @param event The new page size
   */
  onPageSizeChange(event) {
    this.pageSizeChange.emit(event);
  }
  /**
   * Emits the current sort direction when it changes
   * @param event The new sort direction
   */
  onSortDirectionChange(event) {
    this.sortDirectionChange.emit(event);
  }

  /**
   * Emits the current sort field when it changes
   * @param event The new sort field
   */
  onSortFieldChange(event) {
    this.sortFieldChange.emit(event);
  }

  /**
   * Emits the current pagination when it changes
   * @param event The new pagination
   */
  onPaginationChange(event) {
    this.paginationChange.emit(event);
  }

  /**
   * Method to change the current sort field and direction
   * @param {Event} event Change event containing the sort direction and sort field
   */
   reloadOrder(event: Event) {
    this.helperService.setFocusElement('#'+document.activeElement.id)
    const values = (event.target as HTMLInputElement).value.split(',');
    this.paginationService.updateRoute(this.paginationConfig.id, {
      sortField: values[0],
      sortDirection: values[1] as SortDirection,
      page: 1
    });
  }

  /**
   * Method to change the current page size (results per page)
   * @param {Event} event Change event containing the new page size value
   */
   reloadRPP(event: Event) {
    this.helperService.setFocusElement('#'+document.activeElement.id)
    const size = (event.target as HTMLInputElement).value;
    this.paginationService.updateRoute(this.paginationConfig.id,{page: 1, pageSize: +size});
  }
}
