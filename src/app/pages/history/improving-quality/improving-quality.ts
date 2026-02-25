import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { UpscaleService } from '../../../core/services/upscale.service';
import { firstValueFrom } from 'rxjs';
import { Loading } from '../../../shared/components/loading/loading';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-improving-quality',
  standalone: true,
  imports: [CommonModule, ButtonComponent, Loading, PaidDialog],
  templateUrl: './improving-quality.html',
  styleUrls: ['./improving-quality.scss'],
})
export class ImprovingQuality implements AfterViewInit {

  @ViewChild('photoInput', { static: false }) photoInput!: ElementRef<HTMLInputElement>;

  isProcessing = false;
  isLoading = false;
  isStarted = false;
  photos: { photo: string | null } = { photo: null };
  originalImage: string | null = null;
  improvedImage: string | null = null;

  constructor(
    private location: Location,
    private cdr: ChangeDetectorRef,
    private upscaleService: UpscaleService,
    public paidDialogService: PaidDialogService,
    private toast: ToastService
  ) {}

  get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  ngAfterViewInit() {
    const imageUrl = history.state?.imageUrl;
    if (imageUrl) {
      this.photos.photo = imageUrl;
      this.cdr.detectChanges();
    }
  }

  goBack() {
    this.location.back();
  }

  onPhotoSelected(event: Event, type: 'photo') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    this.cdr.detectChanges();

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[type] = reader.result as string;
      this.originalImage = null;
      this.improvedImage = null;
      this.isStarted = false;
      this.cdr.detectChanges();
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
    this.photos[type] = null;
    this.originalImage = null;
    this.improvedImage = null;
    this.isStarted = false;
    this.cdr.detectChanges();
    this.toast.show('Фото удалено', 'success');
  }

  async enhanceImage() {
    if (this.paidDialogService.tryShowDialog()) return;
    if (!this.photos.photo) {
      this.toast.show('Выберите изображение для улучшения', 'error');
      return;
    }

    this.isLoading = true;
    this.isStarted = true;
    this.originalImage = this.photos.photo;
    this.improvedImage = null;
    this.isProcessing = true;
    this.cdr.detectChanges();

    try {
      const result = await firstValueFrom(this.upscaleService.improveImage(this.originalImage));
      this.improvedImage = result?.improvedImage || this.originalImage;
      this.toast.show('Изображение успешно улучшено!', 'success');
    } catch (err) {
      console.error('Ошибка улучшения изображения', err);
      this.improvedImage = null;
      this.toast.show('Ошибка при улучшении изображения', 'error');
    } finally {
      this.isLoading = false;
      this.isProcessing = false;
      this.cdr.detectChanges();
    }
  }

  downloadImage() {
    if (!this.improvedImage) {
      this.toast.show('Нет изображения для скачивания', 'error');
      return;
    }

    fetch(this.improvedImage)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'improved-image.jpg';
        a.click();
        URL.revokeObjectURL(a.href);
        this.toast.show('Изображение успешно скачано', 'success');
      })
      .catch(err => console.error('Ошибка скачивании улучшенного изображения', err));
      this.toast.show('Ошибка скачивании улучшенного изображения', 'error');
  }

  repeatImage() {
    this.improvedImage = null;
    this.isStarted = false;
    this.cdr.detectChanges();
  }
}
