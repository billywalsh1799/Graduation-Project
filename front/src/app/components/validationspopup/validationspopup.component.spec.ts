import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationspopupComponent } from './validationspopup.component';

describe('ValidationspopupComponent', () => {
  let component: ValidationspopupComponent;
  let fixture: ComponentFixture<ValidationspopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationspopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
