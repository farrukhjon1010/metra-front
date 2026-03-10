import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gender, CreateAvatarDto } from '../../../core/models/avatar.model';
import { AvatarService } from '../../../core/services/avatar.service';
import { FileService } from '../../../core/services/file.service';
import { from, Subject, switchMap, takeUntil, map } from 'rxjs';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import { ToastService } from '../../../core/services/toast.service';
import { SplashFormComponent } from '../../splash/components/splash-form/splash-form.component';
import { Loading } from '../../../shared/components/loading/loading';
import {SplashSelectComponent} from '../../splash/components/splash-select/splash-select.component';
import {SplashSuccessComponent} from '../../splash/components/splash-success/splash-success.component';
import {PaidDialog} from '../../../shared/paid-dialog/paid-dialog';

@Component({
  selector: 'app-add-avatar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SplashFormComponent,
    Loading,
    SplashSelectComponent,
    SplashSuccessComponent,
    PaidDialog
  ],
  templateUrl: './add-avatar.component.html',
  styleUrls: ['./add-avatar.component.scss'],
})
export class AddAvatarComponent implements OnDestroy {

  public myForm = new FormGroup({
    avatarName: new FormControl('', Validators.required),
  });

  public gender: Gender = Gender.MALE;

  public photosPreview = {
    front: null as string | null,
    left: null as string | null,
    right: null as string | null
  };

  public photosFiles = {
    front: null as File | null,
    left: null as File | null,
    right: null as File | null
  };

  public currentStep: 'form' | 'loading' | 'select' | 'success' = 'form';
  public generatedAvatars: string[] = [];
  public selectedAvatars: string[] = [];
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private avatarService = inject(AvatarService);
  private fileService = inject(FileService);
  private paidDialogService = inject(PaidDialogService);
  private toast = inject(ToastService);

  public get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  onGenderChange(g: 'male' | 'female') {
    this.gender = g === 'male' ? Gender.MALE : Gender.FEMALE;
  }

  onPhotoUploaded(event: { type: 'front' | 'left' | 'right'; dataUrl: string; file: File }) {
    this.photosPreview[event.type] = event.dataUrl;
    this.photosFiles[event.type] = event.file;
  }

  onPhotoRemoved(type: 'front' | 'left' | 'right') {
    this.photosPreview[type] = null;
    this.photosFiles[type] = null;
  }

  toggleAvatar(avatar: string): void {
    this.selectedAvatars = this.selectedAvatars[0] === avatar ? [] : [avatar];
  }

  confirmAvatars(): void {
    if (this.paidDialogService.tryShowDialog())
      return;
    if (this.selectedAvatars.length === 0)
      return;
    this.currentStep = 'loading';
    const selectedUrl = this.selectedAvatars[0];
    this.uploadAndSave(selectedUrl);
  }

  private uploadAndSave(url: string) {
    from(fetch(url)).pipe(
      switchMap(res => from(res.blob())),
      map(blob => new File([blob], 'avatar.png', { type: 'image/png' })),
      switchMap(file => this.fileService.uploadGeneratedAvatar(file, 1)),
      switchMap(response => {
        const dto: CreateAvatarDto = {
          name: this.myForm.value.avatarName || '',
          gender: this.gender,
          imagesURL: [response.url]
        };
        return this.avatarService.create(dto);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.currentStep = 'success';
        this.toast.show('Аватар успешно сохранён!', 'success');
      },
      error: () => {
        this.currentStep = 'form';
        this.toast.show('Ошибка сохранения аватара', 'error');
      }
    });
  }

  createAvatar() {
    if (this.paidDialogService.tryShowDialog()) return;
    if (!this.photosFiles.front || !this.photosFiles.left || !this.photosFiles.right) {
      this.toast.show('Загрузите все фотографии', 'error');
      return;
    }
    this.currentStep = 'loading';

    const filesUpload: File[] = [
      this.photosFiles.front,
      this.photosFiles.left,
      this.photosFiles.right
    ] as File[];
    this.fileService.uploadAvatars(filesUpload)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((event: any) => {
          if (!event.body) throw new Error('No files uploaded');
          const urls = event.body.map((img: any) => img.url);
          return this.avatarService.generateAvatar({
            name: this.myForm.value.avatarName || '',
            gender: this.gender,
            imageFront: urls[0],
            imageLeft: urls[1],
            imageRight: urls[2]
          });
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response.images) {
            this.generatedAvatars = response.images.imagesURL;
            this.currentStep = 'select';
            this.toast.show('Аватар успешно сгенерирован!', 'success');
          }
        },
        error: () => {
          this.currentStep = 'form';
          this.toast.show('Ошибка генерации аватара', 'error');
        }
      });
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
