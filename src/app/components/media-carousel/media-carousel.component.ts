import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MediaItem {
  type: 'image' | 'video';
  src: string;
}

@Component({
  selector: 'app-media-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-carousel.component.html',
  styleUrl: './media-carousel.component.scss'
})
export class MediaCarouselComponent implements AfterViewInit {

  @Input({ required: true }) items: MediaItem[] = [];

  @ViewChild('carousel', { static: true })
  carousel!: ElementRef<HTMLDivElement>;

  @ViewChildren('mediaItem')
  mediaItems!: QueryList<ElementRef<HTMLDivElement>>;

  @ViewChildren('videoEl')
  videos!: QueryList<ElementRef<HTMLVideoElement>>;

  private observer!: IntersectionObserver;
  private userControlledVideos = new Set<HTMLVideoElement>();

  ngAfterViewInit(): void {
    this.initObserver();

    setTimeout(() => {
      this.checkInitiallyVisible();
    });
  }

  // ========================
  // Scroll
  // ========================

  private getItemWidth(): number {
    return this.mediaItems.first?.nativeElement.offsetWidth ?? 0;
  }

  scrollLeft(): void {
    const width = this.getItemWidth();
    this.carousel.nativeElement.scrollBy({
      left: -(width + 20),
      behavior: 'smooth'
    });
  }

  scrollRight(): void {
    const width = this.getItemWidth();
    this.carousel.nativeElement.scrollBy({
      left: width + 20,
      behavior: 'smooth'
    });
  }

  // ========================
  // Autoplay
  // ========================

  private initObserver(): void {

    this.observer = new IntersectionObserver(
      (entries) => {

        entries.forEach(entry => {

          const container = entry.target as HTMLDivElement;
          const video = container.querySelector('video') as HTMLVideoElement | null;

          if (!video) return;

          const isVisible =
            entry.isIntersecting && entry.intersectionRatio >= 0.6;

          const isUserControlled =
            this.userControlledVideos.has(video);

          if (isVisible) {
            if (!isUserControlled) {
              this.pauseAll();
              video.play().catch(() => {});
            }
          } else {
            if (!isUserControlled) {
              video.pause();
            }
          }

        });

      },
      {
        root: this.carousel.nativeElement,
        threshold: [0.6]
      }
    );

    this.mediaItems.forEach(item =>
      this.observer.observe(item.nativeElement)
    );
  }

  private checkInitiallyVisible(): void {

    const root = this.carousel.nativeElement;
    const rootRect = root.getBoundingClientRect();

    this.mediaItems.forEach(itemRef => {

      const el = itemRef.nativeElement;
      const rect = el.getBoundingClientRect();

      const visibleWidth =
        Math.min(rect.right, rootRect.right) -
        Math.max(rect.left, rootRect.left);

      const visibilityRatio = visibleWidth / rect.width;

      if (visibilityRatio >= 0.6) {
        const video = el.querySelector('video') as HTMLVideoElement | null;
        if (video) {
          this.pauseAll();
          video.play().catch(() => {});
        }
      }
    });
  }

  private pauseAll(): void {
    this.videos.forEach(v => v.nativeElement.pause());
  }

  // ========================
  // Manual tap
  // ========================

  onContainerClick(container: HTMLDivElement): void {

    const video = container.querySelector('video') as HTMLVideoElement | null;
    if (!video) return;

    this.userControlledVideos.add(video);

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}
