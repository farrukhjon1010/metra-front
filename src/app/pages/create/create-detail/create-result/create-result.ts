import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-create-result',
  imports: [ButtonComponent],
  standalone: true,
  templateUrl: './create-result.html',
  styleUrls: ['./create-result.scss'],
})
export class CreateResult {
  @Input() resultImageUrl!: string | null;
  @Input() prompt!: string;
  @Output() edit = new EventEmitter<void>();
  @Output() createAnother = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  downloadResultFile() {
    if (!this.resultImageUrl) return;

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
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Ошибка при скачивании файла:', err);
        this.cdr.detectChanges();
      });
  }

  onEdit() {
    this.edit.emit();
    this.cdr.detectChanges();
  }

  onCreateAnother() {
    this.createAnother.emit();
    this.cdr.detectChanges();
  }
}
