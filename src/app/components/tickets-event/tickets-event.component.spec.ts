import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsEventComponent } from './tickets-event.component';

describe('TicketsEventComponent', () => {
  let component: TicketsEventComponent;
  let fixture: ComponentFixture<TicketsEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
