import { Component, HostListener } from '@angular/core';
import { HostWindowService } from '../../../../app/shared/host-window.service';
import { MenuService } from '../../../../app/shared/menu/menu.service';
import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-header',
  styleUrls: ['../../styles/wet-theme.scss'],
  // styleUrls: ['../../../../app/header/header.component.scss'],
  templateUrl: 'header.component.html',
  // templateUrl: '../../../../app/header/header.component.html',
})
export class HeaderComponent extends BaseComponent {
  menuItems: Array<{link: string, label: string}> = [
    {link: 'https://www.canada.ca/en/services/jobs.html', label: 'Jobs and the workplace'},
    {link: 'https://www.canada.ca/en/services/immigration-citizenship.html', label: 'Immigration and citizenship'},
    {link: 'https://travel.gc.ca/', label: 'Travel and tourism'},
    {link: 'https://www.canada.ca/en/services/business.html', label: 'Business and industry'},
    {link: 'https://www.canada.ca/en/services/environment.html', label: 'Environment and natural resources'},
    {link: 'https://www.canada.ca/en/services/benefits.html', label: 'Benefits'},
    {link: 'https://www.canada.ca/en/services/health.html', label: 'Health'},
    {link: 'https://www.canada.ca/en/services/taxes.html', label: 'Taxes'},
    {link: 'https://www.canada.ca/en/services/defence.html', label: 'National security and defence'},
    {link: 'https://www.canada.ca/en/services/culture.html', label: 'Culture, history and sport'},
    {link: 'https://www.canada.ca/en/services/policing.html', label: 'Policing, justice and emergencies'},
    {link: 'https://www.canada.ca/en/services/transport.html', label: 'Transport and infrastructure'},
    {link: 'https://international.gc.ca/world-monde/index.aspx?lang=eng', label: 'Canada and the world'},
    {link: 'https://www.canada.ca/en/services/finance.html', label: 'Money and finances'},
    {link: 'https://www.canada.ca/en/services/science.html', label: 'Science and innovation'},
  ]
  constructor(
    protected windowService: HostWindowService,
    menuService: MenuService
  ) {
    super(menuService);
  }
}
