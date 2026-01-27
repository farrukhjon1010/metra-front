import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AvatarsService} from './service/avatars.service';
import {CreateAvatarDto} from './models/avatar.model';
import {SplashFormComponent} from './components/splash-form/splash-form.component';
import {SplashSelectComponent} from './components/splash-select/splash-select.component';
import {SplashSuccessComponent} from './components/splash-success/splash-success.component';
import {SplashCaseComponent} from './components/splash-case/splash-case.component';
import {Loading} from '../../shared/components/loading/loading';

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

  currentStep: 'splash' | 'form' | 'loading' | 'select' | 'success' = 'splash';
  gender: 'male' | 'female' = 'male';
  generatedAvatars: string[] = [];
  selectedAvatars: string[] = [];
  photos = {
    front: null as string | null,
    left: null as string | null,
    right: null as string | null,
  };

  photoFiles: { front?: File; left?: File; right?: File } = {};

  myForm = new FormGroup({
    avatarName: new FormControl('', Validators.required),
  });

  constructor(private router: Router,
              private cdr: ChangeDetectorRef,
              private avatarsService: AvatarsService) {
  }

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

  handlePhotoRemoved(type: 'front' | 'left' | 'right') {
    this.photos[type] = null;
    delete this.photoFiles[type];
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
