import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacingOrderPageComponent } from './placing-order-page.component';

describe('PlacingOrderPageComponent', () => {
  let component: PlacingOrderPageComponent;
  let fixture: ComponentFixture<PlacingOrderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacingOrderPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacingOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
