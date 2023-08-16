import { Component, OnDestroy, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { CommunityListService, FlatNode } from '../community-list-service';
import { CommunityListDatasource } from '../community-list-datasource';
import { FlatTreeControl } from '@angular/cdk/tree';
import { isEmpty } from '../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MetadataTranslatePipe } from 'src/app/shared/utils/metadata-translate.pipe';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';
import { LocaleService } from 'src/app/core/locale/locale.service';

/**
 * A tree-structured list of nodes representing the communities, their subCommunities and collections.
 * Initially only the page-restricted top communities are shown.
 * Each node can be expanded to show its children and all children are also page-limited.
 * More pages of a page-limited result can be shown by pressing a show more node/link.
 * Which nodes were expanded is kept in the store, so this persists across pages.
 */
@Component({
  selector: 'ds-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit, OnDestroy {

  private expandedNodes: FlatNode[] = [];
  public loadingNode: FlatNode;

  treeControl = new FlatTreeControl<FlatNode>(
    (node: FlatNode) => node.level, (node: FlatNode) => true
  );

  dataSource: CommunityListDatasource;

  paginationConfig: FindListOptions;

  constructor(private communityListService: CommunityListService,
    private translate: TranslateService,
    private router: Router,
    private dsoNameService: DSONameService,
    private localeService: LocaleService
  ) {
    if (this.translate.currentLang === 'en' && this.router.url.includes('liste-des-communautes')) {
      this.router.navigate(['/community-list'])
    } else if (this.translate.currentLang === 'fr' && this.router.url.includes('community-list')) {
      this.router.navigate(['/liste-des-communautes'])
    }
    this.paginationConfig = new FindListOptions();
    this.paginationConfig.elementsPerPage = 2;
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.sort = new SortOptions('dc.title', SortDirection.ASC);
  }

  ngOnInit() {
    this.dataSource = new CommunityListDatasource(this.communityListService);
    this.communityListService.getLoadingNodeFromStore().pipe(take(1)).subscribe((result) => {
      this.loadingNode = result;
    });
    this.communityListService.getExpandedNodesFromStore().pipe(take(1)).subscribe((result) => {
      this.expandedNodes = [...result];
      this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
    });
  }

  ngOnDestroy(): void {
    this.communityListService.saveCommunityListStateToStore(this.expandedNodes, this.loadingNode);
  }

  // whether or not this node has children (subcommunities or collections)
  hasChild(_: number, node: FlatNode) {
    return node.isExpandable$;
  }

  // whether or not it is a show more node (contains no data, but is indication that there are more topcoms, subcoms or collections
  isShowMore(_: number, node: FlatNode) {
    return node.isShowMoreNode;
  }

  /**
   * Toggles the expanded variable of a node, adds it to the expanded nodes list and reloads the tree so this node is expanded
   * @param node  Node we want to expand
   */
  toggleExpanded(node: FlatNode) {
    this.loadingNode = node;
    //console.log(node)
    if (node.isExpanded) {
      this.expandedNodes = this.expandedNodes.filter((node2) => node2.name !== node.name);
      node.isExpanded = false;
    } else {
      this.expandedNodes.push(node);
      node.isExpanded = true;
      if (isEmpty(node.currentCollectionPage)) {
        node.currentCollectionPage = 1;
      }
      if (isEmpty(node.currentCommunityPage)) {
        node.currentCommunityPage = 1;
      }
    }
    this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);

    // OSPR change start
    setTimeout(() => {document.getElementById("parent-node-" + node.id).focus();}, 1000);
    // OSPR change end
  }

  /**
   * Makes sure the next page of a node is added to the tree (top community, sub community of collection)
   *      > Finds its parent (if not top community) and increases its corresponding collection/subcommunity currentPage
   *      > Reloads tree with new page added to corresponding top community lis, sub community list or collection list
   * @param node  The show more node indicating whether it's an increase in top communities, sub communities or collections
   */
  getNextPage(node: FlatNode): void {
    this.loadingNode = node;
    if (node.parent != null) {
      if (node.id === 'collection') {
        const parentNodeInExpandedNodes = this.expandedNodes.find((node2: FlatNode) => node.parent.id === node2.id);
        parentNodeInExpandedNodes.currentCollectionPage++;
      }
      if (node.id === 'community') {
        const parentNodeInExpandedNodes = this.expandedNodes.find((node2: FlatNode) => node.parent.id === node2.id);
        parentNodeInExpandedNodes.currentCommunityPage++;
      }
      this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
    } else {
      this.paginationConfig.currentPage++;
      this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
    }
  }

  expandAllNodes() {
    this.expandedNodes = [];
    const nodesToExpand = this.dataSource.communityList$.getValue();
    nodesToExpand.forEach((node) => {
      this.expandedNodes.push(node);
      node.isExpanded = true;
      if (isEmpty(node.currentCollectionPage)) {
        node.currentCollectionPage = 1;
      }
      if (isEmpty(node.currentCommunityPage)) {
        node.currentCommunityPage = 1;
      }
    });
    this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
  }

  collapseAllNodes() {
    const nodesToCollapse = this.dataSource.communityList$.getValue();
    this.expandedNodes = [];
    nodesToCollapse.forEach((node) => {
      node.isExpanded = null;
    });
    this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);

    setTimeout(() => {
      const nodesOpen = this.dataSource.communityList$.getValue();
      nodesOpen.forEach((node) => {
        const element = (document.getElementById(`detail-parent-node-${node.id}`)) as HTMLElement;
        if (element) {
          element.removeAttribute('open');
        }
      });
    },0)
  }

  translateMetadata(keys: string | string[], dso: any) {
    const pipe = new MetadataTranslatePipe(this.dsoNameService, this.localeService);
    return pipe.transform(keys, dso);
  }

  getTranslatedValue(payload: any): any {
    return this.translateMetadata(['dc.title', 'dc.title.fosrctranslation'], payload)[0];
  }

  getLanguageAttribute(payload: any): string | undefined {
    const translatedTitle = this.getTranslatedValue(payload);
    const language = translatedTitle?.language;
    return language !== null && language !== undefined && language !== '' ? language : undefined;
  }

  isValidData(payload: any): boolean {
    const translatedTitle = this.getTranslatedValue(payload);
    const value = translatedTitle?.value;
    return value !== null && value !== undefined && value !== '';
  }

}
