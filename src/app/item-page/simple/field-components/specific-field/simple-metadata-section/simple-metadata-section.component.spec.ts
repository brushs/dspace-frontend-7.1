import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMetadataSectionComponent } from './simple-metadata-section.component';

describe('SimpleMetadataSectionComponent', () => {
  let component: SimpleMetadataSectionComponent;
  let fixture: ComponentFixture<SimpleMetadataSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMetadataSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMetadataSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
