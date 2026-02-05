import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AvatarService} from '../../core/services/avatar.service';
import {Gender} from '../../core/models/avatar.model';
import {FileService} from '../../core/services/file.service';
import {SplashCaseComponent} from './components/splash-case/splash-case.component';
import {SplashFormComponent} from './components/splash-form/splash-form.component';
import {SplashSelectComponent} from './components/splash-select/splash-select.component';
import {SplashSuccessComponent} from './components/splash-success/splash-success.component';
import {Loading} from '../../shared/components/loading/loading';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SplashCaseComponent,
    SplashFormComponent,
    SplashSelectComponent,
    SplashSuccessComponent,
    Loading,
  ],
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent {

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';

  currentStep: 'splash' | 'form' | 'loading' | 'select' | 'success' = 'splash';
  gender: Gender = Gender.MALE
  generatedAvatars: string[] = [];
  selectedAvatars: string[] = [];

  photos = {
    front: {file: null as File | null, preview: null as string | null},
    left: {file: null as File | null, preview: null as string | null},
    right: {file: null as File | null, preview: null as string | null},
  };

  get photosPreview() {
    return {
      front: this.photos.front.preview,
      left: this.photos.left.preview,
      right: this.photos.right.preview
    };
  }

  myForm = new FormGroup({
    avatarName: new FormControl('', Validators.required),
  });

  constructor(private router: Router,
              private cdr: ChangeDetectorRef,
              private avatarService: AvatarService,
              private fileService: FileService) {
  }

  navigateToCreate(): void {
    this.currentStep = 'form';
  }

  navigateToDemo(): void {
    this.router.navigate(['/home']);
  }

  onGenderChange(newGender: Gender | 'male' | 'female'): void {
    this.gender = newGender as Gender;
  }

  onPhotoUploaded(event: { type: 'front' | 'left' | 'right'; dataUrl: string; file: File }): void {
    this.photos[event.type].file = event.file;
    this.photos[event.type].preview = event.dataUrl;
    this.cdr.detectChanges();
  }

  onPhotoRemoved(type: 'front' | 'left' | 'right'): void {
    this.photos[type].file = null;
    this.photos[type].preview = null;
    this.cdr.detectChanges();
  }

  canCreate() {
    const avatarName = this.myForm.controls['avatarName'].value?.trim();
    return (
      avatarName &&
      this.photos.front &&
      this.photos.left &&
      this.photos.right
    );
  }

  toggleAvatar(avatar: string) {
    const index = this.selectedAvatars.indexOf(avatar);
    if (index > -1) {
      this.selectedAvatars.splice(index, 1);
    } else if (this.selectedAvatars.length < 3) {
      this.selectedAvatars.push(avatar);
    }
  }

  async confirmAvatars() {
    if (this.selectedAvatars.length === 0) return;

    this.currentStep = 'loading';
    this.cdr.detectChanges();

    try {
      const uploadPromises = this.selectedAvatars.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], `${this.UUID}${index}.png`, {type: blob.type});
      });

      const filesToUpload = await Promise.all(uploadPromises);

      this.fileService.uploadGeneratedAvatars(filesToUpload, this.UUID).subscribe({
        next: (event: any) => {
          if (event.body) {
            const cloudinaryUrls = event.body.map((img: any) => img.url);

            this.avatarService.create({
              userId: this.UUID,
              name: this.myForm.value.avatarName || "New Avatar",
              gender: this.gender,
              imagesURL: cloudinaryUrls
            }).subscribe(() => {
              this.currentStep = 'success';
              this.cdr.detectChanges();
            });
          }
        }
      });
    } catch (error) {
      console.error('Ошибка при обработке ссылок:', error);
      this.currentStep = 'select';
    }
  }

  goToMetra() {
    this.router.navigate(['/home']);
  }

  createAvatar() {
    if (!this.canCreate()) return;

    this.currentStep = 'loading';
    this.cdr.detectChanges();

    const filesToUpload: File[] = [];
    if (this.photos.front.file) filesToUpload.push(this.photos.front.file);
    if (this.photos.left.file) filesToUpload.push(this.photos.left.file);
    if (this.photos.right.file) filesToUpload.push(this.photos.right.file);

    const userId = this.UUID;

    this.fileService.uploadAvatars(filesToUpload, userId).subscribe({
      next: (event: any) => {
        if (event.body) {
          const urls = event.body.map((img: any) => img.url);

          const generateDto = {
            name: this.myForm.value.avatarName || '',
            gender: this.gender,
            imageFront: urls[0],
            imageLeft: urls[1],
            imageRight: urls[2]
          };

          this.avatarService.generateAvatar(generateDto).subscribe({
            next: (response: any) => {
              if (response.images) {
                this.generatedAvatars = response.images.imagesURL;
                console.log(this.generatedAvatars)

                this.currentStep = 'select';
                this.cdr.detectChanges();
              }
            },
            error: (err) => {
              console.error('Ошибка генерации:', err);
              this.currentStep = 'form';
              alert('Ошибка ИИ-сервиса');
              this.cdr.detectChanges();
            }
          });
        }
      },
      error: (err) => {
        console.error('Ошибка загрузки фото:', err);
        this.currentStep = 'form';
        this.cdr.detectChanges();
      }
    });
  }
}
