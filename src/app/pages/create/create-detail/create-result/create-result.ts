import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {GenerationHistory} from '../generation-history/generation-history';

@Component({
  selector: 'app-create-result',
  imports: [
    ButtonComponent,
    GenerationHistory
  ],
  standalone: true,
  templateUrl: './create-result.html',
  styleUrls: ['./create-result.scss'],
})
export class CreateResult {
  @Input() image!: string | null;
  @Input() prompt!: string;
  @Input() generationHistory: any[] = [];

  @Output() edit = new EventEmitter<void>();
  @Output() repeat = new EventEmitter<void>();
  @Output() repeatHistory = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  downloadResultFile(file: string, type: 'image' | 'video') {
    fetch(file)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = type === 'image'
          ? 'result-generation-image.jpg'
          : 'result-generation-video.mp4';

        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }

  onEdit() {
    this.edit.emit();
    this.back.emit();
  }

  onRepeat() {
    this.repeat.emit();
    this.back.emit();
  }

  onHistoryRepeat(generation: any) {
    this.repeatHistory.emit(generation);
  }
}
