import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedAvatarService {
  public currentAvatar = signal<string>(''); // выбранный аватар

  setAvatar(avatar: string) {
    this.currentAvatar.set(avatar);
  }
}
