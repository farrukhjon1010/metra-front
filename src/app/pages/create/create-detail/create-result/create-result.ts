import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonComponent} from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-create-result',
  imports: [
    ButtonComponent
  ],
  standalone: true,
  templateUrl: './create-result.html',
  styleUrls: ['./create-result.scss'],
})
export class CreateResult {
  @Input() resultImageUrl!: string | null;
  @Input() prompt!: string;
  @Output() edit = new EventEmitter<void>();
  @Output() createAnother = new EventEmitter<void>();

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
      });
  }

  onEdit() {
    this.edit.emit();
  }

  onCreateAnother() {
    this.createAnother.emit();
  }
}
