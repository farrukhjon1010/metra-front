import {ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Gender } from '../../../core/models/avatar.model';
import { AvatarService } from '../../../core/services/avatar.service';
import { FileService } from '../../../core/services/file.service';
import { Loading } from '../../../shared/components/loading/loading';
import { from, Subject, switchMap, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-add-avatar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgStyle, ButtonComponent, ReactiveFormsModule, Loading, PaidDialog],
  templateUrl: './add-avatar.component.html',
  styleUrls: ['./add-avatar.component.scss'],
})
export class AddAvatarComponent implements OnDestroy {

  @ViewChild('frontInput') frontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('leftInput') leftInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rightInput') rightInput!: ElementRef<HTMLInputElement>;

  public photos = {
    front: { file: null as File | null, preview: null as string | null },
    left: { file: null as File | null, preview: null as string | null },
    right: { file: null as File | null, preview: null as string | null },
  };

  public myForm = new FormGroup({
    avatarName: new FormControl('', Validators.required),
  });

  public gender: Gender = Gender.MALE;
  public currentStep: 'form' | 'loading' | 'select' | 'success' = 'form';
  public generatedAvatars: string[] = [];
  public selectedAvatars: string[] = [];
  protected readonly Gender = Gender;
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private avatarService = inject(AvatarService);
  private fileService = inject(FileService);
  private paidDialogService = inject(PaidDialogService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  public get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  isSelected(avatar: string): boolean {
    return this.selectedAvatars.includes(avatar);
  }

  toggleAvatar(avatar: string): void {
    if (this.selectedAvatars[0] === avatar) {
      this.selectedAvatars = [];
    } else {
      this.selectedAvatars = [avatar];
    }
  }

  confirmAvatars(): void {
    if (this.paidDialogService.tryShowDialog()) return;
    if (this.selectedAvatars.length === 0) return;

    this.currentStep = 'loading';
    this.cdr.detectChanges();

    const selectedUrl = this.selectedAvatars[0];

    this.avatarService.findByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (existingAvatar) => {
          const currentCount = existingAvatar?.imagesURL?.length || 0;
          const nextIndex = currentCount + 1;
          this.uploadAndSave(selectedUrl, nextIndex);
        },
        error: () => {
          this.uploadAndSave(selectedUrl, 1);
        }
      });
  }

  private uploadAndSave(url: string, index: number) {
    from(fetch(url)).pipe(
      switchMap(res => from(res.blob())),
      map(blob => new File([blob], `avatar_v${index}.png`, { type: 'image/png' })),
      switchMap(file => this.fileService.uploadGeneratedAvatar(file, index)),
      switchMap(response => this.avatarService.addImgUrl(response.url)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.currentStep = 'success';
        this.toast.show('Аватар успешно сохранён!', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка сохранении аватара:', err);
        this.currentStep = 'form';
        this.toast.show('Ошибка сохранении аватара', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  canCreate(): boolean {
    return this.myForm.valid &&
      !!this.photos.front.file &&
      !!this.photos.left.file &&
      !!this.photos.right.file;
  }

  createAvatar() {
    if (this.paidDialogService.tryShowDialog()) return;
    if (!this.canCreate()) return;

    this.currentStep = 'loading';
    this.cdr.detectChanges();

    const filesUpload: File[] = [
      this.photos.front.file!,
      this.photos.left.file!,
      this.photos.right.file!
    ];

    this.fileService.uploadAvatars(filesUpload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event: any) => {
          if (event.body) {
            const url = event.body.map((img: any) => img.url);
            const generate = {
              name: this.myForm.value.avatarName || '',
              gender: this.gender,
              imageFront: url[0],
              imageLeft: url[1],
              imageRight: url[2]
            };
            this.avatarService.generateAvatar(generate)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response: any) => {
                  if (response.images) {
                    this.generatedAvatars = response.images.imagesURL;
                    this.currentStep = 'select';
                    this.toast.show('Аватар успешно сгенерирован!', 'success');
                    this.cdr.detectChanges();
                  }
                },
                error: (err) => {
                  console.error('Ошибка Генерации Аватара:', err);
                  this.currentStep = 'form';
                  this.toast.show('Ошибка Генерации Аватара', 'error');
                  this.cdr.detectChanges();
                }
              });
          }
        },
        error: (err) => {
          console.error('Ошибка создание Аватара:', err);
          this.currentStep = 'form';
          this.toast.show('Ошибка создание Аватара', 'error');
          this.cdr.detectChanges();
        }
      });
  }

  triggerFileInput(type: 'front' | 'left' | 'right', event: Event) {
    event.stopPropagation();
    const map = {
      front: this.frontInput,
      left: this.leftInput,
      right: this.rightInput
    };
    map[type]?.nativeElement.click();
  }

  onFileSelectedAvatar(event: Event, type: 'front' | 'left' | 'right') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    this.photos[type].file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[type].preview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removePhoto(type: 'front' | 'left' | 'right', event: Event) {
    event.stopPropagation();
    this.photos[type].file = null;
    this.photos[type].preview = null;
    this.toast.show('Фото удалено', 'success');
    this.cdr.detectChanges();
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  submit() {
    if (this.myForm.invalid) return;
    console.log('Форма отправлена', this.myForm.value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
