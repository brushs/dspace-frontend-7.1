import {Breadcrumb} from './breadcrumb.model';

/**
 * Class representing breadcrumb options
 */
export interface BreadcrumbOptions {
    
    /**
     * The optional addFederalScienceLibrariesNetworkBreadcrumb breadcrumb option value
     */
    // addFederalScienceLibrariesNetworkBreadcrumb?: boolean;

    /**
     * The optional omitHomeBreadcrumb breadcrumb option value
     */
    omitHomeBreadcrumb?: boolean;
    
    /**
     * The optional omitBreadcrumbElements breadcrumb option value
     */
    omitBreadcrumbElements?: Array<number>;

    /**
     * The optional omitBreadcrumbElements breadcrumb option value
     */
    addBreadcrumbElements?: Array<{breadcrumb: Breadcrumb, position: number}>;

}
  