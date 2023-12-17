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
      relationalOperator: ['contains'],
      filter: [''],
    });
    this.rows.push(newRow);
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }


  filterData(filters: any[]): any[] {
    const operatorMappings: any = {
      contains: (value:string, filter:string) => value.includes(filter),
      equals: (value:string, filter:string) => value === filter,
      authority: (value:string, filter:string) => value === filter,
      notcontains: (value:string, filter:string) => !value.includes(filter),
      notequals: (value:string, filter:string) => value !== filter,
      notauthority: (value:string, filter:string) => value !== filter,
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
    this.form.reset();
    this.filteredData = this.mockData;
  }

  printFormValues() {
    const filters = this.rows.controls.map(row => row.value);
    let filterArray:any = [];
    var filterInfo = '';
    for (const filter of filters) {
      console.log("start of for" + filterInfo);
      console.log(`${filter.filtertype}:${filter.relationalOperator}:${filter.filter}`)
      switch (filter.relationalOperator) {
        case 'contains':
          filterInfo = `${filter.filtertype}:*${filter.filter}*`;
          break;
        case 'equals':
          filterInfo = `${filter.filtertype}:${filter.filter}`;
          break;
        case 'authority':
          filterInfo = `${filter.filtertype}:${filter.filter}`;
          break;
        case 'notcontains':
          filterInfo = `${filter.filtertype}:!*${filter.filter}*`;
          break;
        case 'notequal':
          filterInfo = `${filter.filtertype}:!${filter.filter}`;
          break;
        case
        'notauthority':
          filterInfo = `${filter.filtertype}:!${filter.filter}`;
          break;
      //const filterInfo = `${filter.filtertype}_${filter.relationalOperator}_${filter.filter}`;
      //filterInfoAll += filterInfo + '&&';
      }
      filterArray.push(filterInfo);
      console.log("end of for" + filterInfo);
    }
    let filterAll = filterArray.join('&&')
    console.log(filterAll);
    this.filteredData = this.filterData(filters);
    this.output = filterAll;
  }
}
