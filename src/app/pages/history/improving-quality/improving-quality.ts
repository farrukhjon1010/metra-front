import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-improving-quality',
  imports: [ButtonComponent],
  templateUrl: './improving-quality.html',
  styleUrls: ['./improving-quality.scss'],
})
export class ImprovingQuality {

  @ViewChild('photoInput', {static: false}) photoInput!: ElementRef<HTMLInputElement>;

  photos: { photo: string | null } = {photo: null};
  enhancedPhoto: string | null = null;
  isProcessing = false;
  isStarted = false;

  constructor(private router: Router,
              private cdr: ChangeDetectorRef,) {
  }

  goBack() {
    this.router.navigate(['/history']);
  }

  onPhotoSelected(event: Event, type: 'photo') {
    const photo = (event.target as HTMLInputElement)?.files?.[0];
    if (!photo) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[type] = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(photo);
    this.cdr.detectChanges();
  }

  triggerFileInput(type: 'photo', event: Event) {
    event.stopPropagation();
    const map = {
      photo: this.photoInput,
    };
    map[type]?.nativeElement.click();
  }

  removePhoto(type: 'photo', event: Event) {
    event.stopPropagation();
    this.photos[type] = null;
  }

  enhanceImage() {
    if (!this.photos.photo) return;

    this.isStarted = true;
    this.isProcessing = true;

    this.enhancedPhoto = this.photos.photo;
    setTimeout(() => {
      this.enhancedPhoto = this.photos.photo;
      this.isProcessing = false;
    }, 1200);
  }

  downloadImage() {

  }

  repeatImage() {

  }
}
