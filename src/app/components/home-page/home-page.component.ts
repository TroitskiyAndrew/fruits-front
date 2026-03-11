import { Component, ElementRef, ViewChild } from '@angular/core';
import { InstagramReelsCarouselComponent } from "../instagram-reels-carousel/instagram-reels-carousel.component";
import { StateService } from '../../services/state.service';
import { EVENT_NAMES } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TelegrammService } from '../../services/telegramm.service';
import { MediaCarouselComponent, MediaItem } from "../media-carousel/media-carousel.component";
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, InstagramReelsCarouselComponent, MediaCarouselComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  @ViewChild('tour') targetBlock!: ElementRef;

  eventsNames = EVENT_NAMES;
  reels = [
    'https://www.instagram.com/reel/CqaGVL1JO5n/',
    'https://www.instagram.com/reel/CrjFZ-XrOrX/',
    'https://www.instagram.com/reel/Cuhat7ENbyq/',
    'https://www.instagram.com/reel/CsWgk6NNrNS/',
    'https://www.instagram.com/reel/Cyln9SUN6Ay',
    'https://www.instagram.com/reel/C2iJURyiGEY',
    'https://www.instagram.com/reel/C2nbgkqC-Sd',
    'https://www.instagram.com/reel/C5ky-ACvAnn',
    'https://www.instagram.com/reel/DAbuZSZicBj',
    'https://www.instagram.com/reel/DARC8faCK_o',
    'https://www.instagram.com/reel/DBJVmt0C8gy',
    'https://www.instagram.com/reel/DDWp2eYCyi5',
    'https://www.instagram.com/reel/DIdGDfIiEjC',
    'https://www.instagram.com/reel/DOym13rCC4I',
    'https://www.instagram.com/reel/DPw3vGViDTz',
    'https://www.instagram.com/reel/DRhtVmqCIGP',
    'https://www.instagram.com/reel/DKFiMa9iXsu',
    'https://www.instagram.com/reel/Cwvb8Z9NeJR',
    'https://www.instagram.com/reel/CyTyrWlNNOs',
  ];
  concertMedia: MediaItem[] = [
    { type: 'image', src: 'https://www.dropbox.com/scl/fi/p9rrxwmxjx2nupd1mglad/571013699_18100219999673867_311981241388369606_n.jpg?rlkey=cyqfwx1a0uvqlso31lcvwxz68&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/qmlm277a300eprixnu7yq/StorySaver.net-sverlovsk-Video-1771418125240.mp4?rlkey=kgkqif3i4a2sdjvdxacn2cvty&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/0agyqf2far45uuqtajccy/StorySaver.net-sverlovsk-Video-1771418168375.mp4?rlkey=jnur5n3jxlfoq0ldxuf5ouqzy&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/2q0rp1g2vs0crtakg1ybc/StorySaver.net-sverlovsk-Video-1771418174330.mp4?rlkey=mgx2292w2uu1e7i264m2rbdlc&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/16ic10djsk2e5zfzeygey/StorySaver.net-sverlovsk-Video-1771418188886.mp4?rlkey=8gdclif3w7ptchlrrwe0x10tm&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/2bo2n3i94jd93sk0oxkzu/StorySaver.net-sverlovsk-Video-1771418196174.mp4?rlkey=31a8vhaoisd0utm1hw9wmez58&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/o0835b57geythg0dohklf/StorySaver.net-sverlovsk-Video-1771418214537.mp4?rlkey=i2hnjbqj3zdgru2683db3a01w&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/jcwblm5897g1ebil0g3sz/StorySaver.net-sverlovsk-Video-1771418228994.mp4?rlkey=1bm0wqqskvu333xspdvaq84qw&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/vpj4bqollavwsj98f1bn5/StorySaver.net-sverlovsk-Video-1771418267354.mp4?rlkey=9ypewb5xppjyifrgmrhjpc235&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/g006h857e9aj971kl3hjn/StorySaver.net-sverlovsk-Video-1771418293668.mp4?rlkey=68wuaa89j7b3hqd7nynvzkcd3&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/n5c76lvz0wk018bwqkfny/StorySaver.net-sverlovsk-Video-1771418320304.mp4?rlkey=4bny5ys4ezlg1b3sxuqy7tsiw&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/oxk3dblhz6pmogl9lz6x0/StorySaver.net-sverlovsk-Video-1771418349347.mp4?rlkey=grg9hyf4ers1g048ugmsiwfsf&raw=1' },
      { type: 'image', src: 'https://www.dropbox.com/scl/fi/ogzx6r08zrqik5oqau1yy/563049786_18081679343491269_4983357276798840518_n.jpg?rlkey=hyzuq3ffkttquw3wdiiwpydee&raw=1' },
      { type: 'image', src: 'https://www.dropbox.com/scl/fi/2622zkxv7hja4mp74rqmh/483170708_18489431200028132_6263455324878847419_n.jpg?rlkey=3zhcfeotvxtl6wp1joc89hyvn&raw=1' },
      { type: 'image', src: 'https://www.dropbox.com/scl/fi/arryqzoz2ehp3frwyxn75/566244031_18057038474548646_4902948168267675274_n.jpg?rlkey=vx6shknx3h93fb2ez38pmgm41&raw=1' },
      { type: 'image', src: 'https://www.dropbox.com/scl/fi/d2wxwrb92nd3393gskkax/580683852_18060000170545617_3936766974794681335_n.jpg?rlkey=qhh0515ov840kgs2vrloptmtw&raw=1' },
    ];
    improvisationMedia: MediaItem[] = [
      { type: 'image', src: 'https://www.dropbox.com/scl/fi/fhjnfhhokd2o5jo4drps1/483223133_18489431182028132_2805891946828374716_n.jpg?rlkey=tahex78tojplff40lcezxltlq&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/8gwzozi2yyqaqitlxdaq5/_2.mp4?rlkey=d23xo5plmq0capbtywotdaj5x&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/lph4x4k0h97v6zfihm934/_1.mp4?rlkey=sd86reh8ptndwjud5xtydjlll&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/fe8prueo7c6al4oqmsr71/_3.mp4?rlkey=4d1lygqhrg4bm8kyhp1pa2wjg&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/m34b6y0w2g9fnc1wec4b2/_5.mp4?rlkey=sv4hoz0gshkt1nfn9sxqfoau5&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/nh2rqi6ma7sjc8yc2jrmi/_6.mp4?rlkey=uk4r5hx9b5hn1l6wu1cvbkke1&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/fb015bafmad2heqqagtx5/_7.mp4?rlkey=1vosqx4cs8pylgqaum6wuw0y5&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/tbye5uv3jxx840ai6lpay/_8.mp4?rlkey=a3o418vkez3ot1lenss65vaab&raw=1' },
      { type: 'video', src: 'https://www.dropbox.com/scl/fi/t1ma91yb8aun7epsbsgwd/_4.mp4?rlkey=01hsgsk2in02wea5v07j16vvm&raw=1' },
    ];

  fromBot = false;

  private observer!: IntersectionObserver;
  private triggered = false;

  constructor(public stateService: StateService, private router: Router, private telegrammService: TelegrammService, private apiService: ApiService) { }

  ngOnInit() {
    if (this.telegrammService.initData) {
      this.fromBot = true;
    }
  }

    ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.triggered) {
          this.triggered = true;
          this.apiService.savePath('look at tour')
          this.observer.disconnect(); // отключаем после первого срабатывания
        }
      });
    }, {
      threshold: 0.3 // сколько % блока должно быть видно
    });

    this.observer.observe(this.targetBlock.nativeElement);
  }



  scrollTo(where: string) {
    const element = document.getElementById(where);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  openEvent(event: any) {
    if (this.telegrammService.initData || !environment.production) {
      this.router.navigate(['/event', event.id]);
    } else {
      window.open(`https://t.me/sverlov_vietnam_2026_bot?startapp=SESSION_SPLIT_${this.stateService.sessionId}_SEP_EVENT_SPLIT_${event.id}`, '_blank');
    }
  }
  openMyTickets() {
    this.router.navigate(['/my-tickets']);
  }
}
