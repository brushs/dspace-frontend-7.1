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
}
