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


  addRow(value?: { filtertype?: string; relationalOperator?: string; filter?: string }) {
    const newRow = this.fb.group({
      filtertype: [value?.filtertype ?? 'alltitles'],
      relationalOperator: [value?.relationalOperator ?? 'contains'],
      filter: [value?.filter ?? ''],
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

  serializeRows(): string {
    const rows = this.rows.controls.map((row) => row.value);
    const hasFilters = rows.some((row) => row.filter && row.filter.trim() !== '');
    if (!hasFilters) {
      return '';
    }
    return JSON.stringify(rows);
  }

  setRowsFromSerialized(serialized: string): boolean {
    if (!serialized) {
      return false;
    }
    let parsed: Array<{ filtertype?: string; relationalOperator?: string; filter?: string }>;
    try {
      parsed = JSON.parse(serialized);
    } catch (error) {
      return false;
    }
    if (!Array.isArray(parsed)) {
      return false;
    }
    this.setRows(parsed);
    return true;
  }

  private setRows(values: Array<{ filtertype?: string; relationalOperator?: string; filter?: string }>) {
    while (this.rows.length > 0) {
      this.rows.removeAt(0);
    }
    if (!values || values.length === 0) {
      this.addRow();
      return;
    }
    values.forEach((value) => this.addRow(value));
  }


  resetQuery() {
    //this.form.reset();
    //this.filteredData = this.mockData;
    for (let i = this.rows.length - 1; i > 0; i--) {
      this.rows.removeAt(i);
    }
    this.rows.controls[0].get('filter').setValue('');
    this.router.navigate(['/advanced-search'], {
      queryParams: { af: null, query: null, fq: null, expand: null },
      queryParamsHandling: 'merge',
    });
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

  private escapeSolrValue(value: string): string {
    return value.replace(/[+\-!(){}[\]^"~*?:\\/]/g, '\\$&');
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
      switch (filter.relationalOperator) {
        case 'contains':
        case 'equals': {
          var filterText = trimmedFilter;
          filterText = filterText.replace(/"/g, '');
          filterText = this.escapeSolrValue(filterText);
          filterInfo = this.transformEqualFilterInfo(filter.filtertype, filterText);
          break;
        }
        case 'notcontains':
        case 'notequals': {
          var filterText = trimmedFilter;
          filterText = filterText.replace(/"/g, '');
          filterText = this.escapeSolrValue(filterText);
          const inner = this.transformEqualFilterInfo(filter.filtertype, filterText);
          filterInfo = `-(${inner})`;
          break;
        }
        default:
          continue;
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
