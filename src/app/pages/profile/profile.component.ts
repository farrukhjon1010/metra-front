import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {

  currentStep: 'select' | 'success' | 'profile' = 'select';
  selectedAvatars: string[] = [];
  generatedAvatars: string[] = [
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    'https://images.pexels.com/photos/1310474/pexels-photo-1310474.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  ];

  isSelected(avatar: string): boolean {
    return this.selectedAvatars.includes(avatar);
  }

  toggleAvatar(avatar: string): void {
    const index = this.selectedAvatars.indexOf(avatar);

    if (index > -1) {
      this.selectedAvatars.splice(index, 1);
    } else {
      if (this.selectedAvatars.length < 3) {
        this.selectedAvatars.push(avatar);
      }
    }
  }

  confirmAvatars(): void {
    if (this.selectedAvatars.length > 0) {
      this.currentStep = 'profile';
    }
  }

  startUsingMetra(): void {
    this.currentStep = 'profile';
  }

  addMoreAvatars(): void {
    this.currentStep = 'select';
  }

  navigateTo(page: string): void {
    console.log('Navigating to:', page);
  }
}
