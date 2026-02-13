import { Component, OnDestroy, OnInit } from '@angular/core';
import { AvatarService } from '../../../core/services/avatar.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home-header',
  standalone: true,
  styleUrls: ['./home-header.scss'],
  templateUrl: './home-header.html',
})
export class HomeHeader implements OnInit, OnDestroy {

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  isLoading: boolean = false;
  userAvatars: string[] = [];
  currentAvatar: string = "";
  private destroy$ = new Subject<void>();

  constructor(private avatarService: AvatarService) {}

  ngOnInit() {
    this.loadUserAvatars();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserAvatars() {
    this.isLoading = true;

    this.avatarService.findByUser(this.UUID)
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
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }
}
