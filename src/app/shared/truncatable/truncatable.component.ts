import {
  Component,
  ElementRef,
  Input,
  // TemplateRef,
  ViewChild,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { TruncatableService } from './truncatable.service';
import { isPlatformBrowser } from '@angular/common';
import {
  NativeWindowRef,
  NativeWindowService
} from '../../core/services/window.service';
import {
  CustomNativeWindowService
} from '../../core/services/window.service';

@Component({
  selector: 'ds-truncatable',
  templateUrl: './truncatable.component.html',
  styleUrls: ['./truncatable.component.scss'],

})

/**
 * Component that represents a section with one or more truncatable parts that all listen to this state
 */
export class TruncatableComponent {
  /**
   * Is true when all truncatable parts in this truncatable should be expanded on loading
   */
  @Input() initialExpand = false;

  /**
   * The unique identifier of this truncatable component
   */
  @Input() id: string;

  /**
   * Is true when the truncatable should expand on both hover as click
   */
  @Input() onHover = false;

  /**
   * Instead of click, have a show more button
   */
  @Input() useShowMore = false;

  @Input() overrideTruncation = false;

  isCollapsed$;

  observer;

  toggled = false;

  //input to manually exclude show more button
  @Input() omitExpandCollapseLink = false;

  @ViewChild('innerContent', {static: false}) content: ElementRef;

  truncatable = true;

  public constructor(
    private service: TruncatableService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    private customNativeWindowService: CustomNativeWindowService,
  ) {}

  /**
   * Set the initial state
   */
  ngOnInit() {
    if (this.initialExpand) {
      this.service.expand(this.id);
    } else {
      this.service.collapse(this.id);
    }
    this.isCollapsed$ = this.service.isCollapsed(this.id);
  }

  ngAfterViewInit() {

    if (isPlatformBrowser(this.platformId)) {

      this.observer = new (this._window.nativeWindow as any
        ).ResizeObserver((a) => {
        this.truncateElement();
      });

      if(this.content?.nativeElement) {
        this.observer.observe(this.content.nativeElement)
      }

    }

  }

  public async truncateElement() {
    if (this.useShowMore) {
      if(this.toggled) {
        this.toggled = true;
        return;
      }
      const entry = this.content.nativeElement;
        let children = entry.querySelectorAll('div.content');
        let requiresTruncate = false;
        for(let entry of children) {

          if (entry.children.length > 0) {

            // if ((entry.children[entry.children.length - 1].offsetHeight - 6) > entry.offsetHeight) {
            //   requiresTruncate = true;
            //   break;
            // }
            let entryFirstChild = entry.children[entry.children.length - 1];
            if (entryFirstChild.firstElementChild == null) {
              if (entryFirstChild.offsetHeight > entry.offsetHeight)
                requiresTruncate = true;
              break;
            }
            else if ((entryFirstChild.firstElementChild.offsetHeight) > entry.offsetHeight) {
              requiresTruncate = true;
              break;
            }

          } else {
            if (entry.innerText.length > 0) {
              requiresTruncate = true;
              break;
            }
          }
        }

        this.truncatable = requiresTruncate || this.overrideTruncation;
        if(!this.truncatable) {
          this.service.expand(this.id);
        }
    }
  }

  /**
   * If onHover is true, collapses the truncatable
   */
  public hoverCollapse() {
    if (this.onHover) {
      this.service.collapse(this.id);
    }
  }

  /**
   * If onHover is true, expands the truncatable
   */
  public hoverExpand() {
    if (this.onHover) {
      this.service.expand(this.id);
    }
  }

  /**
   * Expands the truncatable when it's collapsed, collapses it when it's expanded
   */
  public toggle() {
    this.toggled = true;
    this.service.toggle(this.id);
    this.setFocus("description-span-" + this.id);
  }

  ngOnDestroy() {
    if(this.observer && this.content?.nativeElement) {
      this.observer.unobserve(this.content.nativeElement)
    }
  }

  /**
   * Method to set the focus to an element by its ID
   * @param elementId The element ID value
   */
  setFocus(elementId) {
    const el = this.customNativeWindowService.nativeDocument.getElementById(elementId);
    if (el) {
      el.focus();
    }
  }

}
