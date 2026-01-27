import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule, NgStyle} from '@angular/common';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Loading} from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-add-avatar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgStyle, ButtonComponent, ReactiveFormsModule, Loading],
  templateUrl: './add-avatar.component.html',
  styleUrls: ['./add-avatar.component.scss'],
})
export class AddAvatarComponent {

  @ViewChild('frontInput', {static: false}) frontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('leftInput', {static: false}) leftInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rightInput', {static: false}) rightInput!: ElementRef<HTMLInputElement>;

  gender: 'male' | 'female' = 'male';
  currentStep: 'form' | 'loading' | 'select' | 'success' = 'form';
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
              private cdr: ChangeDetectorRef) {
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
    if (this.selectedAvatars.length > 0) {
      this.currentStep = 'success';
    }
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
    const files = (event.target as HTMLInputElement)?.files?.[0];
    if (!files) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[type] = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(files);
  }

  removePhoto(type: 'front' | 'left' | 'right', event: Event) {
    event.stopPropagation();
    this.photos[type] = null;
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

    setTimeout(() => {
      console.log('Timeout finished, generating avatars');
      this.generatedAvatars = [
        this.photos.front!,
        'assets/avatars/avatar-2.png',
        'assets/avatars/avatar-3.png',
        'assets/avatars/avatar-4.png',
      ];

      this.currentStep = 'select';
      this.cdr.detectChanges();
    }, 2000);
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
