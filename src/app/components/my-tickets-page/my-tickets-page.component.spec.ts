import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTicketsPageComponent } from './my-tickets-page.component';

describe('MyTicketsPageComponent', () => {
  let component: MyTicketsPageComponent;
  let fixture: ComponentFixture<MyTicketsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTicketsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTicketsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
