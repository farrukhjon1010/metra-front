import {HttpEvent, HttpRequest, HttpHandlerFn} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environment/environment';

export function prependBaseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  let url = req.url;

  if (!/^https?:\/\//i.test(url)) {
    const base = environment.apiUrl.replace(/\/$/, '');
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    url = base + url;
    req = req.clone({url});
  }

  try {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    }
  } catch (e) {

  }
  return next(req);
}
