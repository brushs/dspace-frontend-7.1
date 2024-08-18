import { Component } from '@angular/core';
import { ItemComponent } from '../../../../item-page/simple/item-types/shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Title } from '@angular/platform-browser';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LocaleService } from '../../../../core/locale/locale.service';
import { RouteService } from '../../../../core/services/route.service';
import { Router } from '@angular/router';

@listableObjectComponent('Person', ViewMode.StandalonePage)
@Component({
  selector: 'ds-person',
  styleUrls: ['./person.component.scss'],
  templateUrl: './person.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Person
 */
export class PersonComponent extends ItemComponent {
    constructor(private titleService: Title,
      protected dsoNameService: DSONameService,
      protected localeService: LocaleService,
      protected routeService: RouteService,
      protected router: Router) {
        super(dsoNameService, localeService, routeService, router);
  }

  ngOnInit(): void {
    const lastName = this.object.firstMetadataValue('person.familyName');
    const firstName = this.object.firstMetadataValue('person.givenName');
    const fullName = `${firstName} ${lastName}`;
    //set title of the page to the full name of the person
    this.titleService.setTitle(fullName);
    super.ngOnInit();
  }
}
