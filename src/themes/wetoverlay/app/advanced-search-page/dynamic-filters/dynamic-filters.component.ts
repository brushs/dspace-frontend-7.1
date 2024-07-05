import {
  Component
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray
} from '@angular/forms';

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
  mockData: any[] = [];
  filteredData: any[] = [];
  output: any = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });

    this.addRow();
  }


  addRow() {
    const newRow = this.fb.group({
      filtertype: ['title'],
      relationalOperator: [''],
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


  filterData(filters: any[]): any[] {
    const operatorMappings: any = {
      contains: (value:string, filter:string) => value.includes(filter),
      equals: (value:string, filter:string) => value === filter,
      notcontains: (value:string, filter:string) => !value.includes(filter),
      notequals: (value:string, filter:string) => value !== filter,
    };

    return this.mockData.filter(item => {
      return filters.every(filter => {
        const operatorFunction = operatorMappings[filter.relationalOperator];
        if (!operatorFunction) {
          return true;
        }

        const value = item[filter.filtertype];
        const result = operatorFunction(value, filter.filter);
        return result;
      });
    });
  }

  resetFilters() {
    //this.form.reset();
    //this.filteredData = this.mockData;
    for (let i = this.rows.length - 1; i > 0; i--) {
      this.rows.removeAt(i);
    }
    this.rows.controls[0].get('filter').setValue('');
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
    else
      filterInfo = `${filtertype}:"${filterText}"`;

    return filterInfo;
  }

  private getQueryString() {
    const filters = this.rows.controls.map(row => row.value);
    let filterArray: any = [];
    var filterInfo = '';
    for (const filter of filters) {
      if (filter.filter === '') {
        continue;
      }
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
    this.filteredData = this.filterData(filters);
    let filterAll = filterArray.join(' AND ');
    this.output = filterAll;
    return filterAll;
  }

  getQuery() {
    this.getQueryString();
    return this.output;
  }
}
