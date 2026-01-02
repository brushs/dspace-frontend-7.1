import {
  Component
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray
} from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dynamic-filters',
  templateUrl: './dynamic-filters.component.html',
  //styleUrls: ['./dynamic-filters.component.css'],
  styleUrls:[
    '../../../styles/static-pages.scss'
  ]
})
export class DynamicFiltersComponent {
  form: FormGroup;
  output: any = '';

  constructor(private fb: FormBuilder, public translate: TranslateService, private router: Router) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.addRow();
  }


  addRow() {
    const newRow = this.fb.group({
      filtertype: ['alltitles'],
      relationalOperator: ['contains'], // Set default value here
      filter: [''],
    });
    this.rows.push(newRow);
  }

  removeRow(index: number) {
    if (this.rows.length === 1) {
      return;
    }
    this.rows.removeAt(index);
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }


  resetQuery() {
    //this.form.reset();
    //this.filteredData = this.mockData;
    for (let i = this.rows.length - 1; i > 0; i--) {
      this.rows.removeAt(i);
    }
    this.rows.controls[0].get('filter').setValue('');
    this.router.navigate(['/advanced-search']);
  }

  printFormValues() {
    var filterAll = this.getQueryString();
  }

  private transformEqualFilterInfo(filtertype: string,filterText:string): string {
    var filterInfo: string = '';
    if (filtertype === 'nrcan.reportnumber') {
      // remove the space in the filterText
      filterText = filterText.replace(/ /g, '');
      // add 'nrcan.issue','nrcan.volume','nrcan.secserial.number','nrcan.articlenumber' to the filter
      filterInfo = `(${filtertype}:${filterText} OR nrcan.issue:${filterText} OR nrcan.volume:${filterText} OR nrcan.secserial.number:${filterText} OR nrcan.articlenumber:${filterText})`;
    }
    else if (filtertype === 'nrcan.nts') {
      // check if the number part of the value is less then 3, if yes, then put leading 0. For example, 1A  should be 001A
      var numberPart = filterText.match(/^\d+/);
      if (numberPart && numberPart[0].length < 3) {
        filterText = filterText.replace(/^\d+/, numberPart[0].padStart(3, '0'));
      }
      filterInfo = `${filtertype}:"${filterText}"`;
    }
    else
      filterInfo = `${filtertype}:"${filterText}"`;

    return filterInfo;
  }

  private getQueryString() {
    const filters = this.rows.controls.map(row => row.value);
    let filterArray: any = [];
    var filterInfo = '';
    for (const filter of filters) {
      const rawFilter = (filter.filter || '');
      const trimmedFilter = rawFilter.trim();
      if (trimmedFilter === '') {
        continue;
      }
      filter.filter = trimmedFilter;
      switch (filter.relationalOperator) {
        case 'contains':
        case 'equals':
          var filterText = filter.filter;
          filterText = filterText.replace(/"/g, '');
          filterInfo = this.transformEqualFilterInfo(filter.filtertype,filterText);
          break;
        case 'notcontains':
        case 'notequals':
          filterInfo = `-${filter.filtertype}:"${filter.filter}"`;
          break;
        default:
          filterInfo = `*:*`;
          break;
      }
      filterArray.push(filterInfo);
    }
    let filterAll = filterArray.join(' AND ');
    this.output = filterAll;
    return filterAll;
  }

  getQuery() {
    this.getQueryString();
    return this.output;
  }
}
