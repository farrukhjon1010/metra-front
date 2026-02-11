import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AvatarService} from '../../../core/services/avatar.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [],
  styleUrls: ['./home-header.scss'],
  templateUrl: './home-header.html',
})
export class HomeHeader implements OnInit, OnDestroy {

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  isLoading: boolean = false;
  userAvatars: string[] = [];
  currentAvatar: string = "";
  private destroy$ = new Subject<void>();

  constructor(
    private avatarService: AvatarService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUserAvatars();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserAvatars() {
    const userId = this.UUID;
    this.isLoading = true;

    this.avatarService.findByUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (avatar) => {
          if (avatar && avatar.imagesURL) {
            this.userAvatars = [...avatar.imagesURL];
            this.currentAvatar = this.userAvatars[0];
          } else {
            this.userAvatars = [];
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
