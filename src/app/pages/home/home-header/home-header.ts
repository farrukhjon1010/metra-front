import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AvatarService } from '../../../core/services/avatar.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home-header',
  standalone: true,
  styleUrls: ['./home-header.scss'],
  templateUrl: './home-header.html',
  imports: []
})
export class HomeHeader implements OnInit, OnDestroy {

  isLoading: boolean = false;
  userAvatars: string[] = [];
  currentAvatar: string = "";
  private destroy$ = new Subject<void>();

  constructor(
    private avatarService: AvatarService,
    private cdr: ChangeDetectorRef
  ) {}

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
        }
      });
  }
}
