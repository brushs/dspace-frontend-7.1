import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComcolSearchFilterComponent } from './comcol-search-filter.component';

describe('ComcolSearchFilterComponent', () => {
  let component: ComcolSearchFilterComponent;
  let fixture: ComponentFixture<ComcolSearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComcolSearchFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComcolSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
