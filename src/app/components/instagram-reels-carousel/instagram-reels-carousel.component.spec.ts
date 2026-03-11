import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramReelsCarouselComponent } from './instagram-reels-carousel.component';

describe('InstagramReelsCarouselComponent', () => {
  let component: InstagramReelsCarouselComponent;
  let fixture: ComponentFixture<InstagramReelsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstagramReelsCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstagramReelsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
