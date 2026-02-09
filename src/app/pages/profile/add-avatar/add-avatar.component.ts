import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Gender } from '../../../core/models/avatar.model';
import { AvatarService } from '../../../core/services/avatar.service';
import { FileService } from '../../../core/services/file.service';
import { Loading } from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-add-avatar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgStyle, ButtonComponent, ReactiveFormsModule, Loading],
  templateUrl: './add-avatar.component.html',
  styleUrls: ['./add-avatar.component.scss'],
})
export class AddAvatarComponent {

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';

  @ViewChild('frontInput', { static: false }) frontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('leftInput', { static: false }) leftInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rightInput', { static: false }) rightInput!: ElementRef<HTMLInputElement>;

  gender: Gender = Gender.MALE
  currentStep: 'form' | 'loading' | 'select' | 'success' = 'form';
  generatedAvatars: string[] = [];
  selectedAvatars: string[] = [];
  protected readonly Gender = Gender;

  photos = {
    front: { file: null as File | null, preview: null as string | null },
    left: { file: null as File | null, preview: null as string | null },
    right: { file: null as File | null, preview: null as string | null },
  };

  myForm = new FormGroup({
    avatarName: new FormControl('', Validators.required),
  });


  constructor(private router: Router,
    private cdr: ChangeDetectorRef,
    private avatarService: AvatarService,
    private fileService: FileService) { }

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
    if (this.selectedAvatars.length === 0) return;

    this.currentStep = 'loading';
    this.cdr.detectChanges();

    const userId = this.UUID;
    const selectedUrl = this.selectedAvatars[0];

    this.avatarService.findByUser(userId).subscribe({
      next: (existingAvatar) => {
        const currentCount = existingAvatar?.imagesURL?.length || 0;
        const nextIndex = currentCount + 1;
        this.uploadAndSave(selectedUrl, userId, nextIndex);
      },
      error: () => {
        this.uploadAndSave(selectedUrl, userId, 1);
      }
    });
  }
  private uploadAndSave(url: string, userId: string, index: number) {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `avatar_v${index}.png`, { type: 'image/png' });

        this.fileService.uploadGeneratedAvatar(file, userId, index).subscribe({
          next: (response) => {
            this.avatarService.addImgUrl(userId, response.url).subscribe({
              next: () => {
                this.currentStep = 'success';
                this.cdr.detectChanges();
              }
            });
          }
        });
      });
  }

  triggerFileInput(type: 'front' | 'left' | 'right', event: Event) {
    event.stopPropagation();
    const map = {
      front: this.frontInput,
      left: this.leftInput,
      right: this.rightInput,
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

  createAvatar() {
    if (!this.canCreate()) return;

    this.currentStep = 'loading';
    this.cdr.detectChanges();

    const filesUpload: File[] = [];
    if (this.photos.front.file) filesUpload.push(this.photos.front.file);
    if (this.photos.left.file) filesUpload.push(this.photos.left.file);
    if (this.photos.right.file) filesUpload.push(this.photos.right.file);

    const userId = this.UUID;

    this.fileService.uploadAvatars(filesUpload, userId).subscribe({
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

          this.avatarService.generateAvatar(generate).subscribe({
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

}
