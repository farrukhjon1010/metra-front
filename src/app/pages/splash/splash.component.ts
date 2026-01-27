import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AvatarService } from '../../core/services/avatar.service';
import { CreateAvatarDto, Gender, GenerateAvatarDto } from '../../core/models/avatar.model';
import { FileService } from '../../core/services/file.service';
import { HelperService } from '../../core/services/helper.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SplashCaseComponent,
    SplashFormComponent,
    Loading,
    SplashSelectComponent,
    SplashSuccessComponent,
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

  @ViewChild('frontInput', { static: false }) frontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('leftInput', { static: false }) leftInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rightInput', { static: false }) rightInput!: ElementRef<HTMLInputElement>;

  currentStep: 'splash' | 'form' | 'loading' | 'select' | 'success' = 'splash';
  gender: Gender = Gender.MALE
  generatedAvatars: string[] = [];
  selectedAvatars: string[] = [];

  photos = {
    front: { file: null as File | null, preview: null as string | null },
    left: { file: null as File | null, preview: null as string | null },
    right: { file: null as File | null, preview: null as string | null },
  };

  photoFiles: { front?: File; left?: File; right?: File } = {};

  myForm = new FormGroup({
    avatarName: new FormControl('', Validators.required),
  });

  constructor(private router: Router,
    private cdr: ChangeDetectorRef,
    private avatarService: AvatarService,
    private fileService: FileService,
    private helperService: HelperService) { }

  navigateToCreate(): void {
    this.currentStep = 'form';
  }

  navigateToDemo(): void {
    this.router.navigate(['/home']);
  }

  handlePhotoUploaded(event: { type: 'front' | 'left' | 'right'; dataUrl: string; file: File }) {
    this.photos[event.type] = event.dataUrl;
    this.photoFiles[event.type] = event.file;
    this.cdr.detectChanges();
  }

  removePhoto(type: 'front' | 'left' | 'right', event: Event) {
    event.stopPropagation();
    this.photos[type].file = null;
    this.photos[type].preview = null;
  }

  onFileSelected(event: Event, type: 'front' | 'left' | 'right') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    // Сохраняем сам файл для отправки
    this.photos[type].file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[type].preview = reader.result as string;
      this.cdr.detectChanges(); // обновляем UI сразу после загрузки
    };
    reader.readAsDataURL(file);
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

  isSelected(avatar: string): boolean {
    return this.selectedAvatars.includes(avatar);
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
      // 1. Скачиваем каждую картинку по ссылке и превращаем в File
      const uploadPromises = this.selectedAvatars.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], `${this.UUID}${index}.png`, { type: blob.type });
      });

      const filesToUpload = await Promise.all(uploadPromises);

      // 2. Загружаем на Cloudinary
      this.fileService.uploadGeneratedAvatars(filesToUpload, this.UUID).subscribe({
        next: (event: any) => {
          if (event.body) {
            const cloudinaryUrls = event.body.map((img: any) => img.url);

            // 3. Сохраняем в БД
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

    // Загрузка файлов
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

          // Генерация
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

  submit() {
    if (this.myForm.invalid) return;
    console.log('Форма отправлена', this.myForm.value);
  }
}
