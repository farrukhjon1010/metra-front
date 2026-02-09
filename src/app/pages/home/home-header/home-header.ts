import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AvatarService} from '../../../core/services/avatar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [],
  styleUrls: ['./home-header.scss'],
  templateUrl: './home-header.html',
})
export class HomeHeader implements OnInit {

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  isLoading: boolean = false;
  userAvatars: string[] = [];
  currentAvatar: string = "";

  constructor(
    private avatarService: AvatarService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserAvatars();
  }

  loadUserAvatars() {
    const userId = this.UUID;
    this.isLoading = true;

    this.avatarService.findByUser(userId).subscribe({
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
