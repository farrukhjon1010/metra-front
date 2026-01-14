import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {NgClass, NgStyle} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../../shared/components/button/button.component';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgStyle,
    ButtonComponent,
    NgClass,
  ],
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent {

  @ViewChild('frontInput', { static: false }) frontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('leftInput', { static: false }) leftInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rightInput', { static: false }) rightInput!: ElementRef<HTMLInputElement>;

  currentStep: 'splash' | 'form' | 'loading' | 'select' | 'success' = 'splash';
  gender: 'male' | 'female' = 'male';
  generatedAvatars: string[] = [];
  selectedAvatars: string[] = [];
  photos = {
    front: null as string | null,
    left: null as string | null,
    right: null as string | null,
  };

  myForm = new FormGroup({
    avatarName: new FormControl('', Validators.required),
  });

  constructor(private router: Router,
              private cdr: ChangeDetectorRef) {}

  navigateToCreate(): void {
    this.currentStep = 'form';
  }

  navigateToDemo(): void {
    this.router.navigate(['/home']);
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

  removePhoto(type: 'front' | 'left' | 'right', event: Event) {
    event.stopPropagation();
    this.photos[type] = null;
  }

  onFileSelected(event: Event, type: 'front' | 'left' | 'right') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[type] = reader.result as string;
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

  confirmAvatars() {
    if (this.selectedAvatars.length > 0) {
      this.currentStep = 'success';
    }
  }

  goToMetra() {
    this.router.navigate(['/home']);
  }

  createAvatar() {
    if (!this.canCreate()) {
      alert('Пожалуйста, заполните все поля и загрузите фото');
      return;
    }
    this.currentStep = 'loading';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.generatedAvatars = [
        this.photos.front!,
        'assets/avatars/avatar-2.png',
        'assets/avatars/avatar-3.png',
        'assets/avatars/avatar-4.png',
      ];
      this.currentStep = 'select'; // переходим на следующий шаг
      this.cdr.detectChanges();
    }, 2000);
  }

  submit() {
    if (this.myForm.invalid) return;
    console.log('Форма отправлена', this.myForm.value);
  }
}
