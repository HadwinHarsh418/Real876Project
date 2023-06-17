import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrproductdetailsComponent } from './qrproductdetails.component';

describe('QrproductdetailsComponent', () => {
  let component: QrproductdetailsComponent;
  let fixture: ComponentFixture<QrproductdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrproductdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrproductdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
