import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsTestComponent } from './charts-test.component';

describe('ChartsTestComponent', () => {
  let component: ChartsTestComponent;
  let fixture: ComponentFixture<ChartsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
