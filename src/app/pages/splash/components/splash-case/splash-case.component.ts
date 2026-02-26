import {Component, EventEmitter, Output, inject, computed, ChangeDetectionStrategy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AvatarService } from '../../../../core/services/avatar.service';
import { catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-splash-case',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './splash-case.component.html',
  styleUrls: ['./splash-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplashCaseComponent {

  @Output() create = new EventEmitter<void>();
  @Output() demo = new EventEmitter<void>();

  private avatarService = inject(AvatarService);

  private avatarsSignal = toSignal(
    this.avatarService.findByUser().pipe(
      catchError(err => {
        console.error('Ошибка загрузки аватаров', err);
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
