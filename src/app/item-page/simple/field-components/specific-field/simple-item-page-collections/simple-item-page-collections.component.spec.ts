import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleItemPageCollectionsComponent } from './simple-item-page-collections.component';

describe('SimpleItemPageCollectionsComponent', () => {
  let component: SimpleItemPageCollectionsComponent;
  let fixture: ComponentFixture<SimpleItemPageCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleItemPageCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleItemPageCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
