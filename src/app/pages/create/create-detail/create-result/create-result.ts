import {Component, EventEmitter, Input, Output, ChangeDetectorRef, inject} from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PaidDialogService } from '../../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../../shared/paid-dialog/paid-dialog';
import {ToastService} from '../../../../core/services/toast.service';

@Component({
  selector: 'app-create-result',
  imports: [ButtonComponent, PaidDialog],
  standalone: true,
  templateUrl: './create-result.html',
  styleUrls: ['./create-result.scss'],
})
export class CreateResult {

  @Input() resultImageUrl!: string | null;
  @Input() prompt!: string;
  @Output() edit = new EventEmitter<void>();
  @Output() createAnother = new EventEmitter<void>();

  public paidDialogService = inject(PaidDialogService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  public get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  downloadResultFile() {
    if (!this.resultImageUrl) {
      this.toast.show('Нет файла для скачивания', 'error');
      return;
    }

    fetch(this.resultImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        const isVideo = blob.type.startsWith('video/');
        const extension = isVideo ? 'mp4' : 'jpg';

        a.href = objectUrl;
        a.download = `generation-${isVideo ? 'video' : 'image'}.${extension}`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.toast.show('Файл успешно скачан', 'success');
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Ошибка скачивании файла:', err);
        this.toast.show('Ошибка скачивании файла', 'error');
        this.cdr.detectChanges();
      });
  }

  onEdit() {
    if (this.paidDialogService.tryShowDialog()) return;
    this.edit.emit();
    this.cdr.detectChanges();
  }

  onCreateAnother() {
    if (this.paidDialogService.tryShowDialog()) return;
    this.createAnother.emit();
    this.cdr.detectChanges();
  }
}
