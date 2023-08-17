import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSimpleMetadataSectionComponent } from './generic-simple-metadata-section.component';

describe('GenericSimpleMetadataSectionComponent', () => {
  let component: GenericSimpleMetadataSectionComponent;
  let fixture: ComponentFixture<GenericSimpleMetadataSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericSimpleMetadataSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericSimpleMetadataSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
