import { Component, Input, Output } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-item-page-citation-field',
  templateUrl: './item-page-citation-field.component.html',
})
/**
 * This component can be used to represent any citation on a simple item page.
 * It expects 4 parameters: The item, a separator, the metadata keys and an i18n key
 */
export class ItemPageCitationFieldComponent extends ItemPageFieldComponent {
  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() separator: string;


  fields: string[] = ['dc.identifier.citation'];

  fieldsAuthor: string[] = ['dc.creator'];
  fieldsTitle: string[] = ['dc.title'];
  fieldPageRange: string = 'nrcan.pagination.pagerange';


  @Output() valuesAuthors: string;
  /**
   * Label i18n key for the rendered metadata
   */
  label = 'item.page.citation';

  labelTitle = 'item.page.titleprefix';
  lablePageRange = 'item.page.pagerange';

  constructor(public tralateService: TranslateService) {
    super();
  }

  ngOnInit() {
    var allAuthors = this.item.allMetadata(this.fieldsAuthor);
    var authors: string = '';
    var translatedAuthors: string;

    this.tralateService.get('item.page.author').subscribe((res: string) => {
      translatedAuthors = res;
    });

    for (var author in allAuthors) {
      //this.valuesAuthors = this.valuesAuthors.concat("author" + author);
      authors =
        authors + allAuthors[author].value + ',';
    }
    this.valuesAuthors = authors;
  }
}
