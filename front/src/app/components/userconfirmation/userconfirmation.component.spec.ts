import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserconfirmationComponent } from './userconfirmation.component';

describe('UserconfirmationComponent', () => {
  let component: UserconfirmationComponent;
  let fixture: ComponentFixture<UserconfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserconfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
