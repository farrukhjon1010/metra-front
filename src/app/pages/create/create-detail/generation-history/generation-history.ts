import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PaidDialogService } from '../../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../../shared/paid-dialog/paid-dialog';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-generation-history',
  imports: [ButtonComponent, DatePipe, PaidDialog],
  standalone: true,
  templateUrl: './generation-history.html',
  styleUrls: ['./generation-history.scss'],
})
export class GenerationHistory {

  @Input() history: any[] = [];
  @Output() repeat = new EventEmitter<any>();

  public paidDialogService = inject(PaidDialogService);
  private toast = inject(ToastService);
  private router = inject(Router);

  get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  repeatGeneration(generation: any) {
    if (this.paidDialogService.tryShowDialog()) return;
    this.repeat.emit(generation);
  }

  downloadFile(url: string, type: 'image' | 'video'): void {
    if (this.paidDialogService.tryShowDialog()) return;
    if (!url) {
      this.toast.show('Файл не найден', 'error');
      return;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки файла');
        }
        return response.blob();
      })
      .then(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        const extension = type === 'video' ? 'mp4' : blob.type.split('/')[1] || 'jpg';
        a.href = objectUrl;
        a.download = `generation-${type}.${extension}`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.toast.show('Файл успешно сохранено', 'success');
      })
      .catch(err => {
        console.error('Не удалось скачать файл:', err);
        this.toast.show('Не удалось скачать файл', 'error');
      });
  }

  goToUpscale(imageUrl: string) {
    if (this.paidDialogService.tryShowDialog()) return;
    this.router.navigate(
      ['/history/improving-quality'],
      { state: { imageUrl } }
    );
  }

  navigateToHistory() {
    if (this.paidDialogService.tryShowDialog()) return;
    this.router.navigate(['/history']);
  }
}
