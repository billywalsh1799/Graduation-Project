import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordresetpopupComponent } from './passwordresetpopup.component';

describe('PasswordresetpopupComponent', () => {
  let component: PasswordresetpopupComponent;
  let fixture: ComponentFixture<PasswordresetpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordresetpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordresetpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
