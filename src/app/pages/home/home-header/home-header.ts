import {Component, OnDestroy, OnInit, ChangeDetectorRef, inject} from '@angular/core';
import { AvatarService } from '../../../core/services/avatar.service';
import { Subject, takeUntil } from 'rxjs';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-home-header',
  standalone: true,
  styleUrls: ['./home-header.scss'],
  templateUrl: './home-header.html',
  imports: []
})
export class HomeHeader implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  public userAvatars: string[] = [];
  public currentAvatar: string = "";
  private destroy$ = new Subject<void>();

  private avatarService = inject(AvatarService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  ngOnInit() {
    this.loadUserAvatars();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserAvatars() {
    this.isLoading = true;
    this.avatarService.findByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (avatar) => {
          if (avatar?.imagesURL?.length) {
            this.userAvatars = avatar.imagesURL;
            this.currentAvatar = avatar.imagesURL[0];
          } else {
            this.userAvatars = [];
            this.currentAvatar = '';
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.toast.show('Ошибка загрузки Аватара', 'error');
        }
      });
  }
}
