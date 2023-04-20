import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTipsPageComponent } from './search-tips-page.component';

describe('SearchTipsPageComponent', () => {
  let component: SearchTipsPageComponent;
  let fixture: ComponentFixture<SearchTipsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchTipsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTipsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
