import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfviewertestComponent } from './pdfviewertest.component';

describe('PdfviewertestComponent', () => {
  let component: PdfviewertestComponent;
  let fixture: ComponentFixture<PdfviewertestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfviewertestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfviewertestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
