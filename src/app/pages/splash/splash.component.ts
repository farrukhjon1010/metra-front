import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SplashCaseComponent, SplashFormComponent, SplashSelectComponent, SplashSuccessComponent, Loading, ToastComponent,],
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnDestroy, OnInit {



  public photos = signal({
    front: { file: null as File | null, preview: null as string | null },
    left: { file: null as File | null, preview: null as string | null },
    right: { file: null as File | null, preview: null as string | null },
  });
  public currentStep = signal<'splash' | 'form' | 'loading' | 'select' | 'success'>('splash');
  public UUID = signal<string>('');
  public gender = signal<Gender>(Gender.MALE);
  public generatedAvatars = signal<string[]>([]);
  public selectedAvatars = signal<string[]>([]);

  public myForm = new FormGroup({
    avatarName: new FormControl('', Validators.required),
  });

  private destroy$ = new Subject<void>();
  private telegram = inject(TelegramService);
  private router = inject(Router);
  private avatarService = inject(AvatarService);
  private fileService = inject(FileService);
  private toast = inject(ToastService);

  ngOnInit() {
    const tgId = this.telegram.userId;
    if (tgId) {
      this.UUID.set(tgId);
    }
  }

  navigateToCreate(): void {
    this.currentStep.set('form');
  }

  navigateToDemo(): void {
    this.router.navigate(['/home']);
  }

  onGenderChange(newGender: Gender | 'male' | 'female'): void {
    this.gender.set(newGender as Gender);
  }

  onPhotoUploaded(event: { type: 'front' | 'left' | 'right'; dataUrl: string; file: File }): void {
    this.photos.update(p => {
      p[event.type] = { file: event.file, preview: event.dataUrl };
      return p;
    });
  }

  onPhotoRemoved(type: 'front' | 'left' | 'right'): void {
    this.photos.update(p => {
      p[type] = { file: null, preview: null };
      return p;
    });
  }

  get photosPreview() {
    const p = this.photos();
    return {
      front: p.front.preview,
      left: p.left.preview,
      right: p.right.preview
    };
  }

  canCreate() {
    const avatarName = this.myForm.controls['avatarName'].value?.trim();
    const p = this.photos();
    return (
      !!avatarName &&
      p.front.file &&
      p.left.file &&
      p.right.file
    );
  }

  toggleAvatar(avatar: string) {
    const arr = this.selectedAvatars();
    const index = arr.indexOf(avatar);
    if (index > -1) {
      arr.splice(index, 1);
    } else if (arr.length < 3) {
      arr.push(avatar);
    }
    this.selectedAvatars.set([...arr]);
  }

  async confirmAvatars() {
    if (this.selectedAvatars().length === 0) return;

    this.currentStep.set('loading');

    try {
      const uploadPromises = this.selectedAvatars().map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], `${this.UUID()}${index}.png`, { type: blob.type });
      });

      const filesToUpload = await Promise.all(uploadPromises);

      this.fileService.uploadGeneratedAvatars(filesToUpload).pipe(
        switchMap((event: any) => {
          if (!event.body) return EMPTY;

          const cloudinaryUrls = event.body.map((img: any) => img.url);

          return this.avatarService.create({
            name: this.myForm.value.avatarName || 'New Avatar',
            gender: this.gender(),
            imagesURL: cloudinaryUrls
          });
        }),
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.currentStep.set('success');
          this.toast.show('Аватары успешно сохранены', 'success');
        },
        error: (err) => {
          console.error('Ошибка сохранения аватаров:', err);
          this.currentStep.set('select');
          this.toast.show('Ошибка при сохранении Аватаров', 'error');
        }
      });

    } catch (error) {
      console.error('Ошибка при обработке ссылок:', error);
      this.currentStep.set('select');
      this.toast.show('Ошибка при обработке ссылок', 'error');
    }
  }

  createAvatar() {
    if (!this.canCreate()) return;

    this.currentStep.set('loading');

    const photos = this.photos();
    const filesToUpload: File[] = [];
    if (photos.front.file) filesToUpload.push(photos.front.file);
    if (photos.left.file) filesToUpload.push(photos.left.file);
    if (photos.right.file) filesToUpload.push(photos.right.file);

    this.fileService.uploadAvatars(filesToUpload).pipe(
      switchMap((event: any) => {
        if (!event.body) return EMPTY;

        const urls = event.body.map((img: any) => img.url);
        const generateDto = {
          name: this.myForm.value.avatarName || '',
          gender: this.gender(),
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
          this.generatedAvatars.set(response.images.imagesURL);
          this.currentStep.set('select');
          this.toast.show('Аватары успешно сгенерированы', 'success');
        }
      },
      error: (err) => {
        console.error('Ошибка:', err);
        this.currentStep.set('form');
        this.toast.show('Ошибка ИИ-сервиса', 'error');
      }
    });
  }

  goToMetra() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
