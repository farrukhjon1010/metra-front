import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './image-viewer.html',
  styleUrls: ['./image-viewer.scss'],
})
export class ImageViewerComponent {
  @Input() generation!: any; // весь объект генерации
  @Output() close = new EventEmitter<void>();
  @Output() updateParent = new EventEmitter<void>();

  private router = inject(Router);
  private toast = inject(ToastService);

  onBackgroundClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.close.emit();
    }
  }

  downloadImage() {
    if (!this.generation?.imageURL) {
      this.toast.show('Нет изображения для скачивания', 'error');
      return;
    }

    fetch(this.generation.imageURL)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки изображения');
        return res.blob();
      })
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'image.jpg';
        a.click();
        URL.revokeObjectURL(a.href);
        this.toast.show('Изображение успешно скачано', 'success');
        this.updateParent.emit();
      })
      .catch(err => {
        console.error(err);
        this.toast.show('Ошибка при скачивании изображения', 'error');
      });
  }

  repeatGeneration() {
    if (!this.generation) {
      this.toast.show('Невозможно повторить генерацию', 'error');
      return;
    }

    try {
      this.router.navigate(['/create', this.generation.type], {
        state: {
          id: this.generation.id,
          prompt: this.generation.prompt,
          imageUrl: this.generation.imageURL
        }
      });
      this.toast.show('Повтор генерации открыт', 'success');
      this.close.emit();
      this.updateParent.emit();
    } catch (err) {
      console.error(err);
      this.toast.show('Ошибка при открытии повторной генерации', 'error');
    }
  }

  upScale() {
    if (!this.generation) {
      this.toast.show('Невозможно запустить Upscale', 'error');
      return;
    }

    try {
      this.router.navigate(['/history/improving-quality'], {
        state: { id: this.generation.id, imageUrl: this.generation.imageURL }
      });
      this.toast.show('Upscale запущен', 'success');
      this.close.emit();
      this.updateParent.emit();
    } catch (err) {
      console.error(err);
      this.toast.show('Ошибка при запуске Upscale', 'error');
    }
  }
}
