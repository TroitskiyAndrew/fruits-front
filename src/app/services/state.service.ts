import { computed, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { TelegrammService } from './telegramm.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  cities = signal<any[]>([]);

  discountEvent = '';
  source = '';
  target = '';

  sessionId = this.generateSecureId();

  user = signal<any>({userId: 480144364, pressedStart: true});
  isStartPressed = computed(() => this.user().pressedStart);
  isAdmin = computed(() => this.user().admin || false);

  constructor(private apiService: ApiService, private telegrammService: TelegrammService) { }



  async init() {
    if (this.telegrammService.initData) {
      const user = await this.apiService.getUser(this.telegrammService.user?.id || 0);
      this.user.set(user || {});
    }


  }
  generateSecureId(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    return Array.from(array)
      .map(x => chars[x % chars.length])
      .join('');
  }
}
