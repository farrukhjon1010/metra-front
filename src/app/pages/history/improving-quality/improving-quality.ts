import { AfterViewInit, Component, ElementRef, inject, ViewChild, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { UpscaleService } from '../../../core/services/upscale.service';
import { firstValueFrom } from 'rxjs';
import { Loading } from '../../../shared/components/loading/loading';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-improving-quality',
  standalone: true,
  imports: [CommonModule, ButtonComponent, Loading, PaidDialog],
  templateUrl: './improving-quality.html',
  styleUrls: ['./improving-quality.scss'],
})
export class ImprovingQuality implements AfterViewInit {

  @ViewChild('photoInput', { static: false }) photoInput!: ElementRef<HTMLInputElement>;

  public isProcessing = signal(false);
  public isLoading = signal(false);
  public isStarted = signal(false);
  public photos = signal<{ photo: string | null }>({ photo: null });
  public originalImage = signal<string | null>(null);
  public improvedImage = signal<string | null>(null);

  private location = inject(Location);
  private upscaleService = inject(UpscaleService);
  private paidDialogService = inject(PaidDialogService);
  private toast = inject(ToastService);

  public get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  ngAfterViewInit() {
    const imageUrl = history.state?.imageUrl;
    if (imageUrl) {
      this.photos.update(p => ({ ...p, photo: imageUrl }));
    }
  }

  goBack() {
    this.location.back();
  }

  onPhotoSelected(event: Event, type: 'photo') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photos.update(p => ({ ...p, [type]: reader.result as string }));
      this.originalImage.set(null);
      this.improvedImage.set(null);
      this.isStarted.set(false);
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(type: 'photo', event: Event) {
    event.stopPropagation();
    const map = { photo: this.photoInput };
    map[type]?.nativeElement.click();
  }

  removePhoto(type: 'photo', event: Event) {
    event.stopPropagation();
    this.photos.update(p => ({ ...p, [type]: null }));
    this.originalImage.set(null);
    this.improvedImage.set(null);
    this.isStarted.set(false);
    this.toast.show('Фото удалено', 'success');
  }

  async enhanceImage() {
    if (this.paidDialogService.tryShowDialog()) return;

    const photo = this.photos().photo;
    if (!photo) {
      this.toast.show('Выберите изображение для улучшения', 'error');
      return;
    }

    this.isLoading.set(true);
    this.isStarted.set(true);
    this.originalImage.set(photo);
    this.improvedImage.set(null);
    this.isProcessing.set(true);

    const original = this.originalImage();
    if (!original) {
      this.toast.show('Нет исходного изображения', 'error');
      this.isLoading.set(false);
      this.isProcessing.set(false);
      return;
    }

    try {
      const result = await firstValueFrom(this.upscaleService.improveImage(original));
      this.improvedImage.set(result?.improvedImage || original);
      this.toast.show('Изображение успешно улучшено!', 'success');
    } catch (err) {
      console.error('Ошибка улучшения изображения', err);
      this.improvedImage.set(null);
      this.toast.show('Ошибка при улучшении изображения', 'error');
    } finally {
      this.isLoading.set(false);
      this.isProcessing.set(false);
    }
  }

  downloadImage() {
    const img = this.improvedImage();
    if (!img) {
      this.toast.show('Нет изображения для скачивания', 'error');
      return;
    }

    fetch(img)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'improved-image.jpg';
        a.click();
        URL.revokeObjectURL(a.href);
        this.toast.show('Изображение успешно скачано', 'success');
      })
      .catch(err => {
        console.error('Ошибка скачивания улучшенного изображения', err);
        this.toast.show('Ошибка скачивания улучшенного изображения', 'error');
      });
  }

  repeatImage() {
    const photo = this.photos().photo;
    if (!photo) return;

    this.improvedImage.set(null);
    this.isStarted.set(false);
    this.enhanceImage();
  }
}
