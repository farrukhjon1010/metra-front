import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AvatarService } from '../../core/services/avatar.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';

  currentStep: 'select' | 'success' | 'profile' = 'select';
  selectedAvatars: string[] = [];
  isLoading: boolean = false;


  constructor(
    public router: Router,
    private avatarService: AvatarService,
    private cdr: ChangeDetectorRef
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
          this.selectedAvatars = [...avatar.imagesURL]; 
        } else {
          this.selectedAvatars = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  addMoreAvatars(): void {
    this.currentStep = 'select';
  }

  goToAddAvatar() {
    this.router.navigate(['/profile/add-avatar']);
  }

  goToReplenish() {
    this.router.navigate(['/profile/balance']);
  }

  goToAffiliateProgram() {
    this.router.navigate(['/profile/affiliate-program']);
  }

  goToSubscription() {
    this.router.navigate(['/profile/subscription']);
  }
}
