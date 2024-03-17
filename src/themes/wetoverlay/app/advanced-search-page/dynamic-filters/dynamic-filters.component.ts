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
      relationalOperator: ['equals'],
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
  }

  printFormValues() {
    var filterAll = this.getQueryString();
    console.log(filterAll);
    //console.log(this.filteredData);
  }

  private getQueryString() {
    const filters = this.rows.controls.map(row => row.value);
    let filterArray: any = [];
    var filterInfo = '';
    for (const filter of filters) {
      switch (filter.relationalOperator) {
        case 'contains':
          if (filter.filtertype === 'nrcan.nts') {
            //make the contains the same as equals for nts
            filterInfo = `${filter.filtertype}:${filter.filter}`;
          }
          else {
            filterInfo = `${filter.filtertype}:*${filter.filter}*`;
          }
          break;
        case 'equals':
          filterInfo = `${filter.filtertype}:${filter.filter}`;
          break;
        case 'notcontains':
          filterInfo = `-${filter.filtertype}:*${filter.filter}*`;
          break;
        case 'notequals':
          filterInfo = `-${filter.filtertype}:${filter.filter}`;
          break;
        default:
          filterInfo = `*:*`;
          break;
        //const filterInfo = `${filter.filtertype}_${filter.relationalOperator}_${filter.filter}`;
        //filterInfoAll += filterInfo + '&&';
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
