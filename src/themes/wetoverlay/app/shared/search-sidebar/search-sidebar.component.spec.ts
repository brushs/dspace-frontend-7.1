import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SearchSidebarComponentX } from './search-sidebar.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SearchSidebarComponentX', () => {
  let comp: SearchSidebarComponentX;
  let fixture: ComponentFixture<SearchSidebarComponentX>;
  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgbCollapseModule],
      declarations: [SearchSidebarComponentX],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSidebarComponentX);

    comp = fixture.componentInstance;

  });

  describe('when the close sidebar button is clicked in mobile view', () => {

    beforeEach(() => {
      spyOn(comp.toggleSidebar, 'emit');
      const closeSidebarButton = fixture.debugElement.query(By.css('button.close-sidebar'));

      closeSidebarButton.triggerEventHandler('click', null);
    });

    it('should emit a toggleSidebar event', () => {
      expect(comp.toggleSidebar.emit).toHaveBeenCalled();
    });

  });
});
