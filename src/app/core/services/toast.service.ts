import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: ToastType = 'success', duration = 1500) {
    const id = this.counter++;

    this.toasts.update(t => [...t, { id, message, type }]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }

  clearAll() {
    this.toasts.set([]);
  }
}
