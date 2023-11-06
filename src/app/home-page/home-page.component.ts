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
  public collections = [];
  public frenchName = {};
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
    let baseHost = environment.rest.host;
    let port = environment.production ? '' : ':' + environment.rest.port;
    let prefix = environment.rest.ssl ? 'https://' : 'http://';
    this.frenchName = {'GEOSCAN':'GEOSCAN', 'Canadian Forest Service':'Service canadien des forêts'};

   this.http.get(`${ prefix  + baseHost + port + '/server'}/api/core/collections`).subscribe( (x) => {
      if (x['_embedded']?.['collections']) {
        const collections = x['_embedded']['collections'];
        collections.forEach((c) => {
          this.collections.push(c);
        });
      }
      const childLinkObservables: Observable<any>[] = [];
      this.cdr.detectChanges()
      //console.log(this.collections);
   })
  }

  search(value) {
    this.router.navigate(['/search'], { queryParams: { page: 1, query: value || '', 'spc.sf': 'score', 'spc.sd': 'DESC' } })
  }

  getCommunityHref(name): string {
    return !this.subcommunities[name] ? null: '/communities/' + this.subcommunities[name]
  }

}
