import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { AvatarService } from '../../../core/services/avatar.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-home-header',
  standalone: true,
  styleUrls: ['./home-header.scss'],
  templateUrl: './home-header.html',
  imports: []
})
export class HomeHeader implements OnInit, OnDestroy {

  public isLoading = signal<boolean>(false);
  public userAvatars = signal<string[]>([]);
  public currentAvatar = signal<string>('');

  private destroy$ = new Subject<void>();
  private avatarService = inject(AvatarService);
  private toast = inject(ToastService);

  ngOnInit() {
    this.loadUserAvatars();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserAvatars() {
    this.isLoading.set(true);
    this.avatarService.findByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (avatar) => {
          if (avatar?.imagesURL?.length) {
            this.userAvatars.set(avatar.imagesURL);
            this.currentAvatar.set(avatar.imagesURL[0]);
          } else {
            this.userAvatars.set([]);
            this.currentAvatar.set('');
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.toast.show('Ошибка загрузки Аватара', 'error');
        }
      });
  }
}
