// telegram.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private tg = (window as any).Telegram?.WebApp;

  constructor() {
    if (this.tg) {
      this.tg.ready();
    }
  }

  get initData(): string {
    return this.tg?.initData || '';
  }

  get user() {
    return this.tg?.initDataUnsafe?.user;
  }

  get userId(): string | null {
    return this.user?.id?.toString() || null;
  }
}