export type FilterItem = "title" | "author" | "subject" | "dateIssued" | "";
export type FilterOperator = "contains" | "equals" | "";

export class SearchFilter {
    public filterItem: FilterItem;
    public filterOperator: FilterOperator;
    public filterItemInfo: string;
  
    constructor(filterItem: FilterItem, filterOperator: FilterOperator, filterItemInfo: string) {
      this.filterItem = filterItem;
      this.filterOperator = filterOperator;
      this.filterItemInfo = filterItemInfo;
    }
  }
  