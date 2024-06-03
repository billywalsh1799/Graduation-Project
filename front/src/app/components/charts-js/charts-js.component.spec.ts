import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsJsComponent } from './charts-js.component';

describe('ChartsJsComponent', () => {
  let component: ChartsJsComponent;
  let fixture: ComponentFixture<ChartsJsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsJsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartsJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
