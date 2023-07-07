import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

  site$: Observable<Site>;
  subcommunities = {}; 
  temporaryCommunityHrefsForProductionBug = { 
    'Agriculture and Agri-Food Canada': '/communities/00a6222f-4761-4167-81e1-44007f19557f',
    'Canadian Food Inspection Agency': '/communities/307d8eca-9337-48d3-a296-6ea96f5a75c5',
    'Canadian Space Agency': '/communities/9dbd2e32-3f4c-459b-817a-8837505aeaca',
    'Environment and Climate Change Canada': '/communities/55c80426-b231-433d-8354-5369caf925c3',
    'Fisheries and Oceans Canada': '/communities/425ddb4a-2ffc-4108-957f-ac70e9207e57',
    'Health Canada': '/communities/456a6d96-ca50-4ac2-a15c-03dfbf951b30',
    'Public Health Agency of Canada': '/communities/3b4da5fb-1231-4cae-bdca-afbb136bf9b6',
    'Transport Canada': '/communities/41c0de91-fb07-4227-b958-f36a99323651',
  };
  temporaryProductionUrls = ["science-ouverte.canada.ca", "open-science.canada.ca"];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
    this.http.get(`${environment.rest.baseUrl}/api/core/communities/search/top?page=0&size=20&sort=dc.title,ASC&embed.size=subcommunities=10&embed=subcommunities`).subscribe(x => {
      if (x['_embedded']?.['communities']) {
        let scienceCommunity = x['_embedded']['communities'].find(y => y.name.includes('GC Science'))?.['_embedded']?.['subcommunities']
        console.log(scienceCommunity?.['_embedded']?.['subcommunities'])
        if (scienceCommunity?.['_embedded']?.['subcommunities']) {
          this.subcommunities = scienceCommunity?.['_embedded']?.['subcommunities'].reduce((prev, curr) => {
            prev[curr.name] = curr.id;
            return prev;
          }, {})
          this.cdr.detectChanges()
        }
      }
    })
  }

  search(value) {
    this.router.navigate(['/search'], { queryParams: { page: 1, query: value || '', 'spc.sf': 'score', 'spc.sd': 'DESC' } })
  }

  getCommunityHref(name): string {
    // if the base url is in the temporaryProductionUrls, use the temporaryCommunityHrefsForProductionBug
    if (this.temporaryProductionUrls.some(url => document.location.href.includes(url))) {
      return this.temporaryCommunityHrefsForProductionBug[name]
    }
    // otherwise, use api to get the href
    return !this.subcommunities[name] ? null: '/communities/' + this.subcommunities[name]
  }

}
