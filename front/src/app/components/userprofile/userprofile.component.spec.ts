import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprofiletwoComponent } from './userprofile.component';

describe('UserprofiletwoComponent', () => {
  let component: UserprofiletwoComponent;
  let fixture: ComponentFixture<UserprofiletwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserprofiletwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserprofiletwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
