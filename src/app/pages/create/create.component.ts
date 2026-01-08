import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
    goToHome() {
        throw new Error('Method not implemented.');
    }
  // @ViewChild('frontInput', { static: false }) frontInput!: ElementRef<HTMLInputElement>;
  // @ViewChild('leftInput', { static: false }) leftInput!: ElementRef<HTMLInputElement>;
  // @ViewChild('rightInput', { static: false }) rightInput!: ElementRef<HTMLInputElement>;
  //
  // currentStep: 'form' | 'loading' | 'select' | 'success' = 'form';
  //
  // avatarName = '';
  // gender: 'male' | 'female' = 'male';
  //
  // photos = {
  //   front: null as string | null,
  //   left: null as string | null,
  //   right: null as string | null,
  // };
  //
  // generatedAvatars: string[] = [];
  // selectedAvatar: string | null = null;
  //
  // constructor(private router: Router,
  //             private cdr: ChangeDetectorRef) {}
  //
  // triggerFileInput(type: 'front' | 'left' | 'right', event: Event) {
  //   event.stopPropagation();
  //
  //   const map = {
  //     front: this.frontInput,
  //     left: this.leftInput,
  //     right: this.rightInput,
  //   };
  //
  //   map[type]?.nativeElement.click();
  // }
  //
  // onFileSelected(event: Event, type: 'front' | 'left' | 'right') {
  //   const file = (event.target as HTMLInputElement)?.files?.[0];
  //   if (!file) return;
  //
  //   const reader = new FileReader();
  //   reader.onload = () => (this.photos[type] = reader.result as string);
  //   reader.readAsDataURL(file);
  // }
  //
  // removePhoto(type: 'front' | 'left' | 'right', event: Event) {
  //   event.stopPropagation();
  //   this.photos[type] = null;
  // }
  //
  // canCreate() {
  //   return (
  //     this.avatarName.trim() &&
  //     this.photos.front &&
  //     this.photos.left &&
  //     this.photos.right
  //   );
  // }
  //
  // createAvatar() {
  //   if (!this.canCreate()) return;
  //
  //   this.currentStep = 'loading';
  //   this.cdr.detectChanges();
  //
  //   setTimeout(() => {
  //     this.generatedAvatars = [
  //       'assets/avatars/avatar-1.png',
  //       'assets/avatars/avatar-2.png',
  //       'assets/avatars/avatar-3.png',
  //       'assets/avatars/avatar-4.png',
  //     ];
  //
  //     this.currentStep = 'select';
  //     this.cdr.detectChanges();
  //   }, 2000);
  // }
  //
  // selectAvatar(avatar: string) {
  //   this.selectedAvatar = avatar;
  // }
  //
  // confirmAvatar() {
  //   if (!this.selectedAvatar) return;
  //   this.currentStep = 'success';
  // }
  //
  // goToHome() {
  //   this.router.navigate(['/home']);
  // }
  //
  // selectedAvatars: string[] = [];
  //
  // isSelected(avatar: string): boolean {
  //   return this.selectedAvatars.includes(avatar);
  // }
  //
  // toggleAvatar(avatar: string): void {
  //   const index = this.selectedAvatars.indexOf(avatar);
  //
  //   if (index > -1) {
  //     this.selectedAvatars.splice(index, 1);
  //   } else {
  //     if (this.selectedAvatars.length < 3) {
  //       this.selectedAvatars.push(avatar);
  //     }
  //   }
  // }
  //
  // confirmAvatars(): void {
  //   if (this.selectedAvatars.length > 0) {
  //     this.currentStep = 'success';
  //   }
  // }
  //
  // goToProfile(): void {
  //   console.log('Profile...');
  // }
}
