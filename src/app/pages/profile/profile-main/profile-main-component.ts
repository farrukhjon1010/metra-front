import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarService } from '../../../core/services/avatar.service';
import { ReferralService } from '../../../core/services/referral.service';
import { BalanceService } from '../../../core/services/balance.service';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-profile-main',
  imports: [ButtonComponent, AsyncPipe],
  templateUrl: './profile-main-component.html',
  styleUrls: ['./profile-main-component.scss'],
})
export class ProfileMainComponent implements OnInit {

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  selectedAvatars: string[] = [];
  isLoading = false;
  income$: Observable<number>;
  currency$: Observable<string>;
  balance$: Observable<number>;

  constructor(
      public router: Router,
      private avatarService: AvatarService,
      private referralService: ReferralService,
      private balanceService: BalanceService
  ) {
    this.income$ = this.referralService.income$.pipe(map(data => data.income));
    this.currency$ = this.referralService.income$.pipe(map(data => data.currency));
    this.balance$ = this.balanceService.balance$;
  }

  ngOnInit(): void {
    this.loadUserAvatars();

    this.referralService.getReferralInfo().subscribe({
      next: (data) => {
        this.referralService.setIncome({
          income: data.stats.income,
          currency: data.stats.currency
        });
      },
      error: () => this.referralService.setIncome({ income: 0, currency: '' })
    });
    this.balanceService.loadUserBalance();
  }

  loadUserAvatars(): void {
    this.isLoading = true;
    this.avatarService.findByUser(this.UUID).subscribe({
      next: (avatar) => {
        this.selectedAvatars = avatar?.imagesURL || [];
        this.isLoading = false;
      },
      error: () => {
        this.selectedAvatars = [];
        this.isLoading = false;
      }
    });
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
