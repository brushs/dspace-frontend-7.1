import {  Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { TruncatableService } from './truncatable.service';

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

  @ViewChild('innerContent', {static: false}) content: ElementRef;

  truncatable = true;

  public constructor(private service: TruncatableService) {
  }

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
    this.observer = new (window as any      
      ).ResizeObserver((a) => {
      this.truncateElement();
    });
    if(this.content?.nativeElement) {
      this.observer.observe(this.content.nativeElement)
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

            if ((entry.children[entry.children.length - 1].firstElementChild.offsetHeight) > entry.offsetHeight) {
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
  }

  ngOnDestroy() {
    if(this.observer && this.content?.nativeElement) {
      this.observer.unobserve(this.content.nativeElement)
    }
  }

}
