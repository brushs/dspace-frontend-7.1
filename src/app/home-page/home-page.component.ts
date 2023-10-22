import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ScienceCommunityService } from '../core/science/science-community.service';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

  site$: Observable<Site>;
  subcommunities = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private scienceCommunityService: ScienceCommunityService,
  ) {
    if (this.translate.currentLang === 'en' && this.router.url.includes('accueil')) {
      this.router.navigate(['/home'])
    } else if (this.translate.currentLang === 'fr' && this.router.url.includes('home')) {
      this.router.navigate(['/accueil'])
    }
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
    let baseHost = environment.production ? document.location.host : environment.rest.host;
    let port = environment.production ? '' : ':' + environment.rest.port;
    let prefix = environment.rest.ssl ? 'https://' : 'http://';

    this.http.get(`${ prefix  + baseHost + port + '/server'}/api/core/communities/search/top?page=0&size=20&sort=dc.title,ASC&embed.size=subcommunities=10&embed=subcommunities`).subscribe(x => {
      if (x['_embedded']?.['communities']) {

        //const parentScienceCommunity = x['_embedded']['communities'].find(y => y.name.includes('GC Science'));
        const parentScienceCommunity = x['_embedded']['communities'];
        if (parentScienceCommunity) {
          // saving the science id to retrive only science community in community page
          this.scienceCommunityService.setScienceId(parentScienceCommunity?.id);
        }

        //let scienceCommunity = x['_embedded']['communities'].find(y => y.name.includes('GC Science'))?.['_embedded']?.['subcommunities']
        let scienceCommunity = x['_embedded']['communities'];
        //if (scienceCommunity?.['_embedded']?.['subcommunities']) {
        if (scienceCommunity) {
          //this.subcommunities = scienceCommunity?.['_embedded']?.['subcommunities'].reduce((prev, curr) => {
          this.subcommunities = scienceCommunity?.reduce((prev, curr) => {
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
    return !this.subcommunities[name] ? null: '/communities/' + this.subcommunities[name]
  }

}
