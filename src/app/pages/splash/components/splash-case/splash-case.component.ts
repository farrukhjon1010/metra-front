import { Component, EventEmitter, Output, inject, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AvatarService } from '../../../../core/services/avatar.service';
import { catchError, of, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Loading } from '../../../../shared/components/loading/loading';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-splash-case',
  standalone: true,
  imports: [CommonModule, ButtonComponent, Loading],
  templateUrl: './splash-case.component.html',
  styleUrls: ['./splash-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplashCaseComponent {

  @Output() create = new EventEmitter<void>();
  @Output() demo = new EventEmitter<void>();

  private avatarService = inject(AvatarService);
  private cdr = inject(ChangeDetectorRef);

  readonly isLoading = signal(true);

  private avatarsSignal = toSignal(
    this.avatarService.findByUser().pipe(
      tap(() => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }),
      catchError(err => {
        console.error('Ошибка загрузки аватаров', err);
        this.isLoading.set(false);
        this.cdr.markForCheck();
        return of({ imagesURL: [] });
      })
    ),
    { initialValue: null }
  );

  readonly hasAvatars = computed(() => {
    const avatars = this.avatarsSignal();
    if (!avatars) return null;
    return (avatars?.imagesURL?.length ?? 0) > 0;
  });
}
