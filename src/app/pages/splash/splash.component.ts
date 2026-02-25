import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarService } from '../../core/services/avatar.service';
import { Gender } from '../../core/models/avatar.model';
import { FileService } from '../../core/services/file.service';
import { SplashCaseComponent } from './components/splash-case/splash-case.component';
import { SplashFormComponent } from './components/splash-form/splash-form.component';
import { SplashSelectComponent } from './components/splash-select/splash-select.component';
import { SplashSuccessComponent } from './components/splash-success/splash-success.component';
import { Loading } from '../../shared/components/loading/loading';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { TelegramService } from '../../core/services/telegram.service';
import {ToastComponent} from '../../shared/components/toast/toast.component';
import {ToastService} from '../../core/services/toast.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SplashCaseComponent, SplashFormComponent, SplashSelectComponent, SplashSuccessComponent, Loading, ToastComponent,],
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnDestroy, OnInit {

  public photos = {
    front: { file: null as File | null, preview: null as string | null },
    left: { file: null as File | null, preview: null as string | null },
    right: { file: null as File | null, preview: null as string | null },
  };
  public myForm = new FormGroup({
    avatarName: new FormControl('', Validators.required),
  });
  public currentStep: 'splash' | 'form' | 'loading' | 'select' | 'success' = 'splash';
  public UUID: string = '';
  public gender: Gender = Gender.MALE
  public generatedAvatars: string[] = [];
  public selectedAvatars: string[] = [];
  private destroy$ = new Subject<void>();

  private telegram = inject(TelegramService);
  private router = inject(Router);
  private avatarService = inject(AvatarService);
  private fileService = inject(FileService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  public get photosPreview() {
    return {
      front: this.photos.front.preview,
      left: this.photos.left.preview,
      right: this.photos.right.preview
    };
  }

  ngOnInit() {
    const tgId = this.telegram.userId;
    if (tgId) {
      this.UUID = tgId;
    }
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
        return new File([blob], `${this.UUID}${index}.png`, { type: blob.type });
      });

      const filesToUpload = await Promise.all(uploadPromises);

      this.fileService.uploadGeneratedAvatars(filesToUpload).pipe(
        switchMap((event: any) => {
          if (!event.body) return EMPTY;

          const cloudinaryUrls = event.body.map((img: any) => img.url);

          return this.avatarService.create({
            name: this.myForm.value.avatarName || "New Avatar",
            gender: this.gender,
            imagesURL: cloudinaryUrls
          });
        }),
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.currentStep = 'success';
          this.cdr.detectChanges();
          this.toast.show('Аватары успешно сохранены', 'success');
        },
        error: (err) => {
          console.error('Ошибка сохранения аватаров:', err);
          this.currentStep = 'select';
          this.cdr.detectChanges();
          this.toast.show('Ошибка при сохранении Аватаров', 'error');
        }
      });

    } catch (error) {
      console.error('Ошибка при обработке ссылок:', error);
      this.currentStep = 'select';
      this.toast.show('Ошибка при обработке ссылок', 'error');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

    this.fileService.uploadAvatars(filesToUpload).pipe(
      switchMap((event: any) => {
        if (!event.body) return EMPTY;

        const urls = event.body.map((img: any) => img.url);
        const generateDto = {
          name: this.myForm.value.avatarName || '',
          gender: this.gender,
          imageFront: urls[0],
          imageLeft: urls[1],
          imageRight: urls[2]
        };
        return this.avatarService.generateAvatar(generateDto);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        if (response.images) {
          this.generatedAvatars = response.images.imagesURL;
          this.currentStep = 'select';
          this.cdr.detectChanges();
          this.toast.show('Аватары успешно сгенерированы', 'success');
        }
      },
      error: (err) => {
        console.error('Ошибка:', err);
        this.currentStep = 'form';
        this.toast.show('Ошибка ИИ-сервиса', 'error');
        this.cdr.detectChanges();
      }
    });
  }
}
