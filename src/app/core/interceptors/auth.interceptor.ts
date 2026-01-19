import { HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

// Functional interceptor compatible with provideHttpClient(withInterceptors([...]))
export function prependBaseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  let url = req.url;

  // If URL already absolute (has protocol), leave unchanged
  if (!/^https?:\/\//i.test(url)) {
    // Ensure there's exactly one slash between base and path
    const base = environment.apiUrl.replace(/\/$/, '');
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    url = base + url;
    req = req.clone({ url });
  }

  // Optionally add Authorization header if token is present
  try {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
  } catch (e) {
    // access to localStorage might fail in some environments — ignore silently
  }

  // For functional interceptors, `next` is a function (HttpHandlerFn)
  return next(req);
}
