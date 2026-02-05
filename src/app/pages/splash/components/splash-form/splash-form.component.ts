import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgStyle} from '@angular/common';
import {ButtonComponent} from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-splash-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgStyle, NgClass, ButtonComponent],
  templateUrl: './splash-form.component.html',
  styleUrls: ['./splash-form.component.scss'],
})
export class SplashFormComponent {
  @ViewChild('frontInput', {static: false}) frontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('leftInput', {static: false}) leftInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rightInput', {static: false}) rightInput!: ElementRef<HTMLInputElement>;

  @Input() gender: 'male' | 'female' = 'male';
  @Output() genderChange = new EventEmitter<'male' | 'female'>();
  @Output() triggerCreate = new EventEmitter<void>();

  @Input() myForm!: FormGroup;
  @Input() photos: { front: string | null; left: string | null; right: string | null } = {
    front: null,
    left: null,
    right: null
  };

  @Output() photoUploaded = new EventEmitter<{ type: 'front' | 'left' | 'right'; dataUrl: string; file: File }>();
  @Output() photoRemoved = new EventEmitter<'front' | 'left' | 'right'>();

  constructor(private cdr: ChangeDetectorRef) {
  }

  triggerFileInput(type: 'front' | 'left' | 'right', event: Event) {
    event.stopPropagation();
    const map: Record<string, ElementRef<HTMLInputElement>> = {
      front: this.frontInput,
      left: this.leftInput,
      right: this.rightInput,
    } as any;
    map[type]?.nativeElement.click();
  }

  removePhoto(type: 'front' | 'left' | 'right', event: Event) {
    event.stopPropagation();
    this.photoRemoved.emit(type);
  }

  onFileSelected(event: Event, type: 'front' | 'left' | 'right') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.photoUploaded.emit({type, dataUrl, file});
      this.cdr.detectChanges();
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

  submit() {
    if (!this.myForm) return;
    if (this.myForm.invalid) return;
    this.triggerCreate.emit();
  }
}
