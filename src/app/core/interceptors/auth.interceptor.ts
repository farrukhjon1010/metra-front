import { HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { inject } from '@angular/core';
import { TelegramService } from '../services/telegram.service'; 

export function prependBaseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const telegramService = inject(TelegramService);
  const initData = telegramService.initData;
  let url = req.url;

  if (!/^https?:\/\//i.test(url)) {
    const base = environment.apiUrl.replace(/\/$/, '');
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    url = base + url;
    req = req.clone({ url });
  }

  const headers: { [name: string]: string } = {};

  if (initData) {
    headers['x-telegram-init-data'] = initData;
  }

  try {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('LocalStorage error', e);
  }

  req = req.clone({ setHeaders: headers });

  return next(req);
}