import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {UpscaleService} from '../../../core/services/upscale.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-improving-quality',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './improving-quality.html',
  styleUrls: ['./improving-quality.scss'],
})
export class ImprovingQuality implements AfterViewInit {

  @ViewChild('photoInput', {static: false}) photoInput!: ElementRef<HTMLInputElement>;

  isProcessing = false;
  isStarted = false;
  photos: { photo: string | null } = {photo: null};
  originalImage: string | null = null;
  improvedImage: string | null = null;

  constructor(private location: Location,
              private cdr: ChangeDetectorRef,
              private upscaleService: UpscaleService) {
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
    const map = {photo: this.photoInput};
    map[type]?.nativeElement.click();
  }

  removePhoto(type: 'photo', event: Event) {
    event.stopPropagation();
    this.photos[type] = null;
    this.originalImage = null;
    this.improvedImage = null;
    this.isStarted = false;
  }

  async enhanceImage() {
    if (!this.photos.photo) return;

    this.isStarted = true;
    this.originalImage = this.photos.photo;
    this.improvedImage = null;
    this.isProcessing = true;
    this.cdr.detectChanges();

    try {
      const result = await firstValueFrom(this.upscaleService.improveImage(this.originalImage));
      this.improvedImage = result?.improvedImage || this.originalImage;
    } catch (err) {
      console.error('Ошибка улучшения изображения', err);
      this.improvedImage = null;
    } finally {
      this.isProcessing = false;
      this.cdr.detectChanges();
    }
  }

  downloadImage() {
    if (!this.improvedImage) return;

    fetch(this.improvedImage)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'improved-image.jpg';
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(err => console.error('Ошибка при скачивании улучшенного изображения', err));
  }

  repeatImage() {
    this.improvedImage = null;
    this.isStarted = false;
  }
}
