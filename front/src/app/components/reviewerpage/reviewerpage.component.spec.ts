import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerpageComponent } from './reviewerpage.component';

describe('ReviewerpageComponent', () => {
  let component: ReviewerpageComponent;
  let fixture: ComponentFixture<ReviewerpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
